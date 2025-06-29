import { get, del, patch, post, postFormData } from "@/app/utils/request";

export const getAllBlogs = async () => {
  const reuslt = await get("api/blogs/getAll");
  return reuslt;
};
export const deleteBlog = async (id: number) => {
  const reuslt = await del(`api/blogs/delete/${id}`);
  return reuslt;
};
export const editBlog = async (values: any, id: number) => {
  const reuslt = await patch(values, `api/blogs/update/${id}`);
  return reuslt;
};
export const createBlog = async (values: any) => {
  const reuslt = await post(values, `api/blogs/create`);
  return reuslt;
};
export const uploadFile = async (values: any) => {
  const reuslt = await postFormData(`api/upload`, values);
  return reuslt;
};
