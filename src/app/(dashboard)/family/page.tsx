"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const familyMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(0, "Age must be positive").max(150, "Invalid age"),
  relationship: z.string().min(1, "Relationship is required"),
  special_needs: z.string().optional(),
});

type FamilyMemberForm = z.infer<typeof familyMemberSchema>;

type FamilyMember = {
  id: string;
  name: string;
  age: number;
  relationship: string;
  special_needs?: string;
};

export default function FamilyMembersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FamilyMemberForm>({
    resolver: zodResolver(familyMemberSchema),
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      fetchFamilyMembers();
    }
  }, [status, router]);

  const fetchFamilyMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/family");
      const data = await response.json();

      if (response.ok) {
        setMembers(data.members || []);
      } else {
        toast.error("Failed to load family members");
      }
    } catch (error) {
      console.error("Error fetching family members:", error);
      toast.error("Failed to load family members");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingMember(null);
    reset({
      name: "",
      age: 0,
      relationship: "",
      special_needs: "",
    });
    setShowModal(true);
  };

  const openEditModal = (member: FamilyMember) => {
    setEditingMember(member);
    reset({
      name: member.name,
      age: member.age,
      relationship: member.relationship,
      special_needs: member.special_needs || "",
    });
    setShowModal(true);
  };

  const onSubmit = async (data: FamilyMemberForm) => {
    try {
      setIsSubmitting(true);

      const url = editingMember
        ? `/api/family?id=${editingMember.id}`
        : "/api/family";
      const method = editingMember ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(
          editingMember
            ? "Family member updated successfully"
            : "Family member added successfully",
        );
        setShowModal(false);
        fetchFamilyMembers();
        reset();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to save family member");
      }
    } catch (error) {
      console.error("Error saving family member:", error);
      toast.error("Failed to save family member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to delete this family member?")) {
      return;
    }

    try {
      const response = await fetch(`/api/family?id=${memberId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Family member deleted");
        fetchFamilyMembers();
      } else {
        toast.error("Failed to delete family member");
      }
    } catch (error) {
      console.error("Error deleting family member:", error);
      toast.error("Failed to delete family member");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading family members...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Family Members
          </h1>
          <p className="text-slate-600">
            Manage your family members for easier booking
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
        >
          <span className="material-icons">add</span>
          Add Member
        </button>
      </div>

      {/* Family Members Grid */}
      {members.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-icons text-slate-400 text-4xl">
              family_restroom
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            No family members yet
          </h3>
          <p className="text-slate-600 mb-6">
            Add family members to make booking easier
          </p>
          <button
            onClick={openAddModal}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all inline-flex items-center gap-2"
          >
            <span className="material-icons">add</span>
            Add First Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="material-icons text-teal-600 text-3xl">
                    person
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteMember(member.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <span className="material-icons text-red-600 text-xl">
                    delete
                  </span>
                </button>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {member.name}
              </h3>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-icons text-sm">cake</span>
                  <span className="text-sm">{member.age} years old</span>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-icons text-sm">
                    family_restroom
                  </span>
                  <span className="text-sm">{member.relationship}</span>
                </div>

                {member.special_needs && (
                  <div className="flex items-start gap-2 text-slate-600 mt-3 pt-3 border-t border-slate-200">
                    <span className="material-icons text-sm">info</span>
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-1">
                        Special Needs
                      </p>
                      <p className="text-sm">{member.special_needs}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingMember ? "Edit Family Member" : "Add Family Member"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-all"
              >
                <span className="material-icons text-slate-600">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none transition-colors text-slate-900"
                  placeholder="Enter name"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  {...register("age", { valueAsNumber: true })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none transition-colors text-slate-900"
                  placeholder="Enter age"
                />
                {errors.age && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.age.message}
                  </p>
                )}
              </div>

              {/* Relationship */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Relationship *
                </label>
                <select
                  {...register("relationship")}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none transition-colors text-slate-900"
                >
                  <option value="">Select relationship</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Grandparent">Grandparent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Other">Other</option>
                </select>
                {errors.relationship && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.relationship.message}
                  </p>
                )}
              </div>

              {/* Special Needs */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Special Needs (Optional)
                </label>
                <textarea
                  {...register("special_needs")}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none transition-colors text-slate-900"
                  placeholder="Any special needs or medical conditions"
                ></textarea>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:border-slate-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingMember
                      ? "Update"
                      : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
