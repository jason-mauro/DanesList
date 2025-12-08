import React, {useState, useEffect} from "react";
import { Sidebar } from "../Components/Sidebar";
import { ListingGrid } from "../Components/ListingGrid";
import "../styles/ManageMyListings.css";
import type { ListingData } from "../types/listing.types";
import axios from "axios";
import LoadingSpinner from "../Components/LoadingSpinner";

export const ManageMyListings: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [listings, setListings] = useState<ListingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
        const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/listings?user=true`,
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
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      {loading ? <LoadingSpinner size="small"/> : 
      <main className="dl-main ml-main">
        <h1 className="ml-title">My Listings</h1>
        <ListingGrid items={listings} myListings={true} />
      </main>
    }
    </div>
  );
};
