'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlay, FaPlus, FaStar, FaClock, FaCalendarAlt } from 'react-icons/fa';
import ShowtimeComponent from '@/app/movies/[id]/components/Showtime';

export interface Movie {
  id: string;
  title: string;
  titleVi: string;
  imagePath: string;
  description: string;
  detailsLink: string;
  director?: string;
  actors?: string[];
  genre?: string;
  duration?: string;
  releaseDate?: string;
  rating?: number;
}

interface MovieContentProps {
  movie: Movie;
}

export function MovieContent({ movie }: MovieContentProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative w-full h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
        <Image
          src={movie.imagePath}
          alt={movie.title}
          fill
          priority
          className="object-cover"
          unoptimized
        />
        <div className="absolute bottom-0 left-0 right-0 z-20 p-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="relative w-48 h-72 shadow-[0_0_15px_rgba(0,0,0,0.5)] rounded-lg overflow-hidden hidden md:block">
              <Image
                src={movie.imagePath}
                alt={movie.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{movie.title}</h1>
              <h2 className="text-xl md:text-2xl text-yellow-400 mb-4">{movie.titleVi}</h2>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-4">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="text-white">{movie.rating}/5</span>
                </div>
                <div className="flex items-center mr-4">
                  <FaClock className="text-white mr-1" />
                  <span className="text-white">{movie.duration}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="text-white mr-1" />
                  <span className="text-white">{movie.releaseDate}</span>
                </div>
              </div>
              
              <p className="text-gray-200 mb-6">
                {movie.description}
              </p>
              
              <div className="flex space-x-4 mb-6">
                <Link 
                  href={`/watch/${movie.id}`} 
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md flex items-center transition"
                >
                  <FaPlay className="mr-2" /> Xem phim
                </Link>
                <button 
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-md flex items-center transition"
                >
                  <FaPlus className="mr-2" /> Thêm vào danh sách
                </button>
              </div>
              
              <div className="text-gray-300">
                <p><span className="font-semibold">Đạo diễn:</span> {movie.director}</p>
                <p><span className="font-semibold">Diễn viên:</span> {movie.actors?.join(', ')}</p>
                <p><span className="font-semibold">Thể loại:</span> {movie.genre}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold border-l-4 border-green-500 pl-4 mb-6">LỊCH CHIẾU</h2>
        <ShowtimeComponent movieId={movie.id} movieTitle={movie.title} />
      </div>
    </div>
  );
}

interface MovieDetailProps {
  id: string;
}

export default function MovieDetail({ id }: MovieDetailProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  function getMovie(id: string): Movie {
    return {
      id: 'house-with-clock',
      title: "House with a Clock in Its Walls",
      titleVi: "Ngôi Nhà Có Chiếc Đồng Hồ Ma Thuật",
      imagePath: "https://assets.glxplay.io/images/w1600/title/house-with-a-clock-in-its-walls_web_spotlight_62b8e08d26fa40510ca1bf18bddbc2fb.jpg",
      description: "Sau tai nạn thương tâm của bố mẹ, Lewis Barnavelt đến sống cùng người bác phù thủy ở một căn nhà dị thường. Trong lúc cậu mải mê khám phá phép thuật, một chiếc đồng hồ bí ẩn cũng đang rình rập cậu. Truyện dựa theo cuốn sách kinh dị huyền bí dành cho thiếu nhi cùng tên của tác giả John Bellairs được xuất bản năm 1973.",
      detailsLink: "/movies/house-with-clock",
      director: "Eli Roth",
      actors: ["Jack Black", "Cate Blanchett", "Owen Vaccaro", "Kyle MacLachlan"],
      genre: "Fantasy, Comedy, Family",
      duration: "105 phút",
      releaseDate: "21/09/2018",
      rating: 4.3
    };
  }

  useEffect(() => {
    try {
      const movieData = getMovie(id);
      setMovie(movieData);
      setLoading(false);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-t-indigo-500 border-gray-200 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl text-red-600">Đã xảy ra lỗi khi tải phim</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl text-gray-600">Không tìm thấy phim</p>
      </div>
    );
  }

  return <MovieContent movie={movie} />;
}