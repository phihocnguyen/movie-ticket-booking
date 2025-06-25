import { get, put, del, patch } from "@/app/utils/request";

export const getAllCustomer = async () => {
  const result = await get("api/user/getAllCustomer");
  return result;
};
export const deleteCustomer = async (id: number) => {
  const result = await del(`api/user/${id}`);
  return result;
};
export const editCustomer = async (values: any, id: number) => {
  const result = await patch(values, `api/user/${id}`);
  return result;
};
