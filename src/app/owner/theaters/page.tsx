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
import TheaterForm from "./components/TheaterForm";
import { useRouter } from "next/navigation";
import { getAllTheaters } from "@/app/services/owner/theaterService";

/* ────────────────── INTERFACE ────────────────── */
export interface Theater {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phoneNumber: string;
  email: string;
  openingTime: string;
  closingTime: string;
  totalScreens: number;
}

/* ────────────────── PAGE COMPONENT ────────────────── */
export default function Theaters() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const [showModal, setShowModal] = useState(false);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const router = useRouter();
  const [theaters, setTheaters] = useState<Theater[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, []);

  const fetchTheaters = async () => {
    const res = await getAllTheaters();
    if (res && res.statusCode === 200 && Array.isArray(res.data)) {
      setTheaters(res.data);
    } else {
      setTheaters([]);
    }
  };

  useEffect(() => {
    fetchTheaters();
  }, []);

  /* ---------- FILTER + SORT ---------- */
  const filtered = useMemo(() => {
    return theaters
      .filter((t: Theater) =>
        `${t.name} ${t.city} ${t.phoneNumber}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort((a: Theater, b: Theater) =>
        sortOrder === "asc"
          ? a.totalScreens - b.totalScreens
          : b.totalScreens - a.totalScreens
      );
  }, [search, sortOrder, theaters]);

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
          placeholder="Tìm kiếm rạp theo tên, thành phố, SĐT..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-3 py-[6px] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-[#1677ff] focus:border-[#1677ff]"
        />

        <button
          className="flex gap-2.5 border px-10 py-1.5 rounded-[8px] bg-[#432DD7] text-white"
          onClick={() => {
            setSelectedTheater(null);
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
              <TableHead className="px-4 py-4">Tên rạp</TableHead>
              <TableHead className="px-4 py-4">Thành phố</TableHead>
              <TableHead className="px-4 py-4">SĐT</TableHead>
              <TableHead
                onClick={toggleSort}
                className="flex items-center justify-start px-4 py-4 mt-1.5 cursor-pointer select-none gap-1"
              >
                Phòng chiếu
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
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((t: Theater, index: number) => (
                <TableRow key={t.id} className="hover:bg-gray-100 transition">
                  <TableCell className="px-4 py-4">
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="px-4 py-4">{t.name}</TableCell>
                  <TableCell className="px-4 py-4">{t.city}</TableCell>
                  <TableCell className="px-4 py-4">{t.phoneNumber}</TableCell>
                  <TableCell className="px-4 py-4">{t.totalScreens}</TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex gap-2">
                      <Eye
                        className="w-4 h-4 text-[#03A9F4] cursor-pointer hover:scale-110 transition"
                        onClick={() => {
                          setSelectedTheater(t);
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
      <BaseModal
        open={showModal}
        title={selectedTheater ? "Chi tiết rạp" : "Thêm rạp mới"}
        onClose={() => setShowModal(false)}
      >
        <TheaterForm
          theater={selectedTheater || undefined}
          onClose={() => setShowModal(false)}
          fetchTheaters={fetchTheaters}
        />
      </BaseModal>
    </div>
  );
}
