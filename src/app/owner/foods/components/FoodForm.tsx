"use client";

import { useEffect, useState } from "react";
import { showErrorMessage, showSuccess } from "@/app/utils/alertHelper";
import { createFood, editFood } from "@/app/services/owner/foodService";
import { SquarePen } from "lucide-react";
import { Food } from "../page";
import {
  getTheaterOwner,
  getTheatersByOwner,
} from "@/app/services/owner/theaterService";
import { Theater } from "../../theaters/page";
import { Owner } from "@/app/admin/users/owners/page";
import { uploadFile } from "@/app/services/admin/blogService";
import { BlogPost } from "@/app/admin/blogs/page";

interface FoodFormProps {
  food?: Food | null;
  reload: () => void;
  setShowModal: (data: boolean) => void;
}

export default function FoodForm({
  food,
  reload,
  setShowModal,
}: FoodFormProps) {
  const [edit, setEdit] = useState(false);
  const [ImgPreview, setImgPreview] = useState<string | null>(null);
  const [foodState, setFoodState] = useState(food);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Food>({
    id: foodState?.id || 0,
    theaterId: foodState?.theater?.id || 0,
    name: foodState?.name ?? "",
    description: foodState?.description ?? "",
    price: foodState?.price ?? "",
    imageUrl: foodState?.imageUrl ?? null,
    category: foodState?.category ?? "",
    preparationTime: foodState?.preparationTime ?? "",
    quantity: foodState?.quantity ?? "",
    isActive: foodState?.isActive ?? true,
  });
  const [theaterOwner, setTheaterOwner] = useState<Owner | null>(null);
  const [theater, setTheater] = useState<Theater[]>([]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const imageUrlPreview = URL.createObjectURL(file);

      setForm((prev) => ({
        ...prev,
        [name]: file,
      }));

      if (name === "imageUrl") setImgPreview(imageUrlPreview);
    }
  };

  useEffect(() => {
    setEdit(false);
    setFoodState(food);

    // Update form with food data
    if (food) {
      console.log("Setting form with food data:", food);
      setForm({
        id: food.id,
        theaterId: food.theater?.id || 0,
        name: food.name,
        description: food.description,
        price: food.price,
        imageUrl: food.imageUrl,
        category: food.category,
        preparationTime: food.preparationTime,
        quantity: food.quantity,
        isActive: food.isActive,
      });
    } else {
      setForm({
        id: 0,
        theaterId: 0,
        name: "",
        description: "",
        price: "",
        imageUrl: null,
        category: "",
        preparationTime: "",
        quantity: "",
        isActive: true,
      });
    }

    // Set imageUrl preview from existing post data
    if (food?.imageUrl instanceof File) {
      setImgPreview(URL.createObjectURL(food.imageUrl));
    } else if (typeof food?.imageUrl === "string") {
      setImgPreview(food.imageUrl);
    } else {
      setImgPreview(null);
    }
  }, [food]);

  const fetchTheaterOwner = async () => {
    const res = await getTheaterOwner(Number(localStorage.getItem("userId")));
    if (res && res.statusCode === 200) {
      setTheaterOwner(res.data);
    } else {
      setTheaterOwner(null);
    }
  };
  useEffect(() => {
    fetchTheaterOwner();
  }, []);
  const fetchTheater = async () => {
    if (!theaterOwner) return;
    const res = await getTheatersByOwner(theaterOwner.id);
    if (res && res.statusCode === 200 && res.data) {
      console.log("Loaded theaters:", res.data);
      setTheater(res.data);
    } else {
      setTheater([]);
    }
  };
  useEffect(() => {
    fetchTheater();
  }, [theaterOwner]);

  // Update form when theater data is loaded and we have food data
  useEffect(() => {
    if (food && theater.length > 0) {
      const theaterId = food.theater?.id;
      console.log(
        "Updating form theaterId:",
        theaterId,
        "Available theaters:",
        theater.map((t) => t.id)
      );

      // Check if the theaterId exists in the theater list
      const theaterExists = theater.some((t) => t.id === theaterId);
      if (theaterExists && theaterId) {
        setForm((prev) => ({
          ...prev,
          theaterId: theaterId,
        }));
      } else {
        console.warn("Theater ID not found in theater list:", theaterId);
      }
    }
  }, [food, theater]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const validateData = (): boolean => {
    const {
      name,
      description,
      theaterId,
      category,
      price,
      quantity,
      preparationTime,
      imageUrl,
    } = form;

    // Kiểm tra tên món
    if (!name.trim()) {
      showErrorMessage("Vui lòng nhập tên món!");
      return false;
    }

    // Kiểm tra mô tả
    if (!description.trim()) {
      showErrorMessage("Vui lòng nhập mô tả!");
      return false;
    }

    // Kiểm tra rạp
    if (!theaterId || theaterId === 0) {
      showErrorMessage("Vui lòng chọn rạp!");
      return false;
    }

    // Kiểm tra danh mục
    if (!category.trim()) {
      showErrorMessage("Vui lòng nhập danh mục!");
      return false;
    }

    // Kiểm tra giá
    if (!price || price === "") {
      showErrorMessage("Vui lòng nhập giá!");
      return false;
    }
    const priceValue = typeof price === "string" ? parseFloat(price) : price;
    if (!priceValue || priceValue <= 0) {
      showErrorMessage("Giá phải lớn hơn 0!");
      return false;
    }

    // Kiểm tra số lượng
    if (!quantity || quantity === "") {
      showErrorMessage("Vui lòng nhập số lượng!");
      return false;
    }
    const quantityValue =
      typeof quantity === "string" ? parseFloat(quantity) : quantity;
    if (!quantityValue || quantityValue <= 0) {
      showErrorMessage("Số lượng phải lớn hơn 0!");
      return false;
    }

    // Kiểm tra thời gian chuẩn bị
    if (!preparationTime || preparationTime === "") {
      showErrorMessage("Vui lòng nhập thời gian chuẩn bị!");
      return false;
    }
    const prepTimeValue =
      typeof preparationTime === "string"
        ? parseFloat(preparationTime)
        : preparationTime;
    if (!prepTimeValue || prepTimeValue <= 0) {
      showErrorMessage("Thời gian chuẩn bị phải lớn hơn 0!");
      return false;
    }

    // Kiểm tra hình ảnh
    if (!imageUrl) {
      showErrorMessage("Vui lòng chọn hình ảnh!");
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateData()) return;

    setLoading(true);
    try {
      let ImgUrl = "";

      // Upload imageUrl if exists
      if (form.imageUrl) {
        const formData = new FormData();
        formData.append("file", form.imageUrl);

        const uploadRes = await uploadFile(formData);
        if (uploadRes && uploadRes.statusCode === 200) {
          ImgUrl = uploadRes.data;
        } else {
          showErrorMessage("Lỗi khi upload ảnh");
          setLoading(false);
          return;
        }
      }

      // Step 2: Create food item with the uploaded image URL
      const foodPayload = {
        theaterId: form.theaterId,
        name: form.name,
        description: form.description,
        price:
          typeof form.price === "string" ? parseFloat(form.price) : form.price,
        quantity:
          typeof form.quantity === "string"
            ? parseFloat(form.quantity)
            : form.quantity,
        preparationTime:
          typeof form.preparationTime === "string"
            ? parseFloat(form.preparationTime)
            : form.preparationTime,
        category: form.category,
        isActive: form.isActive,
        imageUrl: ImgUrl,
      };

      const res = await createFood(foodPayload);
      if (res && res.statusCode === 200) {
        showSuccess("Thêm món thành công");
        reload();
        setShowModal(false);
      } else {
        return;
      }
    } catch (err) {
      showErrorMessage("Lỗi khi thêm món: " + err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!validateData()) return;

    setLoading(true);
    try {
      let ImgUrl = form.imageUrl;
      if (form.imageUrl && form.imageUrl instanceof File) {
        const formData = new FormData();
        formData.append("file", form.imageUrl);

        const uploadRes = await uploadFile(formData);
        if (uploadRes && uploadRes.statusCode === 200) {
          ImgUrl = uploadRes.data;
        } else {
          showErrorMessage("Lỗi khi upload ảnh");
          setLoading(false);
          return;
        }
      }

      const foodPayload = {
        theaterId: form.theaterId,
        name: form.name,
        description: form.description,
        price:
          typeof form.price === "string" ? parseFloat(form.price) : form.price,
        quantity:
          typeof form.quantity === "string"
            ? parseFloat(form.quantity)
            : form.quantity,
        preparationTime:
          typeof form.preparationTime === "string"
            ? parseFloat(form.preparationTime)
            : form.preparationTime,
        category: form.category,
        isActive: form.isActive,
        imageUrl: ImgUrl,
      };

      const res = await editFood(foodPayload, food!.id);
      if (res && res.statusCode === 200) {
        showSuccess("Cập nhật món thành công");
        reload();
        setEdit(false);
        setFoodState((prev) => ({
          ...prev!,
          ...foodPayload,
        }));
      } else {
        return;
      }
    } catch (err) {
      showErrorMessage("Lỗi khi cập nhật: " + err);
    } finally {
      setLoading(false);
    }
  };
  const resetForm = () => {
    if (foodState) {
      setForm({
        id: foodState.id || 0,
        theaterId: foodState.theater?.id || 0,
        name: foodState.name ?? "",
        description: foodState.description ?? "",
        price: foodState.price ?? "",
        imageUrl: foodState.imageUrl ?? null,
        category: foodState.category ?? "",
        preparationTime: foodState.preparationTime ?? "",
        quantity: foodState.quantity ?? "",
        isActive: foodState.isActive ?? true,
      });
      // Reset lại preview ảnh nếu có
      if (foodState.imageUrl instanceof File) {
        setImgPreview(URL.createObjectURL(foodState.imageUrl));
      } else if (typeof foodState.imageUrl === "string") {
        setImgPreview(foodState.imageUrl);
      } else {
        setImgPreview(null);
      }
    }
  };
  const disabled = food !== null && !edit;
  return (
    <div className="h-[500px] overflow-y-auto p-2.5">
      <form className="space-y-3">
        <div className="flex items-center gap-5">
          <label className="w-[30%]">Tên món</label>
          <input
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            className="w-[70%] border px-2 py-1 rounded focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={disabled}
          />
        </div>

        <div className="flex items-center gap-5">
          <label className="w-[30%]">Mô tả</label>
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            className="w-[70%] border px-2 py-1 rounded focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={disabled}
          />
        </div>
        <div className="flex items-center gap-5">
          <label className="w-[30%]">Rạp</label>
          <select
            name="theaterId"
            value={form.theaterId ? form.theaterId.toString() : ""}
            onChange={handleChange}
            className="w-[70%] border px-2 py-1 rounded focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={disabled}
          >
            <option value="">Chọn rạp</option>
            {theater.map((theater) => (
              <option key={theater.id} value={theater.id}>
                {theater.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-5">
          <label className="w-[30%]">Danh mục</label>
          <input
            name="category"
            value={form.category || ""}
            onChange={handleChange}
            className="w-[70%] border px-2 py-1 rounded focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={disabled}
          />
        </div>

        <div className="flex items-center gap-5">
          <label className="w-[30%]">Giá</label>
          <div className="w-[70%]">
            <input
              type="number"
              name="price"
              value={form.price || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded focus:ring-0 focus:border-[#1677ff] outline-none"
              disabled={disabled}
            />
            <div className="text-sm text-gray-500 ">
              {form.price ? (
                <div className="pl-2 mt-2">
                  Giá trị tương ứng:{" "}
                  {Number(form.price).toLocaleString("vi-VN") + "đ"}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <label className="w-[30%]">Số lượng</label>
          <div className="w-[70%]">
            <input
              type="number"
              name="quantity"
              value={form.quantity || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded focus:ring-0 focus:border-[#1677ff] outline-none  "
              disabled={disabled}
            />
            <div className="text-sm text-gray-500 ">
              {form.quantity ? (
                <div className="pl-2 mt-2">
                  Số lượng tương ứng:{" "}
                  {Number(form.quantity).toLocaleString("vi-VN")}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <label className="w-[30%]">Thời gian chuẩn bị (phút)</label>
          <input
            type="number"
            name="preparationTime"
            value={form.preparationTime || ""}
            onChange={handleChange}
            className="w-[70%] border px-2 py-1 rounded focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={disabled}
          />
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-5 w-full">
            <label className="w-[30%] text-[15px]" htmlFor="imageUrl">
              Ảnh đại diện
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="imageUrl"
              name="imageUrl"
              placeholder="Ảnh đại diện"
              className="w-[70%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
              disabled={disabled}
            />
          </div>
          <div className="flex items-center justify-end w-full">
            <div className="w-[calc(70%-20px)] flex justify-start">
              {ImgPreview && (
                <img
                  src={ImgPreview}
                  alt="Poster Preview"
                  className="h-[150px] w-auto rounded-lg object-cover p-1 border w-max-[400px]"
                />
              )}
            </div>
          </div>
        </div>

        {food && !edit && (
          <button
            type="button"
            onClick={() => setEdit(true)}
            className="bg-[#CCC6F4] px-4 py-2 rounded"
          >
            Chỉnh sửa <SquarePen size={16} className="inline ml-2" />
          </button>
        )}

        {edit && (
          <div className="flex justify-end gap-5">
            <button
              type="button"
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={() => {
                setEdit(false);
                resetForm();
              }}
            >
              Hủy
            </button>
            <button
              type="button"
              className="bg-[#432DD7] text-white px-4 py-2 rounded"
              onClick={handleUpdate}
            >
              Xác nhận
            </button>
          </div>
        )}

        {!food && (
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-[#432DD7] text-white px-4 py-2 rounded"
              onClick={handleCreate}
            >
              Xác nhận
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
