"use client";

import { useEffect, useState } from "react";
import { BlogPost } from "../page"; // <-- interface mới bạn khai ở page
import { SquarePen } from "lucide-react";
import dayjs from "dayjs";
import TextEditor from "@/app/admin/components/TextEditor";
import {
  createBlog,
  uploadFile,
  editBlog,
} from "@/app/services/admin/blogService";
import { showErrorMessage, showSuccess } from "@/app/utils/alertHelper";

/* ===== props ===== */
interface BlogFormProps {
  post?: BlogPost | null;
  reload: () => void;
  onClose: () => void;
}

/* ===== component ===== */
export default function BlogForm({ post, reload, onClose }: BlogFormProps) {
  /* preview & edit‑mode */
  const [postState, setPostState] = useState(post);
  const [edit, setEdit] = useState<boolean>(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    typeof post?.thumbnail === "string" ? post.thumbnail : null
  );
  const [loading, setLoading] = useState(false);

  /* form state (giữ nguyên cấu trúc cũ: label 20 % – input 80 %) */
  const [form, setForm] = useState({
    id: postState?.id ?? "",
    title: postState?.title ?? "",
    author: postState?.author ?? "",
    summary: postState?.summary ?? "",
    content: postState?.content ?? "",
    thumbnail: postState?.thumbnail ?? "",
    published: postState?.published ?? false,
    type: postState?.type ?? "",
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
  console.log("Check thumbnailPreview", thumbnailPreview);
  console.log("Check postState", postState);
  /* reset edit khi đổi post */
  useEffect(() => {
    setEdit(false);
    setPostState(post);
    // Set thumbnail preview from existing post data
    setThumbnailPreview(
      typeof post?.thumbnail === "string" ? post.thumbnail : null
    );
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

  const handleUpdate = async () => {
    setLoading(true);

    try {
      // Validate form
      if (!validateForm()) {
        setLoading(false);
        return;
      }

      let thumbnailUrl = "";

      // Upload thumbnail if exists
      if (form.thumbnail instanceof File) {
        const formData = new FormData();
        formData.append("file", form.thumbnail);

        const uploadRes = await uploadFile(formData);
        if (uploadRes && uploadRes.statusCode === 200) {
          thumbnailUrl = uploadRes.data;
        } else {
          showErrorMessage("Lỗi khi upload ảnh");
          setLoading(false);
          return;
        }
      }

      // Prepare blog data
      const blogData = {
        title: form.title.trim(),
        author: form.author.trim(),
        summary: form.summary.trim(),
        content: form.content.trim(),
        thumbnail: thumbnailUrl || form.thumbnail, // Use existing thumbnail if no new upload
        published: form.published,
        type: form.type.trim(),
      };

      // Update blog
      const res = await editBlog(blogData, post!.id);
      if (res && res.statusCode === 200) {
        showSuccess("Cập nhật bài viết thành công");
        reload();
        setEdit(false);
        setPostState(
          (prev) =>
            ({
              ...prev!,
              ...blogData,
            } as BlogPost)
        );
      } else {
        showErrorMessage("Có lỗi xảy ra khi cập nhật bài viết");
      }
    } catch (error) {
      showErrorMessage("Lỗi: " + error);
    } finally {
      setLoading(false);
    }
  };

  /* ===== VALIDATION ===== */
  const validateForm = (): boolean => {
    if (!form.title.trim()) {
      showErrorMessage("Vui lòng nhập tiêu đề bài viết");
      return false;
    }

    if (!form.author.trim()) {
      showErrorMessage("Vui lòng nhập tên tác giả");
      return false;
    }

    if (!form.type.trim()) {
      showErrorMessage("Vui lòng chọn loại bài viết");
      return false;
    }

    if (!form.summary.trim()) {
      showErrorMessage("Vui lòng nhập tóm tắt bài viết");
      return false;
    }

    if (!form.content.trim()) {
      showErrorMessage("Vui lòng nhập nội dung bài viết");
      return false;
    }

    if (!form.thumbnail) {
      showErrorMessage("Vui lòng chọn ảnh đại diện");
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    setLoading(true);

    try {
      // Validate form
      if (!validateForm()) {
        setLoading(false);
        return;
      }

      let thumbnailUrl = "";

      // Upload thumbnail if exists
      if (form.thumbnail instanceof File) {
        const formData = new FormData();
        formData.append("file", form.thumbnail);

        const uploadRes = await uploadFile(formData);
        console.log("Check uploadRes", uploadRes);
        if (uploadRes && uploadRes.statusCode === 200) {
          thumbnailUrl = uploadRes.data; // Adjust based on your API response
        } else {
          showErrorMessage("Lỗi khi upload ảnh");
          setLoading(false);
          return;
        }
      }

      // Prepare blog data
      const blogData = {
        title: form.title.trim(),
        author: form.author.trim(),
        summary: form.summary.trim(),
        content: form.content.trim(),
        thumbnail: thumbnailUrl,
        published: form.published,
        type: form.type.trim(),
      };

      // Create blog
      const res = await createBlog(blogData);
      if (res && res.statusCode === 200) {
        showSuccess("Thêm bài viết thành công");
        reload();
        onClose();
      } else {
        showErrorMessage("Có lỗi xảy ra khi tạo bài viết");
      }
    } catch (error) {
      showErrorMessage("Lỗi: " + error);
    } finally {
      setLoading(false);
    }
  };
  const resetForm = () => {
    setForm({
      id: postState?.id ?? "",
      title: postState?.title ?? "",
      author: postState?.author ?? "",
      summary: postState?.summary ?? "",
      content: postState?.content ?? "",
      thumbnail: postState?.thumbnail ?? "",
      published: postState?.published ?? false,
      type: postState?.type ?? "",
    });
    // Reset thumbnail preview to original
    setThumbnailPreview(
      typeof postState?.thumbnail === "string" ? postState.thumbnail : null
    );
  };
  const disable = post !== null && !edit;

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
          <label className="w-[20%] text-[15px]" htmlFor="type">
            Loại bài đăng
          </label>
          <input
            id="type"
            name="type"
            placeholder="Nhập loại bài đăng. EX: Điện ảnh, hệ thống"
            value={form.type}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px]
                       focus:ring-0 focus:border-[#1677ff] outline-none"
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
            disabled={disable}
          />
        </div>

        {/* content */}
        <div className="flex items-start gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="content">
            Nội dung
          </label>
          <div className="w-[80%]">
            <TextEditor
              value={form.content}
              onChange={(val) => setForm((prev) => ({ ...prev, content: val }))}
              disabled={disable}
              height={500}
            />
          </div>
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
              disabled={loading}
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
              className="w-[20%] bg-[#D51F2A] text-white py-2 rounded disabled:opacity-50"
              disabled={loading}
              onClick={() => {
                setEdit(false);
                resetForm();
              }}
            >
              Hủy
            </button>
            <button
              className="w-[20%] bg-[#432DD7] text-white py-2 rounded disabled:opacity-50"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </button>
          </div>
        )}

        {post === null && (
          <div className="flex justify-end">
            <button
              className="w-[20%] bg-[#432DD7] text-white py-2 rounded disabled:opacity-50"
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
