import { get, post, patch, del } from "@/app/utils/request";

export const getAllRooms = async () => {
  return await get("api/screens");
};

export const createRoom = async (data: {
  screenName: string;
  screenType: "2D" | "3D";
  totalSeats: number;
  isActive: boolean;
  theaterId: number;
}) => {
  return await post(data, "api/screens");
};

export const editRoom = async (data: {
  screenName: string;
  screenType: "2D" | "3D";
  totalSeats: number;
  isActive: boolean;
  theaterId: number;
}, id: number) => {
  return await patch(data, `api/screens/${id}`);
};

export const deleteRoom = async (id: number) => {
  return await del(`api/screens/${id}`);
};

export const getRoomsByTheater = async (theaterId: number) => {
  return await get(`api/screens/theater/${theaterId}`);
}; 