import React from "react";
import { useNavigate } from "react-router-dom";
import DanesListLogoSmall from "../assets/logos/DaneListSmallLogo.png";
import "../styles/Sidebar.css";
import { logout } from "../utils/api";

type SidebarProps = {
  isOpen: boolean;
  onToggle?: () => void;
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      // Call logout API to clear token from localStorage
      await logout();
      
      // Navigate to login page
      navigate("/Login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, still clear local data and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate("/Login");
    }
  };

  // Get user info from localStorage to display
  const getUserName = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.username || "User";
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
    return "User";
  };

  return (
    <aside className={`dl-sidebar ${isOpen ? "open" : "closed"}`}>

      {/* Hamburger inside sidebar */}
      <button
        className="dl-sidebar-hamburger"
        onClick={onToggle}
        aria-label="Toggle sidebar"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className="dl-sidebar-logo">
        <img
          src={DanesListLogoSmall}
          alt="DanesList Logo"
          className="dl-logo-small"
        />
      </div>
      
      <nav className="dl-sidebar-nav">
        <div className="dl-tooltip">
            <button className="dl-nav-item">
                <span className="dl-nav-icon">＋</span>
                <div className="dl-nav-text">
                <span className="dl-nav-title">Create Listing</span>
                </div>
            </button>

            {/* Tooltip text */}
            <span className="dl-tooltip-text">Create Listing</span>
        </div>

        <div className="dl-tooltip">
            <button className="dl-nav-item">
            <span className="dl-nav-icon">📦</span>
            <div className="dl-nav-text">
                <span className="dl-nav-title">Manage My Listings</span>
                <span className="dl-nav-subtitle">Menu description.</span>
            </div>
            </button>
            <span className="dl-tooltip-text">Manage My Listings</span>
        </div>

        <div className="dl-tooltip">
            <button className="dl-nav-item">
            <span className="dl-nav-icon">📝</span>
            <div className="dl-nav-text">
                <span className="dl-nav-title">Menu Label</span>
                <span className="dl-nav-subtitle">Menu description.</span>
            </div>
            </button>
            <span className="dl-tooltip-text">Menu Label</span>
        </div>

        <div className="dl-tooltip">
            <button className="dl-nav-item">
            <span className="dl-nav-icon">✉️</span>
            <div className="dl-nav-text dl-nav-text-row">
                <div>
                <span className="dl-nav-title">Messages</span>
                <span className="dl-nav-subtitle">1 Unread</span>
                </div>
                <span className="dl-nav-dot" />
            </div>
            </button>
            <span className="dl-tooltip-text">Messages</span>
        </div>

        <div className="dl-tooltip">
            <button className="dl-nav-item">
            <span className="dl-nav-icon">⚙️</span>
            <div className="dl-nav-text">
                <span className="dl-nav-title">Menu Label</span>
                <span className="dl-nav-subtitle">Menu description.</span>
            </div>
            </button>
            <span className="dl-tooltip-text">Menu Label</span>
        </div>

    </nav>

      <div className="dl-sidebar-footer">
        <div className="dl-avatar" />
        <div className="dl-avatar-text">
          <div className="dl-avatar-name">{getUserName()}</div>
          <div className="dl-avatar-signout">
            <button 
              onClick={handleSignOut}
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                padding: 0,
                font: 'inherit',
                textDecoration: 'underline'
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};