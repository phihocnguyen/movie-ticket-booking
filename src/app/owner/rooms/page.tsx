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
import RoomForm from "./components/RoomForm";
import dayjs from "dayjs";
import {
  getTheaterOwner,
  getTheatersByOwner,
} from "@/app/services/owner/theaterService";
import {
  deleteRoom,
  getRoomsByTheater,
} from "@/app/services/owner/roomService";
import { useAuth } from "@/app/context/AuthContext";
import {
  confirmDelete,
  showErrorMessage,
  showSuccess,
  showWaringMessage,
} from "@/app/utils/alertHelper";
import { getShowtimeByScreen } from "@/app/services/owner/showtimeService";

interface Room {
  id: number;
  screenName: string;
  screenType: "2D" | "3D";
  totalSeats: number;
  isActive: boolean;
  theaterId: number;
  theater?: { id: number; name: string };
}

export default function Rooms() {
  const { userData } = useAuth();
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [theaters, setTheaters] = useState<any[]>([]);
  const [selectedTheaterId, setSelectedTheaterId] = useState<number | null>(
    null
  );
  const [theaterOwnerId, setTheaterOwnerId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchTheaters() {
      if (!userData?.id) return;
      let ownerId = theaterOwnerId;
      if (!ownerId) {
        const res = await getTheaterOwner(userData.id);
        if (res && res.statusCode === 200 && res.data?.id) {
          ownerId = res.data.id;
          setTheaterOwnerId(ownerId);
        }
      }
      if (ownerId) {
        const theatersRes = await getTheatersByOwner(ownerId);
        if (
          theatersRes &&
          theatersRes.statusCode === 200 &&
          Array.isArray(theatersRes.data)
        ) {
          setTheaters(theatersRes.data);
          if (theatersRes.data.length > 0) {
            setSelectedTheaterId(theatersRes.data[0].id);
          }
        }
      }
    }
    fetchTheaters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.id]);

  const fetchRooms = async (theaterId?: number) => {
    if (!theaterId) return setRooms([]);
    const res = await getRoomsByTheater(theaterId);
    if (res && res.statusCode === 200 && Array.isArray(res.data)) {
      setRooms(res.data);
    } else {
      setRooms([]);
    }
  };

  useEffect(() => {
    if (selectedTheaterId) fetchRooms(selectedTheaterId);
  }, [selectedTheaterId]);

  const filtered = useMemo(() => {
    return rooms
      .filter((r) =>
        `${r.screenName}`.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) =>
        sortOrder === "asc"
          ? a.totalSeats - b.totalSeats
          : b.totalSeats - a.totalSeats
      );
  }, [search, sortOrder, rooms]);

  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(filtered.length / pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize]);

  const toggleSort = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  const handleDelete = async (id: number) => {
    const confirmed = await confirmDelete(
      "Bạn có chắc muốn xóa phòng chiếu này không?"
    );
    if (!confirmed) return;
    // Gọi API kiểm tra showtime của phòng chiếu
    const showtimesRes = await getShowtimeByScreen(id);
    if (
      showtimesRes &&
      showtimesRes.statusCode === 200 &&
      Array.isArray(showtimesRes.data) &&
      showtimesRes.data.length > 0
    ) {
      showWaringMessage("Không thể xóa phòng chiếu vì đã có lịch chiếu!");
      return;
    }
    try {
      const res = await deleteRoom(id);
      if (res && res.statusCode === 200) {
        setRooms((prev) => prev.filter((r) => r.id !== id));
      } else {
        return;
      }
      showSuccess("Xóa phòng chiếu thành công!");
    } catch (error) {
      showErrorMessage("Xóa phòng chiếu thất bại! " + error);
    }
  };
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex gap-5 items-center justify-start w-full">
          <input
            type="text"
            placeholder="Tìm kiếm phòng chiếu theo tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-2/3 px-3 py-[6px] bg-white border border-gray-300 rounded-md 
            focus:outline-none focus:ring-0 focus:ring-[#1677ff] focus:border-[#1677ff]"
          />
          <div className="flex gap-3 items-center w-full">
            <span>Rạp:</span>
            <select
              value={selectedTheaterId ?? ""}
              onChange={(e) => setSelectedTheaterId(Number(e.target.value))}
              className="border  px-3 py-[6px] rounded-md   md:w-[250px] 
              focus:outline-none focus:ring-0 focus:ring-[#1677ff] focus:border-[#1677ff]"
            >
              {theaters.map((theater) => (
                <option key={theater.id} value={theater.id}>
                  {theater.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          className="flex gap-2.5 border px-10 py-1.5 rounded-[8px] bg-[#432DD7] text-white"
          onClick={() => {
            setSelectedRoom(null);
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
              <TableHead className="px-4 py-4">Tên phòng</TableHead>
              <TableHead className="px-4 py-4">Loại</TableHead>
              <TableHead className="px-4 py-4">Tổng ghế</TableHead>
              <TableHead className="px-4 py-4">Rạp</TableHead>
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
              paginated.map((r, index) => (
                <TableRow key={r.id} className="hover:bg-gray-100 transition">
                  <TableCell className="px-4 py-4">
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="px-4 py-4">{r.screenName}</TableCell>
                  <TableCell className="px-4 py-4">{r.screenType}</TableCell>
                  <TableCell className="px-4 py-4">{r.totalSeats}</TableCell>
                  <TableCell className="px-4 py-4">
                    {r.theater?.name || r.theaterId}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex gap-2">
                      <Eye
                        className="w-4 h-4 text-[#03A9F4] cursor-pointer hover:scale-110 transition"
                        onClick={() => {
                          setSelectedRoom(r);
                          setShowModal(true);
                        }}
                      />
                      <Trash
                        className="w-4 h-4 text-[#E34724] cursor-pointer hover:scale-110 transition"
                        onClick={() => {
                          handleDelete(r.id);
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
          title={selectedRoom ? "Chi tiết phòng chiếu" : "Thêm phòng chiếu mới"}
          onClose={() => setShowModal(false)}
        >
          <RoomForm
            room={selectedRoom || undefined}
            fetchRooms={() => fetchRooms(selectedTheaterId!)}
            onClose={() => setShowModal(false)}
          />
        </BaseModal>
      )}
    </div>
  );
}
