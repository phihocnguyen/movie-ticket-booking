"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { BarChart, Bar, Tooltip, ResponsiveContainer } from "recharts";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dayjs from "dayjs";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { showErrorMessage } from "@/app/utils/alertHelper";
import { getRevenueChartByOwner } from "@/app/services/owner/dashboardService";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          boxShadow: "0 4px 16px rgba(67,45,215,0.08)",
          padding: "14px 18px",
          minWidth: 180,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 13,
            marginBottom: 6,
            color: "#432DD7",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          Tháng: {dayjs(label).format("MM/YYYY")}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#374151",
            marginTop: 2,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span>
            Doanh thu:{" "}
            <span style={{ color: "#432DD7", fontWeight: 600 }}>
              {payload[0].value.toLocaleString()}đ
            </span>
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function DashBoardAreaChart({ ownerId }: { ownerId?: number }) {
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);

  const getDefaultRange = () => {
    const end = dayjs();
    const start = dayjs().subtract(5, "month");
    return { start: start.toDate(), end: end.toDate() };
  };

  const [revenueChart, setRevenueChart] = useState<any[]>([]);

  const handleFilter = async () => {
    if (!ownerId) return;
    if (!from || !to) {
      showErrorMessage(
        "Vui lòng chọn đầy đủ cả ngày bắt đầu và ngày kết thúc!"
      );
      return;
    }
    const fromMonth = dayjs(from).format("YYYY-MM");
    const toMonth = dayjs(to).format("YYYY-MM");
    const res = await getRevenueChartByOwner(ownerId, fromMonth, toMonth);
    if (res && res.statusCode === 200) {
      setRevenueChart(res.data || []);
    } else {
      setRevenueChart([]);
      showErrorMessage(res.message);
    }
  };

  useEffect(() => {
    if (!ownerId) return;
    const { start, end } = getDefaultRange();
    setFrom(start);
    setTo(end);
    fetchData(start, end);
    // eslint-disable-next-line
  }, [ownerId]);

  const fetchData = async (fromDate: Date, toDate: Date) => {
    if (!ownerId) return;
    const fromMonth = dayjs(fromDate).format("YYYY-MM");
    const toMonth = dayjs(toDate).format("YYYY-MM");
    const res = await getRevenueChartByOwner(ownerId, fromMonth, toMonth);
    if (res && res.statusCode === 200) {
      setRevenueChart(res.data || []);
    } else {
      setRevenueChart([]);
      showErrorMessage(res.message);
    }
  };
  return (
    <Card className="w-2/3">
      <CardHeader>
        <CardTitle>Sơ đồ doanh thu</CardTitle>
        <CardDescription>
          <div className="flex flex-wrap items-center gap-3 text-sm min-h-[50px] mt-1">
            <span className="text-gray-700 dark:text-gray-300">Từ</span>
            <div className="relative z-10">
              <DatePicker
                selected={from}
                onChange={(date) => setFrom(date)}
                dateFormat="yyyy - MM"
                showMonthYearPicker
                placeholderText="YYYY - MM"
                portalId="root-portal" // vẫn giữ để popup không ảnh hưởng layout
                popperPlacement="bottom-start" // chỉ định vị trí popup
                className="border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2
             focus:outline-none focus:border-blue-500 focus:ring-0
             transition-none shadow-none"
              />
            </div>
            <span className="text-gray-700 dark:text-gray-300">đến</span>
            <div className="relative z-10">
              <DatePicker
                selected={to}
                onChange={(date) => setTo(date)}
                dateFormat="yyyy - MM"
                showMonthYearPicker
                placeholderText="YYYY - MM"
                popperPlacement="bottom-start"
                portalId="root-portal"
                className="border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2
                 focus:outline-none focus:border-blue-500 focus:ring-0
                 transition-none shadow-none"
              />
            </div>
            <button
              onClick={handleFilter}
              // disabled={!from || !to}
              className="ml-2 px-3 py-1 bg-[#432DD7] text-white rounded"
            >
              Lọc
            </button>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {revenueChart && revenueChart.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickFormatter={(month) => dayjs(month).format("MM/YYYY")}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#432DD7"
                fill="#a5b4fc"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-500 text-sm">
            Đang tải dữ liệu hoặc chưa có dữ liệu
          </div>
        )}
      </CardContent>
    </Card>
  );
}
