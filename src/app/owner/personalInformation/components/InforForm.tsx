"use client";

import { useEffect, useState } from "react";
import { SquarePen } from "lucide-react";
import { User } from "../page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs from "dayjs";
import { showErrorMessage, showSuccess } from "@/app/utils/alertHelper";
import { editCustomer } from "@/app/services/admin/customerService";
import { accessSync } from "fs";
interface InforFormProps {
  user?: User | null;
}

export default function InforForm({ user }: InforFormProps) {
  const [edit, setEdit] = useState<boolean>(false);
  const [userState, setUserState] = useState(user);
  const [form, setForm] = useState({
    id: user?.id,
    name: user?.name || "",
    email: user?.email || "",
    password: user?.password || "",
    phoneNumber: user?.phoneNumber || "",
    username: user?.username || "",
    fullName: user?.fullName || "",
    dateOfBirth:
      dayjs(user?.dateOfBirth, "DD/MM/YYYY").format("YYYY-MM-DD") ?? "",
  });
  // console.log("Check form", form);
  // console.log("Check user xxx", user);
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
  const validateData = (): boolean => {
    const { fullName, email, phoneNumber, username, password, dateOfBirth } =
      form;

    // 1. Trường rỗng
    if (!fullName.trim())
      return showErrorMessage("Vui lòng nhập họ tên!"), false;
    if (!email.trim()) return showErrorMessage("Vui lòng nhập email!"), false;
    if (!phoneNumber.trim())
      return showErrorMessage("Vui lòng nhập số điện thoại!"), false;
    if (!username.trim())
      return showErrorMessage("Vui lòng nhập tên đăng nhập!"), false;
    if (!dateOfBirth.trim())
      return showErrorMessage("Vui lòng chọn ngày sinh!"), false;

    // 2. Ngày sinh hợp lệ
    const birthday = dayjs(dateOfBirth, "YYYY-MM-DD");
    if (!birthday.isValid() || birthday.isAfter(dayjs()))
      return showErrorMessage("Ngày sinh phải nhỏ hơn ngày hiện tại!"), false;
    if (birthday.isAfter(dayjs().subtract(15, "year")))
      return showErrorMessage("Tuổi phải ít nhất 15!"), false;
    if (birthday.year() <= 1930)
      return showErrorMessage("Năm sinh phải lớn hơn 1930!"), false;

    // 3. Regex sđt & email
    if (!/^0\d{9}$/.test(phoneNumber.trim()))
      return (
        showErrorMessage("Số điện thoại phải có 10 số và bắt đầu bằng 0!"),
        false
      );
    if (!/^[\w-.]+@gmail\.com$/i.test(email.trim()))
      return showErrorMessage("Email phải có dạng ...@gmail.com!"), false;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateData()) return;

    if (!form.id) {
      showErrorMessage("Không tìm thấy ID người dùng!");
      return;
    }

    // Chuẩn hoá payload
    const payload: Record<string, any> = {
      name: form.fullName.trim(),
      email: form.email.trim(),
      phoneNumber: form.phoneNumber.trim(),
      username: form.username.trim(),
      fullName: form.fullName.trim(),
      dateOfBirth: dayjs(form.dateOfBirth, "YYYY-MM-DD").format("YYYY-MM-DD"),
    };

    // Chỉ thêm password khi người dùng nhập
    if (form.password.trim()) payload.password = form.password.trim();

    try {
      const ok = await editCustomer(payload, form.id); // API update
      if (!ok) return;

      showSuccess("Cập nhật thông tin thành công!");
      setEdit(false); // thoát chế độ chỉnh sửa
      setUserState((prev) => ({
        ...prev!,
        ...payload,
      }));
      setForm((prev) => ({ ...prev, ...payload })); // cập nhật UI
    } catch (err) {
      showErrorMessage("Lỗi khi cập nhật: " + (err as Error).message);
    }
  };

  const resetForm = () => {
    if (!userState) return;
    setForm({
      id: userState.id,
      name: userState.name ?? "",
      email: userState.email ?? "",
      password: userState.password ?? "",
      phoneNumber: userState.phoneNumber ?? "",
      username: userState.username ?? "",
      fullName: userState.fullName ?? "",
      dateOfBirth: userState.dateOfBirth
        ? userState.dateOfBirth.includes("/")
          ? dayjs(userState.dateOfBirth, "DD/MM/YYYY").format("YYYY-MM-DD")
          : userState.dateOfBirth
        : "",
    });
  };

  const handleCancel = () => {
    setEdit(false);
    resetForm();
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
              <label className="w-[20%] text-[15px]" htmlFor="fullName">
                Tên đầy đủ
              </label>
              <input
                id="fullName"
                name="fullName"
                placeholder="Tên đầy đủ"
                value={form.fullName}
                onChange={handleChange}
                className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
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
                disabled={!edit}
              />
            </div>

            {/* phone_number */}
            <div className="flex items-center gap-5">
              <label className="w-[20%] text-[15px]" htmlFor="phoneNumber">
                Số điện thoại
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Số điện thoại"
                value={form.phoneNumber}
                onChange={handleChange}
                className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
                disabled={!edit}
              />
            </div>

            {/* date_of_birth */}
            <div className="flex items-center gap-5">
              <label className="w-[20%] text-[15px]" htmlFor="dateOfBirth">
                Ngày sinh
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange}
                className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
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
        </CardContent>
      </Card>
    </div>
  );
}
