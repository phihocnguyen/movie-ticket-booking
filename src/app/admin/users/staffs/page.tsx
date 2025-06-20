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
import BaseModal from "../../components/BaseModal";
import Pagination from "../../components/Pagination";
import StaffForm from "./components/StaffForm";
import { getAllStaff } from "@/app/services/admin/staffService";

export interface Staff {
  id: number;
  name: string;
  email: string;
  password: string | null;
  phone_number: string;
  username: string;
  full_name: string;
  date_of_birth: string;
}

const mockStaffs: Staff[] = [
  {
    id: 1,
    name: "Nguyen Van A",
    email: "a@example.com",
    password: null,
    phone_number: "0123456789",
    username: "nguyenvana",
    full_name: "Nguyen Van A",
    date_of_birth: "1995-05-01",
  },
  {
    id: 2,
    name: "Tran Thi B",
    email: "b@example.com",
    password: null,
    phone_number: "0987654321",
    username: "tranthib",
    full_name: "Tran Thi B",
    date_of_birth: "1998-08-10",
  },
  {
    id: 3,
    name: "Tran Thi C",
    email: "b@example.com",
    password: null,
    phone_number: "0987654321",
    username: "tranthib",
    full_name: "Tran Thi B",
    date_of_birth: "1998-08-10",
  },
  {
    id: 4,
    name: "Tran Thi d",
    email: "b@example.com",
    password: null,
    phone_number: "0987654321",
    username: "tranthib",
    full_name: "Tran Thi B",
    date_of_birth: "1998-08-10",
  },
  {
    id: 5,
    name: "Tran Thi B",
    email: "b@example.com",
    password: null,
    phone_number: "0987654321",
    username: "tranthib",
    full_name: "Tran Thi B",
    date_of_birth: "1998-08-10",
  },
  {
    id: 6,
    name: "Tran Thi B",
    email: "b@example.com",
    password: null,
    phone_number: "0987654321",
    username: "tranthib",
    full_name: "Tran Thi B",
    date_of_birth: "1998-08-10",
  },
  {
    id: 7,
    name: "Nguyen Van A",
    email: "a@example.com",
    password: null,
    phone_number: "0123456789",
    username: "nguyenvana",
    full_name: "Nguyen Van A",
    date_of_birth: "1995-05-01",
  },
  {
    id: 8,
    name: "Nguyen Van A",
    email: "a@example.com",
    password: null,
    phone_number: "0123456789",
    username: "nguyenvana",
    full_name: "Nguyen Van A",
    date_of_birth: "1995-05-01",
  },
  {
    id: 9,
    name: "Nguyen Van A",
    email: "a@example.com",
    password: null,
    phone_number: "0123456789",
    username: "nguyenvana",
    full_name: "Nguyen Van A",
    date_of_birth: "1995-05-01",
  },
];

export default function Staffs() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [showModal, setShowModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [allStaff, setAllStaff] = useState<Staff[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllStaff();
        if (res === null) {
          setAllStaff([]);
        } else {
          setAllStaff(res);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách user:", error);
      }
    };
    fetchUsers();
  }, []);
  const filtered = useMemo(() => {
    return allStaff
      .filter((staff) => {
        return (
          staff.name.toLowerCase().includes(search.toLowerCase()) ||
          staff.email.toLowerCase().includes(search.toLowerCase())
        );
      })
      .sort((a, b) => (sortOrder === "asc" ? a.id - b.id : b.id - a.id));
  }, [search, sortOrder]);

  const paginatedStaffs = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(filtered.length / pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize]);

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex gap-4 w-full">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 px-3 py-[6px] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-[#1677ff] focus:border-[#1677ff]"
          />
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-200 bg-white h-[400px]">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gray-200 text-sm text-gray-700 hover:bg-gray-200">
              <TableHead className="px-4 py-4">STT</TableHead>
              <TableHead className="px-4 py-4">Tên</TableHead>
              <TableHead className="px-4 py-4">Email</TableHead>
              <TableHead className="px-4 py-4">Số điện thoại</TableHead>
              <TableHead className="px-4 py-4">Ngày sinh</TableHead>
              <TableHead className="px-4 py-4">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStaffs?.length === 0 ? (
              <TableRow className="hover:bg-white">
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-gray-500 hover:bg-white"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              paginatedStaffs?.map((staff, index) => (
                <TableRow
                  key={staff.id}
                  className="hover:bg-gray-100 transition"
                >
                  <TableCell className="px-4 py-4">
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="px-4 py-4">{staff.name}</TableCell>
                  <TableCell className="px-4 py-4">{staff.email}</TableCell>
                  <TableCell className="px-4 py-4">
                    {staff.phone_number}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {staff.date_of_birth}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex gap-2 items-center">
                      <Eye
                        className="w-4 h-4 text-[#03A9F4] cursor-pointer hover:scale-110 transition"
                        onClick={() => {
                          setSelectedStaff(staff);
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
          title={selectedStaff ? "Chi tiết nhân viên" : "Thêm nhân viên mới"}
          onClose={() => setShowModal(false)}
        >
          <StaffForm staff={selectedStaff} />
        </BaseModal>
      )}
    </div>
  );
}
