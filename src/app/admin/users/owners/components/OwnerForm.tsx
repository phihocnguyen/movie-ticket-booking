"use client";

import { useEffect, useState } from "react";
import { Owner } from "../page";
import { SquarePen } from "lucide-react";
import { showErrorMessage, showSuccess } from "@/app/utils/alertHelper";
import dayjs from "dayjs";
import { createOwner } from "@/app/services/admin/ownerService";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { editCustomer } from "@/app/services/admin/customerService";
dayjs.extend(customParseFormat);

interface OwnerFormProps {
  owner?: Owner | null;
  reload: () => void;
  setShowModal: (data: boolean) => void;
  handleUpdatedOwner: (dataUpdate: Owner) => void;
}

export default function OwnerForm({
  owner,
  reload,
  setShowModal,
  handleUpdatedOwner,
}: OwnerFormProps) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    id: owner?.id,
    user: {
      id: owner?.user.id,
      name: owner?.user.name ?? "",
      email: owner?.user.email ?? "",
      password: owner?.user.password ?? "",
      phoneNumber: owner?.user.phoneNumber ?? "",
      username: owner?.user.username ?? "",
      fullName: owner?.user.fullName ?? "",
      dateOfBirth:
        dayjs(owner?.user.dateOfBirth, "DD/MM/YYYY").format("YYYY-MM-DD") ?? "",
      role: owner?.user.role,
    },
  });

  // Khi prop `staff` thay đổi → reset chế độ xem (disable edit)
  useEffect(() => {
    setEdit(false);
  }, [owner]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: gọi API lưu thông tin `form`
  };
  const normalizeDateInput = (value: string): string => {
    if (!value) return "";
    console.log("Check value", value);
    // Nếu chuỗi có dấu '/' -> DD/MM/YYYY
    if (value.includes("/")) {
      // console.log("chạy vào đây");

      const resultValue = dayjs(value, "DD/MM/YYYY").format("YYYY-MM-DD");
      // console.log("chạy vào resultValue", resultValue);
      return resultValue;
    }

    // Nếu là YYYY-MM-DD (đã chuẩn) thì return nguyên
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
  };
  const validateData = (): boolean => {
    const { fullName, email, phoneNumber, username, password, dateOfBirth } =
      form.user;

    // Kiểm tra rỗng (trừ password nếu đang cập nhật)
    if (!fullName.trim()) {
      showErrorMessage("Vui lòng nhập họ tên!");
      return false;
    }
    if (!email.trim()) {
      showErrorMessage("Vui lòng nhập email!");
      return false;
    }
    if (!phoneNumber.trim()) {
      showErrorMessage("Vui lòng nhập số điện thoại!");
      return false;
    }
    if (!username.trim()) {
      showErrorMessage("Vui lòng nhập tên đăng nhập!");
      return false;
    }
    if (owner === null && !password.trim()) {
      showErrorMessage("Vui lòng nhập mật khẩu!");
      return false;
    }
    if (!dateOfBirth.trim()) {
      showErrorMessage("Vui lòng chọn ngày sinh!");
      return false;
    }

    // Kiểm tra logic: ngày sinh
    const birthday = dayjs(dateOfBirth, "YYYY-MM-DD");
    if (!birthday.isValid() || birthday.isAfter(dayjs())) {
      showErrorMessage("Ngày sinh phải nhỏ hơn ngày hiện tại!");
      return false;
    }
    if (birthday.isAfter(dayjs().subtract(15, "year"))) {
      showErrorMessage("Khách hàng phải ít nhất 15 tuổi!");
      return false;
    }
    if (birthday.year() <= 1930) {
      showErrorMessage("Năm sinh phải lớn hơn 1930!");
      return false;
    }

    // Kiểm tra định dạng sđt
    if (!/^0\d{9}$/.test(phoneNumber.trim())) {
      showErrorMessage("Số điện thoại phải có 10 số và bắt đầu bằng 0!");
      return false;
    }

    // Kiểm tra định dạng email
    if (!/^[\w-.]+@gmail\.com$/i.test(email.trim())) {
      showErrorMessage("Email phải có dạng ...@gmail.com!");
      return false;
    }

    return true; // ✅ OK hết
  };

  const handleCreate = async () => {
    if (!validateData()) return;
    const payload: Record<string, any> = {
      user: {
        name: form.user.fullName.trim(),
        email: form.user.email.trim(),
        phoneNumber: form.user.phoneNumber.trim(),
        username: form.user.username.trim(),
        role: "THEATER_OWNER",
        password: form.user.password.trim(),
        fullName: form.user.fullName.trim(),
        dateOfBirth: dayjs(form.user.dateOfBirth, "YYYY-MM-DD").format(
          "YYYY-MM-DD"
        ),
      },
    };

    console.log("Check payload", payload);

    try {
      const result = await createOwner(payload);
      if (!result) {
        return;
      } else {
        showSuccess("Thêm chủ rạp thành công");
        reload();
        setShowModal(false);
      }
    } catch (err) {
      showErrorMessage("Lỗi" + err);
    }
  };
  const handleUpdate = async () => {
    if (!validateData()) return;
    if (form.id == null || form.user.id == null) {
      showErrorMessage("Không tìm thấy ID chủ rạp!");
      return;
    }
    const payload: Record<string, any> = {
      name: form.user.name.trim(),
      email: form.user.email.trim(),
      phoneNumber: form.user.phoneNumber.trim(),
      username: form.user.username.trim(),
      fullName: form.user.fullName.trim(),
      // chuyển "YYYY-MM-DD" (từ input) → "DD/MM/YYYY" (backend)
      dateOfBirth: dayjs(form.user.dateOfBirth, "YYYY-MM-DD").format(
        "YYYY-MM-DD"
      ),
      // dateOfBirth: form.dateOfBirth,
    };

    // console.log("Check payload", payload);
    if (form.user.password && form.user.password.trim() !== "") {
      payload.password = form.user.password.trim();
    }

    try {
      const result = await editCustomer(payload, form.user.id);
      if (!result) {
        return;
      } else {
        showSuccess("Cập nhật thông tin chủ rạp thành công");
        setEdit(false);
        setForm((prev) => ({
          ...prev,
          ...payload,
        }));
        reload();
        handleUpdatedOwner({
          id: form.id!, // chắc chắn có
          user: {
            ...form.user,
            ...payload,
            role: form.user.role!,
            id: form.user.id!, // ✅ khẳng định không undefined
          },
        });
      }
    } catch (err) {
      showErrorMessage("Lỗi" + err);
    }
  };
  console.log("Check form", form);
  const resetForm = () => {
    setForm({
      id: owner?.id,
      user: {
        id: owner?.user.id,
        name: owner?.user.name ?? "",
        email: owner?.user.email ?? "",
        password: owner?.user.password ?? "",
        phoneNumber: owner?.user.phoneNumber ?? "",
        username: owner?.user.username ?? "",
        fullName: owner?.user.fullName ?? "",
        dateOfBirth: owner?.user.dateOfBirth
          ? owner.user.dateOfBirth.includes("/")
            ? dayjs(owner.user.dateOfBirth, "DD/MM/YYYY").format("YYYY-MM-DD")
            : owner.user.dateOfBirth
          : "",
        role: owner?.user.role,
      },
    });
  };
  const handleCancel = () => {
    setEdit(false);
    resetForm();
  };
  // true  => input bị disabls (chế độ xem)
  // false => cho phép nhập
  const disabled = owner !== null && !edit;

  return (
    <div className="max-h-[600px] overflow-y-auto pr-2">
      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3">
        {/* Họ tên */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="fullName">
            Họ tên
          </label>
          <input
            id="fullName"
            name="fullName"
            placeholder="Họ tên"
            value={form.user.fullName}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
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
            value={form.user.email}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={disabled}
          />
        </div>

        {/* Số điện thoại */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="phoneNumber">
            Số điện thoại
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Số điện thoại"
            value={form.user.phoneNumber}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
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
            value={form.user.username}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={disabled}
          />
        </div>

        {/* Ngày sinh */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="dateOfBirth">
            Ngày sinh
          </label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={normalizeDateInput(form.user.dateOfBirth)}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
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
            value={form.user.password}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={disabled}
          />
        </div>
        {/* Khối nút hành động */}
        {owner && !edit && (
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
              onClick={handleCancel}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="w-[20%] bg-[#432DD7] text-white py-2 rounded"
              onClick={handleUpdate}
            >
              Xác nhận
            </button>
          </div>
        )}

        {owner === null && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="w-[20%] bg-[#432DD7] text-white py-2 rounded"
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
