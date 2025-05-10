'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaPlay, FaStar, FaClock, FaCalendarAlt, FaGlobe, FaUserFriends, FaTags, FaUserTie } from 'react-icons/fa';
import ShowtimeComponent from '@/app/movies/[id]/components/Showtime';
import TrailerModal from './TrailerModal';

export interface Movie {
  id: string;
  title: string;
  titleVi: string;
  posterUrl: string;
  description: string;
  detailsLink: string;
  director?: string;
  actor?: string;
  genre?: string;
  duration?: string;
  releaseDate?: string;
  rating?: number;
  trailerUrl?: string;
  country?: string;
  backdropUrl?: string;
}

interface MovieDetailProps {
  movie: Movie;
}

export default function MovieDetail({ movie }: MovieDetailProps) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const defaultImage = 'https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg';
  
  const renderStars = () => {
    const stars = [];
    const rating = movie.rating || 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-200" />);
      } else {
        stars.push(<FaStar key={i} className="text-gray-300" />);
      }
    }
    
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="relative w-full h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40 z-10" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-gray-900 to-transparent z-10" />
        
        {movie.backdropUrl ? (
          <Image
            src={movie.backdropUrl}
            alt={movie.title}
            fill
            priority
            className="object-cover"
            unoptimized
          />
        ) : (
          <Image
            src={defaultImage}
            alt={movie.title}
            fill
            priority
            className="object-cover"
            unoptimized
          />
        )}
        
        <div className="absolute bottom-0 left-0 right-0 z-20 p-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-48 h-72 shadow-xl rounded-lg overflow-hidden hidden md:block group transform transition duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition duration-300 z-10" />
              {movie.posterUrl ? (
                <Image
                  src={movie.posterUrl}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <Image
                  src={defaultImage}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">{movie.title}</h1>
              <h2 className="text-xl md:text-2xl text-yellow-400 mb-4 font-medium">{movie.titleVi}</h2>
              <div className="flex flex-wrap items-center mb-6 gap-4">
                <div className="flex items-center bg-gray-800/80 px-3 py-1 rounded-full">
                  <div className="flex mr-1">
                    {renderStars()}
                  </div>
                  <span className="font-semibold">{movie.rating}/5</span>
                </div>
                <div className="flex items-center bg-gray-800/80 px-3 py-1 rounded-full">
                  <FaClock className="mr-2 text-gray-300" />
                  <span>{movie.duration}</span>
                </div>
                <div className="flex items-center bg-gray-800/80 px-3 py-1 rounded-full">
                  <FaCalendarAlt className="mr-2 text-gray-300" />
                  <span>{movie.releaseDate}</span>
                </div>
              </div>
              <div className="bg-gray-800/70 backdrop-blur-sm p-4 rounded-lg mb-6 transform transition hover:bg-gray-800/90">
                <p className="text-gray-200 leading-relaxed">
                  {movie.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-4 mb-6">
                <button 
                  onClick={() => setIsTrailerOpen(true)}
                  className="cursor-pointer bg-red-600 hover:bg-red-700 text-white py-3 px-8 rounded-full flex items-center transition duration-300 transform hover:scale-105 font-medium shadow-lg"
                >
                  <FaPlay className="mr-2" /> Xem trailer
                </button>
                <button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-full flex items-center transition duration-300 transform hover:scale-105 font-medium shadow-lg">
                  Đặt vé ngay
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                <div className="flex items-center">
                  <FaGlobe className="mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Quốc gia</p>
                    <p className="font-medium">{movie.country || 'Chưa cập nhật'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaUserTie className="mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Đạo diễn</p>
                    <p className="font-medium">{movie.director || 'Chưa cập nhật'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaUserFriends className="mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Diễn viên</p>
                    <p className="font-medium">{movie.actor || 'Chưa cập nhật'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaTags className="mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Thể loại</p>
                    <p className="font-medium">{movie.genre || 'Chưa cập nhật'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold border-l-4 border-green-500 pl-4 mb-8 flex items-center">
          LỊCH CHIẾU
          <span className="ml-3 text-sm bg-green-500 text-white px-3 py-1 rounded-full">Hôm nay</span>
        </h2>
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <ShowtimeComponent movieId={movie.id} movieTitle={movie.title} />
        </div>
      </div>

      <TrailerModal 
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        videoId={movie.trailerUrl || ''}
      />
    </div>
  );
}