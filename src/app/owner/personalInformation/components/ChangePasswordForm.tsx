"use client";

import { useEffect, useState } from "react";
import { SquarePen } from "lucide-react";
import { User } from "../page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs from "dayjs";
import { showErrorMessage, showSuccess } from "@/app/utils/alertHelper";
import { editCustomer } from "@/app/services/admin/customerService";
import { useRouter } from "next/navigation";
interface ChangePasswordFormProps {
  user?: User | null;
}
export default function ChangePasswordForm({ user }: ChangePasswordFormProps) {
  const [edit, setEdit] = useState<boolean>(false);
  const [userState, setUserState] = useState(user);
  const router = useRouter();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const validate = (): boolean => {
    const { currentPassword, newPassword, confirmNewPassword } = form;

    if (!currentPassword.trim())
      return showErrorMessage("Vui lòng nhập mật khẩu hiện tại!"), false;

    if (!newPassword.trim())
      return showErrorMessage("Vui lòng nhập mật khẩu mới!"), false;

    if (newPassword.length < 6)
      return showErrorMessage("Mật khẩu mới phải ≥ 6 ký tự!"), false;

    if (newPassword !== confirmNewPassword)
      return showErrorMessage("Xác nhận mật khẩu không khớp!"), false;

    if (newPassword === currentPassword)
      return showErrorMessage("Mật khẩu mới phải khác mật khẩu cũ!"), false;

    return true;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (!user?.id) {
      showErrorMessage("Không tìm thấy ID người dùng!");
      return;
    }

    // Chuẩn hoá payload
    const payload: Record<string, any> = {
      password: form.newPassword.trim(),
    };
    console.log("Check payload", payload);
    try {
      const ok = await editCustomer(payload, user.id); // API update
      if (!ok) return;

      showSuccess("Đổi mật khẩu thành công!");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("fullName");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      setEdit(false); // thoát chế độ chỉnh sửa
      setForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      router.replace("/login");
    } catch (err) {
      showErrorMessage("Đổi mật khẩu thất bại: " + (err as Error).message);
    }
  };
  const handleCancel = () => {
    setEdit(false);
    setForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
  };
  return (
    <div className="container mx-auto max-w-4xl mt-5">
      <Card className="shadow-xl rounded-2xl p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Đổi mật khẩu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/*password*/}

            <div className="flex items-center gap-5">
              <label className="w-[20%] text-[15px]" htmlFor="currentPassword">
                Mật khẩu cũ
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={form.currentPassword}
                onChange={handleChange}
                className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
                required
                disabled={!edit}
              />
            </div>
            {/*new password*/}
            <div className="flex items-center gap-5">
              <label className="w-[20%] text-[15px]" htmlFor="newPassword">
                Mật khẩu mới
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={form.newPassword}
                onChange={handleChange}
                className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
                required
                disabled={!edit}
              />
            </div>
            {/*confirm password*/}
            <div className="flex items-center gap-5">
              <label
                className="w-[20%] text-[15px]"
                htmlFor="confirmNewPassword"
              >
                Xác thực mật khẩu
              </label>
              <input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type="password"
                value={form.confirmNewPassword}
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
