import React, { useEffect, useState } from "react";
import { Sidebar } from "../Components/Sidebar";
import { Header } from "../Components/Header";
import { SearchBar } from "../Components/SearchBar";
import { Filters } from "../Components/Filters";
import { ListingCard } from "../Components/ListingCard";
import { Pagination } from "../Components/Pagination";
import { sampleListings } from "../data/sampleListings";
import "../styles/DanesListHome.css";
import type {ListingData} from "../types/listing.types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../Components/LoadingSpinner";

export const DanesListHome: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageListings, setPageListings] = useState<ListingData[][]>([[]])
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [categories, setCategories] = useState<string[]>([]);

  const LISTINGS_PER_PAGE = 16;

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSort(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
      const fetchCategories = async() => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/listings/categories`, {
            withCredentials: true
          });
          const categories = res.data;
          setCategories(categories);
        } catch (error: any){
          console.log(error.message);
        }
      }
    fetchCategories();
  }, [])

  // TODO: Finish fetching and setting the listing data for the page
  useEffect(() => {
      if (!pageListings[currentPage-1]){
        setLoading(true)
      }
      // For now, we just fetch all lisitngs every time since we have a small dataset and set pages with that
      // For future, we would cache pages, etc.. so we dont load too many at a time.
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/listings?sortBy=${selectedSort}` +
            `${searchQuery.trim() ? `&name=${searchQuery.trim()}` : ""}` +
            `${selectedCategory.trim() ? `&category=${selectedCategory.trim()}` : ""}`,
            { withCredentials: true }
          );
      
          const listings = response.data.listings;
          console.log(listings)
          const pages = [];
          const total = Math.ceil(listings.length / LISTINGS_PER_PAGE);
      
          for (let i = 0; i < total; i++) {
            const start = i * LISTINGS_PER_PAGE;
            const end = start + LISTINGS_PER_PAGE;
            pages.push(listings.slice(start, end));
          }
      
          setTotalPages(total);
          setPageListings(pages);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
      
  }, [searchQuery, selectedCategory, selectedSort])

  // Pagination calculations
  const start = (currentPage - 1) * LISTINGS_PER_PAGE;
  const end = start + LISTINGS_PER_PAGE;


  return (
    <div className="dl-layout">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <main className="dl-main">
        <Header />

        <SearchBar 
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <Filters
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          selectedSort={selectedSort}
          onSortChange={handleSortChange}
          categories={categories}
        />

        <section className="dl-card-grid">
          
          {loading ? <LoadingSpinner size="small"/> : pageListings[currentPage-1] ? pageListings[currentPage - 1].map((listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
              onClick={() => navigate(`/listing/${listing._id}`)}
            /> 
          )) : <p>No Listings found</p>}
        </section>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
    
    </div>
  );
};
