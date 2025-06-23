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
import { deleteOwner, getAllOwner } from "@/app/services/admin/ownerService";
import {
  confirmDelete,
  showErrorMessage,
  showSuccess,
} from "@/app/utils/alertHelper";
import OwnerForm from "./components/OwnerForm";
import { useRouter } from "next/navigation";

export interface Owner {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    username: string;
    fullName: string;
    dateOfBirth: string;
    role: "THEATER_OWNER";
    password: string | null;
  };
}

export default function Staffs() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [showModal, setShowModal] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [allOwner, setAllOwner] = useState<Owner[]>([]);
  const [formKey, setFormKey] = useState(Date.now());
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    // Có thể kiểm tra thêm role nếu cần
    if (!token) {
      router.replace("/login"); // đẩy về login nếu chưa đăng nhập
    }
  }, []);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllOwner();
        console.log("Check res", res);
        if (res === null) {
          setAllOwner([]);
        } else {
          const data = res.data;
          setAllOwner(data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách user:", error);
      }
    };
    fetchUsers();
  }, []);
  const filtered = useMemo(() => {
    return allOwner
      .filter((owner) => {
        return (
          owner.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
          owner.user?.email?.toLowerCase().includes(search.toLowerCase())
        );
      })
      .sort((a, b) => (sortOrder === "asc" ? a.id - b.id : b.id - a.id));
  }, [search, sortOrder, allOwner]);

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
  const handleUpdatedOwner = (updated: Owner) => {
    // Cập nhật danh sách
    setAllOwner((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    // Gán lại selectedCustomer để form nhận props mới
    setSelectedOwner(updated);
  };
  const handleDelete = async (ownerId: number) => {
    const confirmed = await confirmDelete(
      "Bạn có chắc muốn xóa chủ rạp này không?"
    );
    // console.log(">>>>check confirmed:", confirmed); // Log id ra console
    // console.log("User id:", userId); // Log id ra console
    if (!confirmed) return;
    try {
      const result = await deleteOwner(ownerId);
      // console.log(">>>>check result:", result); // Log kết quả xóa ra console
      if (!result) {
        return;
      }
      setAllOwner((prev) => prev.filter((owner) => owner.id !== ownerId));
      showSuccess("Xóa chủ rạp thành công!");
    } catch (error) {
      showErrorMessage("Xóa chủ rạp thất bại!" + error);
    }
  };
  const reload = async () => {
    try {
      const res = await getAllOwner();
      console.log("Check res", res);
      if (res === null) {
        setAllOwner([]);
      } else {
        const data = res.data;
        setAllOwner(data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách user:", error);
    }
  };
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex gap-4 w-full justify-between">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 px-3 py-[6px] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-[#1677ff] focus:border-[#1677ff]"
          />
          <button
            className="flex gap-2.5 border px-10 py-1.5 rounded-[8px] bg-[#432DD7] text-white"
            onClick={() => {
              setSelectedOwner(null);
              setShowModal(true);
              setFormKey(Date.now());
            }}
          >
            <Plus /> Thêm
          </button>
        </div>
      </div>

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
              paginatedStaffs?.map((owner, index) => (
                <TableRow
                  key={owner.id}
                  className="hover:bg-gray-100 transition"
                >
                  <TableCell className="px-4 py-4">
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {owner.user.fullName}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {owner.user.email}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {owner.user.phoneNumber}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    {owner.user.dateOfBirth}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex gap-2 items-center">
                      <Eye
                        className="w-4 h-4 text-[#03A9F4] cursor-pointer hover:scale-110 transition"
                        onClick={() => {
                          setSelectedOwner(owner);
                          setShowModal(true);
                        }}
                      />
                      <Trash
                        className="w-4 h-4 text-[#E34724] cursor-pointer hover:scale-110 transition"
                        onClick={() => handleDelete(owner.id)}
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
          title={selectedOwner ? "Chi tiết nhân viên" : "Thêm nhân viên mới"}
          onClose={() => setShowModal(false)}
        >
          <OwnerForm
            owner={selectedOwner}
            reload={reload}
            setShowModal={setShowModal}
            key={formKey}
            handleUpdatedOwner={handleUpdatedOwner}
          />
        </BaseModal>
      )}
    </div>
  );
}
