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
import BlogForm from "./components/BlogForm";
import dayjs from "dayjs";

/* ────────────────── INTERFACE ────────────────── */
export interface BlogPost {
  id: number;
  title: string;
  created_at: string;
  author: string;
  content: string;
  summary: string;
  thumbnail: File | null;
  published: boolean;
  type: string;
}

/* ────────────────── MOCK DATA ────────────────── */
const mockBlogs: BlogPost[] = [
  {
    id: 1,
    title: "Giới thiệu về React",
    created_at: "2025-06-19T10:00:00Z",
    author: "Nguyễn Văn A",
    content:
      "React là thư viện JavaScript dùng để xây dựng giao diện người dùng...",
    summary: "Tổng quan về ReactJS",
    thumbnail: null,
    published: true,
    type: "Tin điện ảnh",
  },
  {
    id: 2,
    title: "Hướng dẫn sử dụng TailwindCSS",
    created_at: "2025-06-18T09:30:00Z",
    author: "Trần Thị B",
    content: "Tailwind là framework CSS giúp tạo giao diện nhanh chóng...",
    summary: "Cách sử dụng Tailwind trong dự án",
    thumbnail: null,
    published: false,
    type: "Hệ thống",
  },
];
/* ────────────────── PAGE COMPONENT ────────────────── */
export default function Blogs() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const [showModal, setShowModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  /* ---------- FILTER + SORT ---------- */
  const filtered = useMemo(() => {
    return mockBlogs
      .filter((b) =>
        `${b.title} ${b.author}`.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) =>
        sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title)
      );
  }, [search, sortOrder]);

  /* ---------- PAGINATION ---------- */
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(filtered.length / pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize]);

  /* ---------- HANDLERS ---------- */
  const toggleSort = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  /* ────────────────── RENDER ────────────────── */
  return (
    <div className="space-y-5">
      {/* SEARCH & NEW BUTTON */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <input
          type="text"
          placeholder="Tìm kiếm bài viết theo tiêu đề hoặc tác giả..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-3 py-[6px] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-[#1677ff] focus:border-[#1677ff]"
        />

        <button
          className="flex gap-2.5 border px-10 py-1.5 rounded-[8px] bg-[#432DD7] text-white"
          onClick={() => {
            setSelectedBlog(null);
            setShowModal(true);
          }}
        >
          <Plus /> Thêm
        </button>
      </div>

      {/* TABLE */}
      <div className="rounded-xl overflow-hidden border border-gray-200 bg-white h-[400px]">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gray-200 text-sm text-gray-700 hover:bg-gray-200">
              <TableHead className="px-4 py-4">STT</TableHead>
              <TableHead className="px-4 py-4">Tiêu đề</TableHead>
              <TableHead className="px-4 py-4">Tác giả</TableHead>
              <TableHead className="px-4 py-4">Loại</TableHead>
              <TableHead className="px-4 py-4">Trạng thái</TableHead>
              <TableHead className="px-4 py-4">Ngày tạo</TableHead>
              <TableHead className="px-4 py-4">Hành động</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((b, index) => (
                <TableRow key={b.id} className="hover:bg-gray-100 transition">
                  <TableCell className="px-4 py-4">
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="px-4 py-4">{b.title}</TableCell>
                  <TableCell className="px-4 py-4">{b.author}</TableCell>
                  <TableCell className="px-4 py-4">{b.type}</TableCell>
                  <TableCell className="px-4 py-4">
                    {b.published ? "Công khai" : "Nháp"}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {dayjs(b.created_at).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex gap-2">
                      <Eye
                        className="w-4 h-4 text-[#03A9F4] cursor-pointer hover:scale-110 transition"
                        onClick={() => {
                          setSelectedBlog(b);
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

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

      {/* MODAL */}
      {showModal && (
        <BaseModal
          open={showModal}
          title={selectedBlog ? "Chi tiết bài viết" : "Thêm bài viết mới"}
          onClose={() => setShowModal(false)}
        >
          <BlogForm post={selectedBlog} />
        </BaseModal>
      )}
    </div>
  );
}
