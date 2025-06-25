"use client";

import React, { useState, useEffect } from "react";
import { createTheater, editTheater, getTheaterOwner } from "@/app/services/owner/theaterService";
import { SquarePen } from "lucide-react";
import { showSuccess } from "@/app/utils/alertHelper";
import { useAuth } from "@/app/context/AuthContext";

const defaultTime = { hour: 8, minute: 0, second: 0, nano: 0 };

type TimeObj = { hour: number; minute: number; second: number; nano: number };
type FormState = {
  [key: string]: any;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phoneNumber: string;
  email: string;
  isActive: boolean;
  openingTime: string;
  closingTime: string;
  totalScreens: number;
};

export default function TheaterForm({ theater, onClose, fetchTheaters }: { theater?: any, onClose?: () => void, fetchTheaters?: () => void }) {
  const [edit, setEdit] = useState(!theater);
  const [form, setForm] = useState({
    name: theater?.name || "",
    address: theater?.address || "",
    city: theater?.city || "",
    state: theater?.state || "",
    country: theater?.country || "",
    zipCode: theater?.zipCode || "",
    phoneNumber: theater?.phoneNumber || "",
    email: theater?.email || "",
    isActive: true,
    openingTime: theater?.openingTime || "08:00",
    closingTime: theater?.closingTime || "22:00",
    totalScreens: theater?.totalScreens || 1,
  });
  const [loading, setLoading] = useState(false);
  const [theaterOwnerId, setTheaterOwnerId] = useState<number | null>(null);
  const { userData } = useAuth();

  useEffect(() => {
    if (theater) setEdit(false);
    else setEdit(true);
  }, [theater]);

  useEffect(() => {
    async function fetchTheaterOwnerId() {
      if (userData?.id) {
        try {
          const res = await getTheaterOwner(userData.id);
          if (res && res.statusCode === 200 && res.data?.id) {
            setTheaterOwnerId(res.data.id);
          }
        } catch (err) {
          setTheaterOwnerId(null);
        }
      }
    }
    fetchTheaterOwnerId();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === "isActive") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, isActive: checked }));
    } else if (name === "totalScreens") {
      setForm((prev) => ({ ...prev, totalScreens: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (theater && edit) {
        res = await editTheater(form, theater.id);
      } else if (!theater && theaterOwnerId) {
        res = await createTheater({ ...form, theaterOwnerId });
      }
      if (res && res.statusCode === 200) {
        showSuccess(theater ? "Cập nhật thành công!" : "Tạo rạp thành công!");
        if (!theater) {
          setForm({
            name: "",
            address: "",
            city: "",
            state: "",
            country: "",
            zipCode: "",
            phoneNumber: "",
            email: "",
            isActive: true,
            openingTime: "08:00",
            closingTime: "22:00",
            totalScreens: 1,
          });
        }
        if (onClose) onClose();
        if (fetchTheaters) fetchTheaters();
      }
      setEdit(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-[600px] overflow-y-auto pr-2">
      <form onSubmit={handleSubmit} className="space-y-3">
        <h2 className="text-2xl font-bold mb-4">{theater ? "Chi tiết rạp" : "Tạo rạp chiếu phim mới"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Tên rạp" className="border rounded px-3 py-2" required disabled={theater && !edit} />
          <input name="address" value={form.address} onChange={handleChange} placeholder="Địa chỉ" className="border rounded px-3 py-2" required disabled={theater && !edit} />
          <input name="state" value={form.state} onChange={handleChange} placeholder="Tỉnh/Thành" className="border rounded px-3 py-2" required disabled={theater && !edit} />
          <input name="city" value={form.city} onChange={handleChange} placeholder="Quận huyện" className="border rounded px-3 py-2" required disabled={theater && !edit} />
          <input name="country" value={form.country} onChange={handleChange} placeholder="Quốc gia" className="border rounded px-3 py-2" required disabled={theater && !edit} />
          <input name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="Zip Code" className="border rounded px-3 py-2" required disabled={theater && !edit} />
          <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Số điện thoại" className="border rounded px-3 py-2" required disabled={theater && !edit} />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border rounded px-3 py-2" type="email" required disabled={theater && !edit} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Giờ mở cửa</label>
            <input name="openingTime" value={form.openingTime} onChange={handleChange} type="time" className="border rounded px-2 py-1 w-32" required disabled={theater && !edit} />
        </div>
          <div>
            <label className="block mb-1">Giờ đóng cửa</label>
            <input name="closingTime" value={form.closingTime} onChange={handleChange} type="time" className="border rounded px-2 py-1 w-32" required disabled={theater && !edit} />
        </div>
        </div>
        <div>
          <label className="block mb-1">Tổng số phòng</label>
          <input name="totalScreens" value={form.totalScreens} onChange={handleChange} placeholder="Số phòng chiếu" className="border rounded px-3 py-2" type="number" min={1} required disabled={theater && !edit} />
        </div>
        {theater && !edit && (
          <button type="button" className="flex gap-2 items-center bg-[#CCC6F4] text-[#432DD7] px-4 py-2 rounded font-medium" onClick={() => setEdit(true)}>
            <SquarePen className="w-4 h-4" /> Chỉnh sửa thông tin
          </button>
        )}
        {edit && (
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold mt-4" disabled={loading}>
            {loading ? "Đang lưu..." : theater ? "Cập nhật" : "Tạo rạp"}
            </button>
        )}
      </form>
    </div>
  );
}
