"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
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
import {
  getAllShowtime,
  deleteShowtime,
  getShowtimeByOwner,
} from "@/app/services/owner/showtimeService";
import dayjs from "dayjs";
import {
  confirmDelete,
  showErrorMessage,
  showSuccess,
} from "@/app/utils/alertHelper";
import { getTicketsByShowtime } from "@/app/services/owner/tickerService";
import { useAuth } from "@/app/context/AuthContext";
import { Owner } from "@/app/admin/users/owners/page";
import {
  getTheaterOwner,
  getTheatersByOwner,
} from "@/app/services/owner/theaterService";
import { getRoomsByTheater } from "@/app/services/owner/roomService";
// import { getTicketsByShowtime } from "@/app/services/owner/tickerService";

export interface Showtime {
  id: number;
  movie: { id: number; title: string; titleVi?: string };
  screen: {
    id: number;
    screenName: string;
    theaterName?: string;
    theater?: { id: number; name: string; address: string };
  };
  theater?: { id: number; name: string; address: string };
  startTime: string;
  endTime: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Showtimes() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [showModal, setShowModal] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(
    null
  );
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<string>("");
  const [selectedScreen, setSelectedScreen] = useState<string>("");
  const { userData } = useAuth();
  const [theaterOwner, setTheaterOwner] = useState<Owner | null>(null);
  const [ownerLoading, setOwnerLoading] = useState(true);
  const [theaters, setTheaters] = useState<any[]>([]);
  const [screens, setScreens] = useState<any[]>([]);

  const fetchShowtimes = useCallback(async () => {
    if (!theaterOwner?.id) {
      setShowtimes([]);
      return;
    }
    try {
      const res = await getShowtimeByOwner(theaterOwner.id);
      if (res && res.statusCode === 200 && Array.isArray(res.data)) {
        setShowtimes(res.data);
      } else {
        setShowtimes([]);
        console.error("Không lấy được showtimes", res);
      }
    } catch (err) {
      setShowtimes([]);
      console.error("Lỗi khi lấy showtimes:", err);
    }
  }, [theaterOwner]);

  useEffect(() => {
    const fetchOwnerAndTheaters = async () => {
      if (!userData?.id) return;
      setOwnerLoading(true);
      try {
        const res = await getTheaterOwner(userData.id);
        if (res && res.statusCode === 200 && res.data?.id) {
          setTheaterOwner(res.data);
          // Lấy danh sách rạp của owner
          const theatersRes = await getTheatersByOwner(res.data.id);
          if (
            theatersRes &&
            theatersRes.statusCode === 200 &&
            Array.isArray(theatersRes.data)
          ) {
            setTheaters(theatersRes.data);
          } else {
            setTheaters([]);
          }
        } else {
          setTheaterOwner(null);
          setTheaters([]);
        }
      } catch (err) {
        setTheaterOwner(null);
        setTheaters([]);
      } finally {
        setOwnerLoading(false);
      }
    };
    fetchOwnerAndTheaters();
  }, [userData]);

  useEffect(() => {
    if (!ownerLoading) fetchShowtimes();
  }, [theaterOwner, ownerLoading, fetchShowtimes]);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!selectedTheater) {
        setScreens([]);
        return;
      }
      const res = await getRoomsByTheater(Number(selectedTheater));
      if (res && res.statusCode === 200 && Array.isArray(res.data)) {
        setScreens(res.data);
      } else {
        setScreens([]);
      }
    };
    fetchRooms();
  }, [selectedTheater]);

  const filtered = useMemo(() => {
    return showtimes
      .filter((item) =>
        (item.movie?.titleVi || item.movie?.title || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .filter((item) =>
        selectedTheater
          ? (item.theater?.id || item.screen?.theater?.id) ===
            Number(selectedTheater)
          : true
      )
      .filter((item) =>
        selectedScreen ? item.screen?.id === Number(selectedScreen) : true
      )
      .sort((a, b) =>
        sortOrder === "asc" ? a.price - b.price : b.price - a.price
      );
  }, [search, sortOrder, showtimes, selectedTheater, selectedScreen]);

  const paginatedShowtimes = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(filtered.length / pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize, selectedTheater, selectedScreen]);

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleDelete = async (showtime: Showtime) => {
    // 1. Xác nhận xóa
    const confirmed = await confirmDelete(
      "Bạn có chắc muốn xóa suất chiếu này không?"
    );
    if (!confirmed) return;
    // 2. Kiểm tra đã diễn ra chưa
    if (dayjs(showtime.endTime).isBefore(dayjs())) {
      showErrorMessage("Không thể xóa suất chiếu đã diễn ra!");
      return;
    }

    // 3. Kiểm tra đã có vé đặt chưa
    const ticketsRes = await getTicketsByShowtime(showtime.id);
    if (
      ticketsRes &&
      ticketsRes.statusCode === 200 &&
      Array.isArray(ticketsRes.data) &&
      ticketsRes.data.length > 0
    ) {
      showErrorMessage("Không thể xóa suất chiếu đã có vé đặt!");
      return;
    }
    // 4. Thực hiện xóa
    try {
      const res = await deleteShowtime(showtime.id);
      if (res && res.statusCode === 200) {
        // Cập nhật lại danh sách showtimes
        fetchShowtimes();
        showSuccess("Xóa suất chiếu thành công!");
      }
    } catch (error) {
      showErrorMessage("Xóa suất chiếu thất bại! " + error);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex gap-4 items-center justify-start w-full">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên phim"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 px-3 py-[6px] bg-white border border-gray-300 rounded-md 
            focus:outline-none focus:ring-0 focus:ring-[#1677ff] focus:border-[#1677ff]"
          />
          <select
            value={selectedTheater}
            onChange={(e) => {
              setSelectedTheater(e.target.value);
              setSelectedScreen(""); // reset phòng khi đổi rạp
            }}
            className="w-full md:w-[250px]  px-3 py-[6px] border rounded-md 
            focus:outline-none focus:ring-0 focus:ring-[#1677ff] focus:border-[#1677ff]"
          >
            <option value="">Tất cả rạp</option>
            {theaters.map((theater) => (
              <option key={theater.id} value={theater.id}>
                {theater.name}
              </option>
            ))}
          </select>
          <select
            value={selectedScreen}
            onChange={(e) => setSelectedScreen(e.target.value)}
            className=" w-full md:w-[250px] px-3 py-[6px] border rounded-md 
            focus:outline-none focus:ring-0 focus:ring-[#1677ff] focus:border-[#1677ff]"
            disabled={!selectedTheater}
          >
            <option value="">Tất cả phòng</option>
            {screens.map((screen) => (
              <option key={screen.id} value={screen.id}>
                {screen.screenName}
              </option>
            ))}
          </select>
        </div>
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
              <TableHead className="px-4 py-4 max-w-[200px] truncate">
                Địa chỉ rạp
              </TableHead>

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
                  colSpan={8}
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
                    {showtime.movie?.titleVi || showtime.movie?.title}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {showtime.screen?.screenName}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {showtime.theater?.name || showtime.screen?.theaterName}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {dayjs(showtime.startTime).format("HH:mm:ss DD/MM/YYYY")}
                  </TableCell>
                  <TableCell className="px-4 py-4 max-w-[200px] truncate">
                    {showtime.theater?.address ||
                      showtime.screen?.theater?.address}
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
                      <Trash
                        className="w-4 h-4 text-[#E34724] cursor-pointer hover:scale-110 transition"
                        onClick={() => {
                          handleDelete(showtime);
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
          <ShowtimeForm
            showtime={selectedShowtime}
            fetchShowtimes={fetchShowtimes}
            onClose={() => setShowModal(false)}
          />
        </BaseModal>
      )}
    </div>
  );
}
