import { get, del, patch, post } from "@/app/utils/request";

export const getAllFood = async () => {
  const reuslt = await get("api/theater-food/active");
  return reuslt;
};
export const deleteFood = async (id: number) => {
  const reuslt = await del(`api/theater-owner/${id}`);
  return reuslt;
};
export const editFood = async (values: any, id: number) => {
  const reuslt = await patch(values, `api/theater-owner/${id}`);
  return reuslt;
};
export const createFood = async (values: any) => {
  const reuslt = await post(values, `api/theater-owner/with-user`);
  return reuslt;
};

// export const getUserById = (id: string) => get(`/admin/users/${id}`);

// export const updateUser = (id: string, data: any) =>
//   put(data, `api/users/${id}`);

// export const deleteUser = (id: string) => del(`api/users/${id}`, true);
