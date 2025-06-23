"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SystemSettings {
  commissionPercent: number;
  maxVoucherPerType: number;
}

const initialData: SystemSettings = {
  commissionPercent: 5,
  maxVoucherPerType: 100,
};

export default function SystemSettingsPage() {
  const [data, setData] = useState<SystemSettings>(initialData);
  const [form, setForm] = useState<SystemSettings>(initialData);
  const [editing, setEditing] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof SystemSettings
  ) => {
    const value = Number(e.target.value);
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // TODO: Call API here
    setData(form);
    setEditing(false);
  };

  const handleCancel = () => {
    setForm(data);
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
          {/* Commission Percent */}
          <div className="grid grid-cols-12 items-center gap-4">
            <label
              htmlFor="commission"
              className="col-span-5 text-base font-medium"
            >
              Tỷ lệ hoa hồng (%) mỗi vé
            </label>

            <input
              id="commission"
              type="number"
              min={0}
              step={0.1}
              value={form.commissionPercent}
              onChange={(e) => handleChange(e, "commissionPercent")}
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
              type="number"
              min={1}
              value={form.maxVoucherPerType}
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
