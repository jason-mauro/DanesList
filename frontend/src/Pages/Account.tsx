import React, { useState } from "react";
import { Sidebar } from "../Components/Sidebar";
import "../styles/Account.css";
import defaultAvatar from "../assets/default-avatar.jpg";
import { ToastPortal } from "../Components/ToastPortal";
import axios from "axios";

export const MyAccount: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [username, setUsername] = useState(storedUser.username || "");
  const [email, setEmail] = useState(storedUser.email || "");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  // Fallback image if no profilePic exists
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
    const updateData = {
      username,
      email,
      profilePicture: previewUrl // this could be a URL or Base64 string
    };

    await axios.put(
      `${import.meta.env.VITE_API_URL}/user/update`,
      updateData,
      { withCredentials: true }
    );

    setToast({ message: "Profile updated successfully!", type: "success" });

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
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="account-field">
            <label>Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div className="account-field">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="account-field">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              placeholder="Leave blank to keep current"
              onChange={(e) => setPassword(e.target.value)}
            />
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