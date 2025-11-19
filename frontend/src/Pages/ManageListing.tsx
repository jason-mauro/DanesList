import React, { useState } from "react";
import { Sidebar } from "../Components/Sidebar";
import "../styles/ViewListing.css"; // reuse same styling

export const ManageListing: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSold, setIsSold] = useState(false);

  // TEMP MOCK DATA (same camera listing)
  const listing = {
    title: "Fujifilm Camera",
    price: 0,
    imageUrl:
      "https://images.pexels.com/photos/1203803/pexels-photo-1203803.jpeg?w=1200",
    description:
      "Camera I had lying around. Please contact to negotiate price. I know what I have",
    tags: ["Camera"],
    isSold: false,
    seller: {
      name: "Seller Name",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    },
  };

  return (
    <div className="dl-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className="dl-main">
        <div className="vl-page">
          {/* FORM CONTAINER */}
          <div className="vl-container">
            {/* MAIN LISTING IMAGE */}
            <div className={`vl-image-wrapper ${isSold ? "sold" : ""}`}>
                <img src={listing.imageUrl} alt={listing.title} className="vl-image" />
                {isSold && <div className="vl-sold-banner">SOLD</div>}
            </div>



            {/* TITLE */}
            <h1 className="vl-title">{listing.title}</h1>

            {/* TAGS */}
            <div className="vl-tags">
              {listing.tags.map((tag, i) => (
                <span key={i} className="vl-tag">
                  {tag}
                </span>
              ))}
            </div>

            {/* PRICE */}
            <div className="vl-price">${listing.price}</div>

            <p className="vl-status-label">Listing Status</p>

            {/* DESCRIPTION */}
            <div className="vl-section">
              <h2>Description</h2>
              <p>{listing.description}</p>
            </div>

            {/* SELLER INFO */}
            <div className="vl-section">
              <h2>Seller Information</h2>

              <div className="vl-seller-row">
                <img className="vl-seller-avatar" src={listing.seller.avatar} />
                <div>
                  <div className="vl-seller-name">{listing.seller.name}</div>
                </div>
              </div>
            </div>

            {/* CONFIRMATION PAGE BUTTONS */}
            <div className="vl-confirm-buttons">
              <button className="vl-btn-edit">Modify Listing</button>
              <button className="vl-btn-sold" onClick={() => setIsSold(true)}>Mark Sold</button>

              <button className="vl-btn-delete">Delete Listing</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
