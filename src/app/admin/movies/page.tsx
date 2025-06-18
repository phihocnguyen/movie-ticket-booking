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

export interface Movie {
  id: number;
  title: string;
  director: string;
  genre: string;
  country: string;
  rating: number;
}

const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Inception",
    director: "Christopher Nolan",
    genre: "Sci-Fi",
    country: "USA",
    rating: 8.8,
  },
  {
    id: 2,
    title: "Parasite",
    director: "Bong Joon-ho",
    genre: "Thriller",
    country: "Korea",
    rating: 8.6,
  },
  {
    id: 3,
    title: "Interstellar",
    director: "Christopher Nolan",
    genre: "Sci-Fi",
    country: "USA",
    rating: 8.7,
  },
  {
    id: 4,
    title: "Oldboy",
    director: "Park Chan-wook",
    genre: "Thriller",
    country: "Korea",
    rating: 8.4,
  },
  {
    id: 5,
    title: "The Host",
    director: "Bong Joon-ho",
    genre: "Sci-Fi",
    country: "Korea",
    rating: 7.9,
  },
  {
    id: 6,
    title: "Memento",
    director: "Christopher Nolan",
    genre: "Thriller",
    country: "USA",
    rating: 8.4,
  },
  {
    id: 7,
    title: "Memento",
    director: "Christopher Nolan",
    genre: "Thriller",
    country: "USA",
    rating: 8.4,
  },
];

export default function Movies() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [country, setCountry] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

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
        <button className="flex gap-2.5 border px-10 py-1.5 rounded-[8px] bg-[#432DD7] text-white">
          <Plus /> Thêm
        </button>
      </div>

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
                      <Eye className="w-4 h-4 text-[#03A9F4] cursor-pointer hover:scale-110 transition" />
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
    </div>
  );
}
