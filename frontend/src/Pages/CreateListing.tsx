import React, { useState, useEffect, useRef } from "react";
import { Sidebar } from "../Components/Sidebar";
import { UploadImages } from "../Components/UploadImages";
import type { ListingInput } from "../types/listing.types";
import axios from "axios";

import "../styles/CreateListing.css";
import LoadingSpinner from "../Components/LoadingSpinner";

export const CreateListing: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/listings/categories`, {
          withCredentials: true
        });

        const data = res.data;
        setCategories(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryToggle = (categoryValue: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryValue)) {
        return prev.filter((c) => c !== categoryValue);
      } else {
        return [...prev, categoryValue];
      }
    });
  };

  const handleRemoveCategory = (categoryValue: string) => {
    setSelectedCategories((prev) => prev.filter((c) => c !== categoryValue));
  };

  const handleAddFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const filesToBase64 = (files: File[]): Promise<string[]> => {
    return Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    );
  };

  const handleSubmit = async () => {
    try {
      const priceValue = Number(price);

      const images: string[] = await filesToBase64(files);

      const listingData: ListingInput = {
        title,
        price: priceValue,
        description,
        categories: selectedCategories,
        images: images
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/listings/create`,
        listingData,
        {
          withCredentials: true
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="dl-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      {loading ? (
        <LoadingSpinner size="small" />
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <main className="dl-main">
          <div className="cl-page">
            <h1 className="cl-title">Create a New Listing</h1>

            <div className="cl-form-container">
              <div className="cl-field">
                <label>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="cl-field">
                <label>Price</label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="cl-field">
                <label>Categories</label>
                <div className="cl-multiselect" ref={dropdownRef}>
                  <div 
                    className="cl-multiselect-input"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <div className="cl-selected-tags">
                      {selectedCategories.length === 0 ? (
                        <span className="cl-placeholder">Select categories...</span>
                      ) : (
                        selectedCategories.map((cat) => (
                          <span key={cat} className="cl-tag">
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            <button
                              type="button"
                              className="cl-tag-remove"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveCategory(cat);
                              }}
                            >
                              ×
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                    <span className="cl-dropdown-arrow">{dropdownOpen ? "▲" : "▼"}</span>
                  </div>

                  {dropdownOpen && (
                    <div className="cl-dropdown-menu">
                      {categories.map((cat) => (
                        <label key={cat} className="cl-dropdown-item">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat)}
                            onChange={() => handleCategoryToggle(cat)}
                          />
                          <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="cl-field">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="cl-upload-wrapper">
                <UploadImages
                  files={files}
                  onFilesSelected={handleAddFiles}
                  onRemoveFile={handleRemoveFile}
                />
              </div>

              <button className="cl-submit-btn" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};