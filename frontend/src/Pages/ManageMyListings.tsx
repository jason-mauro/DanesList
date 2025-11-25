import React from "react";
import { Sidebar } from "../Components/Sidebar";
import { ListingGrid } from "../Components/ListingGrid";
import "../styles/ManageMyListings.css";

export const ManageMyListings: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  // TEMP MOCK DATA — same shape as Favorites
  const myListings = [
    { id: 1, title: "Used Candle", price: 2, imageUrl:"https://images.pexels.com/photos/4107897/pexels-photo-4107897.jpeg",},
    { id: 2, title: "Old Laptop", price: 120, imageUrl: "https://images.pexels.com/photos/18105/pexels-photo.jpg",},
    { id: 3, title: "Desk Chair", price: 45, imageUrl:"https://images.pexels.com/photos/1166412/pexels-photo-1166412.jpeg",},
    { id: 4, title: "Textbook", price: 20, imageUrl:"https://images.pexels.com/photos/33283/stack-of-books-vintage-books-book-books.jpg",},
  ];

  return (
    <div className="dl-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className="dl-main ml-main">
        <h1 className="ml-title">My Listings</h1>

        {/* Match Favorites layout */}
        <ListingGrid items={myListings} />
      </main>
    </div>
  );
};
