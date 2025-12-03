// src/Components/ListingGrid.tsx
import React from "react";
import "../styles/ListingGrid.css";
import type {ListingData} from "../types/listing.types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
type Props = {
  items: ListingData[];
  onClick?: () => void;
  myListings: boolean;
};

export const ListingGrid: React.FC<Props> = ({ items, myListings }) => {
  const navigate = useNavigate();
  const {user} = useAuth();
  return (
    <div className="listing-grid">
      {items.map((item) => {
        return (
        <div
          key={item._id}
          className="listing-card"
          onClick={() => myListings || user?._id === item.user._id  ? navigate(`/edit/${item._id}`) : navigate(`/listing/${item._id}`)}
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
      )
})}
    </div>
  );
};
