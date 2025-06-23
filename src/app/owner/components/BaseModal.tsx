// components/BaseModal.tsx
"use client";

import { ReactNode } from "react";

export default function BaseModal({
  open,
  title,
  onClose,
  children,
  width = "800px",
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  width?: string | number;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-white p-6 rounded-xl shadow-lg  relative"
        style={{ width }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
