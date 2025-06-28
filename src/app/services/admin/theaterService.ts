import { get, del, patch, post, getByEmail } from "@/app/utils/request";

export const getAllTheaters = async () => {
  const result = await get("api/theaters/active");
  return result;
};

export const deleteTheater = async (id: number) => {
  const result = await del(`api/theaters/${id}`);
  return result;
};

export const editTheater = async (values: any, id: number) => {
  const result = await patch(values, `api/theaters/${id}`);
  return result;
};

export const createTheater = async (values: any) => {
  const result = await post(values, `api/theaters`);
  return result;
};

export const getTheaterOwner = async (userId: number) => {
  const result = await get(`api/theater-owner/user/${userId}`);
  return result;
};

export const getTheatersByOwner = async (theaterOwnerId: number) => {
  return await get(
    `api/theaters/theater-owner?theaterOwnerId=${theaterOwnerId}`
  );
};
export const getShowtimeByTheater = async (theaterId: number) => {
  const result = await get(`api/showtimes/theater/${theaterId}`);
  return result;
};

export const SearchOwnerEmail = async (email: string) => {
  const result = await getByEmail(`api/theater-owner/search/${email}`);
  return result;
};
export const checkPhoneNumber = async (phone: string) => {
  const result = await get(`api/theaters/check-phone?phoneNumber=${phone}`);
  return result;
};
export const checkEmail = async (email: string) => {
  const result = await get(`api/theaters/check-email?email=${email}`);
  return result;
};
export const checkAddress = async (address: string, theaterOwnerId: number) => {
  const result = await get(
    `api/theaters/check-address?address=${address}&theaterOwnerId=${theaterOwnerId}`
  );
  return result;
};
