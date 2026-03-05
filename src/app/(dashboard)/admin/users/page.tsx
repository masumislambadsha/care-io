"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
  created_at: string;
};

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      if (session?.user?.role !== "ADMIN") {
        router.push("/dashboard");
        return;
      }
      fetchUsers();
    }
  }, [status, router, session]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users");
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users || []);
      } else {
        toast.error("Failed to load users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: newStatus }),
      });

      if (response.ok) {
        toast.success(`User ${newStatus.toLowerCase()} successfully`);
        fetchUsers();
      } else {
        toast.error("Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    }
  };

  const deleteUser = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("User deleted successfully");
        fetchUsers();
        setShowDetailsModal(false);
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading users...</p>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    clients: users.filter((u) => u.role === "CLIENT").length,
    caregivers: users.filter((u) => u.role === "CAREGIVER").length,
    admins: users.filter((u) => u.role === "ADMIN").length,
    active: users.filter((u) => u.status === "ACTIVE").length,
    suspended: users.filter((u) => u.status === "SUSPENDED").length,
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-700";
      case "CAREGIVER":
        return "bg-blue-100 text-blue-700";
      case "CLIENT":
        return "bg-green-100 text-green-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "SUSPENDED":
        return "bg-red-100 text-red-700";
      case "DELETED":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          User Management
        </h1>
        <p className="text-slate-600">Manage all platform users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-sm text-slate-600 mb-1">Total Users</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-sm text-slate-600 mb-1">Clients</p>
          <p className="text-2xl font-bold text-green-600">{stats.clients}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-sm text-slate-600 mb-1">Caregivers</p>
          <p className="text-2xl font-bold text-blue-600">{stats.caregivers}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-sm text-slate-600 mb-1">Admins</p>
          <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-sm text-slate-600 mb-1">Active</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-sm text-slate-600 mb-1">Inactive</p>
          <p className="text-2xl font-bold text-slate-400">{stats.inactive}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none transition-colors text-slate-900"
            />
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none transition-colors text-slate-900"
            >
              <option value="all">All Roles</option>
              <option value="CLIENT">Client</option>
              <option value="CAREGIVER">Caregiver</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none transition-colors text-slate-900"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Joined
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <span className="material-icons text-slate-400 text-5xl mb-3">
                        person_off
                      </span>
                      <p className="text-slate-600 font-medium">
                        No users found
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                          <span className="text-teal-600 font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {user.name}
                          </p>
                          <p className="text-sm text-slate-600">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(
                          user.role,
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                          user.status,
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <span className="material-icons text-slate-600 text-xl">
                            visibility
                          </span>
                        </button>
                        {user.status === "ACTIVE" ? (
                          <button
                            onClick={() =>
                              updateUserStatus(user.id, "SUSPENDED")
                            }
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Suspend User"
                          >
                            <span className="material-icons text-red-600 text-xl">
                              block
                            </span>
                          </button>
                        ) : (
                          <button
                            onClick={() => updateUserStatus(user.id, "ACTIVE")}
                            className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                            title="Activate User"
                          >
                            <span className="material-icons text-green-600 text-xl">
                              check_circle
                            </span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                User Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-all"
              >
                <span className="material-icons text-slate-600">close</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-teal-600 font-bold text-3xl">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {selectedUser.name}
                  </h3>
                  <p className="text-slate-600">{selectedUser.email}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Role</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(
                      selectedUser.role,
                    )}`}
                  >
                    {selectedUser.role}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                      selectedUser.status,
                    )}`}
                  >
                    {selectedUser.status}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Phone</p>
                  <p className="font-semibold text-slate-900">
                    {selectedUser.phone || "Not provided"}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Joined</p>
                  <p className="font-semibold text-slate-900">
                    {new Date(selectedUser.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                {selectedUser.status === "ACTIVE" ? (
                  <button
                    onClick={() => {
                      updateUserStatus(selectedUser.id, "SUSPENDED");
                      setShowDetailsModal(false);
                    }}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
                  >
                    Suspend User
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      updateUserStatus(selectedUser.id, "ACTIVE");
                      setShowDetailsModal(false);
                    }}
                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
                  >
                    Activate User
                  </button>
                )}
                <button
                  onClick={() => deleteUser(selectedUser.id)}
                  className="flex-1 px-4 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-all"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
