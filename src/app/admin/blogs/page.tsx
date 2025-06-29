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
import { deleteBlog, getAllBlogs } from "@/app/services/admin/blogService";
import {
  confirmDelete,
  showErrorMessage,
  showSuccess,
} from "@/app/utils/alertHelper";

/* ────────────────── INTERFACE ────────────────── */
export interface BlogPost {
  id: number;
  title: string;
  createdAt: string;
  author: string;
  content: string;
  summary: string;
  thumbnail: File | null;
  published: boolean;
  type: string;
}

/* ────────────────── HELPER FUNCTIONS ────────────────── */
const parseDate = (dateString: string): Date => {
  // Parse DD/MM/YYYY HH:mm:ss format
  const parts = dateString.split(" ");
  const datePart = parts[0]; // "29/06/2025"
  const timePart = parts[1]; // "13:21:27"

  const [day, month, year] = datePart.split("/");
  const [hour, minute, second] = timePart.split(":");

  // Create Date object (month is 0-indexed)
  return new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hour),
    parseInt(minute),
    parseInt(second)
  );
};

/* ────────────────── PAGE COMPONENT ────────────────── */
export default function Blogs() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [typeBlog, setTypeBlog] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  const fetchBlogs = async () => {
    try {
      const res = await getAllBlogs();
      if (res && res.statusCode === 200 && Array.isArray(res.data)) {
        setBlogs(res.data);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      showErrorMessage("Lỗi khi lấy danh sách blog: " + error);
      return;
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const reload = async () => {
    try {
      const res = await getAllBlogs();
      console.log("Check res", res);
      if (res && res.statusCode === 200 && Array.isArray(res.data)) {
        setBlogs(res.data);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      showErrorMessage("Lỗi khi lấy danh sách blog: " + error);
    }
  };

  /* ---------- FILTER + SORT ---------- */
  const filtered = useMemo(() => {
    console.log("filtered recalculating, sortOrder:", sortOrder);
    return blogs
      .filter((b) => {
        const matchesSearch =
          b.title.toLowerCase().includes(search.toLowerCase()) ||
          b.author.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeBlog ? b.type === typeBlog : true;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const dateA = parseDate(a.createdAt).getTime();
        const dateB = parseDate(b.createdAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [search, sortOrder, typeBlog, blogs]);

  /* ---------- PAGINATION ---------- */
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const blogTypes = Array.from(new Set(blogs.map((b) => b.type)));
  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize, typeBlog]);

  /* ---------- HANDLERS ---------- */
  const toggleSort = () => {
    console.log("toggleSort called, current sortOrder:", sortOrder);
    setSortOrder((prev) => {
      const newOrder = prev === "asc" ? "desc" : "asc";
      console.log("New sortOrder:", newOrder);
      return newOrder;
    });
  };

  const handleDelete = async (id: number) => {
    // Hiển thị confirmation dialog
    const confirmed = await confirmDelete(
      "Bạn có chắc muốn xóa bài viết này không?"
    );
    if (!confirmed) return;

    try {
      const res = await deleteBlog(id);
      if (res && res.statusCode === 200) {
        showSuccess("Xóa bài viết thành công");
        setBlogs((prev) => prev.filter((blog) => blog.id !== id));
      } else {
        return;
      }
    } catch (error) {
      showErrorMessage("Lỗi khi xóa bài viết: " + error);
      return;
    }
  };
  return (
    <div className="space-y-5">
      {/* SEARCH & NEW BUTTON */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex gap-4 w-full">
          <input
            type="text"
            placeholder="Tìm kiếm bài viết theo tiêu đề hoặc tác giả..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 px-3 py-[6px] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-[#1677ff] focus:border-[#1677ff]"
          />
          <select
            value={typeBlog}
            onChange={(e) => setTypeBlog(e.target.value)}
            className="w-full md:w-1/4 px-3 py-[6px] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả loại</option>
            {blogTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
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
              <TableHead
                onClick={toggleSort}
                className="flex items-center justify-start px-4 py-4 mt-1.5 cursor-pointer select-none gap-1"
              >
                Ngày tạo
                {sortOrder === "desc" ? (
                  <IoMdArrowDropdown className="w-5 h-5 mt-0.5" />
                ) : (
                  <IoMdArrowDropup className="w-5 h-5 mt-0.5" />
                )}
              </TableHead>
              <TableHead className="px-4 py-4">Hành động</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
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
                    {dayjs(b.createdAt).format("YYYY-MM-DD")}
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
                      <Trash
                        className="w-4 h-4 text-[#E34724] cursor-pointer hover:scale-110 transition"
                        onClick={() => handleDelete(b.id)}
                      />
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
          <BlogForm
            post={selectedBlog}
            reload={reload}
            onClose={() => setShowModal(false)}
          />
        </BaseModal>
      )}
    </div>
  );
}
