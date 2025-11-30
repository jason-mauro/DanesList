import React, { useState } from "react";
import { Sidebar } from "../Components/Sidebar";
import "../styles/Account.css";

export const MyAccount: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // TEMP user data
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="dl-layout">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className="dl-main account-main">
        <h1 className="account-title">Account Settings</h1>

        <div className="account-card">

          <div className="account-header">
            <img
              className="account-avatar"
              src={user.avatar}
            />
            <div>
              <h2>{user.username}</h2>
              <p>{user.email }</p>
            </div>
          </div>

          <div className="account-buttons">
            <button className="account-btn">Edit Profile</button>
          </div>
        </div>

      </main>
    </div>
  );
};
