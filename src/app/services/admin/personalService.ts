import { get } from "@/app/utils/request";

export const DetailUser = async (id: number) => {
  const reuslt = await get(`api/user/${id}`);
  return reuslt;
};
