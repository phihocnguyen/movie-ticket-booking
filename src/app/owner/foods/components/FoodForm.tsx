"use client";

import { useEffect, useState } from "react";
import { SquarePen } from "lucide-react";
import { Food } from "../page"; // interface đã khai báo
import { showErrorMessage, showSuccess } from "@/app/utils/alertHelper";
// import { editFood } from "@/app/services/admin/foodService";

interface FoodFormProps {
  food?: Food | null;
  reload: () => void;
  // handleUpdatedFood: (dataUpdate: Food) => void;
}

export default function FoodForm({
  food,
  reload,
}: // handleUpdatedFood,
FoodFormProps) {
  const [edit, setEdit] = useState<boolean>(false);
  const [form, setForm] = useState({
    id: food?.id,
    foodName: food?.foodName || "",
    price: food?.price || 0,
    quantity: food?.quantity || 0,
    category: food?.category || "",
    description: food?.description || "",
    imageUrl: food?.imageUrl || "",
    preparationTime: food?.preparationTime || 0,
    isActive: food?.isActive ?? true,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // e.preventDefault();
    // if (!form.foodName.trim()) {
    //   showErrorMessage("Tên món ăn không được để trống!");
    //   return;
    // }
    // const payload = {
    //   ...form,
    // };
    // try {
    //   const result = await editFood(payload, form.id!);
    //   if (!result) return;
    //   showSuccess("Cập nhật món ăn thành công!");
    //   setEdit(false);
    //   reload();
    //   handleUpdatedFood({ ...food!, ...payload });
    // } catch (error) {
    //   showErrorMessage("Cập nhật thất bại!");
    // }
  };

  useEffect(() => {
    setEdit(false);
  }, [food]);

  const handleCancel = () => {
    setForm({
      id: food?.id,
      foodName: food?.foodName || "",
      price: food?.price || 0,
      quantity: food?.quantity || 0,
      category: food?.category || "",
      description: food?.description || "",
      imageUrl: food?.imageUrl || "",
      preparationTime: food?.preparationTime || 0,
      isActive: food?.isActive ?? true,
    });
    setEdit(false);
  };

  return (
    <div className="max-h-[600px] overflow-y-auto pr-2">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* foodName */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="foodName">
            Tên món
          </label>
          <input
            id="foodName"
            name="foodName"
            value={form.foodName}
            onChange={handleChange}
            required
            disabled={food !== null && !edit}
            className="w-[80%] border px-2 py-1.5 rounded-[8px]"
          />
        </div>

        {/* price */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="price">
            Giá
          </label>
          <input
            id="price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
            disabled={food !== null && !edit}
            className="w-[80%] border px-2 py-1.5 rounded-[8px]"
          />
        </div>

        {/* quantity */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="quantity">
            Số lượng
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            required
            disabled={food !== null && !edit}
            className="w-[80%] border px-2 py-1.5 rounded-[8px]"
          />
        </div>

        {/* category */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="category">
            Danh mục
          </label>
          <input
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            disabled={food !== null && !edit}
            className="w-[80%] border px-2 py-1.5 rounded-[8px]"
          />
        </div>

        {/* description */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="description">
            Mô tả
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            disabled={food !== null && !edit}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] resize-none"
          />
        </div>

        {/* imageUrl */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="imageUrl">
            Ảnh
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            required
            disabled={food !== null && !edit}
            className="w-[80%] border px-2 py-1.5 rounded-[8px]"
          />
        </div>

        {/* preparationTime */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="preparationTime">
            Thời gian chuẩn bị (phút)
          </label>
          <input
            id="preparationTime"
            name="preparationTime"
            type="number"
            value={form.preparationTime}
            onChange={handleChange}
            required
            disabled={food !== null && !edit}
            className="w-[80%] border px-2 py-1.5 rounded-[8px]"
          />
        </div>

        {/* isActive */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="isActive">
            Đang bán
          </label>
          <input
            type="checkbox"
            name="isActive"
            id="isActive"
            checked={form.isActive}
            onChange={handleChange}
            disabled={food !== null && !edit}
          />
        </div>

        {/* theater.name - chỉ hiển thị */}
        {food?.theater?.name && (
          <div className="flex items-center gap-5">
            <label className="w-[20%] text-[15px]">Rạp</label>
            <span className="text-[15px]">{food.theater.name}</span>
          </div>
        )}

        {/* createdAt & updatedAt */}
        {food?.createdAt && (
          <div className="flex items-center gap-5 text-[14px] text-gray-600">
            <label className="w-[20%]">Tạo lúc:</label>
            <span>{new Date(food.createdAt).toLocaleString()}</span>
          </div>
        )}
        {food?.updatedAt && (
          <div className="flex items-center gap-5 text-[14px] text-gray-600">
            <label className="w-[20%]">Cập nhật lúc:</label>
            <span>{new Date(food.updatedAt).toLocaleString()}</span>
          </div>
        )}

        {/* Nút edit */}
        {food && !edit && (
          <div className="flex gap-5 text-[15px] my-2">
            <div
              className="flex gap-3 border p-[4px] rounded-lg items-center  bg-[#CCC6F4] cursor-pointer"
              onClick={() => setEdit(true)}
            >
              Chỉnh sửa thông tin
              <SquarePen size={20} />
            </div>
          </div>
        )}

        {/* Submit */}
        {edit && (
          <div className="flex justify-end gap-5">
            <button
              className="w-[20%] bg-[#D51F2A] text-white py-2 rounded"
              onClick={handleCancel}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="w-[20%] bg-[#432DD7] text-white py-2 rounded"
            >
              Xác nhận
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
