import { get } from "@/app/utils/request";

export const getOverview = async () => {
  const reuslt = await get("api/dashboard/overview");
  return reuslt;
};
export const getRevenueChart = async (from: string, to: string) => {
  const reuslt = await get(
    from && to
      ? `api/dashboard/revenue-chart?from=${from}&to=${to}`
      : `api/dashboard/revenue-chart`
  );
  return reuslt;
};
export const getTopTheater = async () => {
  const reuslt = await get(`api/dashboard/top-theaters`);
  return reuslt;
};
