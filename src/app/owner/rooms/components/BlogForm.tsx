"use client";

import { useEffect, useState } from "react";
import { BlogPost } from "../page"; // <-- interface mới bạn khai ở page
import { SquarePen } from "lucide-react";
import dayjs from "dayjs";

/* ===== props ===== */
interface BlogFormProps {
  post?: BlogPost | null;
}

/* ===== component ===== */
export default function BlogForm({ post }: BlogFormProps) {
  /* preview & edit‑mode */
  const [edit, setEdit] = useState<boolean>(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  /* form state (giữ nguyên cấu trúc cũ: label 20 % – input 80 %) */
  const [form, setForm] = useState({
    id: post?.id ?? "",
    title: post?.title ?? "",
    author: post?.author ?? "",
    created_at: post?.created_at ?? "",
    summary: post?.summary ?? "",
    content: post?.content ?? "",
    thumbnail: post?.thumbnail ?? "",
    published: post?.published ?? false,
    type: post?.type ?? "",
  });

  /* ===== handlers ===== */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : name === "created_at" ? value : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: gọi API lưu blog post
  };
  console.log("Check publish", post);
  /* reset edit khi đổi post */
  useEffect(() => {
    setEdit(false);
  }, [post]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const thumbnailPreview = URL.createObjectURL(file);

      setForm((prev) => ({
        ...prev,
        [name]: file,
      }));

      if (name === "thumbnail") setThumbnailPreview(thumbnailPreview);
    }
  };
  const disable = post !== null && !edit;
  /* ===== UI ===== */
  return (
    <div className="max-h-[600px] overflow-y-auto pr-2">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* title */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="title">
            Tiêu đề
          </label>
          <input
            id="title"
            name="title"
            placeholder="Tiêu đề bài viết"
            value={form.title}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px]
                       focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={disable}
          />
        </div>

        {/* author */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="author">
            Tác giả
          </label>
          <input
            id="author"
            name="author"
            placeholder="Tên tác giả"
            value={form.author}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px]
                       focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={disable}
          />
        </div>
        {/* thumbnail */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-5 w-full">
            <label className="w-[20%] text-[15px]" htmlFor="thumbnail">
              Ảnh đại diện
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="thumbnail"
              name="thumbnail"
              placeholder="Ảnh đại diện"
              className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
              required
              disabled={disable}
            />
          </div>
          <div className="flex items-center justify-end w-full">
            <div className="w-[calc(80%-20px)] flex justify-start">
              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  alt="Poster Preview"
                  className="h-[150px] w-auto rounded-lg object-cover p-1 border w-max-[400px]"
                />
              )}
            </div>
          </div>
        </div>
        {/* loại */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="slug">
            Loại bài đăng
          </label>
          <input
            id="slug"
            name="slug"
            placeholder="Nhập loại bài đăng. EX: Điện ảnh, hệ thống"
            value={form.type}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px]
                       focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={disable}
          />
        </div>

        {/* summary */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="summary">
            Tóm tắt
          </label>
          <textarea
            id="summary"
            name="summary"
            placeholder="Mô tả ngắn gọn"
            value={form.summary}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] resize-none text-[15px]
                       focus:ring-0 focus:border-[#1677ff] outline-none"
            rows={3}
            required
            disabled={disable}
          />
        </div>

        {/* content */}
        <div className="flex items-start gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="content">
            Nội dung
          </label>
          <textarea
            id="content"
            name="content"
            placeholder="Nội dung markdown / HTML"
            value={form.content}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] resize-y text-[15px]
                       focus:ring-0 focus:border-[#1677ff] outline-none"
            rows={6}
            required
            disabled={disable}
          />
        </div>

        {/* created_at  */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="created_at">
            Ngày đăng
          </label>
          <input
            id="created_at"
            name="created_at"
            type="date"
            value={dayjs(form.created_at).format("YYYY-MM-DD")}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px]
                       focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={disable}
          />
        </div>
        {/* published */}
        <div className="flex items-center gap-5 ">
          <label className="ml-auto flex items-center gap-2 text-[15px] cursor-pointer">
            <input
              type="checkbox"
              name="published"
              checked={form.published}
              onChange={handleChange}
              disabled={disable}
              className="accent-[#432DD7] w-4 h-4 cursor-pointer"
            />
            Đã xuất bản
          </label>
        </div>

        {/* ----- EDIT / SAVE BUTTONS ----- */}
        {post && !edit && (
          <div className="flex gap-5 text-[15px] my-2">
            <button
              type="button"
              onClick={() => setEdit(true)}
              className="flex gap-2 items-center border p-[6px] rounded-lg bg-[#CCC6F4]"
            >
              Chỉnh sửa thông tin
              <SquarePen size={18} />
            </button>
          </div>
        )}

        {edit && (
          <div className="flex justify-end gap-5">
            <button
              type="button"
              onClick={() => setEdit(false)}
              className="w-[20%] bg-[#D51F2A] text-white py-2 rounded"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="w-[20%] bg-[#432DD7] text-white py-2 rounded"
            >
              Xác nhận
            </button>
          </div>
        )}

        {post === null && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="w-[20%] bg-[#432DD7] text-white py-2 rounded"
            >
              Xác nhận
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
