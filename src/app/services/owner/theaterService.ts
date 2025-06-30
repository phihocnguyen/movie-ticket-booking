import { get, del, patch, post } from "@/app/utils/request";

export const getAllTheaters = async () => {
  const result = await get("api/theaters/active");
  return result;
};
export const deleteTheater = async (id: number) => {
  const result = await del(`api/theaters/${id}`);
  return result;
};
export const editTheater = async (values: any, id: number) => {
  const result = await patch(values, `api/theaters/${id}`);
  return result;
};
export const createTheater = async (values: any) => {
  const result = await post(values, `api/theaters`);
  return result;
};
export const getTheaterOwner = async (userId: number) => {
  const result = await get(`api/theater-owner/user/${userId}`);
  return result;
};
export const getTheatersByOwner = async (theaterOwnerId: number) => {
  return await get(
    `api/theaters/theater-owner?theaterOwnerId=${theaterOwnerId}`
  );
};
