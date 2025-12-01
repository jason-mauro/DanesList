// src/Components/ReportGrid.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ListingGrid.css";
import type { ListingReportData } from "../types/reports.types";

type Props = {
  items: ListingReportData[];
};

export const ReportGrid: React.FC<Props> = ({ items }) => {
  const navigate = useNavigate();
    console.log(items);
  return (
    <div className="listing-grid">
      {items?.map((report) => (
        <div
          key={report._id}
          className="listing-card"
          onClick={() => navigate(`/reports/${report._id}`)}
        >
          <div className="listing-info">
            <h3>{report.listingData.title}</h3>
            <div className="listing-img-wrapper">
            <img src={report.listingData.images[0]} />
            </div>
            <p><b>Reporter:</b> {report.user.username}</p>
            <p><b>Reason:</b> {report.reason}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
