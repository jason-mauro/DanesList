import React from "react";
import "../styles/SearchBar.css";

type SearchBarProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search",
}) => {
  return (
    <section className="dl-search-section">
      <div className="dl-search-bar">
        <input
          type="text"
          placeholder={placeholder}
          className="dl-search-input"
          value={value}
          onChange={onChange}
        />
        <span className="dl-search-icon">🔍</span>
      </div>
    </section>
  );
};
