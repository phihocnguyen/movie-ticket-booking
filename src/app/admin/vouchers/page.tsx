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
import {
  deleteVoucher,
  getAllVouchers,
} from "@/app/services/admin/voucherService";
import {
  confirmDelete,
  showErrorMessage,
  showSuccess,
} from "@/app/utils/alertHelper";

export interface Voucher {
  id: number;
  code: string;
  description: string;
  discountAmount: number;
  minPrice: number;
  startDate: string;
  endDate: string;
  type: "new_user" | "seasonal";
  maxUses: number;
  usedCount: number;
  isActive: boolean;
}

export default function Vouchers() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [showModal, setShowModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [typeVoucher, setTypeVoucher] = useState("");
  const [allVoucher, setAllVoucher] = useState<Voucher[]>([]);
  const [formKey, setFormKey] = useState(Date.now());
  const reload = async () => {
    try {
      const res = await getAllVouchers();
      console.log("Check res", res);
      if (res === null) {
        setAllVoucher([]);
      } else {
        const data = res.data;
        setAllVoucher(data);
      }
    } catch (error) {
      showErrorMessage("Lỗi khi lấy danh sách voucher:" + error);
    }
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllVouchers();
        console.log("Check res", res);
        if (res === null) {
          setAllVoucher([]);
        } else {
          const data = res.data;
          setAllVoucher(data);
        }
      } catch (error) {
        showErrorMessage("Lỗi khi lấy danh sách voucher:" + error);
      }
    };
    fetchUsers();
  }, []);

  // Lấy ra mảng ["new_user","seasonal",...]
  const voucherTypes = Array.from(new Set(allVoucher.map((v) => v.type)));
  const filtered = useMemo(() => {
    return allVoucher
      .filter((voucher) => {
        const matchesSearch =
          voucher.description.toLowerCase().includes(search.toLowerCase()) ||
          voucher.code.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeVoucher ? voucher.type === typeVoucher : true;
        return matchesSearch && matchesType;
      })
      .sort((a, b) =>
        sortOrder === "asc"
          ? a.discountAmount - b.discountAmount
          : b.discountAmount - a.discountAmount
      );
  }, [search, sortOrder, typeVoucher, allVoucher]);

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
  const handleDelete = async (voucherId: number) => {
    const voucher = allVoucher.find((v) => v.id === voucherId);
    if (voucher && voucher.usedCount && Number(voucher.usedCount) > 0) {
      showErrorMessage("Voucher đã có người lấy hoặc sử dụng, không thể xóa!");
      return;
    }
    const confirmed = await confirmDelete(
      "Bạn có chắc muốn xóa phim này không?"
    );
    if (!confirmed) return;
    try {
      const result = await deleteVoucher(voucherId);
      if (!result) {
        return;
      }
      setAllVoucher((prev) =>
        prev.filter((voucher) => voucher.id !== voucherId)
      );
      showSuccess("Xóa voucher thành công!");
    } catch (error) {
      showErrorMessage("Xóa voucher thất bại!" + error);
    }
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
            setFormKey(Date.now());
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
              <TableHead className="px-4 py-4">Mã</TableHead>
              <TableHead className="px-4 py-4">Tiêu đề</TableHead>
              <TableHead className="px-4 py-4">
                Giá trị đơn hàng tối thiểu
              </TableHead>
              <TableHead
                onClick={toggleSort}
                className="flex items-center justify-start px-4 py-4 mt-1.5 cursor-pointer select-none gap-1"
              >
                Phần trăm giảm
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
            {paginatedVouchers?.length === 0 ? (
              <TableRow className="hover:bg-white">
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-gray-500 hover:bg-white"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              paginatedVouchers.map((voucher, index) => (
                <TableRow
                  key={voucher.id}
                  className="hover:bg-gray-100 transition"
                >
                  <TableCell className="px-4 py-4">
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="px-4 py-4">{voucher.code}</TableCell>
                  <TableCell className="px-4 py-4">
                    {voucher.description}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {voucher.minPrice.toLocaleString()}đ
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {voucher.discountAmount}%
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
                      <Trash
                        className="w-4 h-4 text-[#E34724] cursor-pointer hover:scale-110 transition"
                        onClick={() => handleDelete(voucher.id)}
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
          title={selectedVoucher ? "Chi tiết voucher" : "Thêm voucher mới"}
          onClose={() => setShowModal(false)}
        >
          <VoucherForm
            voucher={selectedVoucher}
            reload={reload}
            key={formKey}
            setShowModal={setShowModal}
          />
        </BaseModal>
      )}
    </div>
  );
}
