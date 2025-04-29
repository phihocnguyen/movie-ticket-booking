'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Calendar } from 'lucide-react';
import { TheaterData, Movie } from '../types';

interface TheaterDetailClientProps {
  theater: TheaterData;
  movies: Movie[];
  nearbyTheaters: TheaterData[];
}

export default function TheaterDetailClient({ theater, movies, nearbyTheaters }: TheaterDetailClientProps) {
  const [activeDate, setActiveDate] = useState<string>('29/4');
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);

  useEffect(() => {
    // Set default selected movie to first movie
    if (movies.length > 0 && !selectedMovie) {
      setSelectedMovie(movies[0].id);
    }
  }, [movies, selectedMovie]);

  const handleDateChange = (date: string) => {
    setActiveDate(date);
  };

  const handleMovieSelect = (movieId: string) => {
    setSelectedMovie(movieId);
  };

  const selectedMovieData = movies.find(movie => movie.id === selectedMovie);
  const activeDateShowtimes = selectedMovieData?.showtimes.find(
    showtime => showtime.date === activeDate
  );

  return (
    <div className="pt-16 bg-gray-50">
      {/* Theater Header */}
      <div className="bg-blue-50/50 pt-8 pb-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-white border-4 border-white shadow-md mb-4 md:mb-0 md:mr-6">
              {/* Logo placeholder - replace with actual theater logo */}
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                {theater.name.charAt(0)}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{theater.name}</h1>
              <div className="flex items-center mt-2 text-gray-600">
                <MapPin size={16} className="mr-1" />
                <p className="text-sm">{theater.address}</p>
              </div>
              <div className="mt-3 flex gap-2">
                <Link href="#" className="bg-blue-100 text-blue-700 px-3 py-1 text-sm rounded-full">
                  Bản đồ
                </Link>
                <Link href="#" className="bg-blue-100 text-blue-700 px-3 py-1 text-sm rounded-full">
                  Tp. Hồ Chí Minh
                </Link>
                <Link href="#" className="bg-blue-100 text-blue-700 px-3 py-1 text-sm rounded-full">
                  Beta Cinemas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Theater Description */}
      <div className="container mx-auto px-4 py-6">
        <p className="text-gray-700 leading-relaxed mb-6">{theater.description}</p>

        {/* Date Selection */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Lịch chiếu phim</h2>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {['29/4', '30/4', '1/5', '2/5', '3/5', '4/5'].map((date, index) => (
              <button
                key={date}
                onClick={() => handleDateChange(date)}
                className={`flex flex-col items-center p-3 min-w-[80px] rounded-lg ${
                  activeDate === date
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="text-sm font-medium">{date}</span>
                <span className="text-xs mt-1">
                  {['Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'CN'][index]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Booking Button */}
        <div className="bg-yellow-100 p-4 rounded-lg mb-8 flex items-center">
          <div className="text-yellow-800 flex-1">
            <span className="inline-block mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </span>
            Nhấn vào suất chiếu để tiến hành mua vé
          </div>
        </div>

        {/* Nearby Theaters */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Rạp gần đây</h2>
          <div className="space-y-4">
            {nearbyTheaters.map((nearbyTheater) => (
              <Link
                key={nearbyTheater.id}
                href={`/theaters/${nearbyTheater.id}`}
                className="flex items-start p-3 border border-gray-100 rounded-lg hover:border-blue-100 hover:bg-blue-50/30 transition-all group"
              >
                <div className="w-10 h-10 mr-3 flex-shrink-0">
                  <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                    {nearbyTheater.name.charAt(0)}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">{nearbyTheater.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{nearbyTheater.address}</p>
                  {nearbyTheater.id === 'lotte-ung-van-khiem' && <p className="text-xs text-gray-400 mt-1">263m</p>}
                  {nearbyTheater.id === 'cgv-saigonres-nguyen-xi' && <p className="text-xs text-gray-400 mt-1">915m</p>}
                </div>
                <span className="text-blue-600 text-sm whitespace-nowrap">
                  Bản đồ
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Movie Showtimes */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Phim đang chiếu</h2>
          <div className="space-y-6">
            {movies.map(movie => (
              <div key={movie.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className={`p-4 flex items-center gap-4 cursor-pointer border-l-4 ${
                    selectedMovie === movie.id 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-transparent hover:bg-gray-50'
                  }`}
                  onClick={() => handleMovieSelect(movie.id)}
                >
                  <div className="w-20 h-28 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    {/* Movie poster placeholder */}
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Poster
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{movie.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">{movie.duration}</span>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">{movie.rating}</span>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">{movie.genre}</span>
                    </div>
                    <div className="mt-2">
                      <Link href="#" className="text-blue-600 text-sm">
                        Trailer
                      </Link>
                    </div>
                  </div>
                </div>
                
                {selectedMovie === movie.id && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex flex-wrap gap-3">
                      {activeDateShowtimes?.times.map((showtime, index) => (
                        <Link 
                          key={index} 
                          href="#"
                          className="px-4 py-2 bg-white border border-gray-200 rounded-md hover:border-blue-300 transition-colors text-center min-w-[70px]"
                        >
                          <div className="text-gray-900 font-medium">{showtime.time}</div>
                          <div className="text-gray-500 text-xs">{showtime.price}</div>
                        </Link>
                      ))}
                      
                      {!activeDateShowtimes || activeDateShowtimes.times.length === 0 ? (
                        <p className="text-gray-500 italic">Không có suất chiếu cho ngày đã chọn</p>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 