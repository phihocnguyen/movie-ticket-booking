import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Movie Tickets - Đặt vé phim trực tuyến",
  description: "Đặt vé xem phim nhanh chóng và dễ dàng",
  keywords: ["phim", "đặt vé phim", "xem phim", "rạp phim"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${poppins.variable}`}>
      <body className="antialiased bg-gray-100 text-gray-900">
        <AuthProvider>
          <main className="min-h-screen">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
