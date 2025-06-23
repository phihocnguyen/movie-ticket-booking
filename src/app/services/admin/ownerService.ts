import { get, del, patch, post } from "@/app/utils/request";

export const getAllOwner = async () => {
  const reuslt = await get("api/theater-owner/active");
  return reuslt;
};
export const deleteOwner = async (id: number) => {
  const reuslt = await del(`api/theater-owner/${id}`);
  return reuslt;
};
export const editOwner = async (values: any, id: number) => {
  const reuslt = await patch(values, `api/theater-owner/${id}`);
  return reuslt;
};
export const createOwner = async (values: any) => {
  const reuslt = await post(values, `api/theater-owner/with-user`);
  return reuslt;
};

// export const getUserById = (id: string) => get(`/admin/users/${id}`);

// export const updateUser = (id: string, data: any) =>
//   put(data, `api/users/${id}`);

// export const deleteUser = (id: string) => del(`api/users/${id}`, true);
