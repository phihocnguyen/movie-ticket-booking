import { get, del, patch, post } from "@/app/utils/request";

export const getAllFoodByOwner = async (ownerId: number) => {
  const reuslt = await get(`api/theater-food/user/${ownerId}`);
  return reuslt;
};
export const getOwnerByUserId = async (userId: number) => {
  const reuslt = await get(`api/theater-owner/user/${userId}`);
  return reuslt;
};
export const deleteFood = async (id: number) => {
  const reuslt = await del(`api/theater-food/${id}`);
  return reuslt;
};
export const editFood = async (values: any, id: number) => {
  const reuslt = await patch(values, `api/theater-food/${id}`);
  return reuslt;
};
export const createFood = async (values: any) => {
  const reuslt = await post(values, `api/theater-food`);
  return reuslt;
};
