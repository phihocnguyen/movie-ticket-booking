import MoviePoster from "@/app/components/MoviePoster";

export const metadata = {
  title: "AINBO - Nữ Chiến Binh Amazon | Đặt vé xem phim",
  description: "Đặt vé xem phim AINBO - Nữ Chiến Binh Amazon",
};

export default function Home() {
  return (
    <div className="max-w-screen h-screen mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div>
        <MoviePoster/>
      </div>
    </div>
  );
}