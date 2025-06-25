"use client";

import { ReactNode } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
        <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
