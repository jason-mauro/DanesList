import React, { useEffect, useState } from "react";
import { Sidebar } from "../Components/Sidebar";
import "../styles/Account.css";
import defaultAvatar from "../assets/default-avatar.jpg";
import { ToastPortal } from "../Components/ToastPortal";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export const MyAccount: React.FC = () => {
  const location = useLocation();
  useEffect(() => {
    const latest = JSON.parse(localStorage.getItem("user") || "{}");
    setPreviewUrl(latest.avatar || defaultAvatar);
  }, [location.pathname]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [username, setUsername] = useState(storedUser.username || "");
  const [email, setEmail] = useState(storedUser.email || "");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const handleHidePassword = () => setHidePassword(!hidePassword);
  
  const defaultPic = storedUser.profilePic?.length > 0 
    ? storedUser.profilePic 
    : defaultAvatar

  const [previewUrl, setPreviewUrl] = useState<string>(defaultPic);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  const [toast, setToast] = useState<{message: string, type: "success" | "error"} | null>(null);

  const handleSubmit = async () => {
  try {
    const updateData: any = {};

    // Add only changed fields
    if (username && username !== storedUser.username) updateData.username = username;
    if (email && email !== storedUser.email) updateData.email = email;
    if (password && password.trim() !== "") updateData.password = password;

    if (profilePic) {
      const toBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

      updateData.avatar = await toBase64(profilePic);
    }

    await axios.put(
      `${import.meta.env.VITE_API_URL}/user/update`,
      updateData,
      { withCredentials: true }
    );

    // Optionally update localStorage
    const updatedUser = {
      ...storedUser,
      ...updateData,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("storage")); // Notify other tabs
    window.dispatchEvent(new Event("sidebarUpdate")); // Notify sidebar to refresh

    setToast({ message: "Profile updated successfully!", type: "success" });
    setPassword(""); // Clear password field after successful update

  } catch (error) {
    console.error(error);
    setToast({ message: "Failed to update profile", type: "error" });
  }
};

  return (
    <>
    <ToastPortal toast={toast} onClose={() => setToast(null)} />
    <div className="dl-layout">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className="dl-main account-main">
        <h1 className="account-title">Account Settings</h1>

        <div className="account-card">
          <div className="account-header">
            <img className="account-avatar" src={previewUrl} alt="Profile" />
            <label className="upload-btn">
              Upload New Photo
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </label>
          </div>

          <div className="account-field">
            <label>Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div className="account-field">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

         <div className="account-field position-relative">
            <label htmlFor="NewPasswordInput">New Password</label>
            <div className="position-relative">
              <input
                type={hidePassword ? "password" : "text"}
                id="NewPasswordInput"
                className="form-control pe-5"
                placeholder="Leave blank to keep current"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent"
                onClick={handleHidePassword}
                style={{ zIndex: 2 }}
              >
                {hidePassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="account-buttons">
            <button className="account-btn" onClick={handleSubmit}>Save Changes</button>
          </div>
        </div>
      </main>
    </div>
    </>
  );
};