"use client";

import { useEffect, useState } from "react";
import { Movie } from "../page";
import { SquarePen } from "lucide-react";
interface MovieFormProps {
  movie?: Movie | null;
}
export default function MovieForm({ movie }: MovieFormProps) {
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [backdropPreview, setBackdropPreview] = useState<string | null>(null);
  const [trailerPreview, setTrailerPreview] = useState<string | null>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [form, setForm] = useState({
    title: movie?.title,
    title_vi: movie?.title_vi,
    description: movie?.description,
    duration: movie?.duration,
    language: movie?.language,
    genre: movie?.genre,
    release_date: movie?.release_date,
    poster_url: movie?.poster_url,
    backdrop_url: movie?.backdrop_url,
    trailer_url: movie?.trailer_url,
    director: movie?.director,
    actor: movie?.actor,
    rating: movie?.rating,
    country: movie?.country,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // onSubmit(form);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);

      setForm((prev) => ({
        ...prev,
        [name]: file,
      }));

      if (name === "poster_url") setPosterPreview(previewUrl);
      if (name === "backdrop_url") setBackdropPreview(previewUrl);
      if (name === "trailer_url") setTrailerPreview(previewUrl);
    }
  };
  useEffect(() => {
    setEdit(false);
  }, [movie]);
  return (
    <div className="max-h-[600px] overflow-y-auto pr-2">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* title */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="title">
            Tên phim
          </label>
          <input
            id="title"
            name="title"
            placeholder="Tên phim"
            value={form.title}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={!edit}
          />
        </div>

        {/* title_vi */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="title_vi">
            Tên phim (TV)
          </label>
          <input
            id="title_vi"
            name="title_vi"
            placeholder="Tên phim tiếng Việt"
            value={form.title_vi}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={!edit}
          />
        </div>

        {/* description */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="description">
            Mô tả
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Mô tả phim"
            value={form.description}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] resize-none focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={!edit}
          />
        </div>

        {/* duration */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="duration">
            Thời lượng (phút)
          </label>
          <input
            id="duration"
            name="duration"
            type="number"
            placeholder="Thời lượng"
            value={form.duration}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={!edit}
          />
        </div>

        {/* language */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="language">
            Ngôn ngữ
          </label>
          <input
            id="language"
            name="language"
            placeholder="Ngôn ngữ"
            value={form.language}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={!edit}
          />
        </div>

        {/* genre */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="genre">
            Thể loại
          </label>
          <input
            id="genre"
            name="genre"
            placeholder="Thể loại"
            value={form.genre}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={!edit}
          />
        </div>

        {/* release_date */}
        <div className="flex  items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="release_date">
            Ngày phát hành
          </label>
          <input
            id="release_date"
            name="release_date"
            type="date"
            value={form.release_date}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={!edit}
          />
        </div>

        {/* poster_url */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-5 w-full">
            <label className="w-[20%] text-[15px]" htmlFor="poster_url">
              Poster URL
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="poster_url"
              name="poster_url"
              placeholder="URL poster"
              className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
              required
              disabled={!edit}
            />
          </div>
          <div className="flex items-center justify-end w-full">
            <div className="w-[calc(80%-20px)] flex justify-start">
              {posterPreview && (
                <img
                  src={posterPreview}
                  alt="Poster Preview"
                  className="h-[150px] w-auto rounded-lg object-cover p-1 border w-max-[400px]"
                />
              )}
            </div>
          </div>
        </div>

        {/* backdrop_url */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-5 w-full">
            <label className="w-[20%] text-[15px]" htmlFor="backdrop_url">
              Backdrop URL
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="backdrop_url"
              name="backdrop_url"
              placeholder="URL backdrop"
              className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
              required
              disabled={!edit}
            />
          </div>
          <div className="flex items-center justify-end w-full">
            <div className="w-[calc(80%-20px)] flex justify-start">
              {backdropPreview && (
                <img
                  src={backdropPreview}
                  alt="Poster Preview"
                  className="h-[150px] w-auto rounded-lg object-cover p-1 border w-max-[400px]"
                />
              )}
            </div>
          </div>
        </div>

        {/* trailer_url */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-5 w-full">
            <label className="w-[20%] text-[15px]" htmlFor="trailer_url">
              Trailer URL
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              id="trailer_url"
              name="trailer_url"
              placeholder="URL trailer"
              className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
              required
              disabled={!edit}
            />
          </div>
          <div className="flex items-center justify-end w-full">
            <div className="w-[calc(80%-20px)] flex justify-start">
              {trailerPreview && (
                <video
                  controls
                  src={trailerPreview}
                  className="h-[150px] w-auto rounded-lg object-cover p-1 border w-max-[400px]"
                />
              )}
            </div>
          </div>
        </div>

        {/* director */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="director">
            Đạo diễn
          </label>
          <input
            id="director"
            name="director"
            placeholder="Đạo diễn"
            value={form.director}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={!edit}
          />
        </div>

        {/* actor */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="actor">
            Diễn viên
          </label>
          <input
            id="actor"
            name="actor"
            placeholder="Diễn viên chính"
            value={form.actor}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={!edit}
          />
        </div>

        {/* rating */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="rating">
            Điểm đánh giá
          </label>
          <input
            id="rating"
            name="rating"
            type="number"
            min={0}
            max={10}
            step={0.1}
            placeholder="Điểm đánh giá"
            value={form.rating}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={!edit}
          />
        </div>

        {/* country */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="country">
            Quốc gia
          </label>
          <input
            id="country"
            name="country"
            placeholder="Quốc gia"
            value={form.country}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            required
            disabled={!edit}
          />
        </div>
        {movie && !edit && (
          <div className="flex gap-5 text-[15px] my-2">
            <div
              className="flex gap-5 border p-[4px] rounded-lg items-center  bg-[#CCC6F4] cursor-pointer"
              onClick={() => {
                setEdit(true);
              }}
            >
              Chỉnh sửa thông tin
              <SquarePen size={20} className="" />
            </div>
          </div>
        )}

        {/* submit button */}
        {edit && (
          <div className="flex justify-end gap-5">
            <button
              type="submit"
              className="w-[20%] bg-[#D51F2A] text-white py-2 rounded"
              onClick={() => {
                setEdit(false);
              }}
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
        {movie === null && (
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
