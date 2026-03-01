import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import {
  Users,
  UserPlus,
  Search,
  Edit3,
  Trash2,
  Save,
  X,
  LayoutDashboard,
  Shield,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  LogOut,
  UserCheck,
} from "lucide-react";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    students: 0,
    admins: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("users");

  const [createForm, setCreateForm] = useState({
    studentId: "",
    fullName: "",
    email: "",
    password: "",
    role: "student",
    isActive: true,
  });

  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student",
    isActive: true,
    points: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("limit", 10);
      if (searchTerm) params.append("search", searchTerm);
      if (roleFilter) params.append("role", roleFilter);
      if (statusFilter) params.append("status", statusFilter);

      const { data } = await API.get(`/users?${params.toString()}`);
      setUsers(data.users);
      setTotalPages(data.totalPages);

      const allRes = await API.get("/users?limit=9999");
      const all = allRes.data.users;
      setStats({
        total: allRes.data.totalUsers,
        active: all.filter((u) => u.isActive).length,
        students: all.filter((u) => u.role === "student").length,
        admins: all.filter((u) => u.role === "admin").length,
      });
    } catch (error) {
      setMessage({ text: "Failed to load users", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await API.post("/users", createForm);
      setShowCreateModal(false);
      setCreateForm({
        studentId: "",
        fullName: "",
        email: "",
        password: "",
        role: "student",
        isActive: true,
      });
      setMessage({ text: "User created successfully!", type: "success" });
      fetchUsers();
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to create user",
        type: "error",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      // Always include all required fields, fallback to selectedUser values
      const payload = {
        studentId: selectedUser.studentId,
        fullName: editForm.fullName || selectedUser.fullName,
        email: editForm.email || selectedUser.email,
        role: editForm.role || selectedUser.role,
        isActive:
          typeof editForm.isActive !== "undefined"
            ? editForm.isActive
            : selectedUser.isActive,
        points:
          typeof editForm.points !== "undefined"
            ? editForm.points
            : selectedUser.points,
        profilePhoto:
          typeof editForm.profilePhoto !== "undefined"
            ? editForm.profilePhoto
            : selectedUser.profilePhoto,
      };
      if (editForm.password) payload.password = editForm.password;
      await API.put(`/users/${selectedUser._id}`, payload);
      setShowEditModal(false);
      setMessage({ text: "User updated successfully!", type: "success" });
      fetchUsers();
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (error) {
      const errorData = error.response?.data;
      const detailedMessage = errorData?.error || (typeof errorData?.message === 'string' ? errorData.message : null);
      setMessage({
        text: detailedMessage || "Failed to update user",
        type: "error",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/users/${selectedUser._id}`);
      setShowDeleteModal(false);
      setMessage({ text: "User deleted successfully!", type: "success" });
      fetchUsers();
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to delete user",
        type: "error",
      });
    }
  };

  const openEditModal = (u) => {
    setSelectedUser(u);
    setEditForm({
      fullName: u.fullName,
      email: u.email,
      password: "",
      role: u.role,
      isActive: u.isActive,
      points: u.points,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (u) => {
    setSelectedUser(u);
    setShowDeleteModal(true);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const sidebarItems = [
    {
      id: "overview",
      label: "Overview",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    { id: "users", label: "Users", icon: <Users className="w-5 h-5" /> },
  ];

  const statCards = [
    {
      label: "Total Users",
      value: stats.total,
      icon: <Users className="w-5 h-5" />,
      bg: "bg-primary-50",
      text: "text-primary-600",
    },
    {
      label: "Active Users",
      value: stats.active,
      icon: <UserCheck className="w-5 h-5" />,
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      label: "Students",
      value: stats.students,
      icon: <Users className="w-5 h-5" />,
      bg: "bg-violet-50",
      text: "text-violet-600",
    },
    {
      label: "Admins",
      value: stats.admins,
      icon: <Shield className="w-5 h-5" />,
      bg: "bg-amber-50",
      text: "text-amber-600",
    },
  ];

  const inputClass =
    "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-surface-dark placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 focus:bg-white transition-all text-sm";
  const selectClass =
    "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-surface-dark text-sm focus:outline-none focus:border-primary-500 appearance-none cursor-pointer";

  return (
    <div className="min-h-screen bg-surface text-surface-dark pt-16">
      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200/60 p-4 hidden lg:flex flex-col">
          <div className="flex items-center gap-3 p-4 mb-6 bg-gray-50 rounded-xl border border-gray-200/60">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-lg font-bold text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate text-surface-dark">
                {user?.fullName}
              </p>
              <p className="text-xs text-amber-600 font-medium">Admin</p>
            </div>
          </div>

          <nav className="space-y-1 flex-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === item.id
                  ? "bg-primary-50 text-primary-600 border border-primary-200/60 font-medium"
                  : "text-gray-500 hover:text-surface-dark hover:bg-gray-50"
                  }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-500 hover:text-danger-500 hover:bg-gray-50 transition-all mt-auto"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-64 p-6 lg:p-8">
          {/* Mobile tabs */}
          <div className="flex gap-2 mb-6 lg:hidden overflow-x-auto pb-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${activeTab === item.id
                  ? "bg-primary-50 text-primary-600 border border-primary-200/60 font-medium"
                  : "text-gray-500 hover:text-surface-dark bg-white border border-gray-200"
                  }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* Message toast */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-xl flex items-center gap-2 text-sm ${message.type === "success"
                ? "bg-success-50 border border-success-400/20 text-success-600"
                : "bg-danger-50 border border-danger-400/20 text-danger-600"
                }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              {message.text}
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-surface-dark">
                  Admin Dashboard
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Manage users and monitor platform activity
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white border border-gray-200/60 rounded-2xl hover:shadow-md hover:shadow-gray-200/50 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-500">
                        {stat.label}
                      </span>
                      <div
                        className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center ${stat.text}`}
                      >
                        {stat.icon}
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-surface-dark">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-white border border-gray-200/60 rounded-2xl">
                <h3 className="font-semibold text-surface-dark mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setActiveTab("users");
                      setShowCreateModal(true);
                    }}
                    className="p-4 bg-primary-50 border border-primary-200/60 rounded-xl flex items-center gap-3 hover:bg-primary-100/50 transition-all"
                  >
                    <UserPlus className="w-5 h-5 text-primary-500" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-surface-dark">
                        Create New User
                      </p>
                      <p className="text-xs text-gray-500">
                        Add a student or admin account
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("users")}
                    className="p-4 bg-violet-50 border border-violet-200/60 rounded-xl flex items-center gap-3 hover:bg-violet-100/50 transition-all"
                  >
                    <Users className="w-5 h-5 text-accent-500" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-surface-dark">
                        Manage Users
                      </p>
                      <p className="text-xs text-gray-500">
                        View, edit, or remove users
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-surface-dark">
                    User Management
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                    {stats.total} total users
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-medium text-sm text-white hover:from-primary-600 hover:to-accent-600 transition-all shadow-md shadow-primary-500/20 flex items-center gap-2 self-start"
                >
                  <UserPlus className="w-4 h-4" />
                  Create User
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search by name, email, or student ID..."
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-surface-dark placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all text-sm"
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-surface-dark text-sm focus:outline-none focus:border-primary-500 appearance-none cursor-pointer"
                >
                  <option value="">All Roles</option>
                  <option value="student">Students</option>
                  <option value="admin">Admins</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-surface-dark text-sm focus:outline-none focus:border-primary-500 appearance-none cursor-pointer"
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              {/* Users Table */}
              <div className="bg-white border border-gray-200/60 rounded-2xl overflow-hidden shadow-sm">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-20">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400">No users found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200/60 bg-gray-50/50">
                          <th className="text-left text-xs text-gray-500 font-medium px-6 py-4 uppercase tracking-wider">
                            User
                          </th>
                          <th className="text-left text-xs text-gray-500 font-medium px-6 py-4 uppercase tracking-wider">
                            Student ID
                          </th>
                          <th className="text-left text-xs text-gray-500 font-medium px-6 py-4 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="text-left text-xs text-gray-500 font-medium px-6 py-4 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="text-left text-xs text-gray-500 font-medium px-6 py-4 uppercase tracking-wider">
                            Points
                          </th>
                          <th className="text-right text-xs text-gray-500 font-medium px-6 py-4 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr
                            key={u._id}
                            className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-semibold text-white shrink-0">
                                  {u.fullName?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-surface-dark truncate">
                                    {u.fullName}
                                  </p>
                                  <p className="text-xs text-gray-400 truncate">
                                    {u.email}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-600">
                                {u.studentId}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${u.role === "admin"
                                  ? "bg-amber-50 text-amber-600 border border-amber-200/60"
                                  : "bg-primary-50 text-primary-600 border border-primary-200/60"
                                  }`}
                              >
                                {u.role === "admin" ? (
                                  <Shield className="w-3 h-3" />
                                ) : (
                                  <Users className="w-3 h-3" />
                                )}
                                {u.role}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 text-xs ${u.isActive ? "text-success-600" : "text-danger-600"}`}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full ${u.isActive ? "bg-success-500" : "bg-danger-500"}`}
                                />
                                {u.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-600">
                                {u.points}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => openEditModal(u)}
                                  className="p-2 text-gray-400 hover:text-primary-500 hover:bg-gray-100 rounded-lg transition-all"
                                  title="Edit"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => openDeleteModal(u)}
                                  className="p-2 text-gray-400 hover:text-danger-500 hover:bg-gray-100 rounded-lg transition-all"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200/60">
                    <p className="text-sm text-gray-500">
                      Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="p-2 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="p-2 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-surface-dark">
                Create New User
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">
                  Student ID
                </label>
                <input
                  type="text"
                  value={createForm.studentId}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, studentId: e.target.value })
                  }
                  className={inputClass}
                  placeholder="e.g. IT23543964"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={createForm.fullName}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, fullName: e.target.value })
                  }
                  className={inputClass}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, email: e.target.value })
                  }
                  className={inputClass}
                  placeholder="it23543964@my.sliit.lk"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={createForm.password}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, password: e.target.value })
                  }
                  className={inputClass}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-1.5">
                    Role
                  </label>
                  <select
                    value={createForm.role}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, role: e.target.value })
                    }
                    className={selectClass}
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-1.5">
                    Status
                  </label>
                  <select
                    value={createForm.isActive}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        isActive: e.target.value === "true",
                      })
                    }
                    className={selectClass}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl text-sm font-medium text-white hover:from-primary-600 hover:to-accent-600 transition-all shadow-md shadow-primary-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Create
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-surface-dark">Edit User</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, fullName: e.target.value })
                  }
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">
                  New Password{" "}
                  <span className="text-gray-400">(leave blank to keep)</span>
                </label>
                <input
                  type="password"
                  value={editForm.password}
                  onChange={(e) =>
                    setEditForm({ ...editForm, password: e.target.value })
                  }
                  className={inputClass}
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-1.5">
                    Role
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role: e.target.value })
                    }
                    className={selectClass}
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-1.5">
                    Status
                  </label>
                  <select
                    value={editForm.isActive}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        isActive: e.target.value === "true",
                      })
                    }
                    className={selectClass}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">
                  Points
                </label>
                <input
                  type="number"
                  value={editForm.points}
                  onChange={(e) =>
                    setEditForm({ ...editForm, points: Number(e.target.value) })
                  }
                  className={inputClass}
                  min="0"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl text-sm font-medium text-white hover:from-primary-600 hover:to-accent-600 transition-all shadow-md shadow-primary-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-danger-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-danger-500" />
            </div>
            <h3 className="text-lg font-bold text-center text-surface-dark mb-2">
              Delete User?
            </h3>
            <p className="text-sm text-gray-500 text-center mb-2">
              Are you sure you want to delete{" "}
              <span className="text-surface-dark font-medium">
                {selectedUser.fullName}
              </span>
              ?
            </p>
            <p className="text-xs text-gray-400 text-center mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 bg-danger-500 text-white rounded-xl text-sm font-medium hover:bg-danger-600 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
