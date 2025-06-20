import { get, post, put, del } from "@/app/utils/request";

export const getAllUsers = () => get("api/users");

// export const getUserById = (id: string) => get(`/admin/users/${id}`);

export const updateUser = (id: string, data: any) =>
  put(data, `api/users/${id}`);

export const deleteUser = (id: string) => del(`api/users/${id}`, true);
