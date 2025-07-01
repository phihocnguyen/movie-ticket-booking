"use client";

import { useEffect, useState } from "react";
import { createRoom, editRoom } from "@/app/services/owner/roomService";
import {
  getAllTheaters,
  getTheaterOwner,
  getTheatersByOwner,
} from "@/app/services/owner/theaterService";
import {
  showSuccess,
  showErrorMessage,
  showWaringMessage,
} from "@/app/utils/alertHelper";
import { SquarePen } from "lucide-react";
import dayjs from "dayjs";
import { useAuth } from "@/app/context/AuthContext";
import { getShowtimeByScreen } from "@/app/services/owner/showtimeService";

/* ===== props ===== */
interface RoomFormProps {
  room?: any;
  onClose?: () => void;
  fetchRooms?: () => void;
}

export default function RoomForm({ room, onClose, fetchRooms }: RoomFormProps) {
  const { userData } = useAuth();
  const [edit, setEdit] = useState(!room);
  const [form, setForm] = useState({
    screenName: room?.screenName || "",
    screenType: room?.screenType || "2D",
    totalSeats: room?.totalSeats ? String(room.totalSeats) : "0",
    isActive: room?.isActive ?? true,
    theaterId: room?.theaterId || "",
  });
  const [loading, setLoading] = useState(false);
  const [theaters, setTheaters] = useState<any[]>([]);
  const [theaterOwnerId, setTheaterOwnerId] = useState<number | null>(null);

  // Cache theaterOwnerId
  useEffect(() => {
    async function fetchOwnerAndTheaters() {
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
        if (
          theatersRes &&
          theatersRes.statusCode === 200 &&
          Array.isArray(theatersRes.data)
        ) {
          setTheaters(theatersRes.data);
        }
      }
    }
    fetchOwnerAndTheaters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.id]);

  useEffect(() => {
    if (room) setEdit(false);
    else setEdit(true);
  }, [room]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "totalSeats") {
      const sanitizedValue = value.replace(/^0+(?=\d)/, "");
      setForm((prev) => ({ ...prev, totalSeats: sanitizedValue }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!form.screenName.trim()) {
      showErrorMessage("Tên phòng không được để trống!");
      return false;
    }
    if (!form.screenType.trim()) {
      showErrorMessage("Loại phòng không được để trống!");
      return false;
    }
    if (!form.totalSeats || Number(form.totalSeats) < 1) {
      showErrorMessage("Tổng số ghế phải lớn hơn 0!");
      return false;
    }
    if (!form.theaterId) {
      showErrorMessage("Vui lòng chọn rạp phim!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const submitData = {
        ...form,
        totalSeats: Number(form.totalSeats),
        theaterId: Number(form.theaterId),
      };
      let res;
      if (room && edit) {
        res = await editRoom(submitData, room.id);
      } else if (!room) {
        res = await createRoom(submitData);
      }
      if (res && res.statusCode === 200) {
        showSuccess(room ? "Cập nhật thành công!" : "Tạo phòng thành công!");
        if (!room) {
          setForm({
            screenName: "",
            screenType: "2D",
            totalSeats: "0",
            isActive: true,
            theaterId: "",
          });
          if (onClose) onClose();
        }
        setEdit(false);
        if (fetchRooms) fetchRooms();
      }
      setEdit(false);
    } finally {
      setLoading(false);
    }
  };

  const disable = room !== undefined && !edit;

  /* ===== UI ===== */
  return (
    <div className="max-h-[600px] overflow-y-auto pr-2">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* <h2 className="text-2xl font-bold mb-4">{room ? "Chi tiết phòng chiếu" : "Tạo phòng chiếu mới"}</h2> */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]">Tên phòng</label>
          <input
            name="screenName"
            value={form.screenName}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={disable}
            placeholder="Tên phòng"
          />
        </div>
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]">Loại phòng</label>
          <select
            name="screenType"
            value={form.screenType}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={disable}
          >
            <option value="2D">2D</option>
            <option value="3D">3D</option>
          </select>
        </div>
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]">Tổng số ghế</label>
          <input
            name="totalSeats"
            type="number"
            min={1}
            value={form.totalSeats}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={disable}
            placeholder="Tổng số ghế"
          />
        </div>
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]">Rạp phim</label>
          <select
            name="theaterId"
            value={form.theaterId}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={disable || !theaterOwnerId}
          >
            <option value="">Chọn rạp phim</option>
            {theaters.map((theater) => (
              <option key={theater.id} value={theater.id}>
                {theater.name}
              </option>
            ))}
          </select>
        </div>
        {room && !edit && (
          <div className="flex gap-5 text-[15px] my-2">
            <button
              type="button"
              onClick={async () => {
                if (room?.id) {
                  const res = await getShowtimeByScreen(room.id);
                  if (
                    res &&
                    res.statusCode === 200 &&
                    Array.isArray(res.data) &&
                    res.data.length > 0
                  ) {
                    showWaringMessage(
                      "Không thể chỉnh sửa vì phòng đã có suất chiếu!"
                    );
                    return;
                  }
                }
                setEdit(true);
              }}
              className="flex gap-2 items-center border p-[6px] rounded-lg bg-[#CCC6F4]"
            >
              Chỉnh sửa thông tin
            </button>
          </div>
        )}
        {edit && room && (
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
              disabled={loading}
            >
              Xác nhận
            </button>
          </div>
        )}
        {room === undefined && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="w-[20%] bg-[#432DD7] text-white py-2 rounded"
              disabled={loading}
            >
              Xác nhận
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
