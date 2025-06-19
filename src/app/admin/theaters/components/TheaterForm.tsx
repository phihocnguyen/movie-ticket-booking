"use client";

import { useEffect, useState } from "react";
import { Theater } from "../page";
import { SquarePen } from "lucide-react";

interface TheaterFormProps {
  theater?: Theater | null;
}

export default function TheaterForm({ theater }: TheaterFormProps) {
  const [edit, setEdit] = useState<boolean>(false);
  const [form, setForm] = useState({
    name: theater?.name || "",
    address: theater?.address || "",
    city: theater?.city || "",
    state: theater?.state || "",
    country: theater?.country || "",
    zip_code: theater?.zip_code || "",
    phone_number: theater?.phone_number || "",
    email: theater?.email || "",
    opening_time: theater?.opening_time || "",
    closing_time: theater?.closing_time || "",
    total_screens: theater?.total_screens || 1,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "total_screens" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // onSubmit(form);
  };

  useEffect(() => {
    setEdit(false);
  }, [theater]);

  return (
    <div className="max-h-[600px] overflow-y-auto pr-2">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="name">
            Tên rạp
          </label>
          <input
            id="name"
            name="name"
            placeholder="Tên rạp"
            value={form.name}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={theater !== null && !edit}
          />
        </div>

        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="address">
            Địa chỉ
          </label>
          <input
            id="address"
            name="address"
            placeholder="Địa chỉ"
            value={form.address}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={theater !== null && !edit}
          />
        </div>

        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="city">
            Thành phố
          </label>
          <input
            id="city"
            name="city"
            placeholder="Thành phố"
            value={form.city}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={theater !== null && !edit}
          />
        </div>

        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="state">
            Bang/Tỉnh
          </label>
          <input
            id="state"
            name="state"
            placeholder="Bang/Tỉnh"
            value={form.state}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={theater !== null && !edit}
          />
        </div>

        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="country">
            Quốc gia
          </label>
          <input
            id="country"
            name="country"
            placeholder="Quốc gia"
            value={form.country}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={theater !== null && !edit}
          />
        </div>

        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="zip_code">
            Mã bưu chính
          </label>
          <input
            id="zip_code"
            name="zip_code"
            placeholder="Mã bưu chính"
            value={form.zip_code}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={theater !== null && !edit}
          />
        </div>

        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="phone_number">
            Số điện thoại
          </label>
          <input
            id="phone_number"
            name="phone_number"
            placeholder="Số điện thoại"
            value={form.phone_number}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={theater !== null && !edit}
          />
        </div>

        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            type="email"
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={theater !== null && !edit}
          />
        </div>

        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="opening_time">
            Giờ mở cửa
          </label>
          <input
            id="opening_time"
            name="opening_time"
            type="time"
            value={form.opening_time}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={theater !== null && !edit}
          />
        </div>

        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="closing_time">
            Giờ đóng cửa
          </label>
          <input
            id="closing_time"
            name="closing_time"
            type="time"
            value={form.closing_time}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={theater !== null && !edit}
          />
        </div>

        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="total_screens">
            Số phòng chiếu
          </label>
          <input
            id="total_screens"
            name="total_screens"
            type="number"
            placeholder="Số phòng chiếu"
            value={form.total_screens}
            onChange={handleChange}
            min={1}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={theater !== null && !edit}
          />
        </div>

        {theater && !edit && (
          <div className="flex gap-5 text-[15px] my-2">
            <div
              className="flex gap-5 border p-[4px] rounded-lg items-center  bg-[#CCC6F4] cursor-pointer"
              onClick={() => {
                setEdit(true);
              }}
            >
              Chỉnh sửa thông tin
              <SquarePen size={20} className="" />
            </div>
          </div>
        )}

        {edit && (
          <div className="flex justify-end gap-5">
            <button
              type="submit"
              className="w-[20%] bg-[#D51F2A] text-white py-2 rounded"
              onClick={() => {
                setEdit(false);
              }}
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
        {theater === null && (
          <div className="flex justify-end">
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
