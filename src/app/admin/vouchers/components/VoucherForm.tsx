"use client";

import { useEffect, useState } from "react";
import { SquarePen, RefreshCw } from "lucide-react";
import { Voucher } from "../page";
import { showErrorMessage, showSuccess } from "@/app/utils/alertHelper";
import {
  createVoucher,
  editVoucher,
} from "@/app/services/admin/voucherService";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

interface VoucherFormProps {
  voucher?: Voucher | null;
  reload: () => void;
  setShowModal: (show: boolean) => void;
}

export default function VoucherForm({
  voucher,
  reload,
  setShowModal,
}: VoucherFormProps) {
  const [edit, setEdit] = useState<boolean>(false);
  const [voucherState, setVoucherState] = useState(voucher);
  const [form, setForm] = useState({
    id: voucherState?.id || "",
    code: voucherState?.code || "",
    description: voucherState?.description || "",
    discountAmount: voucherState?.discountAmount ?? "",
    minPrice: voucherState?.minPrice ?? "",
    startDate: voucherState?.startDate
      ? voucherState.startDate.includes("/")
        ? dayjs(voucherState.startDate, "DD/MM/YYYY").format("YYYY-MM-DD")
        : dayjs(voucherState.startDate).format("YYYY-MM-DD")
      : "",
    endDate: voucherState?.endDate
      ? voucherState.endDate.includes("/")
        ? dayjs(voucherState.endDate, "DD/MM/YYYY").format("YYYY-MM-DD")
        : dayjs(voucherState.endDate).format("YYYY-MM-DD")
      : "",
    maxUses: voucherState?.maxUses ?? "",
    usedCount: voucherState?.usedCount ?? "",
    isActive: voucherState?.isActive ?? true,
    type: voucherState?.type || "",
  });
  console.log("check form", form);
  console.log("check voucherState", voucherState);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "discountAmount" ||
        name === "minPrice" ||
        name === "maxUses" ||
        name === "usedCount"
          ? value // giữ là string để input number không bị lỗi số 0 ở đầu
          : value,
    }));
  };

  const validateVoucherData = (data: any) => {
    // Validate code
    if (!data.code || data.code.trim().length === 0) {
      showErrorMessage("Mã voucher không được để trống");
      return false;
    } else if (data.code.trim().length < 3) {
      showErrorMessage("Mã voucher phải có ít nhất 3 ký tự");
      return false;
    }

    // Validate description
    if (!data.description || data.description.trim().length === 0) {
      showErrorMessage("Mô tả không được để trống");
      return false;
    } else if (data.description.trim().length < 10) {
      showErrorMessage("Mô tả phải có ít nhất 10 ký tự");
      return false;
    }

    // Validate discountAmount
    const discountValue = Number(data.discountAmount);
    if (
      data.discountAmount === null ||
      data.discountAmount === undefined ||
      data.discountAmount === "" ||
      isNaN(discountValue)
    ) {
      showErrorMessage("Phần trăm giảm giá không được để trống");
      return false;
    } else if (discountValue <= 0) {
      showErrorMessage("Phần trăm giảm giá phải lớn hơn 0");
      return false;
    } else if (discountValue > 100) {
      showErrorMessage("Phần trăm giảm giá không được vượt quá 100%");
      return false;
    }

    // Validate minPrice
    const minPriceValue = Number(data.minPrice);
    if (
      data.minPrice === null ||
      data.minPrice === undefined ||
      data.minPrice === "" ||
      isNaN(minPriceValue)
    ) {
      showErrorMessage("Giá trị tối thiểu không được để trống");
      return false;
    } else if (minPriceValue < 0) {
      showErrorMessage("Giá trị tối thiểu không được âm");
      return false;
    }

    // Validate startDate
    if (!data.startDate) {
      showErrorMessage("Ngày bắt đầu không được để trống");
      return false;
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // reset giờ phút giây để so sánh ngày
      const startDate = new Date(data.startDate);
      if (startDate < today) {
        showErrorMessage("Ngày bắt đầu không được bé hơn ngày hiện tại");
        return false;
      }
    }

    // Validate endDate
    if (!data.endDate) {
      showErrorMessage("Ngày kết thúc không được để trống");
      return false;
    } else if (data.startDate && data.endDate) {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      if (endDate <= startDate) {
        showErrorMessage("Ngày kết thúc phải sau ngày bắt đầu");
        return false;
      }
    }

    // Validate maxUses
    const maxUsesValue = Number(data.maxUses);
    if (
      data.maxUses === null ||
      data.maxUses === undefined ||
      data.maxUses === "" ||
      isNaN(maxUsesValue)
    ) {
      showErrorMessage("Số lượng voucher không được để trống");
      return false;
    } else if (maxUsesValue <= 0) {
      showErrorMessage("Số lượng voucher phải lớn hơn 0");
      return false;
    }

    // Validate type
    if (!data.type || data.type.trim().length === 0) {
      showErrorMessage("Loại voucher không được để trống");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Submit voucher:", form);
    // onSubmit(form);
  };

  const handleCreate = async () => {
    try {
      // Validate dữ liệu trước khi xử lý
      const isValid = validateVoucherData(form);
      if (!isValid) return;

      // Chuẩn bị dữ liệu để tạo voucher
      const voucherData = {
        code: form.code?.trim() || "",
        description: form.description?.trim() || "",
        discountAmount: Number(form.discountAmount) || 0,
        minPrice: Number(form.minPrice) || 0,
        startDate: formatDate(form.startDate),
        endDate: formatDate(form.endDate),
        maxUses: Number(form.maxUses) || 0,
        type: form.type?.trim() || "",
        isActive: true,
      };

      console.log("Final voucherData:", voucherData);

      // Gọi API tạo voucher
      const response = await createVoucher(voucherData);

      if (response) {
        showSuccess("Tạo voucher thành công!");
        reload();
        setShowModal(false);
      } else {
        return;
      }
    } catch (error) {
      showErrorMessage("Có lỗi xảy ra khi tạo voucher: " + error);
    }
  };

  const handleUpdate = async () => {
    try {
      // Validate dữ liệu trước khi xử lý
      const isValid = validateVoucherData(form);
      if (!isValid) return;

      // Chuẩn bị dữ liệu để cập nhật voucher
      const voucherData = {
        code: form.code?.trim() || "",
        description: form.description?.trim() || "",
        discountAmount: Number(form.discountAmount) || 0,
        minPrice: Number(form.minPrice) || 0,
        startDate: formatDate(form.startDate),
        endDate: formatDate(form.endDate),
        maxUses: Number(form.maxUses) || 0,
        type: form.type?.trim() || "",
        isActive: form.isActive || true,
      };

      console.log("Final update voucherData:", voucherData);

      // Gọi API cập nhật voucher
      const response = await editVoucher(voucherData, voucher!.id);

      if (response) {
        showSuccess("Cập nhật voucher thành công!");
        setEdit(false);
        reload();

        // Cập nhật voucherState với dữ liệu mới
        setVoucherState(
          (prev) =>
            ({
              ...prev!,
              ...voucherData,
            } as Voucher)
        );
      } else {
        return;
      }
    } catch (error) {
      showErrorMessage("Có lỗi xảy ra khi cập nhật voucher: " + error);
    }
  };

  const resetForm = () => {
    setForm({
      id: voucherState?.id || "",
      code: voucherState?.code || "",
      description: voucherState?.description || "",
      discountAmount: voucherState?.discountAmount ?? "",
      minPrice: voucherState?.minPrice ?? "",
      startDate: voucherState?.startDate
        ? voucherState.startDate.includes("/")
          ? dayjs(voucherState.startDate, "DD/MM/YYYY").format("YYYY-MM-DD")
          : dayjs(voucherState.startDate).format("YYYY-MM-DD")
        : "",
      endDate: voucherState?.endDate
        ? voucherState.endDate.includes("/")
          ? dayjs(voucherState.endDate, "DD/MM/YYYY").format("YYYY-MM-DD")
          : dayjs(voucherState.endDate).format("YYYY-MM-DD")
        : "",
      maxUses: voucherState?.maxUses ?? "",
      usedCount: voucherState?.usedCount ?? "",
      isActive: voucherState?.isActive ?? true,
      type: voucherState?.type || "",
    });
  };

  useEffect(() => {
    setEdit(false);
    // Cập nhật form khi voucher prop thay đổi
    setForm({
      id: voucher?.id || "",
      code: voucher?.code || "",
      description: voucher?.description || "",
      discountAmount: voucher?.discountAmount ?? "",
      minPrice: voucher?.minPrice ?? "",
      startDate: voucher?.startDate
        ? voucher.startDate.includes("/")
          ? dayjs(voucher.startDate, "DD/MM/YYYY").format("YYYY-MM-DD")
          : dayjs(voucher.startDate).format("YYYY-MM-DD")
        : "",
      endDate: voucher?.endDate
        ? voucher.endDate.includes("/")
          ? dayjs(voucher.endDate, "DD/MM/YYYY").format("YYYY-MM-DD")
          : dayjs(voucher.endDate).format("YYYY-MM-DD")
        : "",
      maxUses: voucher?.maxUses ?? "",
      usedCount: voucher?.usedCount ?? "",
      isActive: voucher?.isActive ?? true,
      type: voucher?.type || "",
    });
  }, [voucher]);

  // Hàm generate mã voucher tự động
  const generateVoucherCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm((prev) => ({
      ...prev,
      code: result,
    }));
  };

  // Hàm helper để format ngày tháng thành YYYY-MM-DD
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "";
    const date = dayjs(dateString);
    return date.isValid() ? date.format("YYYY-MM-DD") : "";
  };

  return (
    <div className="max-h-[600px] overflow-y-auto pr-2">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Mã voucher */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="code">
            Mã Voucher
          </label>
          <div className="w-[80%] flex gap-2">
            <input
              id="code"
              name="code"
              placeholder="Nhập mã voucher"
              value={form.code}
              onChange={handleChange}
              className="flex-1 border px-2 py-1.5 rounded-[8px] text-[15px] "
              disabled={true}
            />
            <button
              type="button"
              onClick={generateVoucherCode}
              disabled={voucher !== null && !edit}
              className="px-3 py-1.5 bg-[#432DD7] text-white rounded-[8px] hover:bg-[#3a25c0] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
              title="Tạo mã voucher tự động"
            >
              <RefreshCw size={16} />
              Generate
            </button>
          </div>
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
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] resize-none focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={voucher !== null && !edit}
          />
        </div>

        {/* % giảm giá */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="discountAmount">
            Phần trăm Giảm
          </label>
          <input
            id="discountAmount"
            name="discountAmount"
            type="number"
            value={form.discountAmount}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={voucher !== null && !edit}
            placeholder="Nhập phần trăm giảm giá. EX: 20 là 20%"
          />
        </div>

        {/* Giá trị đơn tối thiểu */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="minPrice">
            Giá trị tối thiểu
          </label>
          <div className="w-[80%]">
            <input
              id="minPrice"
              name="minPrice"
              type="number"
              value={form.minPrice}
              onChange={handleChange}
              className="w-full border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
              disabled={voucher !== null && !edit}
              placeholder="Nhập giá trị đơn hàng tối thiểu"
            />
            <div className="text-sm text-gray-500 ">
              {form.minPrice ? (
                <div className="pl-2 mt-2">
                  Giá trị tương ứng:{" "}
                  {Number(form.minPrice).toLocaleString("vi-VN") + "đ"}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        {/* Ngày phát hành */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="startDate">
            Ngày bắt đầu
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={voucher !== null && !edit}
            placeholder="Nhập ngày phát hành"
          />
        </div>

        {/* Ngày hết hạn */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="endDate">
            Ngày kết thúc
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={voucher !== null && !edit}
            placeholder="Nhập ngày hết hạn"
          />
        </div>

        {/* Số lượng */}
        <div className="flex items-center gap-5">
          <label className="w-[20%] text-[15px]" htmlFor="maxUses">
            Số lượng
          </label>
          <input
            id="maxUses"
            name="maxUses"
            type="number"
            value={form.maxUses}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={voucher !== null && !edit}
            placeholder="Nhập số lượng voucher"
          />
        </div>
        {/* Số lượng người đã lấy voucher */}
        {form.usedCount !== "" && form.usedCount !== undefined && (
          <div className="flex items-center gap-5">
            <label className="w-[20%] text-[15px]" htmlFor="usedCount">
              Số người lấy voucher
            </label>
            <input
              id="usedCount"
              name="usedCount"
              type="number"
              value={form.usedCount}
              onChange={handleChange}
              className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
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
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-[80%] border px-2 py-1.5 rounded-[8px] text-[15px] focus:ring-0 focus:border-[#1677ff] outline-none"
            disabled={voucher !== null && !edit}
          >
            <option value="" disabled>
              Chọn loại voucher
            </option>
            <option value="new_user">Người dùng mới</option>
            <option value="seasonal">Theo mùa</option>
          </select>
        </div>

        {/* Toggle chỉnh sửa */}
        {voucher && !edit && (
          <div className="flex gap-5 text-[15px] my-2">
            <div
              className="flex gap-5 border p-[4px] rounded-lg items-center bg-[#CCC6F4] cursor-pointer"
              onClick={() => {
                // Không cho phép update nếu ngày phát hành đã qua
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const startDate = new Date(form.startDate);
                if (startDate <= today) {
                  showErrorMessage(
                    "Voucher đã phát hành, không thể chỉnh sửa!"
                  );
                  setEdit(false);
                  return;
                }
                setEdit(true);
              }}
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
              className="w-[20%] bg-[#D51F2A] text-white py-2 rounded"
              onClick={() => {
                setEdit(false);
                resetForm();
              }}
            >
              Hủy
            </button>
            <button
              className="w-[20%] bg-[#432DD7] text-white py-2 rounded"
              onClick={handleUpdate}
            >
              Xác nhận
            </button>
          </div>
        )}

        {voucher === null && (
          <div className="flex justify-end">
            <button
              className="w-[20%] bg-[#432DD7] text-white py-2 rounded"
              onClick={handleCreate}
            >
              Xác nhận
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
