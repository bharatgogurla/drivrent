import React, { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  Camera,
  User,
  Lock,
  ShieldAlert,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const getPasswordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: "" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const labels = ["Weak", "Fair", "Good", "Strong"];
  const colors = [
    "bg-red-500",
    "bg-amber-500",
    "bg-yellow-500",
    "bg-green-500",
  ];
  const i = Math.max(score - 1, 0);
  return { score, label: labels[i], color: colors[i] };
};

const OwnerProfile = () => {
  const { user, axios, fetchUser, logout } = useAppContext();

  const initialProfile = useRef({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [preview, setPreview] = useState(user?.image || "");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [profile, setProfile] = useState(initialProfile.current);

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Sync state when user changes
  React.useEffect(() => {
    if (user) {
      const uProfile = {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      };
      initialProfile.current = uProfile;
      setProfile(uProfile);
      setPreview(user.image || "");
    }
  }, [user]);

  const strength = useMemo(
    () => getPasswordStrength(password.newPassword),
    [password.newPassword],
  );

  const passwordMismatch =
    password.newPassword &&
    password.confirmPassword &&
    password.newPassword !== password.confirmPassword;

  const hasChanges =
    JSON.stringify(profile) !== JSON.stringify(initialProfile.current) ||
    password.currentPassword ||
    password.newPassword ||
    password.confirmPassword;

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    try {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios.post("/api/owner/update-image", formData);

      if (data.success) {
        fetchUser();
        toast.success(data.message);
      } else {
        toast.error(data.message);
        setPreview(user?.image || "");
      }
    } catch (error) {
      toast.error(error.message);
      setPreview(user?.image || "");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      setUploadingImage(true);
      const { data } = await axios.post("/api/owner/delete-image");
      if (data.success) {
        fetchUser();
        toast.success(data.message);
        setPreview("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    const isChangingPassword =
      password.currentPassword ||
      password.newPassword ||
      password.confirmPassword;
    if (isChangingPassword) {
      if (!password.currentPassword) {
        toast.error("Current password is required");
        return;
      }
      if (!password.newPassword) {
        toast.error("New password is required");
        return;
      }
      if (password.newPassword !== password.confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }
    }

    const isChangingProfile =
      JSON.stringify(profile) !== JSON.stringify(initialProfile.current);
    if (isChangingProfile) {
      if (!profile.name || !profile.name.trim()) {
        toast.error("Name is required");
        return;
      }
    }

    try {
      setSaving(true);

      if (isChangingProfile) {
        const { data } = await axios.post("/api/owner/update-profile", {
          name: profile.name,
          phone: profile.phone,
        });

        if (data.success) {
          initialProfile.current = {
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone,
          };
          setProfile(initialProfile.current);
        } else {
          toast.error(data.message);
          return;
        }
      }

      if (isChangingPassword) {
        const { data } = await axios.post("/api/owner/change-password", {
          currentPassword: password.currentPassword,
          newPassword: password.newPassword,
        });

        if (data.success) {
          setPassword({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        } else {
          toast.error(data.message);
          return;
        }
      }

      fetchUser();
      toast.success("Profile saved successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Password is required to delete account");
      return;
    }

    try {
      setDeleting(true);
      const { data } = await axios.post("/api/owner/delete-account", {
        password: deletePassword,
      });

      if (data.success) {
        toast.success("Account deleted successfully");
        setShowDeleteModal(false);
        logout(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleting(false);
    }
  };

  const ownerId = user?._id ? user._id.slice(-6).toUpperCase() : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-14 py-6"
    >
      {/* Heading */}
      <div className="mb-6">
        <p className="text-xs font-medium tracking-wide text-primary uppercase">
          Account settings
        </p>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mt-1">
          Owner profile
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your personal information and account security.
        </p>
      </div>

      {/* Identity card */}
      <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-6 sm:px-8 sm:py-7 flex items-center gap-5">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            background:
              "linear-gradient(115deg, transparent 40%, white 50%, transparent 60%)",
          }}
        />

        <label className="relative group cursor-pointer shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white/30 bg-primary-dark">
            <img
              src={
                preview ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  profile.name || "Owner",
                )}&background=2563eb&color=fff`
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <Camera size={20} className="text-white" />
          </div>

          <input
            hidden
            type="file"
            accept="image/*"
            disabled={uploadingImage}
            onChange={handleImage}
          />
        </label>

        <div className="min-w-0 flex-1">
          <p className="text-white font-semibold text-lg truncate">
            {profile.name || "Owner"}
          </p>
          <p className="text-white/70 text-sm truncate">{profile.email}</p>
          {uploadingImage ? (
            <p className="text-white/70 text-xs mt-1">Uploading photo...</p>
          ) : user?.image ? (
            <button
              onClick={handleDeleteImage}
              className="text-xs text-red-200 hover:text-red-100 underline mt-1.5 block transition text-left"
            >
              Remove photo
            </button>
          ) : null}
        </div>

        <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
          <span className="text-xs font-medium text-white bg-white/15 px-3 py-1 rounded-full">
            Owner
          </span>
          {ownerId && (
            <span className="text-[11px] font-mono text-white/60">
              ID {ownerId}
            </span>
          )}
        </div>
      </div>

      {/* Personal information */}
      <div className="bg-white rounded-2xl border border-borderColor shadow-sm p-6 md:p-8 mt-5">
        <div className="flex items-center gap-2 mb-6">
          <User size={18} className="text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-800">
            Personal information
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium text-sm">Full name</label>
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full border border-borderColor rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-sm">
              Phone number
            </label>
            <input
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              placeholder="+91 9876543210"
              className="w-full border border-borderColor rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block mb-2 font-medium text-sm">Email</label>
            <input
              value={profile.email}
              readOnly
              className="w-full bg-gray-100 border border-borderColor rounded-lg px-4 py-3 text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="bg-white rounded-2xl border border-borderColor shadow-sm p-6 md:p-8 mt-5">
        <div className="flex items-center gap-2 mb-1">
          <Lock size={18} className="text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-800">Password</h2>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Leave these blank if you don't want to change your password.
        </p>

        <div className="space-y-5 max-w-xl">
          <div className="relative">
            <label className="block mb-2 font-medium text-sm">
              Current password
            </label>
            <input
              type={showPassword.current ? "text" : "password"}
              value={password.currentPassword}
              onChange={(e) =>
                setPassword({ ...password, currentPassword: e.target.value })
              }
              placeholder="Enter current password"
              className="w-full border border-borderColor rounded-lg px-4 py-3 pr-11 outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword({
                  ...showPassword,
                  current: !showPassword.current,
                })
              }
              className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600"
            >
              {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <label className="block mb-2 font-medium text-sm">
              New password
            </label>
            <input
              type={showPassword.next ? "text" : "password"}
              value={password.newPassword}
              onChange={(e) =>
                setPassword({ ...password, newPassword: e.target.value })
              }
              placeholder="Enter new password"
              className="w-full border border-borderColor rounded-lg px-4 py-3 pr-11 outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword({ ...showPassword, next: !showPassword.next })
              }
              className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600"
            >
              {showPassword.next ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            {password.newPassword && (
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full ${strength.color} transition-all`}
                    style={{ width: `${(strength.score / 4) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-10">
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          <div className="relative">
            <label className="block mb-2 font-medium text-sm">
              Confirm new password
            </label>
            <input
              type={showPassword.confirm ? "text" : "password"}
              value={password.confirmPassword}
              onChange={(e) =>
                setPassword({ ...password, confirmPassword: e.target.value })
              }
              placeholder="Confirm new password"
              className={`w-full border rounded-lg px-4 py-3 pr-11 outline-none focus:ring-2 focus:ring-primary ${
                passwordMismatch ? "border-red-400" : "border-borderColor"
              }`}
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword({
                  ...showPassword,
                  confirm: !showPassword.confirm,
                })
              }
              className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600"
            >
              {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {passwordMismatch && (
              <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
            )}
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end mt-5">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="bg-primary text-white px-8 py-3 rounded-lg font-medium min-w-[180px] flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            "Save changes"
          )}
        </motion.button>
      </div>

      {/* Danger zone */}
      <div className="bg-red-50 rounded-2xl border border-red-200 p-6 md:p-8 mt-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div className="flex gap-3">
          <ShieldAlert size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-red-700">Danger zone</h2>
            <p className="text-gray-600 mt-1 max-w-xl text-sm">
              Deleting your account is permanent. All cars, bookings, and
              profile information associated with this account will be removed.
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setDeletePassword("");
            setShowDeleteModal(true);
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium shrink-0"
        >
          Delete account
        </motion.button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full border border-borderColor shadow-2xl"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Delete Account
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              This action is{" "}
              <span className="font-bold text-red-600">irreversible</span>.
              Enter your password to verify and permanently delete your account,
              including all your cars and bookings.
            </p>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full border border-borderColor rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="px-4 py-2 border border-borderColor rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || !deletePassword}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {deleting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Delete permanently"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default OwnerProfile;
