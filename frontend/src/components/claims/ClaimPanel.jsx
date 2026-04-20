import { useState, useEffect } from 'react';
import { Upload, X, CheckCircle, Clock, XCircle, AlertCircle, FileText, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import {
    submitClaim, getClaimsForItem, approveClaim, rejectClaim
} from '../../api/claims';

// ─── Status helpers ──────────────────────────────────────────────────────────

const StatusPill = ({ status }) => {
    const map = {
        pending: { label: 'Pending Review', color: 'bg-amber-50 text-amber-700 border-amber-200' },
        approved: { label: 'Approved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        rejected: { label: 'Rejected', color: 'bg-red-50 text-red-700 border-red-200' },
        claimed:  { label: 'Claimed', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    };
    const s = map[status] || { label: status, color: 'bg-gray-100 text-gray-600 border-gray-200' };
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.color}`}>
            {s.label}
        </span>
    );
};

// ─── Sub-form: Claimant submits proof ────────────────────────────────────────

const SubmitClaimForm = ({ itemType, itemId, onSuccess }) => {
    const [proofDescription, setProofDescription] = useState('');
    const [uniqueIdentifiers, setUniqueIdentifiers] = useState('');
    const [descriptionDetails, setDescriptionDetails] = useState('');
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFiles = (e) => {
        const selected = Array.from(e.target.files).slice(0, 3);
        setFiles(selected);
        setPreviews(selected.map(f => URL.createObjectURL(f)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!proofDescription.trim()) {
            setError('Please provide a proof description.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const fd = new FormData();
            fd.append('proofDescription', proofDescription);
            fd.append('uniqueIdentifiers', uniqueIdentifiers);
            fd.append('descriptionDetails', descriptionDetails);
            files.forEach(f => fd.append('proofImages', f));
            await submitClaim(itemType, itemId, fd);
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit claim');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {itemType === 'found' ? 'Proof of Ownership' : 'Proof You Have the Item'} <span className="text-red-400">*</span>
                </label>
                <textarea
                    value={proofDescription}
                    onChange={e => setProofDescription(e.target.value)}
                    rows={3}
                    placeholder={itemType === 'found'
                        ? 'Describe how you can prove this item belongs to you (e.g., purchase date, where you bought it, what was inside the bag)...'
                        : 'Describe how you found this item, where it is now, and how you can prove you have it...'}
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Unique Identifiers
                    <span className="ml-1 text-xs font-normal text-gray-400">(serial number, custom marks, etc.)</span>
                </label>
                <input
                    type="text"
                    value={uniqueIdentifiers}
                    onChange={e => setUniqueIdentifiers(e.target.value)}
                    placeholder="e.g. Serial: ABC123, sticker on the back, name engraved..."
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Additional Details
                </label>
                <textarea
                    value={descriptionDetails}
                    onChange={e => setDescriptionDetails(e.target.value)}
                    rows={2}
                    placeholder="Any other details that can help verify your claim..."
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Proof Photos <span className="text-xs font-normal text-gray-400">(up to 3 images)</span>
                </label>
                <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                    <Upload className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Upload receipts, photos...</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFiles} />
                </label>
                {previews.length > 0 && (
                    <div className="flex gap-2 mt-2">
                        {previews.map((src, i) => (
                            <img key={i} src={src} alt={`proof-${i}`} className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                        ))}
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                {loading ? 'Submitting...' : 'Submit Claim'}
            </button>
        </form>
    );
};

// ─── Sub-view: Post owner sees pending claims ─────────────────────────────────

const ClaimsReviewList = ({ itemType, itemId, onApprove, onNavigateToChat }) => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);
    const [processing, setProcessing] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    const load = async () => {
        try {
            const res = await getClaimsForItem(itemType, itemId);
            setClaims(res.data || []);
        } catch {
            // silent
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [itemId]);

    const handleApprove = async (claimId) => {
        setProcessing(claimId);
        try {
            const res = await approveClaim(claimId);
            await load();
            onApprove(res.chatId);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to approve claim');
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async (claimId) => {
        setProcessing(claimId);
        try {
            await rejectClaim(claimId, rejectReason);
            setRejectReason('');
            await load();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to reject claim');
        } finally {
            setProcessing(null);
        }
    };

    if (loading) return <div className="text-center py-6 text-gray-400 text-sm">Loading claims...</div>;
    if (claims.length === 0) return (
        <div className="text-center py-6">
            <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No claims submitted yet</p>
        </div>
    );

    return (
        <div className="space-y-3">
            {claims.map(claim => (
                <div key={claim._id} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div
                        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-all"
                        onClick={() => setExpanded(expanded === claim._id ? null : claim._id)}
                    >
                        <div>
                            <p className="text-sm font-semibold text-gray-800">
                                {claim.claimantId?.fullName || 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-400">{claim.claimantId?.studentId}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <StatusPill status={claim.status} />
                            {expanded === claim._id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </div>
                    </div>

                    {expanded === claim._id && (
                        <div className="border-t border-gray-100 px-4 py-3 space-y-3 bg-gray-50/50">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Proof Description</p>
                                <p className="text-sm text-gray-700">{claim.proofDescription}</p>
                            </div>
                            {claim.uniqueIdentifiers && (
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Unique Identifiers</p>
                                    <p className="text-sm text-gray-700">{claim.uniqueIdentifiers}</p>
                                </div>
                            )}
                            {claim.descriptionDetails && (
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Additional Details</p>
                                    <p className="text-sm text-gray-700">{claim.descriptionDetails}</p>
                                </div>
                            )}
                            {claim.proofImages?.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Proof Images</p>
                                    <div className="flex gap-2">
                                        {claim.proofImages.map((img, i) => (
                                            <a key={i} href={`http://localhost:5000${img}`} target="_blank" rel="noopener noreferrer">
                                                <img src={`http://localhost:5000${img}`} alt={`proof-${i}`} className="w-16 h-16 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {claim.status === 'pending' && (
                                <div className="space-y-2 pt-1">
                                    <input
                                        type="text"
                                        placeholder="Rejection reason (optional)..."
                                        value={rejectReason}
                                        onChange={e => setRejectReason(e.target.value)}
                                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-red-300"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleApprove(claim._id)}
                                            disabled={processing === claim._id}
                                            className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                                        >
                                            {processing === claim._id ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(claim._id)}
                                            disabled={processing === claim._id}
                                            className="flex-1 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            )}

                            {claim.status === 'approved' && claim.chatId && (
                                <button
                                    onClick={() => onNavigateToChat(claim.chatId)}
                                    className="w-full py-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold rounded-xl hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    Open Chat in Dashboard
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// ─── Main ClaimPanel ─────────────────────────────────────────────────────────

/**
 * ClaimPanel — shown in the item detail modal.
 * 
 * Props:
 *  item        — the found/lost item object
 *  itemType    — 'found' | 'lost'
 *  currentUser — authenticated user object
 *  onNavigateToChat(chatId) — called to open a chat in the dashboard
 */
const ClaimPanel = ({ item, itemType, currentUser, onNavigateToChat }) => {
    const [submitted, setSubmitted] = useState(false);

    if (!item) return null;

    const isOwner = item.postedBy?._id
        ? item.postedBy._id === currentUser?._id
        : item.postedBy === currentUser?._id;

    const isClaimed = item.status === 'Claimed';

    // ── Claimed: show badge ──────────────────────────────────────────────────
    if (isClaimed) {
        return (
            <div className="border border-blue-100 bg-blue-50 rounded-2xl p-5 text-center">
                <CheckCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-blue-700 mb-1">Item Claimed</p>
                <p className="text-xs text-blue-500">This item has been successfully claimed and returned.</p>
            </div>
        );
    }

    // ── Post owner: sees incoming claims ─────────────────────────────────────
    if (isOwner) {
        return (
            <div className="border border-gray-200 rounded-2xl p-5">
                <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Incoming Claims
                </h3>
                <ClaimsReviewList
                    itemType={itemType}
                    itemId={item._id}
                    onApprove={(chatId) => {
                        if (onNavigateToChat) onNavigateToChat(chatId);
                    }}
                    onNavigateToChat={onNavigateToChat}
                />
            </div>
        );
    }

    // ── Non-owner: can submit a claim ────────────────────────────────────────
    if (!currentUser) {
        return (
            <div className="border border-gray-200 rounded-2xl p-5 text-center">
                <p className="text-sm text-gray-500">Please <a href="/login" className="text-blue-600 font-semibold underline">log in</a> to submit a claim.</p>
            </div>
        );
    }

    const hasPendingClaim = item.activeClaim && item.status !== 'Claimed';
    
    if (submitted || hasPendingClaim) {
        return (
            <div className="border border-amber-100 bg-amber-50 rounded-2xl p-5 text-center">
                <Clock className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-amber-700 mb-1">Claim Under Review</p>
                <p className="text-xs text-amber-600">The post owner is reviewing the claim. You'll be notified if it's approved.</p>
            </div>
        );
    }

    return (
        <div className="border border-gray-200 rounded-2xl p-5">
            <h3 className="text-base font-bold text-gray-800 mb-1">
                {itemType === 'found' ? 'Claim This Item' : 'Submit Found Proof'}
            </h3>
            <p className="text-xs text-gray-400 mb-4">
                {itemType === 'found'
                    ? 'Prove this item belongs to you — the finder will review your claim.'
                    : 'Submit proof that you found this item — the owner will review your claim.'}
            </p>
            <SubmitClaimForm
                itemType={itemType}
                itemId={item._id}
                onSuccess={() => setSubmitted(true)}
            />
        </div>
    );
};

export default ClaimPanel;
