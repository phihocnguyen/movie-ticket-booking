"use client";
import { useRouter } from "next/navigation";
import DashBoardAreaChart from "./components/DashBoardAreaChart";
import DashBoardPieChart from "./components/DashBoardPiechart";
import { Ticket, CircleDollarSign, Clapperboard, Theater } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getOwnerByUserId } from "../services/owner/foodService";
import { Owner } from "../admin/users/owners/page";
import { getOverviewByOwner } from "../services/owner/dashboardService";
import { showErrorMessage } from "../utils/alertHelper";

export default function DashBoard() {
  const router = useRouter();
  // const { userData } = useAuth();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [overview, setOverview] = useState<any>(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    // Có thể kiểm tra thêm role nếu cần
    if (!token) {
      router.replace("/login"); // đẩy về login nếu chưa đăng nhập
    }
  }, []);
  const fetchOwner = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    const res = await getOwnerByUserId(Number(userId));
    if (res && res.statusCode === 200 && res.data) {
      setOwner(res.data);
    } else {
      setOwner(null);
    }
  };
  const fetchData = async () => {
    try {
      if (!owner) return;
      const res = await getOverviewByOwner(owner.id);
      console.log("res", res);
      if (res && res.statusCode === 200 && res.data) {
        setOverview(res.data);
      } else {
        setOverview(null);
      }
    } catch (error) {
      showErrorMessage("Lỗi khi lấy danh sách food:" + error);
    }
  };
  useEffect(() => {
    fetchOwner();
  }, []);
  useEffect(() => {
    fetchData();
  }, [owner]);
  console.log("overview", overview);
  return (
    <div className="space-y-6">
      {/* Record Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 shadow rounded-2xl p-4 flex items-center gap-4">
          <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 p-3 rounded-full">
            <CircleDollarSign />
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Tổng doanh thu
            </div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white">
              {overview?.totalRevenue.toLocaleString()} VND
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 shadow rounded-2xl p-4 flex items-center gap-4">
          <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 p-3 rounded-full">
            <Ticket />
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Tổng vé đã bán
            </div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white">
              {overview?.totalTicketsSold.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow rounded-2xl p-4 flex items-center gap-4">
          <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 p-3 rounded-full">
            <Clapperboard />
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Tổng suất chiếu
            </div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white">
              {overview?.totalTheaters.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow rounded-2xl p-4 flex items-center gap-4">
          <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 p-3 rounded-full">
            <Theater />
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Tổng số rạp
            </div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white">
              {overview?.totalTheaters.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="flex flex-col lg:flex-row gap-5 w-full">
        <DashBoardAreaChart ownerId={owner?.id} />
        <DashBoardPieChart ownerId={owner?.id} />
      </div>
    </div>
  );
}
