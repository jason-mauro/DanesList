import React, { useState } from "react";
import { Sidebar } from "../Components/Sidebar";
import { Header } from "../Components/Header";
import { UploadImages } from "../Components/UploadImages";

import "../styles/CreateListing.css"; // ← new CSS file

export const CreateListing: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const handleAddFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    console.log({
      title,
      price,
      category,
      description,
      files,
    });
  };

  return (
    <div className="dl-layout">
      {/* SIDEBAR */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* MAIN PAGE */}
      <main className="dl-main">
        <div className="cl-page">

        <h1 className="cl-title">Create a New Listing</h1>

        <div className="cl-form-container">
          {/* TITLE */}
          <div className="cl-field">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* PRICE */}
          <div className="cl-field">
            <label>Price</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          {/* CATEGORY */}
          <div className="cl-field">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="vehicles">Vehicles</option>
              <option value="clothing">Clothing</option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div className="cl-field">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* UPLOAD COMPONENT */}
          <div className="cl-upload-wrapper">
            <UploadImages
              files={files}
              onFilesSelected={handleAddFiles}
              onRemoveFile={handleRemoveFile}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button className="cl-submit-btn" onClick={handleSubmit}>
            Submit
          </button>
          </div>
        </div>
      </main>
    </div>
  );
};
