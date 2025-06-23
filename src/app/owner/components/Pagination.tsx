import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  // giữ giá trị gõ vào ô input
  const [goToPage, setGoToPage] = useState<string>(currentPage.toString());

  const handleGoToPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGoToPage(value);

    if (value === "") {
      // setTimeout(() => alert("Không được để trống"), 0);
      return;
    }

    if (!/^\d+$/.test(value)) {
      alert("Vui lòng nhập một số nguyên dương");
      return;
    }

    const pageNum = Number(value);
    if (pageNum < 1 || pageNum > totalPages) {
      alert(`Vui lòng nhập số trang từ 1 đến ${totalPages}`);
      return;
    }

    onPageChange(pageNum);
  };

  return (
    <div className="flex w-full justify-end items-center gap-2 mt-4 text-sm">
      {/* First & Prev */}
      <button
        className="border px-2 py-1 rounded disabled:opacity-30 bg-[#432DD7] text-white "
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        <ChevronsLeft size={16} className="font-bold" />
      </button>
      <button
        className="border px-2 py-1 rounded disabled:opacity-30 bg-[#432DD7] text-white"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={16} className="font-bold" />
      </button>

      {/* Info */}
      <span>
        Page <strong>{currentPage}</strong> of{" "}
        <strong>{totalPages.toLocaleString()}</strong>
      </span>

      {/* Go to page */}
      <span className="flex items-center gap-1">
        | Go to page:
        <input
          type="number"
          value={goToPage}
          onChange={handleGoToPage}
          className="w-16 px-1 py-0.5 border rounded"
          min={1}
          max={totalPages}
        />
      </span>

      {/* Next & Last */}
      <button
        className="border px-2 py-1 rounded disabled:opacity-30 bg-[#432DD7] text-white"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight size={16} className="font-bold" />
      </button>
      <button
        className="border px-2 py-1 rounded disabled:opacity-30 bg-[#432DD7] text-white"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        <ChevronsRight size={16} className="font-bold" />
      </button>
    </div>
  );
}
