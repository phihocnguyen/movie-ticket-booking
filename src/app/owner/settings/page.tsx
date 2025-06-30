"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  createSystemSetting,
  editSystemSetting,
  getByOwner,
  getTheaterOwnerByUserId,
} from "@/app/services/owner/systemService";
import { showErrorMessage, showSuccess } from "@/app/utils/alertHelper";

interface SystemSettings {
  id: number | null;
  ownerId: number | null;
  commissionRate: number | null;
  maxVoucherPerType: number | null;
  cancelFee: number | null;
  cancelTimeLimit: number | null;
  priceSeatRegular: number | null;
  priceSeatVip: number | null;
  priceSeatDouble: number | null;
}

const emptySystemSettings: SystemSettings = {
  id: null,
  ownerId: null,
  commissionRate: null,
  maxVoucherPerType: null,
  cancelFee: null,
  cancelTimeLimit: null,
  priceSeatRegular: null,
  priceSeatVip: null,
  priceSeatDouble: null,
};

export default function SystemSettingsPage() {
  const [data, setData] = useState<SystemSettings>(emptySystemSettings);
  const [form, setForm] = useState<SystemSettings>(emptySystemSettings);
  const [editing, setEditing] = useState(false);
  const [hasSetting, setHasSetting] = useState(false);
  const [ownerId, setOwnerId] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof SystemSettings
  ) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value === "" ? null : value }));
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const userId = Number(localStorage.getItem("userId"));
        if (!userId) {
          showErrorMessage("Không tìm thấy userId");
          return;
        }
        const result = await getTheaterOwnerByUserId(userId);
        if (!result || !result.data || !result.data.id) {
          showErrorMessage("Không tìm thấy ownerId");
          return;
        }
        const ownerId = result.data.id;
        setOwnerId(ownerId);
        const res = await getByOwner(ownerId);
        if (res && res.data) {
          setData(res.data);
          setForm(res.data);
          setHasSetting(true);
        } else {
          setHasSetting(false);
        }
      } catch (e) {
        setHasSetting(false);
        showErrorMessage("Lỗi khi lấy dữ liệu");
      }
    };
    fetchAll();
  }, []);
  console.log("ownerId", ownerId);

  const validateForm = () => {
    // cancelFee
    if (
      form.cancelFee === null ||
      String(form.cancelFee) === "" ||
      isNaN(Number(form.cancelFee))
    ) {
      showErrorMessage("Phí huỷ vé phải là số và không được để trống");
      return false;
    } else if (Number(form.cancelFee) < 0) {
      showErrorMessage("Phí huỷ vé không được nhỏ hơn 0");
      return false;
    }
    // cancelTimeLimit
    if (
      form.cancelTimeLimit === null ||
      String(form.cancelTimeLimit) === "" ||
      isNaN(Number(form.cancelTimeLimit))
    ) {
      showErrorMessage(
        "Giới hạn thời gian huỷ vé phải là số và không được để trống"
      );
      return false;
    } else if (Number(form.cancelTimeLimit) < 0) {
      showErrorMessage("Giới hạn thời gian huỷ vé không được nhỏ hơn 0");
      return false;
    }
    // priceSeatRegular (tỉ lệ)
    if (
      form.priceSeatRegular === null ||
      String(form.priceSeatRegular) === "" ||
      isNaN(Number(form.priceSeatRegular))
    ) {
      showErrorMessage(
        "Tỉ lệ giá ghế thường phải là số thực và không được để trống"
      );
      return false;
    } else if (Number(form.priceSeatRegular) < 1.0) {
      showErrorMessage("Tỉ lệ giá ghế thường phải lớn hơn hoặc bằng 1.0");
      return false;
    }
    // priceSeatVip (tỉ lệ)
    if (
      form.priceSeatVip === null ||
      String(form.priceSeatVip) === "" ||
      isNaN(Number(form.priceSeatVip))
    ) {
      showErrorMessage(
        "Tỉ lệ giá ghế VIP phải là số thực và không được để trống"
      );
      return false;
    } else if (Number(form.priceSeatVip) < 1.0) {
      showErrorMessage("Tỉ lệ giá ghế VIP phải lớn hơn hoặc bằng 1.0");
      return false;
    }
    // priceSeatDouble (tỉ lệ)
    if (
      form.priceSeatDouble === null ||
      String(form.priceSeatDouble) === "" ||
      isNaN(Number(form.priceSeatDouble))
    ) {
      showErrorMessage(
        "Tỉ lệ giá ghế đôi phải là số thực và không được để trống"
      );
      return false;
    } else if (Number(form.priceSeatDouble) < 1.0) {
      showErrorMessage("Tỉ lệ giá ghế đôi phải lớn hơn hoặc bằng 1.0");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    if (typeof ownerId !== "number" || isNaN(ownerId)) {
      showErrorMessage("Không xác định được ownerId. Vui lòng thử lại sau.");
      return;
    }
    try {
      let res;
      if (!hasSetting) {
        res = await createSystemSetting(form, ownerId);
        setHasSetting(true);
      } else {
        res = await editSystemSetting(form, ownerId);
      }
      if (res && res.statusCode === 200) {
        setData(form);
        setEditing(false);
        showSuccess("Cấu hình hệ thống đã được lưu thành công");
      } else {
        showErrorMessage("Lưu cấu hình thất bại. Vui lòng thử lại.");
      }
    } catch (e) {
      showErrorMessage("Lỗi khi lưu" + e);
      return;
    }
  };

  const handleCancel = () => {
    setForm(data ?? emptySystemSettings);
    setEditing(false);
  };

  return (
    <div className="container mx-auto max-w-4xl py-10">
      <Card className="shadow-xl rounded-2xl p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Cấu hình hệ thống
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cancel Fee */}
          <div className="grid grid-cols-12 items-center gap-4">
            <label
              htmlFor="cancelFee"
              className="col-span-5 text-base font-medium"
            >
              Phí huỷ vé (VNĐ)
            </label>

            <input
              id="cancelFee"
              type="number"
              min={0}
              value={form.cancelFee ?? ""}
              onChange={(e) => handleChange(e, "cancelFee")}
              className="col-span-5 border rounded-[8px] px-4 py-2 focus:ring-0 focus:border-[#1677ff] outline-none"
              disabled={!editing}
            />
          </div>

          {/* Cancel Time Limit */}
          <div className="grid grid-cols-12 items-center gap-4">
            <label
              htmlFor="cancelTimeLimit"
              className="col-span-5 text-base font-medium"
            >
              Giới hạn thời gian huỷ vé (phút trước suất chiếu)
            </label>

            <input
              id="cancelTimeLimit"
              type="number"
              min={0}
              value={form.cancelTimeLimit ?? ""}
              onChange={(e) => handleChange(e, "cancelTimeLimit")}
              className="col-span-5 border rounded-[8px] px-4 py-2 focus:ring-0 focus:border-[#1677ff] outline-none"
              disabled={!editing}
            />
          </div>

          {/* Price Seat Regular */}
          <div className="grid grid-cols-12 items-center gap-4">
            <label
              htmlFor="priceSeatRegular"
              className="col-span-5 text-base font-medium"
            >
              Tỉ lệ giá ghế thường (ví dụ: 1.0)
            </label>
            <input
              id="priceSeatRegular"
              type="number"
              step="0.1"
              min={1}
              // placeholder="1.0"
              value={form.priceSeatRegular ?? ""}
              onChange={(e) => handleChange(e, "priceSeatRegular")}
              className="col-span-5 border rounded-[8px] px-4 py-2 focus:ring-0 focus:border-[#1677ff] outline-none"
              disabled={!editing}
            />
          </div>

          {/* Price Seat VIP */}
          <div className="grid grid-cols-12 items-center gap-4">
            <label
              htmlFor="priceSeatVip"
              className="col-span-5 text-base font-medium"
            >
              Tỉ lệ giá ghế VIP (ví dụ: 1.2)
            </label>
            <input
              id="priceSeatVip"
              type="number"
              step="0.1"
              min={1}
              // placeholder="1.2"
              value={form.priceSeatVip ?? ""}
              onChange={(e) => handleChange(e, "priceSeatVip")}
              className="col-span-5 border rounded-[8px] px-4 py-2 focus:ring-0 focus:border-[#1677ff] outline-none"
              disabled={!editing}
            />
          </div>

          {/* Price Seat Double */}
          <div className="grid grid-cols-12 items-center gap-4">
            <label
              htmlFor="priceSeatDouble"
              className="col-span-5 text-base font-medium"
            >
              Tỉ lệ giá ghế đôi (ví dụ: 1.5)
            </label>
            <input
              id="priceSeatDouble"
              type="number"
              step="0.1"
              min={1}
              // placeholder="1.5"
              value={form.priceSeatDouble ?? ""}
              onChange={(e) => handleChange(e, "priceSeatDouble")}
              className="col-span-5 border rounded-[8px] px-4 py-2 focus:ring-0 focus:border-[#1677ff] outline-none"
              disabled={!editing}
            />
          </div>

          {/* Action Buttons */}
          <motion.div
            className="flex justify-end gap-4 pt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {editing ? (
              <>
                <button
                  className="flex gap-2.5 border px-10 py-1.5 rounded-[8px] bg-[#D51F2A] text-white"
                  onClick={handleCancel}
                >
                  Huỷ
                </button>
                <button
                  className="flex gap-2.5 border px-10 py-1.5 rounded-[8px] bg-[#432DD7] text-white"
                  onClick={handleSave}
                >
                  Lưu
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex gap-2.5 border px-10 py-1.5 rounded-[8px] bg-[#432DD7] text-white"
              >
                Chỉnh sửa
              </button>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
