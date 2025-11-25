import React, { useState } from "react";
import { Sidebar } from "../Components/Sidebar";
import { ListingGrid } from "../Components/ListingGrid"; 
import "../styles/Favorites.css";

// TEMP MOCK
const favoriteListings = [
  { id: 1, title: "Dining Table", price: 120, imageUrl: "https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg" },
  { id: 2, title: "Laptop", price: 650, imageUrl: "https://images.pexels.com/photos/18105/pexels-photo.jpg" },
  { id: 3, title: "Bike", price: 200, imageUrl: "https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg" },
  { id: 4, title: "Bookshelf", price: 40, imageUrl: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg" },
];

export const Favorites: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dl-layout">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className="dl-main fav-main">
         <h1 className="fav-title">My Favorites</h1>
        <ListingGrid items={favoriteListings} />
      </main>

    </div>
  );
};