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
import CustomerForm from "./components/CustomerForm";

export interface Customer {
  id: number;
  name: string;
  email: string;
  password: string | null;
  phone_number: string;
  username: string;
  full_name: string;
  date_of_birth: string;
}

const mockCustomers: Customer[] = [
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
    name: "Tran Thi B",
    email: "b@example.com",
    password: null,
    phone_number: "0987654321",
    username: "tranthib",
    full_name: "Tran Thi B",
    date_of_birth: "1998-08-10",
  },
  {
    id: 4,
    name: "Tran Thi B",
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
    name: "Tran Thi B",
    email: "b@example.com",
    password: null,
    phone_number: "0987654321",
    username: "tranthib",
    full_name: "Tran Thi B",
    date_of_birth: "1998-08-10",
  },
  {
    id: 8,
    name: "Tran Thi B",
    email: "b@example.com",
    password: null,
    phone_number: "0987654321",
    username: "tranthib",
    full_name: "Tran Thi B",
    date_of_birth: "1998-08-10",
  },
];

export default function Customers() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  const filtered = useMemo(() => {
    return mockCustomers
      .filter((customer) => {
        return (
          customer.name.toLowerCase().includes(search.toLowerCase()) ||
          customer.email.toLowerCase().includes(search.toLowerCase())
        );
      })
      .sort((a, b) => (sortOrder === "asc" ? a.id - b.id : b.id - a.id));
  }, [search, sortOrder]);

  const paginatedCustomers = filtered.slice(
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
        {/* Bộ lọc và nút thêm */}
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

      {/* bảng dữ liệu */}
      <div className="rounded-xl overflow-hidden border border-gray-200 bg-white h-[400px]">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gray-200 text-sm text-gray-700 hover:bg-gray-200">
              <TableHead className="px-4 py-4">STT</TableHead>
              <TableHead className="px-4 py-4">Tên</TableHead>
              <TableHead className="px-4 py-4">Email</TableHead>
              <TableHead className="px-4 py-4">Số điện thoại</TableHead>
              <TableHead className="px-4 py-4">Username</TableHead>
              <TableHead className="px-4 py-4">Ngày sinh</TableHead>
              <TableHead className="px-4 py-4">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCustomers.length === 0 ? (
              <TableRow className="hover:bg-white">
                <TableCell
                  colSpan={7}
                  className="text-center py-6 text-gray-500 hover:bg-white"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              paginatedCustomers.map((customer, index) => (
                <TableRow
                  key={customer.id}
                  className="hover:bg-gray-100 transition"
                >
                  <TableCell className="px-4 py-4">{index + 1}</TableCell>
                  <TableCell className="px-4 py-4">{customer.name}</TableCell>
                  <TableCell className="px-4 py-4">{customer.email}</TableCell>
                  <TableCell className="px-4 py-4">
                    {customer.phone_number}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {customer.username}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {customer.date_of_birth}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex gap-2 items-center">
                      <Eye
                        className="w-4 h-4 text-[#03A9F4] cursor-pointer hover:scale-110 transition"
                        onClick={() => {
                          setSelectedCustomer(customer);
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
          title={
            selectedCustomer ? "Chi tiết khách hàng" : "Thêm khách hàng mới"
          }
          onClose={() => setShowModal(false)}
        >
          <CustomerForm customer={selectedCustomer} />
        </BaseModal>
      )}
    </div>
  );
}
