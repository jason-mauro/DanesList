
import React, { useEffect, useState } from "react";
import { Sidebar } from "../Components/Sidebar";
import axios from "axios";
import LoadingSpinner from "../Components/LoadingSpinner";
import "../styles/Favorites.css";
import { ReportGrid } from "../Components/ReportGrid";
import type { ListingReportData } from "../types/reports.types";

export const Reports: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reports, setReports] = useState<ListingReportData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/reports`,
          { withCredentials: true }
        );
        setReports(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="dl-layout">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <main className="dl-main fav-main">
          <h1 className="fav-title">Listing Reports</h1>
          <ReportGrid items={reports} />
        </main>
      )}
    </div>
  );
};
