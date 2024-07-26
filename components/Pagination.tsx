import React, { useMemo } from 'react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = useMemo(() => {
    const pageNumbers = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (currentPage > 3) {
        pageNumbers.push('...');
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      if (currentPage < totalPages - 2) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-12">
      {pageNumbers.map((number, index) => (
        <button
          key={index}
          className={`mx-1 rounded-lg border border-[#d0d5dd] h-10 min-w-10 bg-white text-[#777e90] transition-colors ${
            number === currentPage
              ? 'bg-[#2563eb] border-[#2563eb] text-[#fff]'
              : number === '...' ? '' : 'hover:bg-[#f2f4fc]'
          }`}
          onClick={() => typeof number === 'number' && onPageChange(number)}
          disabled={number === '...'}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
