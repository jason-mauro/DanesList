import React, {useState} from "react";
import "../styles/DanesListHome.css";
import DanesListLogoLarge from "../assets/logos/DanesListLettersOnly.png";
import DanesListLogoSmall from "../assets/logos/DaneListSmallLogo.png";
import RealBurger from "../assets/logos/burger.png"
import {sampleListings} from "../data/sampleListings";

export const DanesListHome = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => { setSidebarOpen(!sidebarOpen);};
    
    const LISTINGS_PER_PAGE = 8;

    const [currentPage, setCurrentPage] = useState(1);

    const start = (currentPage - 1) * LISTINGS_PER_PAGE;
    const end = start + LISTINGS_PER_PAGE;

    const pageListings = sampleListings.slice(start, end);
    const totalPages = Math.ceil(sampleListings.length / LISTINGS_PER_PAGE);

  
    return (
    <div className="dl-layout">
      {/* LEFT SIDEBAR */}
      <aside className={`dl-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="dl-sidebar-logo">
          {/* Placeholder circle logo */}
          <img
            src={DanesListLogoSmall}
            alt="DanesList Logo"
            className="dl-logo-small"
            />
        </div>

        <nav className="dl-sidebar-nav">
          <button className="dl-nav-item">
            <span className="dl-nav-icon">＋</span>
            <div className="dl-nav-text">
              <span className="dl-nav-title">Create Listing</span>
            </div>
          </button>

          <button className="dl-nav-item">
            <span className="dl-nav-icon">📦</span>
            <div className="dl-nav-text">
              <span className="dl-nav-title">Manage My Listings</span>
              <span className="dl-nav-subtitle">Menu description.</span>
            </div>
          </button>

          <button className="dl-nav-item">
            <span className="dl-nav-icon">📝</span>
            <div className="dl-nav-text">
              <span className="dl-nav-title">Menu Label</span>
              <span className="dl-nav-subtitle">Menu description.</span>
            </div>
          </button>

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

          <button className="dl-nav-item">
            <span className="dl-nav-icon">⚙️</span>
            <div className="dl-nav-text">
              <span className="dl-nav-title">Menu Label</span>
              <span className="dl-nav-subtitle">Menu description.</span>
            </div>
          </button>
        </nav>

        <div className="dl-sidebar-footer">
          <div className="dl-avatar" />
          <div className="dl-avatar-text">
            <div className="dl-avatar-name">Username</div>
            <div className="dl-avatar-signout">Signout</div>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="dl-main">
        {/* Top bar with hamburger & logo text */}
        <header className="dl-header">
          <button className="dl-hamburger" aria-label="Toggle menu" onClick={toggleSidebar}>
            <img src={RealBurger} alt="Menu" className="dl-burger-img"/>
          </button>

          <div className="dl-brand">
            <img src={DanesListLogoLarge} className="dl-logo-img" alt="DanesList Logo" />
            </div>
        </header>

        {/* Search bar */}
        <section className="dl-search-section">
          <div className="dl-search-bar">
            <input
              type="text"
              placeholder="Search"
              className="dl-search-input"
            />
            <span className="dl-search-icon">🔍</span>
          </div>
        </section>

        {/* Filters */}
        <section className="dl-filters">
          <span className="dl-tags-label">Tags:</span>

          <div className="dl-filter-row">
            <div className="dl-filter-group">
              <label className="dl-filter-label">Browse By Category</label>
              <div className="dl-select">
                <select>
                  <option>Select Category</option>
                  <option>Electronics</option>
                  <option>School Supplies</option>
                  <option>Furniture</option>
                </select>
                <span className="dl-select-caret">▾</span>
              </div>
            </div>

            <div className="dl-filter-group">
              <label className="dl-filter-label">Sort By</label>
              <div className="dl-select">
                <select defaultValue="Newest First">
                  <option>Newest First</option>
                  <option>Oldest First</option>
                  <option>Lowest Price</option>
                  <option>Highest Price</option>
                </select>
                <span className="dl-select-caret">▾</span>
              </div>
            </div>
          </div>
        </section>

        {/* Card grid */}
        <section className="dl-card-grid">
            
        {pageListings.map((listing) => (
            <article key={listing.id} className="dl-card">
            <div className="dl-card-image-wrapper">
                <img
                className="dl-card-image"
                src={listing.imageUrl}
                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                alt={listing.title}
                />
            </div>

            <div className="dl-card-body">
                <h3 className="dl-card-title">{listing.title}</h3>
                <p className="dl-card-price">${listing.price}</p>
            </div>
            </article>
        ))}
        <div className="dl-pagination-container">
            <div className="dl-pagination">
                <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                >
                Prev
                </button>

                <div className="dl-page-numbers">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                    key={i}
                    className={currentPage === i + 1 ? "active" : ""}
                    onClick={() => setCurrentPage(i + 1)}
                    >
                    {i + 1}
                    </button>
                ))}
                </div>

                <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                >
                Next
                </button>
            </div>
            </div>

        </section>
      </main>
    </div>
  );
};
