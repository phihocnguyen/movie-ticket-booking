"use client";

import { useEffect, useState } from "react";
import { Customer } from "../page";
import { SquarePen } from "lucide-react";
import dayjs from "dayjs";
import { editCustomer } from "@/app/services/admin/customerService";
import { showErrorMessage, showSuccess } from "@/app/utils/alertHelper";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

interface CustomerFormProps {
  customer?: Customer | null;
  reload: () => void;
  handleUpdatedCustomer: (dataUpdate: Customer) => void;
}

export default function CustomerForm({
  customer,
  reload,
  handleUpdatedCustomer,
}: CustomerFormProps) {
  const [edit, setEdit] = useState<boolean>(false);
  const [form, setForm] = useState({
    id: customer?.id,
    name: customer?.name || "",
    email: customer?.email || "",
    password: customer?.password || "",
    phoneNumber: customer?.phoneNumber || "",
    username: customer?.username || "",
    fullName: customer?.fullName || "",
    dateOfBirth: customer?.dateOfBirth || "",
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

  const validateData = (): boolean => {
    // 👉 convert từ YYYY-MM-DD thành đối tượng dayjs
    const birthday = dayjs(form.dateOfBirth, "YYYY-MM-DD");

    // 1. Ngày sinh phải < hôm nay
    if (!birthday.isValid() || birthday.isAfter(dayjs())) {
      showErrorMessage("Ngày sinh phải nhỏ hơn ngày hiện tại!");
      return false;
    }

    // 2. Tuổi phải ≥ 5
    if (birthday.isAfter(dayjs().subtract(15, "year"))) {
      showErrorMessage("Khách hàng phải ít nhất 15 tuổi!");
      return false;
    }

    // 3. Năm sinh > 1969
    if (birthday.year() <= 1930) {
      showErrorMessage("Năm sinh phải lớn hơn 1930!");
      return false;
    }

    // 4. Số điện thoại: 10 số & bắt đầu bằng 0
    if (!/^0\d{9}$/.test(form.phoneNumber.trim())) {
      showErrorMessage("Số điện thoại phải có 10 số và bắt đầu bằng 0!");
      return false;
    }

    // 5. Email phải có đuôi @gmail.com
    if (!/^[\w-.]+@gmail\.com$/i.test(form.email.trim())) {
      showErrorMessage("Email phải có dạng ...@gmail.com!");
      return false;
    }

    // 6. Tên đăng nhập không được rỗng
    if (!form.username.trim()) {
      showErrorMessage("Vui lòng nhập tên đăng nhập!");
      return false;
    }

    return true; // ✅ Tất cả kiểm tra đều qua
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateData()) return;
    if (form.id == null) {
      showErrorMessage("Không tìm thấy ID khách hàng!");
      return;
    }
    const payload: Record<string, any> = {
      name: form.name.trim(),
      email: form.email.trim(),
      phoneNumber: form.phoneNumber.trim(),
      username: form.username.trim(),
      fullName: form.fullName.trim(),
      // chuyển "YYYY-MM-DD" (từ input) → "DD/MM/YYYY" (backend)
      dateOfBirth: dayjs(form.dateOfBirth, "YYYY-MM-DD").format("YYYY-MM-DD"),
      // dateOfBirth: form.dateOfBirth,
    };

    // console.log("Check payload", payload);
    if (form.password && form.password.trim() !== "") {
      payload.password = form.password.trim();
    }

    try {
      const result = await editCustomer(payload, form.id);
      if (!result) {
        return;
      } else {
        showSuccess("Cập nhật thông tin khách hàng thành công");
        setEdit(false);
        setForm((prev) => ({
          ...prev,
          ...payload,
        }));
        reload();
        handleUpdatedCustomer({
          ...form,
          ...payload,
          id: form.id!,
        });
      }
    } catch (err) {
      showErrorMessage("Lỗi" + err);
    }
  };
  // console.log("Check form", form);
  useEffect(() => {
    setEdit(false);
  }, [customer]);
  const resetForm = () => {
    setForm({
      id: customer?.id,
      name: customer?.name || "",
      email: customer?.email || "",
      password: customer?.password || "",
      phoneNumber: customer?.phoneNumber || "",
      username: customer?.username || "",
      fullName: customer?.fullName || "",
      dateOfBirth: customer?.dateOfBirth || "",
    });
  };

  const normalizeDateInput = (value: string): string => {
    if (!value) return "";
    console.log("Check value", value);
    // Nếu chuỗi có dấu '/' -> DD/MM/YYYY
    if (value.includes("/")) {
      // console.log("chạy vào đây");

      const resultValue = dayjs(value, "DD/MM/YYYY").format("YYYY-MM-DD");
      console.log("chạy vào resultValue", resultValue);
      return resultValue;
    }

    // Nếu là YYYY-MM-DD (đã chuẩn) thì return nguyên
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
  };

  const handleCancel = () => {
    setEdit(false);
    resetForm();
  };

  return (
    <div className="max-h-[600px] overflow-y-auto pr-2">
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
            required
            disabled={customer !== null && !edit}
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
            disabled={customer !== null && !edit}
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
            required
            disabled={customer !== null && !edit}
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
            value={normalizeDateInput(form.dateOfBirth)}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={customer !== null && !edit}
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
            disabled={customer !== null && !edit}
          />
        </div>
        {/*password*/}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="text"
            value={form.password}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            // required
            disabled={customer !== null && !edit}
          />
        </div>

        {customer && !edit && (
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
    </div>
  );
}
