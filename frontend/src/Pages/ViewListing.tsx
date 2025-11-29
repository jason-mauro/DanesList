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
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ListingData>();
  const [error, setError] = useState(null);

    const handleFavoriteClick = () => {
    // If trying to un-favorite → ask for confirmation
    if (isFavorite) {
        setShowConfirm(true);
    } else {
        addFavorite();
    }
    };

    // TEMP frontend-only favorite add
    const addFavorite = () => {
    console.log("Pretend: sending POST /favorites/add");
    setIsFavorite(true);      // <-- immediately toggle
    };

    // TEMP frontend-only favorite remove
    const removeFavorite = () => {
    console.log("Pretend: sending DELETE /favorites/remove");
    setIsFavorite(false);     // <-- immediately toggle
    setShowConfirm(false);
    };
    
    //Backend logic maybe?
    /*const addFavorite = async () => {
    try {
        // Replace with your backend endpoint
        await axios.post(
        `${import.meta.env.VITE_API_URL}/favorites/add/${id}`,
        {},
        { withCredentials: true }
        );

        setIsFavorite(true);
    } catch (err) {
        console.error("Failed to favorite:", err);
    }
    };

    const removeFavorite = async () => {
    try {
        // Replace with your backend endpoint
        await axios.delete(
        `${import.meta.env.VITE_API_URL}/favorites/remove/${id}`,
        { withCredentials: true }
        );

        setIsFavorite(false);
        setShowConfirm(false);
    } catch (err) {
        console.error("Failed to remove favorite:", err);
    }
    };

  useEffect(() => {
  if (!id) return;

  const fetchData = async () => {
    try {
      setLoading(true);

      // 1) Load listing details
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/listings/${id}`,
        { withCredentials: true }
      );
      setData(res.data);

      // 2) Load favorite status
      const favRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/favorites/check/${id}`,
        { withCredentials: true }
      );
      setIsFavorite(favRes.data.isFavorite);
    }
    catch (error: any) {
      setError(error.message);
    }
    finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id]);*/

    useEffect(() => {
  if (!id) return;
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
        withCredentials: true
      });
      setData(res.data);

      // TEMP: default to "not favorited"
      setIsFavorite(false);
    } catch (err: any) {
      setError(err.message);
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
            {/* FAVORITE BUTTON */}
            <button className="vl-fav-btn" onClick={handleFavoriteClick}>
            <span>{isFavorite ? "❤️" : "🤍"}</span>
            </button>
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
      {showConfirm && (
        <div className="vl-confirm-overlay">
            <div className="vl-confirm-box">
            <p>Remove this listing from favorites?</p>
            <div className="vl-confirm-buttons">
                <button className="confirm-yes" onClick={removeFavorite}>Yes</button>
                <button className="confirm-no" onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
            </div>
        </div>
        )}
    </main>}
      
    </div>
  );
};
