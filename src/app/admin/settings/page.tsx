"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  getByAdmin,
  createSystemSetting,
  editSystemSetting,
} from "@/app/services/admin/systemService";
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
  const [data, setData] = useState<SystemSettings>();
  const [editing, setEditing] = useState(false);
  const [hasSetting, setHasSetting] = useState(false);
  const [form, setForm] = useState<SystemSettings>(emptySystemSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getByAdmin();
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
        return;
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof SystemSettings
  ) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value === "" ? null : value }));
  };

  const validateForm = () => {
    // commissionRate
    if (
      form.commissionRate === null ||
      String(form.commissionRate) === "" ||
      isNaN(Number(form.commissionRate))
    ) {
      showErrorMessage("Tỷ lệ hoa hồng phải là số và không được để trống");
      return false;
    } else if (Number(form.commissionRate) <= 0) {
      showErrorMessage("Tỷ lệ hoa hồng phải lớn hơn 0");
      return false;
    }
    // maxVoucherPerType
    if (
      form.maxVoucherPerType === null ||
      String(form.maxVoucherPerType) === "" ||
      isNaN(Number(form.maxVoucherPerType))
    ) {
      showErrorMessage("Số lượng voucher phải là số và không được để trống");
      return false;
    } else if (Number(form.maxVoucherPerType) <= 0) {
      showErrorMessage("Số lượng voucher phải lớn hơn 0");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      if (!hasSetting) {
        await createSystemSetting(form);
        setHasSetting(true);
      } else {
        await editSystemSetting(form);
      }
      setData(form);
      setEditing(false);
      showSuccess("Cấu hình hệ thống đã được lưu thành công");
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
          {/* Commission Rate */}
          <div className="grid grid-cols-12 items-center gap-4">
            <label
              htmlFor="commission"
              className="col-span-5 text-base font-medium"
            >
              Tỷ lệ hoa hồng (%) mỗi vé
            </label>

            <input
              id="commission"
              type="text"
              value={form.commissionRate ?? ""}
              onChange={(e) => handleChange(e, "commissionRate")}
              className="col-span-5 border rounded-[8px] px-4 py-2 focus:ring-0 focus:border-[#1677ff] outline-none"
              disabled={!editing}
            />
          </div>

          {/* Max Voucher Per Type */}
          <div className="grid grid-cols-12 items-center gap-4 w-full">
            <label
              htmlFor="voucher"
              className="col-span-5 text-base font-medium"
            >
              Số lượng tối đa mỗi loại voucher (mặc định)
            </label>

            <input
              id="voucher"
              type="text"
              min={1}
              value={form.maxVoucherPerType ?? ""}
              onChange={(e) => handleChange(e, "maxVoucherPerType")}
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
                  className=" flex gap-2.5 border px-10 py-1.5 rounded-[8px] bg-[#D51F2A] text-white"
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
