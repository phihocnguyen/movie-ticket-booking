"use client";

import { useEffect, useState } from "react";
import { Showtime } from "../page";
import { SquarePen } from "lucide-react";
import { getAllMovies, createShowtime } from "@/app/services/owner/showtimeService";
import { useAuth } from "@/app/context/AuthContext";
import { getTheaterOwner, getTheatersByOwner } from "@/app/services/owner/theaterService";
import { getRoomsByTheater } from "@/app/services/owner/roomService";
import dayjs from "dayjs";

interface Movie {
  id: number;
  title: string;
  titleVi?: string;
}

interface ShowtimeFormProps {
  showtime?: Showtime | null;
  fetchShowtimes?: () => void;
  onClose?: () => void;
}

export default function ShowtimeForm({ showtime, fetchShowtimes, onClose }: ShowtimeFormProps) {
  const { userData } = useAuth();
  const [edit, setEdit] = useState<boolean>(false);
  const [form, setForm] = useState({
    movieId: showtime?.movie?.id ?? 0,
    theaterId: showtime?.theater?.id ?? 0,
    screenId: showtime?.screen?.id ?? 0,
    startTime: showtime?.startTime ?? "",
    endTime: showtime?.endTime ?? "",
    price: showtime?.price ?? 0,
    isActive: showtime?.isActive ?? true,
  });
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [theaterOwnerId, setTheaterOwnerId] = useState<number | null>(null);

  useEffect(() => {
    setEdit(false);
  }, [showtime]);

  useEffect(() => {
    async function fetchMovies() {
      const res = await getAllMovies();
      if (res && res.statusCode === 200 && Array.isArray(res.data)) {
        setMovies(res.data);
      }
    }
    fetchMovies();
  }, []);

  // Lấy danh sách rạp theo owner
  useEffect(() => {
    async function fetchTheaters() {
      if (!userData?.id) return;
      let ownerId = theaterOwnerId;
      if (!ownerId) {
        const res = await getTheaterOwner(userData.id);
        if (res && res.statusCode === 200 && res.data?.id) {
          ownerId = res.data.id;
          setTheaterOwnerId(ownerId);
        }
      }
      if (ownerId) {
        const theatersRes = await getTheatersByOwner(ownerId);
        if (theatersRes && theatersRes.statusCode === 200 && Array.isArray(theatersRes.data)) {
          setTheaters(theatersRes.data);
        }
      }
    }
    fetchTheaters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.id]);

  // Lấy danh sách phòng chiếu khi chọn rạp
  useEffect(() => {
    async function fetchRooms() {
      if (form.theaterId) {
        const res = await getRoomsByTheater(Number(form.theaterId));
        if (res && res.statusCode === 200 && Array.isArray(res.data)) {
          setRooms(res.data);
        } else {
          setRooms([]);
        }
      } else {
        setRooms([]);
      }
    }
    fetchRooms();
  }, [form.theaterId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (name === "theaterId") {
      setForm((prev) => ({ ...prev, theaterId: Number(value), screenId: 0 }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...form,
      movieId: Number(form.movieId),
      theaterId: Number(form.theaterId),
      screenId: Number(form.screenId),
      price: Number(form.price),
      startTime: dayjs(form.startTime).format("YYYY-MM-DDTHH:mm:ss"),
      endTime: dayjs(form.endTime).format("YYYY-MM-DDTHH:mm:ss"),
    };
    const res = await createShowtime(submitData);
    if (res && res.statusCode === 200) {
      if (fetchShowtimes) fetchShowtimes();
      if (onClose) onClose();
    }
  };

  return (
    <div className="max-h-[600px] overflow-y-auto pr-2">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* movieId */}
        <div className="flex items-center gap-5">
          <label className="w-[30%] text-[15px]" htmlFor="movieId">
            Danh sách phim
          </label>
          <select
            id="movieId"
            name="movieId"
            value={form.movieId}
            onChange={handleChange}
            className="w-[70%] border px-2 py-1.5 rounded-[8px] text-[15px]"
            required
            disabled={showtime !== null && !edit}
          >
            <option value="">Chọn phim</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.titleVi || movie.title}
              </option>
            ))}
          </select>
        </div>

        {/* theaterId */}
        <div className="flex items-center gap-5">
          <label className="w-[30%] text-[15px]" htmlFor="theaterId">
            Rạp phim
          </label>
          <select
            id="theaterId"
            name="theaterId"
            value={form.theaterId}
            onChange={handleChange}
            className="w-[70%] border px-2 py-1.5 rounded-[8px] text-[15px]"
            required
            disabled={showtime !== null && !edit}
          >
            <option value="">Chọn rạp phim</option>
            {theaters.map((theater) => (
              <option key={theater.id} value={theater.id}>
                {theater.name}
              </option>
            ))}
          </select>
        </div>

        {/* screenId */}
        <div className="flex items-center gap-5">
          <label className="w-[30%] text-[15px]" htmlFor="screenId">
            Phòng chiếu
          </label>
          <select
            id="screenId"
            name="screenId"
            value={form.screenId}
            onChange={handleChange}
            className="w-[70%] border px-2 py-1.5 rounded-[8px] text-[15px]"
            required
            disabled={showtime !== null && !edit || !form.theaterId}
          >
            <option value="">Chọn phòng chiếu</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.screenName}
              </option>
            ))}
          </select>
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
