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
import BaseModal from "../components/BaseModal";
import Pagination from "../components/Pagination";
import { deleteOwner, getAllOwner } from "@/app/services/admin/ownerService";
import {
  confirmDelete,
  showErrorMessage,
  showSuccess,
} from "@/app/utils/alertHelper";

import { useRouter } from "next/navigation";
import { getTheaterOwnerByUserId } from "@/app/services/owner/systemService";
import { getAllTicketByOwner } from "@/app/services/owner/tickerService";
import { getTheatersByOwner } from "@/app/services/owner/theaterService";
import TicketForm from "./components/TicketForm";

export interface Ticket {
  id: number;
  user: {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  showtime: {
    id: number;
    movie: {
      id: number;
      title: string;
    };
    screen: {
      id: number;
      name: string;
    };
    theater: {
      id: number;
      name: string;
      address: string;
    };
    startTime: string;
    // date: string;
  };
  bookingSeats: {
    seatId: number;
    price: number;
    seatName: string;
    seatType: string;
    rowNumber: null;
    columnNumber: null;
  };
  bookingFoods: {
    foodInventoryId: number;
    quantity: number;
    price: number;
    foodName: string;
  };
  bookingTime: string;
  status: string;
  totalAmount: number;
  totalTicketPrice: number;
  totalFoodPrice: number;
}

export default function Staffs() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [ownerId, setOwnerId] = useState<number | null>(null);
  const [theaters, setTheaters] = useState<{ id: number; name: string }[]>([]);
  const [selectedTheaterId, setSelectedTheaterId] = useState<number | "all">(
    "all"
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, []);

  const fetchTickets = async () => {
    try {
      const userId = Number(localStorage.getItem("userId"));
      if (!userId) {
        showErrorMessage("Không tìm thấy userId");
        return;
      }
      const result = await getTheaterOwnerByUserId(userId);
      if (!result || !result.data || !result.data.id) {
        showErrorMessage("Không tìm thấy ownerId");
        return;
      }
      const ownerId = result.data.id;
      setOwnerId(ownerId);
      const res = await getAllTicketByOwner(ownerId);
      if (res && res.data && res.statusCode === 200) {
        setAllTickets(res.data);
      } else {
        setAllTickets([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách vé:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (!ownerId) return;
    const fetchTheaters = async () => {
      try {
        const res = await getTheatersByOwner(ownerId);
        if (res && res.data && Array.isArray(res.data)) {
          setTheaters(res.data.map((t: any) => ({ id: t.id, name: t.name })));
        } else {
          setTheaters([]);
        }
      } catch (error) {
        setTheaters([]);
      }
    };
    fetchTheaters();
  }, [ownerId]);

  console.log("allTickets", allTickets);
  const filtered = useMemo(() => {
    return allTickets
      .filter((ticket) => {
        const matchSearch =
          ticket.user.fullName
            .toLowerCase()
            .includes(search.trim().toLowerCase()) ||
          ticket.user.phoneNumber
            .toLowerCase()
            .includes(search.trim().toLowerCase());
        const matchTheater =
          selectedTheaterId === "all" ||
          ticket.showtime.theater.id === selectedTheaterId;
        const matchStatus =
          selectedStatus === "all" || ticket.status === selectedStatus;
        return matchSearch && matchTheater && matchStatus;
      })
      .sort((a, b) => (sortOrder === "asc" ? a.id - b.id : b.id - a.id));
  }, [search, sortOrder, allTickets, selectedTheaterId, selectedStatus]);

  const paginatedTickets = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  console.log("paginatedTickets", paginatedTickets);
  const totalPages = Math.ceil(filtered.length / pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize]);

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const reload = () => {
    fetchTickets();
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-4 w-full justify-start">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc số điện thoại"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-3 py-[6px] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-[#1677ff] focus:border-[#1677ff]"
        />
        <select
          className="w-full md:w-1/4 px-3 py-[6px] border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-0 focus:ring-[#1677ff] focus:border-[#1677ff]"
          value={selectedTheaterId}
          onChange={(e) =>
            setSelectedTheaterId(
              e.target.value === "all" ? "all" : Number(e.target.value)
            )
          }
        >
          <option value="all">Tất cả rạp</option>
          {theaters.map((theater) => (
            <option key={theater.id} value={theater.id}>
              {theater.name}
            </option>
          ))}
        </select>
        <select
          className="w-full md:w-1/4 px-3 py-[6px] border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-0 focus:ring-[#1677ff] focus:border-[#1677ff]"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="PENDING">Chưa thanh toán</option>
          <option value="CONFIRMED">Đã thanh toán</option>
          <option value="CANCELLED">Đã huỷ</option>
        </select>
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-200 bg-white h-[400px]">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gray-200 text-sm text-gray-700 hover:bg-gray-200">
              <TableHead className="px-4 py-4">STT</TableHead>
              <TableHead className="px-4 py-4">Họ và tên</TableHead>
              <TableHead className="px-4 py-4">Số điện thoại</TableHead>
              <TableHead className="px-4 py-4">Phim</TableHead>
              <TableHead className="px-4 py-4">Rạp</TableHead>
              <TableHead className="px-4 py-4">Địa chỉ rạp</TableHead>
              <TableHead className="px-4 py-4">Suất chiếu</TableHead>
              <TableHead className="px-4 py-4">Trạng thái</TableHead>
              <TableHead className="px-4 py-4">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTickets?.length === 0 ? (
              <TableRow className="hover:bg-white">
                <TableCell
                  colSpan={8}
                  className="text-center py-6 text-gray-500 hover:bg-white"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              paginatedTickets?.map((ticket, index) => (
                <TableRow
                  key={ticket.id}
                  className="hover:bg-gray-100 transition"
                >
                  <TableCell className="px-4 py-4">
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {ticket.user.fullName}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {ticket.user.phoneNumber}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {ticket.showtime.movie.title}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {ticket.showtime.theater.name}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {ticket.showtime.theater.address}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {ticket.showtime.startTime}
                  </TableCell>
                  <TableCell className="px-4 py-4">{ticket.status}</TableCell>
                  <TableCell className="px-4 py-4">
                    <Eye
                      className="w-4 h-4 text-[#03A9F4] cursor-pointer hover:scale-110 transition"
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setShowModal(true);
                        setFormKey((prev) => prev + 1);
                      }}
                    />
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
          title={selectedTicket ? "Chi tiết vé" : "Thêm vé mới"}
          onClose={() => setShowModal(false)}
        >
          <TicketForm
            owner={selectedTicket}
            reload={reload}
            setShowModal={setShowModal}
            handleUpdatedOwner={() => {}}
            key={formKey}
          />
        </BaseModal>
      )}
    </div>
  );
}
