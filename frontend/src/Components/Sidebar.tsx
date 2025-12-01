import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import DanesListLogoSmall from "../assets/logos/DaneListSmallLogo.png";
import "../styles/Sidebar.css";
import { logout } from "../utils/api";
import { useConversation } from "../context/ConversationContext";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

type SidebarProps = {
  isOpen: boolean;
  onToggle?: () => void;
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const {loading , isAdmin} = useAuth();
  const {unreadCount} = useConversation();
  const handleSignOut = async () => {
    try {
      // Call logout API to clear token from localStorage
      await logout();
      
      // Navigate to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, still clear local data and redirect
      localStorage.removeItem('username');
      localStorage.removeItem("userId")
      navigate("/login");
    }
  };

  // Get user info from localStorage to display
  const getUserName = () => {
    const username = localStorage.getItem('username');
    if (username) {
        return username;
    }
    return "User"
  };

  const getUserAvatar = () => {
    const avatar = localStorage.getItem('user_avatar');
    if (!avatar) {
      return "none"
    }
    return avatar;
  }

  return (
    <aside className={`dl-sidebar ${isOpen ? "open" : "closed"}`}>
      {/* Hamburger in top-right, NOT wrapped in tooltip */}
      <button className="dl-sidebar-hamburger" onClick={onToggle}>
        {isOpen ? "☰" : "✕"}
      </button>
    
        <Link to="/home" className="sidebar-link">
            <div className="dl-sidebar-logo">
                <img
                src={DanesListLogoSmall}
                alt="DanesList Logo"
                className="dl-logo-small"
                />
            </div>
        </Link>
      {loading ? <LoadingSpinner size="small"/> : 
      <nav className="dl-sidebar-nav">
        <Link to="/createListing" className="sidebar-link">
            <div className="dl-tooltip">
            <button className="dl-nav-item">
                <span className="dl-nav-icon">＋</span>
                <div className="dl-nav-text">
                <span className="dl-nav-title">Create Listing</span>
                </div>
            </button>
            <span className="dl-tooltip-text">Create Listing</span>
            </div>
        </Link>


        {/* TODO make a page that sends you to your listings, similar to favorite listings */}
        {/* Then when they click a listing from there, send them to manage listing for that specific listing */}

        <Link to="/manageListings" className="sidebar-link">
            <div className="dl-tooltip">
            <button className="dl-nav-item">
                <span className="dl-nav-icon">🗒️</span>
                <div className="dl-nav-text">
                <span className="dl-nav-title">Manage My Listings</span>
                </div>
            </button>
            <span className="dl-tooltip-text">Manage My Listings</span>
            </div>
        </Link>

        <Link to="/favorites" className="sidebar-link">
            <div className="dl-tooltip">
            <button className="dl-nav-item">
                <span className="dl-nav-icon">⭐️</span>
                <div className="dl-nav-text">
                <span className="dl-nav-title">Favorites</span>
                </div>
            </button>
            <span className="dl-tooltip-text">Favorites</span>
            </div>
        </Link>

        <Link to="/messages" className="sidebar-link">
            <div className="dl-tooltip">
            <button className="dl-nav-item">
                <span className="dl-nav-icon">✉️</span>
                <div className="dl-nav-text dl-nav-text-row">
                <div>
                    <span className="dl-nav-title">Messages</span>
                    {unreadCount > 0 && <span className="unread-badge">{ unreadCount }</span>}
                </div>
                <span className="dl-nav-dot" />
                </div>
            </button>
            <span className="dl-tooltip-text">Messages</span>
            </div>
        </Link>
        

        <Link to="/account" className="sidebar-link">
            <div className="dl-tooltip">
            <button className="dl-nav-item">
                <span className="dl-nav-icon">👤</span>
                <div className="dl-nav-text">
                <span className="dl-nav-title">Account</span>
                </div>
            </button>
            <span className="dl-tooltip-text">Account</span>
            </div>
        </Link>
        {isAdmin && <Link to="/reports" className="sidebar-link">
            <div className="dl-tooltip">
            <button className="dl-nav-item">
                <span className="dl-nav-icon">⚠️</span>
                <div className="dl-nav-text dl-nav-text-row">
                <div>
                    <span className="dl-nav-title">Reports</span>
                </div>
                <span className="dl-nav-dot" />
                </div>
            </button>
            <span className="dl-tooltip-text">Messages</span>
            </div>
        </Link>
        }
        </nav>
      }


      
        <div className="dl-sidebar-footer">
          <img className="dl-avatar" src={getUserAvatar()} alt={getUserName()} />
          <div className="dl-avatar-text">
            <div className="dl-avatar-name">{getUserName()}</div>
            <button 
              onClick={handleSignOut}
              className="dl-sign-out-btn"
            >
              Sign out
            </button>
          </div>
        </div>
    </aside>
  );
};