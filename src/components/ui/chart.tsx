// components/ui/chart.tsx
"use client";

import React, { ReactElement } from "react";
import {
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  TooltipProps,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { cn } from "@/lib/utils"; // helper gộp className, tự tạo nếu chưa có

// ----- Kiểu cấu hình màu/nhãn dùng chung -----
export type ChartConfig = Record<
  string,
  {
    label: string;
    color: string;
  }
>;

// ----- ChartContainer -----
interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  // kế thừa mọi props div (className, style,…)
  children: ReactElement; // luôn phải là 1 ReactElement hợp lệ
  config: ChartConfig;
}

export function ChartContainer({
  children,
  className,
  ...divProps
}: ChartContainerProps) {
  return (
    <div className={cn("w-full", className)} {...divProps}>
      <ResponsiveContainer width="100%" height={365}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

// ----- ChartTooltip -----
export function ChartTooltip(props: TooltipProps<ValueType, NameType>) {
  return <RechartsTooltip {...props} />;
}

// ----- ChartTooltipContent -----
interface ChartTooltipContentProps {
  indicator?: "line" | "dot";
  hideLabel?: boolean;
}
export function ChartTooltipContent({
  indicator,
  hideLabel,
}: ChartTooltipContentProps) {
  return (
    <div className="rounded bg-white p-2 text-xs shadow">
      {!hideLabel && <div className="font-medium">Visitors</div>}
      <div>{indicator === "line" ? "—" : "•"} Chi tiết tooltip</div>
    </div>
  );
}
