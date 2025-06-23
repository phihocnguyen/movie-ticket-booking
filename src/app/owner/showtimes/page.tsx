"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Plus, Trash } from "lucide-react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "../components/Pagination";
import BaseModal from "../components/BaseModal";
import ShowtimeForm from "./components/ShowtimesForm";

export interface Showtime {
  id: number;
  movieId: number;
  theaterId: number;
  screenId: number;
  startTime: string;
  endTime: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  movieTitle?: string;
  theaterName?: string;
  screenName?: string;
  theaterAddress?: string;
}

const mockShowtimes: Showtime[] = [
  {
    id: 1,
    movieId: 1,
    theaterId: 1,
    screenId: 1,
    startTime: "24/06/2025 15:00",
    endTime: "24/06/2025 17:30",
    price: 95000,
    isActive: true,
    createdAt: "24/06/2025 10:00",
    movieTitle: "Inception",
    theaterName: "CGV Vincom",
    screenName: "Phòng chiếu 1",
    theaterAddress: "Vincom Đồng Khởi",
  },
];

export default function Showtimes() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [showModal, setShowModal] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(
    null
  );

  const filtered = useMemo(() => {
    return mockShowtimes
      .filter((item) =>
        item.movieTitle?.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) =>
        sortOrder === "asc" ? a.price - b.price : b.price - a.price
      );
  }, [search, sortOrder]);

  const paginatedShowtimes = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(filtered.length / pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize]);

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên phim"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-3 py-[6px] bg-white border border-gray-300 rounded-md focus:outline-none"
        />
        <button
          className="flex gap-2.5 border px-10 py-1.5 rounded-[8px] bg-[#432DD7] text-white"
          onClick={() => {
            setSelectedShowtime(null);
            setShowModal(true);
          }}
        >
          <Plus /> Thêm
        </button>
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-200 bg-white h-[400px]">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gray-200 text-sm text-gray-700 hover:bg-gray-200">
              <TableHead className="px-4 py-4">STT</TableHead>
              <TableHead className="px-4 py-4">Tên phim</TableHead>
              <TableHead className="px-4 py-4">Phòng</TableHead>
              <TableHead className="px-4 py-4">Rạp</TableHead>
              <TableHead className="px-4 py-4">Giờ chiếu</TableHead>
              <TableHead className="px-4 py-4">Địa chỉ rạp</TableHead>

              <TableHead
                onClick={toggleSort}
                className="flex items-center justify-start px-4 py-4 mt-1.5 cursor-pointer select-none gap-1"
              >
                Giá vé
                {sortOrder === "asc" ? (
                  <IoMdArrowDropdown className="w-5 h-5 mt-0.5" />
                ) : (
                  <IoMdArrowDropup className="w-5 h-5 mt-0.5" />
                )}
              </TableHead>
              <TableHead className="px-4 py-4">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedShowtimes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-6 text-gray-500"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              paginatedShowtimes.map((showtime, index) => (
                <TableRow key={showtime.id}>
                  <TableCell className="px-4 py-4">
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {showtime.movieTitle}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {showtime.screenName}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {showtime.theaterName}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {showtime.startTime}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {showtime.theaterAddress}
                  </TableCell>

                  <TableCell className="px-4 py-4">{showtime.price}</TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex gap-2 items-center">
                      <Eye
                        className="w-4 h-4 text-[#03A9F4] cursor-pointer hover:scale-110 transition"
                        onClick={() => {
                          setSelectedShowtime(showtime);
                          setShowModal(true);
                        }}
                      />
                      <Trash className="w-4 h-4 text-[#E34724] cursor-pointer hover:scale-110 transition" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

      {showModal && (
        <BaseModal
          open={showModal}
          title={
            selectedShowtime ? "Chi tiết lịch chiếu" : "Thêm lịch chiếu mới"
          }
          onClose={() => setShowModal(false)}
        >
          <ShowtimeForm showtime={selectedShowtime} />
        </BaseModal>
      )}
    </div>
  );
}
