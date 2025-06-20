import { get, post, put, del } from "@/app/utils/request";

export const getAllStaff = async () => {
  const reuslt = await get("api/staff/active");
  return reuslt;
};
// export const getUserById = (id: string) => get(`/admin/users/${id}`);

// export const updateUser = (id: string, data: any) =>
//   put(data, `api/users/${id}`);

// export const deleteUser = (id: string) => del(`api/users/${id}`, true);
