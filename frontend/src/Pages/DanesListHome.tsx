import React, { useState } from "react";
import { Sidebar } from "../Components/Sidebar";
import { Header } from "../Components/Header";
import { SearchBar } from "../Components/SearchBar";
import { Filters } from "../Components/Filters";
import { ListingCard } from "../Components/ListingCard";
import { Pagination } from "../Components/Pagination";
import { sampleListings } from "../data/sampleListings";
import "../styles/DanesListHome.css";

export const DanesListHome: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);

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

  // Pagination calculations
  const start = (currentPage - 1) * LISTINGS_PER_PAGE;
  const end = start + LISTINGS_PER_PAGE;

  const pageListings = sampleListings.slice(start, end);
  const totalPages = Math.ceil(sampleListings.length / LISTINGS_PER_PAGE);

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
        />

        <section className="dl-card-grid">
          {pageListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onClick={() => console.log("Clicked:", listing.id)}
            />
          ))}
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
