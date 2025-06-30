"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Plus, Trash } from "lucide-react";
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
import {
  deleteFood,
  getAllFoodByOwner,
  getOwnerByUserId,
} from "@/app/services/owner/foodService";
import FoodForm from "./components/FoodForm";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { Owner } from "@/app/admin/users/owners/page";
// Tùy bạn tổ chức

export interface Food {
  id: number;
  theaterId: number;
  name: string;
  description: string;
  price: number | string;
  imageUrl: File | null;
  category: string;
  preparationTime: number | string;
  quantity: number | string;
  isActive: boolean;
  theater?: {
    id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    phoneNumber: string;
    email: string;
    openingTime: string; // "08:00"
    closingTime: string; // "22:00"
    totalScreens: number;
  };
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
  const [owner, setOwner] = useState<Owner | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [theaterFilter, setTheaterFilter] = useState("");
  const fetchOwner = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    const res = await getOwnerByUserId(Number(userId));
    if (res && res.statusCode === 200 && res.data) {
      setOwner(res.data);
    } else {
      setOwner(null);
    }
  };
  const fetchData = async () => {
    try {
      if (!owner) return;
      const res = await getAllFoodByOwner(owner.id);
      console.log("res", res);
      if (res && res.statusCode === 200 && res.data) {
        setAllFood(res.data);
      } else {
        setAllFood([]);
      }
    } catch (error) {
      showErrorMessage("Lỗi khi lấy danh sách food:" + error);
    }
  };
  useEffect(() => {
    fetchOwner();
  }, []);
  useEffect(() => {
    fetchData();
  }, [owner]);
  // console.log("allFood", allFood);
  const filtered = useMemo(() => {
    return allFood
      .filter((food) => {
        const matchesSearch =
          food.name.toLowerCase().includes(search.toLowerCase()) ||
          food.category.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter
          ? food.category === categoryFilter
          : true;
        const matchesTheater = theaterFilter
          ? food.theater?.name === theaterFilter
          : true;
        return matchesSearch && matchesCategory && matchesTheater;
      })
      .sort((a, b) => {
        const priceA =
          typeof a.price === "string" ? parseFloat(a.price) || 0 : a.price;
        const priceB =
          typeof b.price === "string" ? parseFloat(b.price) || 0 : b.price;
        return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
      });
  }, [search, sortOrder, allFood, categoryFilter, theaterFilter]);

  const paginatedFoods = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize, categoryFilter, theaterFilter]);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };
  const reload = () => {
    fetchData();
  };
  const handleDelete = async (id: number) => {
    const confirmed = await confirmDelete(
      "Bạn có chắc muốn xóa món này không?"
    );
    if (!confirmed) return;
    try {
      const res = await deleteFood(id);
      if (res && res.statusCode === 200) {
        setAllFood((prev) => prev.filter((f) => f.id !== id));
      } else {
        return;
      }
      showSuccess("Xóa món thành công!");
    } catch (error) {
      showErrorMessage("Xóa món thất bại! " + error);
    }
  };
  const categories = Array.from(new Set(allFood.map((f) => f.category)));
  const theaters = Array.from(new Set(allFood.map((f) => f.theater?.name)));
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex gap-4 w-full justify-between">
          <div className="flex gap-4 w-full">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên món"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-1/3 px-3 py-[6px] bg-white border border-gray-300 rounded-md focus:ring-0 focus:border-[#1677ff] outline-none"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full md:w-1/4 px-3 py-[6px] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả loại</option>
              {categories.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              value={theaterFilter}
              onChange={(e) => setTheaterFilter(e.target.value)}
              className="w-full md:w-1/4 px-3 py-[6px] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả rạp</option>
              {theaters.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <button
            className="flex gap-2.5 border px-10 py-1.5 rounded-[8px] bg-[#432DD7] text-white"
            onClick={() => {
              setSelectedFood(null);
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
              <TableHead className="px-4 py-4">Tên món</TableHead>
              <TableHead
                onClick={toggleSort}
                className="flex items-center justify-start px-4 py-4 mt-1.5 cursor-pointer select-none gap-1"
              >
                Giá
                {sortOrder === "desc" ? (
                  <IoMdArrowDropdown className="w-5 h-5 mt-0.5" />
                ) : (
                  <IoMdArrowDropup className="w-5 h-5 mt-0.5" />
                )}
              </TableHead>

              <TableHead className="px-4 py-4">Loại</TableHead>
              <TableHead className="px-4 py-4">Rạp</TableHead>
              <TableHead className="px-4 py-4">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedFoods.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-6 text-gray-500"
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
                  <TableCell className="px-4 py-4">{food.name}</TableCell>
                  <TableCell className="px-4 py-4">
                    {typeof food.price === "string"
                      ? Number(food.price).toLocaleString()
                      : food.price.toLocaleString()}
                    đ
                  </TableCell>
                  <TableCell className="px-4 py-4">{food.category}</TableCell>
                  <TableCell className="px-4 py-4">
                    {food.theater?.name}
                  </TableCell>

                  <TableCell className="px-4 py-4">
                    <div className="flex gap-2 items-center">
                      <Eye
                        className="w-4 h-4 text-[#03A9F4] cursor-pointer hover:scale-110"
                        onClick={() => {
                          setSelectedFood(food);
                          setShowModal(true);
                        }}
                      />
                      <Trash
                        className="w-4 h-4 text-[#E34724] cursor-pointer hover:scale-110"
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
        onPageChange={setCurrentPage}
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
          <FoodForm
            food={selectedFood}
            reload={reload}
            setShowModal={setShowModal}
            key={formKey}
          />
        </BaseModal>
      )}
    </div>
  );
}
