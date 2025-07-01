import { get, del, patch, post } from "@/app/utils/request";

export const getAllShowtime = async () => {
  const result = await get("api/showtimes/active");
  return result;
};
export const deleteShowtime = async (id: number) => {
  const result = await del(`api/showtimes/${id}`);
  return result;
};
export const editShowtime = async (values: any, id: number) => {
  const result = await patch(values, `api/showtimes/${id}`);
  return result;
};
export const createShowtime = async (values: any) => {
  const result = await post(values, `api/showtimes`);
  return result;
};
export const getAllMovies = async () => {
  const result = await get("api/movies");
  return result;
};
export const getShowtimeByScreen = async (screenId: number) => {
  const result = await get(`api/showtimes/screen/${screenId}`);
  return result;
};
export const getShowtimeByOwner = async (OwnerId: number) => {
  const result = await get(`api/showtimes/owner/${OwnerId}`);
  return result;
};
