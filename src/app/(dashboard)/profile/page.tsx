"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    image: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      const data = await response.json();

      if (response.ok) {
        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          image: data.user.image || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          image: formData.image,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        
        await update({
          ...session,
          user: {
            ...session?.user,
            name: formData.name,
            image: formData.image,
          },
        });
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploadingImage(true);
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData((prev) => ({ ...prev, image: data.url }));
        toast.success("Image uploaded successfully");
        
        await update({ user: { image: data.url } });
      } else {
        toast.error(data.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <>
      
      <div className="mb-4 sm:mb-8">
        <h1 className="text-lg sm:text-3xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2">
          Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Manage your account information
        </p>
      </div>

      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        
        <div className="h-32 bg-linear-to-r from-teal-500 to-blue-500"></div>

        
        <div className="px-4 sm:px-8 pb-4 sm:pb-8">
          <div className="flex items-end justify-between flex-col sm:flex-row -mt-10 sm:-mt-16 mb-4 sm:mb-6">
            <div className="flex items-end gap-2 sm:gap-4">
              <div className="relative group">
                <div className="w-20 h-20 sm:w-32 sm:h-32 bg-white rounded-full border-4 border-white shadow-lg overflow-hidden">
                  {formData.image || session?.user?.image ? (
                    <Image
                      src={formData.image || session?.user?.image!}
                      alt={formData.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl sm:text-4xl font-bold text-teal-600 bg-teal-50">
                      {formData.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    <div className="text-center">
                      {uploadingImage ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                      ) : (
                        <>
                          <span className="material-icons text-white text-xl sm:text-3xl">
                            camera_alt
                          </span>
                          <p className="text-white text-xs mt-1 hidden sm:block">
                            Change Photo
                          </p>
                        </>
                      )}
                    </div>
                  </label>
                )}
              </div>
              <div className="mb-2 sm:mb-4">
                <h2 className="text-base sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {formData.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate max-w-[140px] sm:max-w-none">
                  {formData.email}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full">
                  {session?.user?.role}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-teal-600 focus:outline-none text-slate-900 dark:text-white dark:bg-slate-700 disabled:bg-slate-50 dark:disabled:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled={!isEditing}
                  placeholder="+880 1XXX-XXXXXX"
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-teal-600 focus:outline-none text-slate-900 dark:text-white dark:bg-slate-700 disabled:bg-slate-50 dark:disabled:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={session?.user?.role || ""}
                  disabled
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-700"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    fetchProfile();
                  }}
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:border-teal-600 hover:text-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Security
          </h3>
          <button className="w-full flex items-center justify-between p-4 border-2 border-slate-200 dark:border-slate-600 rounded-lg hover:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all group">
            <div className="flex items-center gap-3">
              <span className="material-icons text-slate-600 dark:text-slate-400 group-hover:text-teal-600">
                lock
              </span>
              <span className="font-semibold text-slate-900 dark:text-white group-hover:text-teal-700">
                Change Password
              </span>
            </div>
            <span className="material-icons text-slate-400 group-hover:text-teal-600">
              arrow_forward
            </span>
          </button>
        </div>

        
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Preferences
          </h3>
          <button className="w-full flex items-center justify-between p-4 border-2 border-slate-200 dark:border-slate-600 rounded-lg hover:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all group">
            <div className="flex items-center gap-3">
              <span className="material-icons text-slate-600 dark:text-slate-400 group-hover:text-teal-600">
                notifications
              </span>
              <span className="font-semibold text-slate-900 dark:text-white group-hover:text-teal-700">
                Notifications
              </span>
            </div>
            <span className="material-icons text-slate-400 group-hover:text-teal-600">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
