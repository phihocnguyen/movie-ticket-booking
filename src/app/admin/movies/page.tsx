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
import MovieForm from "./components/MovieForm";
import { deleteMovie, getAllMovies } from "@/app/services/admin/movieSercive";
import {
  confirmDelete,
  showErrorMessage,
  showSuccess,
} from "@/app/utils/alertHelper";

export interface Movie {
  id: number;
  title: string;
  titleVi: string;
  description: string;
  duration: number;
  language: string;
  genre: string;
  releaseDate: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  director: string;
  actor: string;
  rating: number;
  country: string;
  isActive?: boolean;
}

export default function Movies() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [country, setCountry] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [allMovie, setAllMovie] = useState<Movie[]>([]);
  const [formKey, setFormKey] = useState(Date.now());
  const reload = async () => {
    try {
      const res = await getAllMovies();
      console.log("Check res", res);
      if (res === null) {
        setAllMovie([]);
      } else {
        const data = res.data;
        setAllMovie(data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách user:", error);
    }
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllMovies();
        console.log("Check res", res);
        if (res === null) {
          setAllMovie([]);
        } else {
          const data = res.data;
          setAllMovie(data);
        }
      } catch (error) {
        showErrorMessage("Lỗi khi lấy danh sách user:" + error);
      }
    };
    fetchUsers();
  }, []);
  console.log("Check allMovie", allMovie);
  const filtered = useMemo(() => {
    return allMovie
      .filter((movie) => {
        const matchesSearch =
          movie.title.toLowerCase().includes(search.toLowerCase()) ||
          movie.director.toLowerCase().includes(search.toLowerCase());
        const matchesGenre = genre ? movie.genre === genre : true;
        const matchesCountry = country ? movie.country === country : true;
        return matchesSearch && matchesGenre && matchesCountry;
      })
      .sort((a, b) =>
        sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating
      );
  }, [search, genre, country, sortOrder, allMovie]);
  const uniqueGenreList = useMemo(() => {
    const genres = allMovie.map((movie) => movie.genre).filter(Boolean);
    return Array.from(new Set(genres)); // loại bỏ trùng lặp
  }, [allMovie]);

  const uniqueCountryList = useMemo(() => {
    const countries = allMovie.map((movie) => movie.country).filter(Boolean);
    return Array.from(new Set(countries)); // loại bỏ trùng
  }, [allMovie]);
  const paginatedMovies = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(filtered.length / pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, genre, country, pageSize]);

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleDelete = async (ownerId: number) => {
    const confirmed = await confirmDelete(
      "Bạn có chắc muốn xóa phim này không?"
    );
    // console.log(">>>>check confirmed:", confirmed); // Log id ra console
    // console.log("User id:", userId); // Log id ra console
    if (!confirmed) return;
    try {
      const result = await deleteMovie(ownerId);
      // console.log(">>>>check result:", result); // Log kết quả xóa ra console
      if (!result) {
        return;
      }
      setAllMovie((prev) => prev.filter((owner) => owner.id !== ownerId));
      showSuccess("Xóa phim thành công!");
    } catch (error) {
      showErrorMessage("Xóa phim thất bại!" + error);
    }
  };
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        {/* bộ lọc data, và nút thêm */}
        <div className="flex gap-4 w-full">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên phim hoặc tác giả"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 px-3 py-[6px] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-[#1677ff] focus:border-[#1677ff]"
          />
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full md:w-1/4 px-3 py-[6px] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Chọn thể loại</option>
            {uniqueGenreList.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full md:w-1/4 px-3 py-[6px] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Chọn quốc gia</option>
            {uniqueCountryList.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <button
          className="flex gap-2.5 border px-10 py-1.5 rounded-[8px] bg-[#432DD7] text-white"
          onClick={() => {
            setSelectedMovie(null);
            setShowModal(true);
            setFormKey(Date.now());
          }}
        >
          <Plus /> Thêm
        </button>
      </div>
      {/* bảng data */}
      <div className="rounded-xl overflow-hidden border border-gray-200 bg-white h-[400px]">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gray-200 text-sm text-gray-700 hover:bg-gray-200">
              <TableHead className="px-4 py-4">STT</TableHead>
              <TableHead className="px-4 py-4">Tên phim</TableHead>
              <TableHead className="px-4 py-4">Đạo diễn</TableHead>
              <TableHead className="px-4 py-4">Thể loại</TableHead>
              <TableHead className="px-4 py-4">Quốc gia</TableHead>
              <TableHead
                onClick={toggleSort}
                className="flex items-center justify-start px-4 py-4 mt-1.5 cursor-pointer select-none gap-1"
              >
                Số sao
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
            {paginatedMovies.length === 0 ? (
              <TableRow className="hover:bg-white">
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-gray-500 hover:bg-white"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              paginatedMovies.map((movie, index) => (
                <TableRow
                  key={movie.id}
                  className="hover:bg-gray-100 transition"
                >
                  <TableCell className="px-4 py-4">
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="px-4 py-4">{movie.title}</TableCell>
                  <TableCell className="px-4 py-4">{movie.director}</TableCell>
                  <TableCell className="px-4 py-4">{movie.genre}</TableCell>
                  <TableCell className="px-4 py-4">{movie.country}</TableCell>
                  <TableCell className="px-4 py-4">{movie.rating}</TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex gap-2 items-center">
                      <Eye
                        className="w-4 h-4 text-[#03A9F4] cursor-pointer hover:scale-110 transition"
                        onClick={() => {
                          setSelectedMovie(movie);
                          setShowModal(true);
                        }}
                      />
                      <Trash
                        className="w-4 h-4 text-[#E34724] cursor-pointer hover:scale-110 transition"
                        onClick={() => handleDelete(movie.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Phân trang */}
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

      {/* show modal */}
      {showModal && (
        <BaseModal
          open={showModal}
          title={selectedMovie ? "Chi tiết phim" : "Thêm phim mới"}
          onClose={() => setShowModal(false)}
        >
          <MovieForm
            movie={selectedMovie}
            reload={reload}
            setShowModal={setShowModal}
            key={formKey}
          />{" "}
          {/* props tùy bạn định nghĩa */}
        </BaseModal>
      )}
    </div>
  );
}
