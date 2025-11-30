// src/Components/ListingGrid.tsx
import React from "react";
import "../styles/ListingGrid.css";
import type {ListingData} from "../types/listing.types";
import { useNavigate } from "react-router-dom";
type Props = {
  items: ListingData[];
  onClick?: () => void;
  myListings: boolean;
};

export const ListingGrid: React.FC<Props> = ({ items, onClick, myListings }) => {
  const navigate = useNavigate();
  return (
    <div className="listing-grid">
      {items.map((item) => (
        <div
          key={item._id}
          className="listing-card"
          onClick={() => myListings ? navigate(`/edit/${item._id}`) : navigate(`/listing/${item._id}`)}
        >
          <div className="listing-img-wrapper">
            <img src={item.images[0]} className="listing-img" />
            {item.isSold && <span className="listing-sold">SOLD</span>}
          </div>

          <div className="listing-info">
            <h3>{item.title}</h3>
            <p>${item.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
