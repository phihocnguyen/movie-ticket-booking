import { get, del, patch, post } from "@/app/utils/request";

export const getByOwner = async (id: number) => {
  const reuslt = await get(`api/system-setting/${id}`);
  return reuslt;
};
export const getTheaterOwnerByUserId = async (id: number) => {
  const reuslt = await get(`api/theater-owner/user/${id}`);
  return reuslt;
};
export const deleteSystemSetting = async (id: number) => {
  const reuslt = await del(`api/system-setting/${id}`);
  return reuslt;
};
export const editSystemSetting = async (values: any, ownerId?: number) => {
  const url = ownerId
    ? `api/system-setting/update?ownerId=${ownerId}`
    : `api/system-setting/update`;

  const result = await patch(values, url);
  return result;
};
export const createSystemSetting = async (values: any, ownerId?: number) => {
  const url = ownerId
    ? `api/system-setting/create?ownerId=${ownerId}`
    : `api/system-setting/create`;

  const result = await post(values, url);
  return result;
};
