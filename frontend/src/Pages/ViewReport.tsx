// src/Pages/ViewReport.tsx
import React, { useState, useEffect } from "react";
import { Sidebar } from "../Components/Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../Components/LoadingSpinner";
import "../styles/ViewListing.css";
import type { ListingReportData } from "../types/reports.types";

export const ViewReport: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<ListingReportData>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [deletingString, setDeletingString] = useState("");
  const [error, setError] = useState("");
  const [showDeleteError, setShowDeleteError] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/reports/${id}`,
          { withCredentials: true }
        );
        setReport(res.data.reportData);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const deleteReport = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/reports/${id}`,
        { withCredentials: true }
      );
      setShowDeleteConfirm(false);
      setShowDeleteSuccess(true);
    } catch (err) {
      console.log(err);
    }
  };


  const deleteListing = async () => {
    try {
      
      await axios.post(`${import.meta.env.VITE_API_URL}/listings/delete`, report?.listingData, {withCredentials: true});
      setShowDeleteConfirm(false);
      setShowDeleteSuccess(true);
    } catch (error: any){
        console.log(error)
    }
  }

  const banUser = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/user/ban/${report?.listingData.user._id}`, {}, {withCredentials: true});
      setShowDeleteConfirm(false);
      setShowDeleteSuccess(true);
    } catch (error: any){
      setShowDeleteConfirm(false);
      setShowDeleteError(true);
      setError(error.response.data.message);
    }
  }


  if (loading) return <LoadingSpinner />;

  if (!report) return <p>No report found.</p>;

  return (
    <div className="dl-layout">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className="dl-main">
        <div className="vl-page">
          <div className="vl-container">

            <h1 className="vl-title">Report Details</h1>

            <div className="vl-section">
              <h2>Reported Listing</h2>
              <p><b>Title:</b> {report.listingData.title}</p>
              <p><b>Price:</b> ${report.listingData.price}</p>
              <div className="vl-image-wrapper">
          <img src={report.listingData.images[0]} className="vl-image" />

          </div>
            </div>

            <div className="vl-section">
              <h2>Reporter</h2>
              <p><b>User:</b> {report.user.username}</p>
            </div>

            <div className="vl-section">
              <h2>Reason</h2>
              <p>{report.reason}</p>
            </div>

            <div className="vl-confirm-buttons">
            <button className="vl-btn-delete" onClick={() => {
                setDeletingString("Listing");
                setShowDeleteConfirm(true)
            }}>
                Delete Listing
              </button>
              <button className="vl-btn-delete" onClick={() => {
                setDeletingString("Report");
                setShowDeleteConfirm(true)
                }}>
                Delete Report
              </button>
              <button className="vl-btn-delete" onClick={() => {
                setDeletingString("ban");
                setShowDeleteConfirm(true)
                }}>
                Ban User
              </button>
              {showDeleteConfirm && (
        <div className="vl-confirm-overlay">
            <div className="vl-confirm-box">
            <p>{deletingString !== "ban" ? `Are you sure you want to delete this ${deletingString}` : "Are you sure you want to ban this user?"}</p>
            <div className="vl-confirm-buttons">
                <button className="confirm-yes" onClick={deletingString === "Listing" ? deleteListing : deletingString === "ban" ? banUser : deleteReport}>Yes</button>
                <button className="confirm-no" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            </div>
            </div>
        </div>
        )}

        {showDeleteSuccess && (
              <div className="vl-confirm-overlay">
                <div className="vl-confirm-box">
                  <p><b>Success</b></p>
                  <div className="vl-confirm-buttons">
                    <button 
                      className="confirm-yes" 
                      onClick={() => {
                        setShowDeleteSuccess(false);
                        navigate("/reports");}
                    }
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showDeleteError && (
              <div className="vl-confirm-overlay">
                <div className="vl-confirm-box">
                  <p><b>{`Error: ${error}`}</b></p>
                  <div className="vl-confirm-buttons">
                    <button 
                      className="confirm-yes" 
                      onClick={() => {
                        setShowDeleteError(false)
                      }
                    }
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
