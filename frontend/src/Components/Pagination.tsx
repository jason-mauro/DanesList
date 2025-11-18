import React from "react";
import "../styles/Pagination.css";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="dl-pagination-container">
      <div className="dl-pagination">
        <button disabled={currentPage === 1} onClick={handlePrevious}>
          Prev
        </button>

        <div className="dl-page-numbers">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button disabled={currentPage === totalPages} onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};
