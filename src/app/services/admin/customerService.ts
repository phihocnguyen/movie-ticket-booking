import { get, put, del, patch } from "@/app/utils/request";

export const getAllCustomer = async () => {
  const reuslt = await get("api/user/getAllCustomer");
  return reuslt;
};
export const deleteCustomer = async (id: number) => {
  const reuslt = await del(`api/user/${id}`);
  return reuslt;
};
export const editCustomer = async (values: any, id: number) => {
  const reuslt = await patch(values, `api/user/${id}`);
  return reuslt;
};
