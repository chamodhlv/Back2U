import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Pencil, Trash2, Check, X, Lock, Package, CheckCircle2, ArrowLeft, MessageCircle } from 'lucide-react';
import { getChatById, getMessages, sendMessage, editMessage, deleteMessage, confirmReturn } from '../../api/claims';
import { getSocket } from '../../socket';

const formatTime = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

// ─── Single message bubble ───────────────────────────────────────────────────

const MessageBubble = ({ msg, isOwn, onEdit, onDelete }) => {
    const [hovering, setHovering] = useState(false);
    const isSystem = msg.type === 'SYSTEM';
    const isDeleted = msg.isDeleted;

    if (isSystem) {
        return (
            <div className="flex justify-center my-3">
                <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">{msg.content}</span>
            </div>
        );
    }

    return (
        <div
            className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            <div className={`max-w-[70%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                <div className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                    ${isOwn
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'}
                    ${isDeleted ? 'opacity-50 italic' : ''}`}
                >
                    {msg.content}
                    {msg.isEdited && !isDeleted && (
                        <span className={`ml-1 text-[10px] ${isOwn ? 'text-blue-200' : 'text-gray-400'}`}>(edited)</span>
                    )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-gray-400">{formatTime(msg.createdAt)}</span>
                    {isOwn && !isDeleted && hovering && (
                        <div className="flex gap-1">
                            <button
                                onClick={() => onEdit(msg)}
                                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all"
                                title="Edit"
                            >
                                <Pencil className="w-3 h-3" />
                            </button>
                            <button
                                onClick={() => onDelete(msg._id)}
                                className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-500 transition-all"
                                title="Delete"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Main ChatView ────────────────────────────────────────────────────────────

const ChatView = ({ chat, currentUser, onBack }) => {
    const [messages, setMessages] = useState([]);
    const [chatData, setChatData] = useState(chat);
    const [input, setInput] = useState('');
    const [editingMsg, setEditingMsg] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [sending, setSending] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const bottomRef = useRef(null);

    const isLocked = chatData?.status === 'LOCKED';

    const loadMessages = useCallback(async () => {
        if (!chat?._id) return;
        try {
            const res = await getMessages(chat._id);
            setMessages(res.data || []);
        } catch {
            // silent
        }
    }, [chat?._id]);

    const loadChatData = useCallback(async () => {
        if (!chat?._id) return;
        try {
            const res = await getChatById(chat._id);
            setChatData(res.data);
        } catch {
            // silent
        }
    }, [chat?._id]);

    useEffect(() => {
        loadMessages();
        loadChatData();
    }, [loadMessages, loadChatData]);

    // Scroll to bottom when messages change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Socket.IO real-time
    useEffect(() => {
        const socket = getSocket();
        if (!socket || !chat?._id) return;

        socket.emit('join_chat', chat._id);

        const onReceived = (msg) => setMessages(prev => {
            if (prev.some(m => m._id === msg._id)) return prev; // already added optimistically
            return [...prev, msg];
        });
        const onUpdated = (msg) => setMessages(prev => prev.map(m => m._id === msg._id ? msg : m));
        const onDeleted = ({ messageId }) => setMessages(prev => prev.map(m => m._id === messageId ? { ...m, isDeleted: true, content: '[Message deleted]' } : m));

        socket.on('message_received', onReceived);
        socket.on('message_updated', onUpdated);
        socket.on('message_deleted', onDeleted);

        return () => {
            socket.emit('leave_chat', chat._id);
            socket.off('message_received', onReceived);
            socket.off('message_updated', onUpdated);
            socket.off('message_deleted', onDeleted);
        };
    }, [chat?._id]);

    const handleSend = async () => {
        if (!input.trim() || sending || isLocked) return;
        setSending(true);
        const content = input.trim();
        setInput('');
        try {
            await sendMessage(chat._id, content);
            // Do NOT add to messages here — server emits 'message_received' back
            // to all room members including sender, which the socket handler adds.
        } catch (err) {
            setInput(content); // restore on failure
            alert(err.response?.data?.message || 'Failed to send');
        } finally {
            setSending(false);
        }
    };

    const handleEdit = (msg) => {
        setEditingMsg(msg);
        setEditContent(msg.content);
    };

    const handleEditSave = async () => {
        if (!editContent.trim()) return;
        try {
            const res = await editMessage(editingMsg._id, editContent.trim());
            setMessages(prev => prev.map(m => m._id === editingMsg._id ? res.data : m));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to edit');
        } finally {
            setEditingMsg(null);
            setEditContent('');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this message?')) return;
        try {
            await deleteMessage(id);
            setMessages(prev => prev.map(m => m._id === id ? { ...m, isDeleted: true, content: '[Message deleted]' } : m));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete');
        }
    };

    const handleConfirmReturn = async () => {
        if (!chatData?.claimId && !chat?.claimId) return;
        const claimId = chatData?.claimId?._id || chatData?.claimId || chat?.claimId;
        if (!window.confirm('Confirm that the item has been returned/retrieved?')) return;
        setConfirming(true);
        try {
            const res = await confirmReturn(claimId);
            if (res.bothConfirmed) {
                await loadChatData();
                await loadMessages();
            } else {
                alert('Confirmation recorded! Waiting for the other party to confirm.');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to confirm');
        } finally {
            setConfirming(false);
        }
    };

    // Determine if current user is the post owner (vs the claimant)
    // postedBy from DB may be an ObjectId string or object
    const postOwnerIdRaw = chatData?.item?.postedBy?._id ?? chatData?.item?.postedBy;
    const postOwnerIdStr = postOwnerIdRaw?.toString();
    const currentUserIdStr = currentUser?._id?.toString();
    const isPostOwner = !!(postOwnerIdStr && currentUserIdStr && postOwnerIdStr === currentUserIdStr);

    // Banner + button text depends on item type AND user role:
    //   Found item:  post owner = finder (posted found item),  claimant = actual owner
    //   Lost item:   post owner = actual owner (posted lost),  claimant = finder
    let bannerText, confirmLabel;
    if (chatData?.itemType === 'found') {
        bannerText   = isPostOwner ? 'Returned the item? Confirm the handover.'      : 'Met with the finder? Confirm you received your item.';
        confirmLabel = isPostOwner ? 'I successfully returned the item'               : 'I got my item back';
    } else {
        // lost item
        bannerText   = isPostOwner ? 'Retrieved your item? Confirm you got it back.' : 'Returned the item? Confirm the handover.';
        confirmLabel = isPostOwner ? 'I successfully retrieved my item'               : 'I successfully returned the item';
    }

    if (!chat) return (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <MessageCircle className="w-12 h-12 text-gray-200 mb-3" />
            <p className="text-gray-400 text-sm">Select a conversation to start messaging</p>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm">
                {onBack && (
                    <button onClick={onBack} className="mr-1 p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-all">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                )}
                <div className="w-9 h-9 rounded-xl overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                    {chatData?.item?.images?.[0]
                        ? <img src={`http://localhost:5000${chatData.item.images[0]}`} alt="" className="w-full h-full object-cover" />
                        : <Package className="w-5 h-5 text-gray-300" />}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                        {chatData?.otherUser?.fullName || 'User'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{chatData?.item?.title || 'Item'}</p>
                </div>
                {isLocked && (
                    <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full font-semibold">
                        <Lock className="w-3 h-3" /> Chat Closed
                    </span>
                )}
            </div>

            {/* Confirm Return Banner */}
            {!isLocked && chatData?.claimId && (
                <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <p className="text-xs text-emerald-700 font-medium">
                            {bannerText}
                        </p>
                    </div>
                    <button
                        onClick={handleConfirmReturn}
                        disabled={confirming}
                        className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-3 py-1.5 rounded-xl transition-all disabled:opacity-50 shrink-0 flex items-center gap-1"
                    >
                        {confirming ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check className="w-3 h-3" />}
                        {confirmLabel}
                    </button>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.length === 0 && (
                    <div className="text-center text-sm text-gray-400 py-8">No messages yet. Say hello!</div>
                )}
                {messages.map(msg => (
                    <MessageBubble
                        key={msg._id}
                        msg={msg}
                        isOwn={msg.senderId?._id === currentUser?._id || msg.senderId === currentUser?._id}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Edit bar */}
            {editingMsg && (
                <div className="bg-blue-50 border-t border-blue-100 px-4 py-2 flex items-center gap-2">
                    <Pencil className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <input
                        autoFocus
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleEditSave(); if (e.key === 'Escape') setEditingMsg(null); }}
                        className="flex-1 text-sm bg-transparent outline-none text-gray-800"
                    />
                    <button onClick={handleEditSave} className="p-1.5 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all">
                        <Check className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setEditingMsg(null)} className="p-1.5 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* Input */}
            {isLocked ? (
                <div className="bg-white border-t border-gray-100 px-4 py-3 text-center">
                    <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
                        <Lock className="w-4 h-4" /> This chat has been closed. The item was successfully claimed.
                    </p>
                </div>
            ) : (
                <div className="bg-white border-t border-gray-100 px-4 py-3 flex items-end gap-2">
                    <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        placeholder="Type a message..."
                        rows={1}
                        className="flex-1 resize-none px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10 max-h-32 overflow-y-auto"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || sending}
                        className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-40 shrink-0"
                    >
                        {sending ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChatView;
