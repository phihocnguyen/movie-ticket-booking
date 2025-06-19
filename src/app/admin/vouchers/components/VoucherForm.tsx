"use client";

import { useEffect, useState } from "react";
import { SquarePen } from "lucide-react";
import { Voucher } from "../page";

interface VoucherFormProps {
  voucher?: Voucher | null;
}

export default function VoucherForm({ voucher }: VoucherFormProps) {
  const [edit, setEdit] = useState<boolean>(false);
  const [form, setForm] = useState({
    id: voucher?.id,
    code: voucher?.code,
    title: voucher?.title,
    description: voucher?.description,
    discount_value: voucher?.discount_value,
    min_order_value: voucher?.min_order_value,
    release_date: voucher?.release_date,
    expire_date: voucher?.expire_date,
    quantity: voucher?.quantity,
    claimed: voucher?.claimed,
    is_active: voucher?.is_active,
    type: voucher?.type,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "discount_value" ||
        name === "min_order_value" ||
        name === "quantity"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit voucher:", form);
    // onSubmit(form);
  };

  useEffect(() => {
    setEdit(false);
  }, [voucher]);
  console.log("check voucher", voucher);
  console.log("check edit", edit);
  return (
    <div className="max-h-[600px] overflow-y-auto pr-2">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Mã voucher */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="code">
            Mã Voucher
          </label>
          <input
            id="code"
            name="code"
            placeholder="Nhập mã voucher"
            value={form.code}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px]"
            required
            disabled={voucher !== null && !edit}
          />
        </div>

        {/* Tiêu đề */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="title">
            Tiêu đề
          </label>
          <input
            id="title"
            name="title"
            placeholder="Nhập tiêu đề voucher"
            value={form.title}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px]"
            required
            disabled={voucher !== null && !edit}
          />
        </div>

        {/* Mô tả */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="description">
            Mô tả
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Nhập mô tả voucher"
            value={form.description}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] resize-none"
            required
            disabled={voucher !== null && !edit}
          />
        </div>

        {/* % giảm giá */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="discount_value">
            Phần trăm Giảm
          </label>
          <input
            id="discount_value"
            name="discount_value"
            type="number"
            value={form.discount_value}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px]"
            required
            disabled={voucher !== null && !edit}
            placeholder="Nhập phần trăm giảm giá. EX: 20 là 20%"
          />
        </div>

        {/* Giá trị đơn tối thiểu */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="min_order_value">
            Giá trị tối thiểu
          </label>
          <input
            id="min_order_value"
            name="min_order_value"
            type="number"
            value={form.min_order_value}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px]"
            required
            disabled={voucher !== null && !edit}
            placeholder="Nhập giá trị đơn hàng tối thiểu"
          />
        </div>

        {/* Ngày phát hành */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="release_date">
            Ngày bắt đầu
          </label>
          <input
            id="release_date"
            name="release_date"
            type="date"
            value={form.release_date}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px]"
            required
            disabled={voucher !== null && !edit}
            placeholder="Nhập ngày phát hành"
          />
        </div>

        {/* Ngày hết hạn */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="expire_date">
            Ngày kết thúc
          </label>
          <input
            id="expire_date"
            name="expire_date"
            type="date"
            value={form.expire_date}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px]"
            required
            disabled={voucher !== null && !edit}
            placeholder="Nhập ngày hết hạn"
          />
        </div>

        {/* Số lượng */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="quantity">
            Số lượng
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px]"
            required
            disabled={voucher !== null && !edit}
            placeholder="Nhập số lượng voucher"
          />
        </div>
        {/* Số lượng người đã lấy voucher */}
        {form.claimed && (
          <div className="flex items-center gap-5">
            <label className="w-[20%] text-[15px]" htmlFor="claimed">
              Số người lấy voucher
            </label>
            <input
              id="claimed"
              name="claimed"
              type="number"
              value={form.claimed}
              onChange={handleChange}
              className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px]"
              required
              disabled={true}
              placeholder="Nhập số lượng voucher"
            />
          </div>
        )}

        {/* Loại voucher */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="type">
            Loại voucher
          </label>
          <input
            id="type"
            name="type"
            type="text"
            value={form.type}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px]"
            required
            disabled={voucher !== null && !edit}
            placeholder="Nhập loại voucher"
          />
        </div>

        {/* Toggle chỉnh sửa */}
        {voucher && !edit && (
          <div className="flex gap-5 text-[15px] my-2">
            <div
              className="flex gap-5 border p-[4px] rounded-lg items-center bg-[#CCC6F4] cursor-pointer"
              onClick={() => setEdit(true)}
            >
              Chỉnh sửa thông tin
              <SquarePen size={20} />
            </div>
          </div>
        )}

        {/* Button submit */}
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

        {voucher === null && (
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
