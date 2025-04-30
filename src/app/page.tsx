import MoviePoster from "@/app/components/MoviePoster";
import MovieCarousel from "@/app/components/MovieCarousel";

export const metadata = {
  title: "Movie Tickets - Đặt vé phim trực tuyến",
  description: "Đặt vé phim trực tuyến",
};



export default function Home() {
  const movies = [
    {
      id: 1,
      title: "Havoc: Tàn Phá",
      originalTitle: "Havoc",
      imageUrl: "https://static.nutscdn.com/vimg/300-0/5008f114fa79d35c78a6913e0b3dc902.jpg",
      genres: ["Action", "Thriller"],
      hasSubtitles: true,
      hasDubbing: true
    },
    {
      id: 2,
      title: "Bộp Cò Hạnh Phúc",
      originalTitle: "Trigger Happy",
      imageUrl: "https://static.nutscdn.com/vimg/300-0/4dc279d90d10d7338594d996d3298ca2.jpg",
      genres: ["Comedy", "Action"],
      hasSubtitles: true
    },
    {
      id: 3,
      title: "Kẻ Trộm Trang Sức: Phi Vụ Bắt Đầu",
      originalTitle: "Jewel Thief: The Heist Begins",
      imageUrl: "https://static.nutscdn.com/vimg/300-0/1a0a344a7015ed937f734f18e1123513.jpg",
      genres: ["Crime", "Drama"],
      hasSubtitles: true
    },
    {
      id: 4,
      title: "Mèo Mập Mang 10 Mạng",
      originalTitle: "10 Lives",
      imageUrl: "https://static.nutscdn.com/vimg/300-0/a69a7cb2881e6344f4a59e30c708de23.jpg",
      genres: ["Animation", "Comedy"],
      hasSubtitles: true,
      hasDubbing: false
    },
    {
      id: 5,
      title: "Wicked: Phù Thủy Xứ Oz",
      originalTitle: "Wicked",
      imageUrl: "https://static.nutscdn.com/vimg/300-0/c4ce3d145017c9131b014c35fb92ecd4.jpg",
      genres: ["Fantasy", "Musical"],
      hasSubtitles: true
    },
    {
      id: 6,
      title: "Captain America: Thế Giới Mới",
      originalTitle: "Captain America: Brave New World",
      imageUrl: "https://static.nutscdn.com/vimg/300-0/bcc5125d059117eeb33cf7f1d16f8615.jpg",
      genres: ["Action", "Adventure"],
      hasSubtitles: true,
      hasDubbing: true
    },
    {
      id: 7,
      title: "404 Chạy Ngay Đi",
      originalTitle: "404 Run Run",
      imageUrl: "https://static.nutscdn.com/vimg/300-0/875e0692ccefd5c2f9fb9463ab072571.jpg",
      genres: ["Horror", "Thriller"],
      hasSubtitles: true,
      hasDubbing: false
    }
  ];
  return (
    <div className="max-w-screen mx-auto bg-[#181922] shadow-md overflow-auto">
      <div>
        <MoviePoster />
      </div>
      <div className="mx-auto px-4 py-8">
        <MovieCarousel 
          title="Phim Điện Ảnh Mới Coóng" 
          movies={movies} 
        />
        
        {/* You can add more carousel sections */}
        <MovieCarousel 
          title="Phim Đề Cử" 
          movies={movies.slice(2, 7).concat(movies.slice(0, 2))} 
        />
      </div>
    </div>
  );
}