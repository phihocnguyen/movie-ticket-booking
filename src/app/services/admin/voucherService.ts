import { get, del, patch, post } from "@/app/utils/request";

export const getAllVouchers = async () => {
  const reuslt = await get("api/voucher");
  return reuslt;
};
export const deleteVoucher = async (id: number) => {
  const reuslt = await del(`api/voucher/${id}`);
  return reuslt;
};
export const editVoucher = async (values: any, id: number) => {
  const reuslt = await patch(values, `api/voucher/${id}`);
  return reuslt;
};
export const createVoucher = async (values: any) => {
  const reuslt = await post(values, `api/voucher`);
  return reuslt;
};
