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
import { getTopFoodsByOwner } from "@/app/services/owner/dashboardService";
import { useEffect, useState } from "react";

export const description = "A pie chart with a label";

const chartConfig = {
  foodName: { label: "Món ăn", color: "" },
  totalQuantity: { label: "Số lượng", color: "var(--chart-1)" },
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
          {data.foodName}
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
            Số lượng:{" "}
            <span style={{ color: "#432DD7", fontWeight: 600 }}>
              {data.totalQuantity.toLocaleString()}
            </span>
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export default function DashBoardPieChart({ ownerId }: { ownerId?: number }) {
  const [topFoods, setTopFoods] = useState<any[]>([]);
  const fetchTopFoods = async () => {
    if (!ownerId) return;
    const res = await getTopFoodsByOwner(ownerId);
    if (res && res.statusCode === 200 && res.data) {
      // Gán màu cho từng phần tử
      const dataWithColor = res.data.map((item: any, idx: number) => ({
        ...item,
        fill: COLORS[idx % COLORS.length],
      }));
      setTopFoods(dataWithColor);
    }
  };
  useEffect(() => {
    fetchTopFoods();
  }, [ownerId]);
  console.log("topFoods", topFoods);
  return (
    <Card className="flex flex-col w-1/3">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top 3 món ăn bán chạy nhất</CardTitle>
        {/* <CardDescription>January – June 2024</CardDescription> */}
      </CardHeader>

      {/* ----- Chart ----- */}
      <CardContent className="flex-1">
        {topFoods.length === 0 ? (
          <div className="flex items-center justify-center h-[250px] text-gray-500 text-sm">
            Chưa có món ăn nào được bán
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={topFoods}
                dataKey="totalQuantity"
                nameKey="foodName"
                outerRadius="85%"
              >
                {topFoods.map((entry, idx) => (
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
