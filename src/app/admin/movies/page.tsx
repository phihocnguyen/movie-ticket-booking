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

export interface Movie {
  id: number;
  title: string;
  title_vi: string;
  description: string;
  duration: string;
  language: string;
  genre: string;
  release_date: string;
  poster_url: File | null;
  backdrop_url: File | null;
  trailer_url: File | null;
  director: string;
  actor: string;
  rating: number;
  country: string;
}
const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Inception",
    title_vi: "Giấc Mơ Trong Giấc Mơ",
    description: "A thief who steals corporate secrets through dream-sharing.",
    duration: "148",
    language: "English",
    genre: "Sci-Fi",
    release_date: "2010-07-16",
    poster_url: null,
    backdrop_url: null,
    trailer_url: null,
    director: "Christopher Nolan",
    actor: "Leonardo DiCaprio",
    rating: 8.8,
    country: "USA",
  },
  {
    id: 2,
    title: "Parasite",
    title_vi: "Ký Sinh Trùng",
    description:
      "A poor family schemes to become employed by a wealthy family.",
    duration: "132",
    language: "Korean",
    genre: "Thriller",
    release_date: "2019-05-30",
    poster_url: null,
    backdrop_url: null,
    trailer_url: null,
    director: "Bong Joon-ho",
    actor: "Song Kang-ho",
    rating: 8.6,
    country: "Korea",
  },
  {
    id: 3,
    title: "Interstellar",
    title_vi: "Hố Đen Tử Thần",
    description:
      "A team travels through a wormhole to find a new home for humanity.",
    duration: "169",
    language: "English",
    genre: "Sci-Fi",
    release_date: "2014-11-07",
    poster_url: null,
    backdrop_url: null,
    trailer_url: null,
    director: "Christopher Nolan",
    actor: "Matthew McConaughey",
    rating: 8.7,
    country: "USA",
  },
  {
    id: 4,
    title: "Oldboy",
    title_vi: "Báo Thù",
    description: "After being imprisoned for 15 years, a man seeks revenge.",
    duration: "120",
    language: "Korean",
    genre: "Thriller",
    release_date: "2003-11-21",
    poster_url: null,
    backdrop_url: null,
    trailer_url: null,
    director: "Park Chan-wook",
    actor: "Choi Min-sik",
    rating: 8.4,
    country: "Korea",
  },
  {
    id: 5,
    title: "The Host",
    title_vi: "Quái Vật Sông Hàn",
    description: "A monster emerges from Seoul's Han River and abducts a girl.",
    duration: "119",
    language: "Korean",
    genre: "Sci-Fi",
    release_date: "2006-07-27",
    poster_url: null,
    backdrop_url: null,
    trailer_url: null,
    director: "Bong Joon-ho",
    actor: "Song Kang-ho",
    rating: 7.9,
    country: "Korea",
  },
  {
    id: 6,
    title: "Memento",
    title_vi: "Kẻ Mất Trí Nhớ",
    description:
      "A man with short-term memory loss uses notes and tattoos to hunt for his wife's killer.",
    duration: "113",
    language: "English",
    genre: "Thriller",
    release_date: "2000-10-11",
    poster_url: null,
    backdrop_url: null,
    trailer_url: null,
    director: "Christopher Nolan",
    actor: "Guy Pearce",
    rating: 8.4,
    country: "USA",
  },
  {
    id: 7,
    title: "Memento",
    title_vi: "Kẻ Mất Trí Nhớ",
    description:
      "A man with short-term memory loss uses notes and tattoos to hunt for his wife's killer.",
    duration: "113",
    language: "English",
    genre: "Thriller",
    release_date: "2000-10-11",
    poster_url: null,
    backdrop_url: null,
    trailer_url: null,
    director: "Christopher Nolan",
    actor: "Guy Pearce",
    rating: 8.4,
    country: "USA",
  },
];

export default function Movies() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [country, setCountry] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const filtered = useMemo(() => {
    return mockMovies
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
  }, [search, genre, country, sortOrder]);

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
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Thriller">Thriller</option>
          </select>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full md:w-1/4 px-3 py-[6px] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Chọn quốc gia</option>
            <option value="USA">USA</option>
            <option value="Korea">Korea</option>
          </select>
        </div>
        <button
          className="flex gap-2.5 border px-10 py-1.5 rounded-[8px] bg-[#432DD7] text-white"
          onClick={() => {
            setSelectedMovie(null);
            setShowModal(true);
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
              paginatedMovies.map((movie) => (
                <TableRow
                  key={movie.id}
                  className="hover:bg-gray-100 transition"
                >
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
                      <Trash className="w-4 h-4 text-[#E34724] cursor-pointer hover:scale-110 transition" />
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
          <MovieForm movie={selectedMovie} /> {/* props tùy bạn định nghĩa */}
        </BaseModal>
      )}
    </div>
  );
}
