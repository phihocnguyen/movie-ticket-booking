"use client";

import { useEffect, useState } from "react";
import { Showtime } from "../page";
import { SquarePen } from "lucide-react";

interface ShowtimeFormProps {
  showtime?: Showtime | null;
}

export default function ShowtimeForm({ showtime }: ShowtimeFormProps) {
  const [edit, setEdit] = useState<boolean>(false);
  const [form, setForm] = useState({
    movieId: showtime?.movieId ?? 0,
    theaterId: showtime?.theaterId ?? 0,
    screenId: showtime?.screenId ?? 0,
    startTime: showtime?.startTime ?? "",
    endTime: showtime?.endTime ?? "",
    price: showtime?.price ?? 0,
    isActive: showtime?.isActive ?? true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // onSubmit(form);
  };

  useEffect(() => {
    setEdit(false);
  }, [showtime]);

  return (
    <div className="max-h-[600px] overflow-y-auto pr-2">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* movieId */}
        <div className="flex items-center gap-5">
          <label className="w-[30%] text-[15px]" htmlFor="movieId">
            ID Phim
          </label>
          <input
            id="movieId"
            name="movieId"
            type="number"
            placeholder="ID phim"
            value={form.movieId}
            onChange={handleChange}
            className="w-[70%] border px-2 py-1.5 rounded-[8px] text-[15px]"
            required
            disabled={showtime !== null && !edit}
          />
        </div>

        {/* theaterId */}
        <div className="flex items-center gap-5">
          <label className="w-[30%] text-[15px]" htmlFor="theaterId">
            ID Rạp
          </label>
          <input
            id="theaterId"
            name="theaterId"
            type="number"
            placeholder="ID rạp"
            value={form.theaterId}
            onChange={handleChange}
            className="w-[70%] border px-2 py-1.5 rounded-[8px] text-[15px]"
            required
            disabled={showtime !== null && !edit}
          />
        </div>

        {/* screenId */}
        <div className="flex items-center gap-5">
          <label className="w-[30%] text-[15px]" htmlFor="screenId">
            ID Phòng chiếu
          </label>
          <input
            id="screenId"
            name="screenId"
            type="number"
            placeholder="ID phòng chiếu"
            value={form.screenId}
            onChange={handleChange}
            className="w-[70%] border px-2 py-1.5 rounded-[8px] text-[15px]"
            required
            disabled={showtime !== null && !edit}
          />
        </div>

        {/* startTime */}
        <div className="flex items-center gap-5">
          <label className="w-[30%] text-[15px]" htmlFor="startTime">
            Bắt đầu chiếu
          </label>
          <input
            id="startTime"
            name="startTime"
            type="datetime-local"
            value={form.startTime}
            onChange={handleChange}
            className="w-[70%] border px-2 py-1.5 rounded-[8px] text-[15px]"
            required
            disabled={showtime !== null && !edit}
          />
        </div>

        {/* endTime */}
        <div className="flex items-center gap-5">
          <label className="w-[30%] text-[15px]" htmlFor="endTime">
            Kết thúc chiếu
          </label>
          <input
            id="endTime"
            name="endTime"
            type="datetime-local"
            value={form.endTime}
            onChange={handleChange}
            className="w-[70%] border px-2 py-1.5 rounded-[8px] text-[15px]"
            required
            disabled={showtime !== null && !edit}
          />
        </div>

        {/* price */}
        <div className="flex items-center gap-5">
          <label className="w-[30%] text-[15px]" htmlFor="price">
            Giá vé
          </label>
          <input
            id="price"
            name="price"
            type="number"
            placeholder="Giá vé"
            value={form.price}
            onChange={handleChange}
            className="w-[70%] border px-2 py-1.5 rounded-[8px] text-[15px]"
            required
            disabled={showtime !== null && !edit}
          />
        </div>

        {showtime && !edit && (
          <div className="flex gap-5 text-[15px] my-2">
            <div
              className="flex gap-5 border p-[4px] rounded-lg items-center bg-[#CCC6F4] cursor-pointer"
              onClick={() => {
                setEdit(true);
              }}
            >
              Chỉnh sửa thông tin
              <SquarePen size={20} className="" />
            </div>
          </div>
        )}

        {edit && (
          <div className="flex justify-end gap-5">
            <button
              type="button"
              className="w-[20%] bg-[#D51F2A] text-white py-2 rounded"
              onClick={() => setEdit(false)}
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

        {showtime === null && (
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
