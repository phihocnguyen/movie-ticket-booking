"use client";

import { useEffect, useState } from "react";
import { Staff } from "../page";
import { SquarePen } from "lucide-react";

interface StaffFormProps {
  staff?: Staff | null;
}

export default function StaffForm({ staff }: StaffFormProps) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    name: staff?.name ?? "",
    email: staff?.email ?? "",
    password: staff?.password ?? "",
    phone_number: staff?.phone_number ?? "",
    username: staff?.username ?? "",
    full_name: staff?.full_name ?? "",
    date_of_birth: staff?.date_of_birth ?? "",
  });

  // Khi prop `staff` thay đổi → reset chế độ xem (disable edit)
  useEffect(() => {
    setEdit(false);
  }, [staff]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: gọi API lưu thông tin `form`
  };

  // true  => input bị disable (chế độ xem)
  // false => cho phép nhập
  const disabled = staff !== null && !edit;

  return (
    <div className="max-h-[600px] overflow-y-auto pr-2">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Họ tên */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="name">
            Họ tên
          </label>
          <input
            id="name"
            name="name"
            placeholder="Họ tên"
            value={form.name}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={disabled}
          />
        </div>

        {/* Email */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={disabled}
          />
        </div>

        {/* Số điện thoại */}
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
            disabled={disabled}
          />
        </div>

        {/* Tên đăng nhập */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="username">
            Tên đăng nhập
          </label>
          <input
            id="username"
            name="username"
            placeholder="Tên đăng nhập"
            value={form.username}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={disabled}
          />
        </div>

        {/* Password (chỉ cho phép nhập khi thêm mới hoặc đang chỉnh sửa) */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="password">
            Mật khẩu
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required={staff === null}
            disabled={disabled}
          />
        </div>

        {/* Ngày sinh */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="date_of_birth">
            Ngày sinh
          </label>
          <input
            id="date_of_birth"
            name="date_of_birth"
            type="date"
            value={form.date_of_birth}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={disabled}
          />
        </div>

        {/* Khối nút hành động */}
        {staff && !edit && (
          <div className="flex gap-5 text-[15px] my-2">
            <button
              type="button"
              className="flex gap-2 border p-[4px] rounded-lg items-center bg-[#CCC6F4] hover:bg-[#b7b0ee] transition-colors"
              onClick={() => setEdit(true)}
            >
              Chỉnh sửa thông tin
              <SquarePen size={20} />
            </button>
          </div>
        )}

        {edit && (
          <div className="flex justify-end gap-5">
            <button
              type="button"
              className="w-[20%] bg-[#D51F2A] text-white py-2 rounded"
              onClick={() => setEdit(false)}
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

        {staff === null && (
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
