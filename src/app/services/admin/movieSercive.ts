import { get, del, patch, post, postFormData } from "@/app/utils/request";
import { resourceLimits } from "worker_threads";

export const getAllMovies = async () => {
  const reuslt = await get("api/movies");
  return reuslt;
};
export const deleteMovie = async (id: number) => {
  const reuslt = await del(`api/movies/${id}`);
  return reuslt;
};
export const editMovie = async (values: any, id: number) => {
  const reuslt = await patch(values, `api/movies/${id}`);
  return reuslt;
};
export const createMovie = async (values: any) => {
  const reuslt = await post(values, `api/movies`);
  return reuslt;
};
export const uploadFile = async (values: any) => {
  const reuslt = await postFormData(`api/upload`, values);
  return reuslt;
};
