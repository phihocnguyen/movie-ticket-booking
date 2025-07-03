import { get } from "@/app/utils/request";

export const getOverviewByOwner = async (ownerId: number) => {
  const reuslt = await get(`api/dashboard/owner-overview/${ownerId}`);
  return reuslt;
};
export const getRevenueChartByOwner = async (
  ownerId: number,
  from: string,
  to: string
) => {
  const reuslt = await get(
    from && to
      ? `api/dashboard/revenue-chart/owner/${ownerId}?from=${from}&to=${to}`
      : `api/dashboard/revenue-chart/owner/${ownerId}`
  );
  return reuslt;
};
export const getTopFoodsByOwner = async (ownerId: number) => {
  const reuslt = await get(`api/dashboard/top-foods/owner/${ownerId}`);
  return reuslt;
};
