import { get, patch } from "@/app/utils/request";

export const getAllTicketByOwner = async (ownerId: number) => {
  const reuslt = await get(`api/bookings/owner/${ownerId}`);
  return reuslt;
};
export const editTicket = async (values: any, id: number) => {
  const result = await patch(values, `api/bookings/${id}`);
  return result;
};
