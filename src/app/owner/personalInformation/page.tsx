"use client";

import { useEffect, useState } from "react";
import InforForm from "./components/InforForm";
import ChangePasswordForm from "./components/ChangePasswordForm";
import { useAuth } from "@/app/context/AuthContext";
import { DetailUser } from "@/app/services/admin/personalService";
import { showErrorMessage } from "@/app/utils/alertHelper";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
dayjs.extend(customParseFormat);

export interface User {
  id: number;
  name: string;
  email: string;
  password: string | null;
  phoneNumber: string;
  username: string;
  fullName: string;
  dateOfBirth: string;
}
export default function PersonalInfor() {
  const { userData } = useAuth(); // lấy thông tin đăng nhập
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // trạng thái tải dữ liệu

  useEffect(() => {
    const fetchUser = async () => {
      if (!userData?.id) return; // chờ tới khi có id

      try {
        const res = await DetailUser(userData.id);
        setUser(res?.data ?? null);
      } catch (err) {
        showErrorMessage("Lỗi khi lấy thông tin user: " + err);
      } finally {
        setLoading(false); // dừng loading
      }
    };

    fetchUser();
  }, [userData?.id]);

  /* ---------- UI ---------- */
  if (loading) return <p className="text-center">Đang tải thông tin…</p>;
  if (!user)
    return <p className="text-center text-red-500">Không tìm thấy user</p>;

  return (
    <div>
      <InforForm user={user} />
      <ChangePasswordForm user={user} />
    </div>
  );
}
