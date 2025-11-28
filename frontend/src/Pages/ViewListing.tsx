import React, { useEffect, useState } from "react";
import { Sidebar } from "../Components/Sidebar";
import "../styles/ViewListing.css";
import { useParams } from "react-router-dom";

import defaultAvatar from "../assets/default-avatar.jpg"
import axios from "axios";
import type { ListingData } from "../types/listing.types";
import LoadingSpinner from "../Components/LoadingSpinner";

export const ViewListing: React.FC = () => {
  const {id} = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ListingData>();
  const [error, setError] = useState(null);

  // This is not done
  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);

    // Later you will replace this with:
    // await api.addFavorite(listing.id)
    console.log("Favorite toggled:", !isFavorite);
  };

  useEffect(() => {
    if (!id)
      return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
          withCredentials: true
        });

        const data = res.data;
        
        setData(data);
      }
      catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);


  return (
    <div className="dl-layout viewlisting-bg">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      {loading ? <LoadingSpinner size="small"/> : error ? <p>Error: {error} </p> : !data ? <p>No listing found.</p> :
      <main className="dl-main">
      <div className="vl-page">
        
        {/* FORM CONTAINER */}
        <div className="vl-container">

          <div className="vl-image-wrapper">
          <img src={data.images[0]} alt={data.title} className="vl-image" />
          </div>


          {/* TITLE */}
          <h1 className="vl-title">{data.title}</h1>

          {/* TAGS */}
          <div className="vl-tags">
            {data.categories.map((tag, i) => (
              <span key={i} className="vl-tag">
                {tag}
              </span>
            ))}
          </div>

          {/* PRICE */}
          <div className="vl-price">${data.price}</div>

          <p className="vl-status-label">Listing Status : {data.isSold ? "sold": "available"}</p>

          {/* DESCRIPTION */}
          <div className="vl-section">
            <h2>Description</h2>
            <p>{data.description}</p>
          </div>

          {/* SELLER INFO */}
          <div className="vl-section">
            <h2>Seller Information</h2>

            <div className="vl-seller-row">
              <img className="vl-seller-avatar" src={data.user.avatar || defaultAvatar} />
              <div>
                <div className="vl-seller-name">{data.user.username}</div>
              </div>
            </div>
          </div>

          {/* BUTTON */}
          <button className="vl-message-btn">Message Seller</button>
        </div>
      </div>
    </main>}
      
    </div>
  );
};
