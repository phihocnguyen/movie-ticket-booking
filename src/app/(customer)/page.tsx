// "use client";
import MoviePoster from "@/app/components/MoviePoster";
import MovieCarousel from "@/app/components/MovieCarousel";
import { getLatestMovies, getTopRatedMovies } from "./movies/[id]/api";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";
export const metadata = {
  title: "Movie Tickets - Đặt vé phim trực tuyến",
  description: "Đặt vé phim trực tuyến",
};

export default async function Home() {
  const [latestMovies, topRatedMovies] = await Promise.all([
    getLatestMovies(),
    getTopRatedMovies(),
  ]);

  const safeLatestMovies = Array.isArray(latestMovies) ? latestMovies : [];
  const safeTopRatedMovies = Array.isArray(topRatedMovies)
    ? topRatedMovies
    : [];

  return (
    <div className="max-w-screen mx-auto bg-[#181922] shadow-md overflow-auto">
      <div>
        <MoviePoster />
      </div>
      <div className="mx-auto px-4 py-8">
        <MovieCarousel
          title="Phim Điện Ảnh Mới Coóng"
          movies={safeLatestMovies}
        />
        <MovieCarousel title="Phim Đề Cử" movies={safeTopRatedMovies} />
      </div>
    </div>
  );
}
