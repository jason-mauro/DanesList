import React from "react";
import DanesListLogoSmall from "../assets/logos/DaneListSmallLogo.png";
import "../styles/Sidebar.css";
import { Link } from "react-router-dom";

type SidebarProps = {
  isOpen: boolean;
  onToggle?: () => void;
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
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
          <div className="dl-avatar-name">Username</div>
          <div className="dl-avatar-signout">
        <Link to="/Login">
          Sign out
        </Link>
      </div>
        </div>
      </div>
    </aside>
  );
};
