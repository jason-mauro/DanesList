// src/Components/ListingGrid.tsx
import React from "react";
import "../styles/ListingGrid.css";

type Item = {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  isSold?: boolean;
};

type Props = {
  items: Item[];
  onClick?: (id: number) => void;
};

export const ListingGrid: React.FC<Props> = ({ items, onClick }) => {
  return (
    <div className="listing-grid">
      {items.map((item) => (
        <div
          key={item.id}
          className="listing-card"
          onClick={() => onClick && onClick(item.id)}
        >
          <div className="listing-img-wrapper">
            <img src={item.imageUrl} className="listing-img" />
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
