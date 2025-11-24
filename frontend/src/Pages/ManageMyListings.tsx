import React from "react";
import { Sidebar } from "../Components/Sidebar";
import "../styles/ManageMyListings.css";

export const ManageMyListings: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  // TEMP MOCK DATA — same shape as favorites
  const myListings = [
    {
      id: 1,
      title: "Used Candle",
      price: 2,
      imageUrl: "https://images.pexels.com/photos/4107897/pexels-photo-4107897.jpeg",
    },
    {
      id: 2,
      title: "Old Laptop",
      price: 120,
      imageUrl: "https://images.pexels.com/photos/18105/pexels-photo.jpg",
    },
    {
      id: 3,
      title: "Desk Chair",
      price: 45,
      imageUrl: "https://images.pexels.com/photos/1166412/pexels-photo-1166412.jpeg",
    },
    {
      id: 4,
      title: "Textbook",
      price: 20,
      imageUrl: "https://images.pexels.com/photos/33283/stack-of-books-vintage-books-book-books.jpg",
    },
  ];

  return (
    <div className="dl-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className="dl-main">
        <h1 className="ml-title">My Listings</h1>

        <div className="manage-listings-grid">
          {myListings.map((item) => (
            <div key={item.id} className="listing-card">
              <img src={item.imageUrl} className="listing-card-img" />
              <div className="listing-card-info">
                <h3>{item.title}</h3>
                <p>${item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
