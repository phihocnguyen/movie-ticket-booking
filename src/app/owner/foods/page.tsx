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

import {
  confirmDelete,
  showErrorMessage,
  showSuccess,
} from "@/app/utils/alertHelper";
import { useRouter } from "next/navigation";
import FoodForm from "./components/FoodForm";
import { deleteFood, getAllFood } from "@/app/services/owner/foodService";

export interface TheaterDTO {
  id: number;
  name: string;
  address: string;
}

export interface Food {
  id: number;
  foodName: string;
  quantity: number;
  price: number;
  theater: TheaterDTO;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  preparationTime: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Foods() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [showModal, setShowModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [allFood, setAllFood] = useState<Food[]>([]);
  const [formKey, setFormKey] = useState(Date.now());
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, []);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await getAllFood();
        if (res === null) {
          setAllFood([]);
        } else {
          const data = res.data;
          setAllFood(data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách food:", error);
      }
    };
    fetchFoods();
  }, []);

  const reload = async () => {
    try {
      const res = await getAllFood();
      if (res === null) {
        setAllFood([]);
      } else {
        const data = res.data;
        setAllFood(data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách food:", error);
    }
  };

  const filtered = useMemo(() => {
    return allFood
      .filter((food) => {
        return (
          food.foodName.toLowerCase().includes(search.toLowerCase()) ||
          food.description.toLowerCase().includes(search.toLowerCase())
        );
      })
      .sort((a, b) => (sortOrder === "asc" ? a.id - b.id : b.id - a.id));
  }, [search, sortOrder, allFood]);

  const paginatedFoods = filtered.slice(
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

  const handleDelete = async (foodId: number) => {
    const confirmed = await confirmDelete("Bạn có chắc muốn xóa món này?");
    if (!confirmed) return;
    try {
      const result = await deleteFood(foodId);
      if (!result) {
        return;
      }
      setAllFood((prev) => prev.filter((food) => food.id !== foodId));
      showSuccess("Xóa món thành công!");
    } catch (error) {
      showErrorMessage("Xóa món thất bại!");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex gap-4 w-full">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mô tả"
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
              <TableHead className="px-4 py-4">Tên món</TableHead>
              <TableHead className="px-4 py-4">Mô tả</TableHead>
              <TableHead className="px-4 py-4">Giá</TableHead>
              <TableHead className="px-4 py-4">Rạp</TableHead>
              <TableHead className="px-4 py-4">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedFoods.length === 0 ? (
              <TableRow className="hover:bg-white">
                <TableCell
                  colSpan={7}
                  className="text-center py-6 text-gray-500 hover:bg-white"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              paginatedFoods.map((food, index) => (
                <TableRow
                  key={food.id}
                  className="hover:bg-gray-100 transition"
                >
                  <TableCell className="px-4 py-4">
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="px-4 py-4">{food.foodName}</TableCell>
                  <TableCell className="px-4 py-4">
                    {food.description}
                  </TableCell>
                  <TableCell className="px-4 py-4">{food.price}</TableCell>
                  <TableCell className="px-4 py-4">
                    {food.theater?.name || ""}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex gap-2 items-center">
                      <Eye
                        className="w-4 h-4 text-[#03A9F4] cursor-pointer hover:scale-110 transition"
                        onClick={() => {
                          setSelectedFood(food);
                          setShowModal(true);
                        }}
                      />
                      <Trash
                        className="w-4 h-4 text-[#E34724] cursor-pointer hover:scale-110 transition"
                        onClick={() => handleDelete(food.id)}
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
          title={selectedFood ? "Chi tiết món ăn" : "Thêm món mới"}
          onClose={() => setShowModal(false)}
        >
          <FoodForm food={selectedFood} reload={reload} key={formKey} />
        </BaseModal>
      )}
    </div>
  );
}
