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
import {
  deleteCustomer,
  getAllCustomer,
} from "@/app/services/admin/customerService";
import {
  confirmDelete,
  showErrorMessage,
  showSuccess,
} from "@/app/utils/alertHelper";

export interface Customer {
  id: number;
  name: string;
  email: string;
  password: string | null;
  phoneNumber: string;
  username: string;
  fullName: string;
  dateOfBirth: string;
}

export default function Customers() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [allCustomer, setAllCustomer] = useState<Customer[]>([]);
  const [formKey, setFormKey] = useState(Date.now());
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllCustomer();
        console.log("Check res", res);
        if (res === null) {
          setAllCustomer([]);
        } else {
          const data = res.data;
          setAllCustomer(data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách user:", error);
      }
    };
    fetchUsers();
  }, []);
  const reload = async () => {
    try {
      const res = await getAllCustomer();
      console.log("Check res", res);
      if (res === null) {
        setAllCustomer([]);
      } else {
        const data = res.data;
        setAllCustomer(data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách user:", error);
    }
  };
  const filtered = useMemo(() => {
    return allCustomer
      .filter((customer) => {
        return (
          customer.fullName.toLowerCase().includes(search.toLowerCase()) ||
          customer.email.toLowerCase().includes(search.toLowerCase())
        );
      })
      .sort((a, b) => (sortOrder === "asc" ? a.id - b.id : b.id - a.id));
  }, [search, sortOrder, allCustomer]);

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

  const handleDelete = async (customerId: number) => {
    const confirmed = await confirmDelete(
      "Bạn có chắc muốn xóa khách hàng này?"
    );
    // console.log(">>>>check confirmed:", confirmed); // Log id ra console
    // console.log("User id:", userId); // Log id ra console
    if (!confirmed) return;
    try {
      const result = await deleteCustomer(customerId);
      // console.log(">>>>check result:", result); // Log kết quả xóa ra console
      if (!result) {
        return;
      }
      setAllCustomer((prev) =>
        prev.filter((customer) => customer.id !== customerId)
      );
      showSuccess("Xóa user thành công!");
    } catch (error) {
      showErrorMessage("Xóa user thất bại!");
    }
  };
  // const fetchCustomer = () => {
  //   setFormKey(Date.now());
  // };
  const handleUpdatedCustomer = (updated: Customer) => {
    // Cập nhật danh sách
    setAllCustomer((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    // Gán lại selectedCustomer để form nhận props mới
    setSelectedCustomer(updated);
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
              <TableHead className="px-4 py-4">Họ và tên</TableHead>
              <TableHead className="px-4 py-4">Email</TableHead>
              <TableHead className="px-4 py-4">Số điện thoại</TableHead>

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
                  <TableCell className="px-4 py-4">
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {customer.fullName}
                  </TableCell>
                  <TableCell className="px-4 py-4">{customer.email}</TableCell>
                  <TableCell className="px-4 py-4">
                    {customer.phoneNumber}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {customer.dateOfBirth}
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
                      <Trash
                        className="w-4 h-4 text-[#E34724] cursor-pointer hover:scale-110 transition"
                        onClick={() => handleDelete(customer.id)}
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
            selectedCustomer ? "Chi tiết khách hàng" : "Thêm khách hàng mới"
          }
          onClose={() => setShowModal(false)}
        >
          <CustomerForm
            customer={selectedCustomer}
            reload={reload}
            key={formKey}
            handleUpdatedCustomer={handleUpdatedCustomer}
          />
        </BaseModal>
      )}
    </div>
  );
}
