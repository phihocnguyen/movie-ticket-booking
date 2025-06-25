import { get, del, patch, post } from "@/app/utils/request";

export const getAllOwner = async () => {
  const result = await get("api/theater-owner/active");
  return result;
};
export const deleteOwner = async (id: number) => {
  const result = await del(`api/theater-owner/${id}`);
  return result;
};
export const editOwner = async (values: any, id: number) => {
  const result = await patch(values, `api/theater-owner/${id}`);
  return result;
};
export const createOwner = async (values: any) => {
  const result = await post(values, `api/theater-owner/with-user`);
  return result;
};

// export const getUserById = (id: string) => get(`/admin/users/${id}`);

// export const updateUser = (id: string, data: any) =>
//   put(data, `api/users/${id}`);

// export const deleteUser = (id: string) => del(`api/users/${id}`, true);
