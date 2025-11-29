import React, {useEffect} from "react";
import "../styles/Filters.css";

type Option = {
  value: string;
  label: string;
};

type FiltersProps = {
  categories?: string[];               // optional array of categories
  selectedCategory: string;            // currently selected category
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  sortOptions?: Option[];              // optional array of sort options
  selectedSort: string;                // selected sort value
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const Filters: React.FC<FiltersProps> = ({
  categories = [],
  selectedCategory,
  onCategoryChange,
  sortOptions = [],
  selectedSort,
  onSortChange,
}) => {
  const defaultCategories: Option[] =
    categories.length > 0
      ? [
        { value: "", label: "Select Category" },
        ...categories.map(c => ({ value: c, label: c }))
      ]
      : [
          { value: "", label: "Select Category" },
          { value: "electronics", label: "Electronics" },
          { value: "school-supplies", label: "School Supplies" },
          { value: "furniture", label: "Furniture" },
        ];

  const defaultSortOptions: Option[] =
    sortOptions.length > 0
      ? sortOptions
      : [
          { value: "newest", label: "Newest First" },
          { value: "oldest", label: "Oldest First" },
          { value: "minPrice", label: "Lowest Price" },
          { value: "maxPrice", label: "Highest Price" },
        ];

  return (
    <section className="dl-filters">
      <span className="dl-tags-label">Tags:</span>

      <div className="dl-filter-row">
        {/* CATEGORY SELECT */}
        <div className="dl-filter-group">
          <label className="dl-filter-label">Browse By Category</label>
          <div className="dl-select">
            <select value={selectedCategory} onChange={onCategoryChange}>
              {defaultCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <span className="dl-select-caret">▾</span>
          </div>
        </div>

        {/* SORT SELECT */}
        <div className="dl-filter-group">
          <label className="dl-filter-label">Sort By</label>
          <div className="dl-select">
            <select value={selectedSort} onChange={onSortChange}>
              {defaultSortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="dl-select-caret">▾</span>
          </div>
        </div>
      </div>
    </section>
  );
};
