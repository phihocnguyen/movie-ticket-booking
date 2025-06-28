"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Plus, Trash, Search, X } from "lucide-react";
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
import {
  deleteTheater,
  getAllTheaters,
  getShowtimeByTheater,
} from "@/app/services/admin/theaterService";
import {
  confirmDelete,
  showErrorMessage,
  showSuccess,
} from "@/app/utils/alertHelper";

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
  openingTime: string; // "08:00"
  closingTime: string; // "22:00"
  totalScreens: number;
  theaterOwnerId: number;
  theaterOwner?: {
    id: number;
    user: {
      id: number;
      name: string;
      email: string;
      phoneNumber: string;
      role: string;
      isActive: boolean;
      username: string;
      fullName: string;
      dateOfBirth: string;
      createdAt: string;
      updatedAt: string;
    };
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

/* ────────────────── PAGE COMPONENT ────────────────── */
export default function Theaters() {
  const [search, setSearch] = useState("");
  const [ownerSearch, setOwnerSearch] = useState("");
  const [selectedOwnerEmail, setSelectedOwnerEmail] = useState<string>("");
  const [showOwnerDropdown, setShowOwnerDropdown] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const [showModal, setShowModal] = useState(false);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const router = useRouter();
  const [theaters, setTheaters] = useState<Theater[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Có thể kiểm tra thêm role nếu cần
    if (!token) {
      router.replace("/login"); // đẩy về login nếu chưa đăng nhập
    }
  }, []);

  const fetchTheaters = async () => {
    try {
      const res = await getAllTheaters();
      if (res && res.statusCode === 200 && Array.isArray(res.data)) {
        setTheaters(res.data);
      } else {
        setTheaters([]);
      }
    } catch (error) {
      showErrorMessage("Lỗi khi lấy danh sách rạp" + error);
      return;
    }
  };

  useEffect(() => {
    fetchTheaters();
  }, []);

  const reload = async () => {
    try {
      const res = await getAllTheaters();
      console.log("Check res", res);
      if (res && res.statusCode === 200 && Array.isArray(res.data)) {
        setTheaters(res.data);
      } else {
        setTheaters([]);
      }
    } catch (error) {
      showErrorMessage("Lỗi khi lấy danh sách rạp:" + error);
    }
  };

  /* ---------- FILTER + SORT ---------- */
  const filtered = useMemo(() => {
    return theaters
      .filter((t) => {
        // Search filter
        const searchMatch = `${t.name} ${t.city} ${t.phoneNumber}`
          .toLowerCase()
          .includes(search.toLowerCase());

        // Owner filter
        const ownerMatch =
          !selectedOwnerEmail ||
          t.theaterOwner?.user.email === selectedOwnerEmail;

        return searchMatch && ownerMatch;
      })
      .sort((a, b) =>
        sortOrder === "asc"
          ? a.totalScreens - b.totalScreens
          : b.totalScreens - a.totalScreens
      );
  }, [theaters, search, selectedOwnerEmail, sortOrder]);

  // Get unique owners for dropdown
  const uniqueOwners = useMemo(() => {
    const owners = theaters
      .map((t) => ({
        email: t.theaterOwner?.user.email || "",
        fullName: t.theaterOwner?.user.fullName || "",
        id: t.theaterOwner?.user.id || 0,
      }))
      .filter((owner) => owner.email && owner.fullName);

    // Remove duplicates based on email
    const uniqueByEmail = owners.reduce((acc, current) => {
      const x = acc.find((item) => item.email === current.email);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, [] as typeof owners);

    return uniqueByEmail.sort((a, b) => a.fullName.localeCompare(b.fullName));
  }, [theaters]);

  // Filter owners based on search
  const filteredOwners = useMemo(() => {
    if (!ownerSearch) return uniqueOwners;
    return uniqueOwners.filter((owner) =>
      owner.email.toLowerCase().includes(ownerSearch.toLowerCase())
    );
  }, [uniqueOwners, ownerSearch]);

  /* ---------- PAGINATION ---------- */
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(filtered.length / pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedOwnerEmail, pageSize]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".owner-filter-container")) {
        setShowOwnerDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ---------- HANDLERS ---------- */
  const toggleSort = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  const handleOwnerSelect = (owner: { email: string; fullName: string }) => {
    setSelectedOwnerEmail(owner.email);
    setOwnerSearch(owner.fullName);
    setShowOwnerDropdown(false);
  };

  const clearOwnerFilter = () => {
    setSelectedOwnerEmail("");
    setOwnerSearch("");
    setShowOwnerDropdown(false);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedTheater(null);
    // Refresh data after modal closes (assuming form submission was successful)
    fetchTheaters();
  };

  const handleDelete = async (id: number) => {
    // Hiển thị confirmation dialog
    const confirmed = await confirmDelete(
      "Bạn có chắc muốn xóa rạp này không?"
    );
    if (!confirmed) return;

    try {
      // Kiểm tra xem rạp còn showtime không
      const showtimeRes = await getShowtimeByTheater(id);
      if (
        showtimeRes &&
        showtimeRes.statusCode === 200 &&
        Array.isArray(showtimeRes.data) &&
        showtimeRes.data.length > 0
      ) {
        showErrorMessage(
          "Không thể xóa rạp vì vẫn còn suất chiếu trong rạp này!"
        );
        return;
      }
      const res = await deleteTheater(id);
      if (res && res.statusCode === 200) {
        showSuccess("Xóa rạp thành công");
        setTheaters((prev) => prev.filter((theater) => theater.id !== id));
      } else {
        return;
      }
    } catch (error) {
      showErrorMessage("Lỗi khi xóa rạp" + error);
      return;
    }
  };

  /* ────────────────── RENDER ────────────────── */
  return (
    <div className="space-y-5">
      {/* SEARCH & FILTERS & NEW BUTTON */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4 w-full md:w-2/3">
          <input
            type="text"
            placeholder="Tìm kiếm rạp theo tên, thành phố, SĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 px-3 py-[6px] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-[#1677ff] focus:border-[#1677ff]"
          />

          {/* Owner Filter with Autocomplete */}
          <div className="relative w-full md:w-1/2 owner-filter-container">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm theo email chủ rạp..."
                value={ownerSearch}
                onChange={(e) => {
                  setOwnerSearch(e.target.value);
                  setShowOwnerDropdown(true);
                  if (!e.target.value) {
                    setSelectedOwnerEmail("");
                  }
                }}
                onFocus={() => setShowOwnerDropdown(true)}
                className="w-full px-3 py-[6px] pr-8 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-[#1677ff] focus:border-[#1677ff]"
              />
              {selectedOwnerEmail && (
                <button
                  onClick={clearOwnerFilter}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* Dropdown */}
            {showOwnerDropdown && filteredOwners.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredOwners.map((owner) => (
                  <div
                    key={owner.email}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleOwnerSelect(owner)}
                  >
                    {owner.fullName}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

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
              <TableHead className="px-4 py-4">Chủ sở hữu</TableHead>
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
                <TableCell colSpan={6} className="text-center py-6">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((t, index) => (
                <TableRow key={t.id} className="hover:bg-gray-100 transition">
                  <TableCell className="px-4 py-4">
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="px-4 py-4">{t.name}</TableCell>
                  <TableCell className="px-4 py-4">
                    {t.theaterOwner?.user.fullName}
                  </TableCell>
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
                      <Trash
                        className="w-4 h-4 text-[#E34724] cursor-pointer hover:scale-110 transition"
                        onClick={() => {
                          handleDelete(t.id);
                        }}
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
          title={selectedTheater ? "Chi tiết rạp" : "Thêm rạp mới"}
          onClose={handleModalClose}
        >
          <TheaterForm
            theater={selectedTheater}
            reload={reload}
            setShowModal={setShowModal}
          />
        </BaseModal>
      )}
    </div>
  );
}
