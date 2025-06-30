"use client";

import { useEffect, useState } from "react";
import { Ticket } from "../page";
import { SquarePen } from "lucide-react";
import {
  showErrorMessage,
  showSuccess,
  showWaringMessage,
} from "@/app/utils/alertHelper";
import dayjs from "dayjs";
import { createOwner } from "@/app/services/admin/ownerService";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { editCustomer } from "@/app/services/admin/customerService";
import { editTicket } from "@/app/services/owner/tickerService";
dayjs.extend(customParseFormat);

interface TicketFormProps {
  owner?: Ticket | null;
  reload: () => void;
  setShowModal: (data: boolean) => void;
  handleUpdatedOwner: (dataUpdate: any) => void;
}

export default function TicketForm({
  owner,
  reload,
  setShowModal,
  handleUpdatedOwner,
}: TicketFormProps) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<Ticket | null>(owner ?? null);

  if (!form) {
    return (
      <div className="p-4 text-center text-gray-500">Không có dữ liệu</div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("user.")) {
      setForm((prev) =>
        prev
          ? {
              ...prev,
              user: {
                ...prev.user,
                [name.replace("user.", "")]: value,
              },
            }
          : prev
      );
    } else if (name === "status") {
      setForm((prev) => (prev ? { ...prev, status: value } : prev));
    }
  };

  const handleCancel = () => {
    setEdit(false);
    setForm(owner ?? null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    try {
      const payload = {
        status: form.status,
      };
      const result = await editTicket(payload, form.id);
      if (result && result.statusCode === 200) {
        showSuccess("Cập nhật vé thành công!");
        setEdit(false);
        reload();
      } else {
        return;
      }
    } catch (err: any) {
      showErrorMessage("Cập nhật vé thất bại!" + (err?.message || ""));
    }
  };
  console.log("form", form);
  const canEdit = form.status === "PENDING";

  return (
    <div className="max-h-[600px] overflow-y-auto pr-2">
      <form className="space-y-3" onSubmit={handleUpdate}>
        <div className="flex items-center gap-5">
          <label className="w-[30%] text-[15px]">Họ tên</label>
          <input
            className="w-[70%] border px-2 py-1.5 rounded-[8px] text-[15px] bg-gray-100 text-gray-500"
            name="user.fullName"
            value={form.user.fullName}
            onChange={handleChange}
            required
            disabled
          />
        </div>
        <div className="flex items-center gap-5">
          <label className="w-[30%] text-[15px]">Email</label>
          <input
            className="w-[70%] border px-2 py-1.5 rounded-[8px] text-[15px] bg-gray-100 text-gray-500"
            name="user.email"
            value={form.user.email}
            onChange={handleChange}
            required
            disabled
          />
        </div>
        <div className="flex items-center gap-5">
          <label className="w-[30%] text-[15px]">Số điện thoại</label>
          <input
            className="w-[70%] border px-2 py-1.5 rounded-[8px] text-[15px] bg-gray-100 text-gray-500"
            name="user.phoneNumber"
            value={form.user.phoneNumber}
            onChange={handleChange}
            required
            disabled
          />
        </div>
        <div className="flex items-center gap-5">
          <label className="w-[30%] text-[15px]">Tên phim</label>
          <input
            className="w-[70%] border px-2 py-1.5 rounded-[8px] text-[15px] bg-gray-100 text-gray-500"
            value={form.showtime.movie.title}
            disabled
          />
        </div>
        <div className="flex items-center gap-5">
          <label className="w-[30%] text-[15px]">Rạp</label>
          <input
            className="w-[70%] border px-2 py-1.5 rounded-[8px] text-[15px] bg-gray-100 text-gray-500"
            value={form.showtime.theater.name}
            disabled
          />
        </div>
        <div className="flex items-center gap-5">
          <label className="w-[30%] text-[15px]">Địa chỉ rạp</label>
          <input
            className="w-[70%] border px-2 py-1.5 rounded-[8px] text-[15px] bg-gray-100 text-gray-500"
            value={form.showtime.theater.address}
            disabled
          />
        </div>
        <div className="flex items-center gap-5">
          <label className="w-[30%] text-[15px]">Suất chiếu</label>
          <input
            className="w-[70%] border px-2 py-1.5 rounded-[8px] text-[15px] bg-gray-100 text-gray-500"
            value={form.showtime.startTime}
            disabled
          />
        </div>
        <div className="flex items-center gap-5">
          <label className="w-[30%] text-[15px]">Thời gian đặt vé</label>
          <input
            className="w-[70%] border px-2 py-1.5 rounded-[8px] text-[15px] bg-gray-100 text-gray-500"
            value={form.bookingTime}
            disabled
          />
        </div>

        {/* Danh sách ghế */}
        <div className="flex items-start gap-5">
          <label className="w-[30%] text-[15px] pt-2">Danh sách ghế</label>
          <div className="w-[70%]">
            <div className="overflow-y-auto max-h-40 border rounded-md">
              <table className="min-w-full text-[15px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-2 py-1 text-left font-medium">Tên ghế</th>
                    <th className="px-2 py-1 text-left font-medium">
                      Loại ghế
                    </th>
                    <th className="px-2 py-1 text-left font-medium">Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(form.bookingSeats) &&
                  form.bookingSeats.length > 0 ? (
                    form.bookingSeats.map((seat, idx) => (
                      <tr key={idx}>
                        <td className="px-2 py-1">{seat.seatName}</td>
                        <td className="px-2 py-1">{seat.seatType}</td>
                        <td className="px-2 py-1">
                          {seat.price.toLocaleString()} đ
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-2 py-1 text-gray-500 text-center"
                      >
                        Không có ghế
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Danh sách thức ăn */}
        <div className="flex items-start gap-5">
          <label className="w-[30%] text-[15px] pt-2">Thức ăn</label>
          <div className="w-[70%]">
            <div className="overflow-y-auto max-h-40 border rounded-md">
              <table className="min-w-full text-[15px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-2 py-1 text-left font-medium">Tên món</th>
                    <th className="px-2 py-1 text-left font-medium">
                      Số lượng
                    </th>
                    <th className="px-2 py-1 text-left font-medium">Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(form.bookingFoods) &&
                  form.bookingFoods.length > 0 ? (
                    form.bookingFoods.map((food, idx) => (
                      <tr key={idx}>
                        <td className="px-2 py-1">{food.foodName}</td>
                        <td className="px-2 py-1">{food.quantity}</td>
                        <td className="px-2 py-1">
                          {food.price.toLocaleString()} đ
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-2 py-1 text-gray-500 text-center"
                      >
                        Không có thức ăn
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <label className="w-[30%] text-[15px]">Tổng tiền vé</label>
          <input
            className="w-[70%] border px-2 py-1.5 rounded-[8px] text-[15px] bg-gray-100 text-gray-500"
            value={form.totalTicketPrice?.toLocaleString() + " đ"}
            disabled
          />
        </div>
        <div className="flex items-center gap-5">
          <label className="w-[30%] text-[15px]">Tổng tiền thức ăn</label>
          <input
            className="w-[70%] border px-2 py-1.5 rounded-[8px] text-[15px] bg-gray-100 text-gray-500"
            value={form.totalFoodPrice?.toLocaleString() + " đ"}
            disabled
          />
        </div>
        <div className="flex items-center gap-5">
          <label className="w-[30%] text-[15px] font-semibold">
            Tổng thanh toán
          </label>
          <input
            className="w-[70%] border px-2 py-1.5 rounded-[8px] text-[15px] bg-gray-200 text-black font-semibold"
            value={form.totalAmount?.toLocaleString() + " đ"}
            disabled
          />
        </div>
        <div className="flex items-center gap-5">
          <label className="w-[30%] text-[15px]">Trạng thái</label>
          {edit ? (
            <select
              className="w-[70%] border px-2 py-1.5 rounded-[8px] text-[15px]"
              name="status"
              value={form.status}
              onChange={handleChange}
              required
            >
              <option value="PENDING">Chưa thanh toán</option>
              <option value="CONFIRMED">Đã thanh toán</option>
              <option value="CANCELLED">Đã huỷ</option>
            </select>
          ) : (
            <select
              className="w-[70%] border px-2 py-1.5 rounded-[8px] text-[15px] bg-gray-100 text-gray-500"
              value={form.status}
              disabled
            >
              <option value="PENDING">Chưa thanh toán</option>
              <option value="CONFIRMED">Đã thanh toán</option>
              <option value="CANCELLED">Đã huỷ</option>
            </select>
          )}
        </div>
        <div className="flex justify-end gap-3 pt-2">
          {edit ? (
            <>
              <button
                type="button"
                className=" bg-[#D51F2A] text-white px-4 py-2 rounded"
                onClick={handleCancel}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="bg-[#432DD7] text-white px-4 py-2 rounded"
              >
                Lưu
              </button>
            </>
          ) : (
            <div className="flex flex-col items-end w-full">
              <button
                type="button"
                className="bg-[#432DD7] text-white px-4 py-2 rounded"
                onClick={() => {
                  if (!canEdit) {
                    showWaringMessage(
                      "Chỉ có thể chỉnh sửa khi trạng thái là chưa thanh toán"
                    );
                  } else {
                    setEdit(true);
                  }
                }}
              >
                Chỉnh sửa
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
