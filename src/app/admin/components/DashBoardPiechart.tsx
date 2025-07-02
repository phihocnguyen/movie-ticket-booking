"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Cell, Tooltip } from "recharts"; // nhớ import Cell!

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { getTopTheater } from "@/app/services/admin/dashboardService";
import { showErrorMessage } from "@/app/utils/alertHelper";

export const description = "A pie chart with a label";

type TheaterData = {
  theaterName: string;
  revenue: number;
  fill: string; // sẽ thêm trường này để dùng cho màu sắc từng phần của Pie chart
};

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const chartConfig = {
  theaterName: { label: "Rạp", color: "" },
  revenue: { label: "Doanh thu", color: "var(--chart-1)" },
} satisfies ChartConfig;

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          padding: "12px 16px",
          minWidth: 180,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 13,
            marginBottom: 4,
            color: "#432DD7",
          }}
        >
          {data.theaterName}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#374151",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span>
            Doanh thu:{" "}
            <span style={{ color: "#432DD7", fontWeight: 600 }}>
              {data.revenue.toLocaleString()}đ
            </span>
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  name,
  value,
  ...rest
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Lấy data từ props
  const { payload } = rest;
  return (
    <text
      x={x}
      y={y}
      fill="#333"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {payload.theaterName}: {payload.revenue.toLocaleString()}đ
    </text>
  );
};

export default function DashBoardPieChart() {
  const [topTheater, setTopTheater] = useState<TheaterData[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await getTopTheater();
      if (res && res.statusCode === 200) {
        setTopTheater(
          res.data.map((item: any, idx: number) => ({
            ...item,
            fill: COLORS[idx % COLORS.length],
          }))
        );
      } else {
        showErrorMessage(res.message);
      }
    };
    fetchData();
  }, []);
  return (
    <Card className="flex flex-col w-1/3">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top 5 rạp có doanh thu cao nhất</CardTitle>
        {/* <CardDescription>January – June 2024</CardDescription> */}
      </CardHeader>
      <CardContent className="flex-1">
        {topTheater.length === 0 ? (
          <div className="flex items-center justify-center h-[250px] text-gray-500 text-sm">
            Chưa có rạp nào có doanh thu
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={topTheater}
                dataKey="revenue"
                nameKey="theaterName"
                outerRadius="85%"
              >
                {topTheater.map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={entry.fill}
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
