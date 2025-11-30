import React, { useState, useEffect} from "react";
import { Sidebar } from "../Components/Sidebar";
import { ListingGrid } from "../Components/ListingGrid"; 
import "../styles/Favorites.css";
import type { ListingData } from "../types/listing.types";
import LoadingSpinner from "../Components/LoadingSpinner";
import axios from "axios";


export const Favorites: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [listings, setListings] = useState<ListingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
        const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/listings?favorites=true`,
        { withCredentials: true }
        );
        const data = response.data.listings;
        setListings(data);
        setLoading(false);
    }
    fetchData();
  },[])


  return (
    <div className="dl-layout">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      {loading ? <LoadingSpinner/> : 
        <main className="dl-main fav-main">
          <h1 className="fav-title">My Favorites</h1>
          <ListingGrid items={listings} myListings={false} />
        </main>
      }
    </div>
  );
};