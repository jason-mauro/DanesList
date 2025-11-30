import React, { useState, useEffect, useRef } from "react";
import { UploadImages } from "../Components/UploadImages";
import { ToastPortal } from "../Components/ToastPortal";
import type { ListingData, ListingInput } from "../types/listing.types";
import axios from "axios";
import "../styles/CreateListing.css";

interface EditListingPopupProps {
  listingData: ListingData;
  onClose: () => void;
  onSuccess: (updatedData: ListingData) => void;
}

export const EditListingPopup: React.FC<EditListingPopupProps> = ({
  listingData,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState(listingData.title);
  const [price, setPrice] = useState(listingData.price.toString());
  const [selectedCategories, setSelectedCategories] = useState<string[]>(listingData.categories);
  const [description, setDescription] = useState(listingData.description);
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(listingData.images);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toast, setToast] = useState<{message: string, type: "success" | "error"} | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/listings/categories`, {
          withCredentials: true
        });
        setCategories(res.data);
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
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

  const handleAddFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
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
      const newImages = await filesToBase64(files);
      const allImages = [...existingImages, ...newImages];

      // Validate at least 1 image
      if (allImages.length < 1) {
        setToast({message: "At least 1 image required", type: "error"});
        return;
      }

      const updatedData = {
        ...listingData,
        title,
        price: priceValue,
        description,
        categories: selectedCategories,
        images: allImages
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/listings/update`,
        updatedData,
        { withCredentials: true }
      );

      onSuccess(updatedData);
    } catch (error: any) {
      console.error("Failed to update listing:", error);
    }
  };

  return (
    <>
      <ToastPortal
        toast={toast}
        onClose={() => setToast(null)}
      />
      <div className="vl-confirm-overlay">
        <div className="edit-popup-box">
          <div className="edit-popup-header">
            <h2>Edit Listing</h2>
            <button className="edit-popup-close" onClick={onClose}>×</button>
          </div>
  
          <div className="edit-popup-content">
            {loading ? (
              <p>Loading categories...</p>
            ) : (
              <>
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
  
                {existingImages.length > 0 && (
                  <div className="cl-field">
                    <label>Current Images</label>
                    <div className="existing-images-grid">
                      {existingImages.map((img, idx) => (
                        <div key={idx} className="existing-image-item">
                          <img src={img} alt={`Existing ${idx}`} />
                          <button
                            className="remove-existing-img"
                            onClick={() => handleRemoveExistingImage(idx)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
  
                <div className="cl-upload-wrapper">
                  <UploadImages
                    files={files}
                    onFilesSelected={handleAddFiles}
                    onRemoveFile={handleRemoveFile}
                  />
                </div>
  
                <div className="edit-popup-buttons">
                  <button className="confirm-no" onClick={onClose}>
                    Cancel
                  </button>
                  <button className="confirm-yes" onClick={handleSubmit}>
                    Save Changes
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>  {/* This closing tag was missing */}
    </>
  );
};