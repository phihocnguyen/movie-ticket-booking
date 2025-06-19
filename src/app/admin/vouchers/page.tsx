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
import VoucherForm from "./components/VoucherForm";

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  discount_value: number;
  min_order_value: number;
  release_date: string;
  expire_date: string;
  quantity: number;
  claimed: number;
  is_active: boolean;
  type: "new_user" | "seasonal" | "referral" | "general";
}

export default function Vouchers() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [showModal, setShowModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [typeVoucher, setTypeVoucher] = useState("");

  const mockVouchers: Voucher[] = [
    {
      id: "1",
      code: "SALE50",
      title: "Giảm 50% cho đơn hàng đầu tiên",
      description: "Áp dụng cho đơn hàng tối thiểu 100k.",
      discount_value: 50,
      min_order_value: 100000,
      release_date: "2025-06-20",
      expire_date: "2025-07-01",
      quantity: 100,
      claimed: 40,
      is_active: true,
      type: "new_user",
    },
    {
      id: "2",
      code: "SUMMER20",
      title: "Ưu đãi mùa hè 20%",
      description: "Giảm giá cho toàn bộ khách hàng mùa hè này.",
      discount_value: 20,
      min_order_value: 50000,
      release_date: "2025-06-15",
      expire_date: "2025-07-31",
      quantity: 200,
      claimed: 100,
      is_active: true,
      type: "seasonal",
    },
  ];

  // Lấy ra mảng ["new_user","seasonal",...]
  const voucherTypes = Array.from(new Set(mockVouchers.map((v) => v.type)));
  const filtered = useMemo(() => {
    return mockVouchers
      .filter((voucher) => {
        const matchesSearch =
          voucher.title.toLowerCase().includes(search.toLowerCase()) ||
          voucher.code.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeVoucher ? voucher.type === typeVoucher : true;
        return matchesSearch && matchesType;
      })
      .sort((a, b) =>
        sortOrder === "asc"
          ? a.discount_value - b.discount_value
          : b.discount_value - a.discount_value
      );
  }, [search, sortOrder, typeVoucher]);

  const paginatedVouchers = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(filtered.length / pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize, typeVoucher]);

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex gap-4 w-full">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã hoặc tiêu đề"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 px-3 py-[6px] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-[#1677ff] focus:border-[#1677ff]"
          />
          <select
            value={typeVoucher}
            onChange={(e) => setTypeVoucher(e.target.value)}
            className="w-full md:w-1/4 px-3 py-[6px] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả loại</option>
            {voucherTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <button
          className="flex gap-2.5 border px-10 py-1.5 rounded-[8px] bg-[#432DD7] text-white"
          onClick={() => {
            setSelectedVoucher(null);
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
              <TableHead className="px-4 py-4">Mã</TableHead>
              <TableHead className="px-4 py-4">Tiêu đề</TableHead>
              <TableHead className="px-4 py-4">Phần trăm giảm</TableHead>
              <TableHead
                onClick={toggleSort}
                className="flex items-center justify-start px-4 py-4 mt-1.5 cursor-pointer select-none gap-1"
              >
                Giảm giá
                {sortOrder === "asc" ? (
                  <IoMdArrowDropdown className="w-5 h-5 mt-0.5" />
                ) : (
                  <IoMdArrowDropup className="w-5 h-5 mt-0.5" />
                )}
              </TableHead>
              <TableHead className="px-4 py-4">Loại</TableHead>
              <TableHead className="px-4 py-4">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedVouchers.length === 0 ? (
              <TableRow className="hover:bg-white">
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-gray-500 hover:bg-white"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              paginatedVouchers.map((voucher) => (
                <TableRow
                  key={voucher.id}
                  className="hover:bg-gray-100 transition"
                >
                  <TableCell className="px-4 py-4">{voucher.code}</TableCell>
                  <TableCell className="px-4 py-4">{voucher.title}</TableCell>
                  <TableCell className="px-4 py-4">
                    {voucher.discount_value}%
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {voucher.min_order_value.toLocaleString()}đ
                  </TableCell>
                  <TableCell className="px-4 py-4">{voucher.type}</TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex gap-2 items-center">
                      <Eye
                        className="w-4 h-4 text-[#03A9F4] cursor-pointer hover:scale-110 transition"
                        onClick={() => {
                          setSelectedVoucher(voucher);
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
          title={selectedVoucher ? "Chi tiết voucher" : "Thêm voucher mới"}
          onClose={() => setShowModal(false)}
        >
          <VoucherForm voucher={selectedVoucher} />
        </BaseModal>
      )}
    </div>
  );
}
