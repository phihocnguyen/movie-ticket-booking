// "use client";

import Link from "next/link";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/admin" className="hover:text-blue-600">
            Dashboard
          </Link>
          <Link href="/admin/users" className="hover:text-blue-600">
            Users
          </Link>
          <Link href="/admin/settings" className="hover:text-blue-600">
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 border-b">
          <h1 className="text-2xl font-semibold">Admin Area</h1>
        </header>

        {/* Page content */}
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
