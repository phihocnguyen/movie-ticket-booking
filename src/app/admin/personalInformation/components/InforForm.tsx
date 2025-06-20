"use client";

import { useEffect, useState } from "react";
import { SquarePen } from "lucide-react";
import { User } from "../page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InforForm() {
  const [edit, setEdit] = useState<boolean>(false);
  //   const [form, setForm] = useState({
  //     name: customer?.name || "",
  //     email: customer?.email || "",
  //     password: customer?.password || "",
  //     phone_number: customer?.phone_number || "",
  //     username: customer?.username || "",
  //     full_name: customer?.full_name || "",
  //     date_of_birth: customer?.date_of_birth || "",
  //   });
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    username: "",
    full_name: "",
    date_of_birth: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // onSubmit(form);
  };

  //   useEffect(() => {
  //     setEdit(false);
  //   }, [customer]);

  return (
    <div className="container mx-auto max-w-4xl">
      <Card className="shadow-xl rounded-2xl p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Thông tin cá nhân
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* full_name */}
            <div className="flex items-center gap-5">
              <label className="w-[20%] text-[15px]" htmlFor="full_name">
                Tên đầy đủ
              </label>
              <input
                id="full_name"
                name="full_name"
                placeholder="Tên đầy đủ"
                value={form.full_name}
                onChange={handleChange}
                className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
                required
                disabled={!edit}
              />
            </div>
            {/* email */}
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
                className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
                required
                disabled={!edit}
              />
            </div>

            {/* phone_number */}
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
                disabled={!edit}
              />
            </div>

            {/* date_of_birth */}
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
                disabled={!edit}
              />
            </div>
            {/*user name*/}
            <div className="flex items-center gap-5">
              <label className="w-[20%] text-[15px]" htmlFor="username">
                Tên đăng nhập
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
                required
                disabled={!edit}
              />
            </div>

            {!edit && (
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

            {/* submit button */}
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
