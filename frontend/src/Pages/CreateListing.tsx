import React, { useState, useEffect, useRef } from "react";
import { Sidebar } from "../Components/Sidebar";
import { UploadImages } from "../Components/UploadImages";
import { ToastPortal } from "../Components/ToastPortal";
import type { ListingInput } from "../types/listing.types";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const [toast, setToast] = useState<{message: string, type: "success" | "error"} | null>(null);
  const navigate = useNavigate();
  
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
    const images = await filesToBase64(files);

    const listingData: ListingInput = {
      title,
      price: priceValue,
      description,
      categories: selectedCategories,
      images
    };

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/listings/create`,
      listingData,
      { withCredentials: true }
    );

    setToast({ message: "Listing created successfully!", type: "success" });
    setTimeout(() => {
    navigate(`/listing/${res.data.id}`);
    }, 1000);

    // Reset form fields
    setTitle("");
    setPrice("");
    setSelectedCategories([]);
    setDescription("");
    setFiles([]);


  } catch (error: any) {
    setToast({ message: "Failed to create listing", type: "error" });
    console.error(error);
  }
};


  return (
    <>
    <ToastPortal
        toast={toast}
        onClose={() => setToast(null)}
    />
        {/* LAYOUT CONTAINER */}
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
                  <input value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className="cl-field">
                  <label>Price</label>
                  <input value={price} onChange={(e) => setPrice(e.target.value)} />
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
                              {cat}
                              <button
                                type="button"
                                className="cl-tag-remove"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCategories((prev) =>
                                    prev.filter((c) => c !== cat)
                                  );
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
                              onChange={() =>
                                setSelectedCategories((prev) =>
                                  prev.includes(cat)
                                    ? prev.filter((c) => c !== cat)
                                    : [...prev, cat]
                                )
                              }
                            />
                            <span>{cat}</span>
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
    </>
  );
};