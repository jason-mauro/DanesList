import React from "react";
import "../styles/ListingCard.css";

type Listing = {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
};

type ListingCardProps = {
  listing: Listing;
  onClick?: () => void; // optional because some pages may not use it
};

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
  return (
    <article className="dl-card" onClick={onClick}>
      <div className="dl-card-image-wrapper">
        <img
          className="dl-card-image"
          src={listing.imageUrl}
          onError={(e) => (e.currentTarget.src = "/placeholder.png")}
          alt={listing.title}
        />
      </div>

      <div className="dl-card-body">
        <h3 className="dl-card-title">{listing.title}</h3>
        <p className="dl-card-price">${listing.price}</p>
      </div>
    </article>
  );
};
