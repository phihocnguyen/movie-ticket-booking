"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { AppSidebar } from "../components/AppSidebar";
import { AccountAvatar } from "../components/AccountAvatar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [titleHeader, setTitleHeader] = useState<String>("DashBoard");
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar cố định bên trái */}
        <div className="w-64">
          <AppSidebar setTitleHeader={setTitleHeader} />
        </div>

        {/* Nội dung chính */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white  px-6 py-4 border-b flex items-center justify-between sticky top-0 shadow-none">
            <h1 className="text-2xl font-semibold text-gray-800">
              {titleHeader}
            </h1>
            <div className="space-x-4">
              <div className="text-sm text-indigo-600 hover:underline font-medium">
                <AccountAvatar />
              </div>
            </div>
          </header>

          {/* Nội dung trang */}
          <main className="p-6 flex-1 bg-[#F9FBFD]">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
