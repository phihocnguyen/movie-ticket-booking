"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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
import { useState } from "react";
const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function DashBoardAreaChart() {
  const [range, setRange] = useState<{ from: Date | null; to: Date | null }>({
    from: new Date("2025-01-01"),
    to: new Date("2025-06-01"),
  });

  function isValidMonthFormat(value: string) {
    return dayjs(value, "YYYY - MM", true).isValid();
  }
  return (
    <Card className="w-2/3">
      <CardHeader>
        <CardTitle>Sơ đồ doanh thu</CardTitle>
        <CardDescription>
          <div className="flex flex-wrap items-center gap-3 text-sm min-h-[50px] mt-1">
            <span className="text-gray-700 dark:text-gray-300">Từ</span>
            <div className="relative z-10">
              <DatePicker
                selected={range.from}
                onChange={(date) => setRange({ ...range, from: date })}
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
                selected={range.to}
                onChange={(date) => setRange({ ...range, to: date })}
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
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="oklch(0.809 0.105 251.813)"
              stroke="#432DD7"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
