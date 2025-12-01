import React, { useEffect, useState } from "react";
import { Sidebar } from "../Components/Sidebar";
import "../styles/ViewListing.css";
import { useNavigate, useParams } from "react-router-dom";

import defaultAvatar from "../assets/default-avatar.jpg"
import axios from "axios";
import type { ListingData } from "../types/listing.types";
import LoadingSpinner from "../Components/LoadingSpinner";
import { useConversation } from "../context/ConversationContext";

export const ViewListing: React.FC = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ListingData>();
  const [error, setError] = useState(null);
  const {setSelectedConversation} = useConversation();
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [showReportSuccess, setShowReportSuccess] = useState(false);

    const handleFavoriteClick = () => {
    // If trying to un-favorite → ask for confirmation
    if (isFavorite) {
        setShowConfirm(true);
    } else {
        addFavorite();
    }
    };

    
    //Backend logic maybe?
    const addFavorite = async () => {
    try {
        // Replace with your backend endpoint
        await axios.post(
          `${import.meta.env.VITE_API_URL}/listings/favorite/${id}`, {},
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
          await axios.post(
          `${import.meta.env.VITE_API_URL}/listings/favorite/${id}`, {} ,
          { withCredentials: true }
          );

          setIsFavorite(false);
          setShowConfirm(false);
      } catch (err) {
          console.error("Failed to remove favorite:", err);
      }
    };

    const messageSeller = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/messages/conversations/check/${data?.user._id}`, {withCredentials: true});
        const conversationData = response.data;
        if (response.data.exists){
          setSelectedConversation(conversationData.conversation);
          navigate("/messages");
        } else {
          setSelectedConversation(null);
          navigate(`/messages/newMessage`, {state: {user: data?.user}})
        }
      } catch (error: any){
        console.log(error);
      }
    }


    useEffect(() => {
      if (!id) return;
      const fetchData = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
            withCredentials: true
          });
          setData(res.data);

          const favoriteRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/listings/favorite/${id}`,
            { withCredentials: true }
          );
          setIsFavorite(favoriteRes.data.favorite);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [id]);

    const submitReport = async () => {
      if (!reportReason.trim()) {
        alert("Please provide a reason.");
        return;
      }
    
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/reports`,
          { listingID: id, reason: reportReason },
          { withCredentials: true }
        );
        
    
        setShowReportPopup(false);
        setReportReason("");
        setShowReportSuccess(true);
        
      } catch (err) {
        console.error("Failed to submit report:", err);
      }
    };
    


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
          <button className="vl-message-btn" onClick={messageSeller}>Message Seller</button>
          <button className="vl-report-btn" onClick={() => setShowReportPopup(true)}>
            Report Listing
          </button>
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

    {showReportPopup && (
      <div className="vl-confirm-overlay">
        <div className="vl-confirm-box vl-report-box" style={{ width: "400px" }}>
          <h3>Report This Listing</h3>

          <label style={{ fontWeight: 600 }}>Reason</label>
          <textarea
            className="vl-input"
            placeholder="Describe the issue…"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            style={{
              width: "100%",
              minHeight: "100px",
              padding: "10px",
              resize: "vertical",
            }}
          />

          <div className="vl-confirm-buttons">
            <button className="confirm-yes" onClick={submitReport}>
              Submit
            </button>
            <button className="confirm-no" onClick={() => setShowReportPopup(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}

{showReportSuccess && (
              <div className="vl-confirm-overlay">
                <div className="vl-confirm-box">
                  <p><b>Report Submitted</b></p>
                  <div className="vl-confirm-buttons">
                    <button 
                      className="confirm-yes" 
                      onClick={() => setShowReportSuccess(false)}
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}

    </main>}
      
    </div>
  );
};
