'use client'
import { useState, useRef, useEffect } from 'react';
import axiosInstance from '@/axiosInstance';

interface Movie {
  id: number;
  title: string;
  titleVi: string;
  originalTitle?: string; 
  imageUrl: string;
  posterUrl: string;
  genre: string[]
  hasSubtitles?: boolean;
  hasDubbing?: boolean;
}

interface MovieCarouselProps {
  title: string;
  movies?: Movie[];
}

export default function MovieCarousel({ title, movies }: MovieCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);


  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !carouselRef.current) return;
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('touchend', stopDragging);
    return () => {
      document.removeEventListener('mouseup', stopDragging);
      document.removeEventListener('touchend', stopDragging);
    };
  }, []);

  const addRandomSubtitleAndDubbing = (movie: any): any => {
  const hasSubtitles = movie.id % 3 !== 0; 
  const hasDubbing = movie.id % 2 === 0;  
  
  return {
    ...movie,
    hasSubtitles,
    hasDubbing
    };
  }

  return (
    <div className="w-full px-4 py-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <button className="bg-transparent text-white p-2 rounded-full">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
      
      <div 
        ref={carouselRef}
        className={`flex gap-4 overflow-x-hidden pb-6 cursor-grab scrollbar-hide px-4 ${isDragging ? 'cursor-grabbing' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={stopDragging}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies?.map((movie) => {
          const imageUrl = movie.imageUrl || movie.posterUrl;
          const displayTitle = movie.titleVi || movie.title;
          const originalTitle = movie.originalTitle || movie.title;
          movie = addRandomSubtitleAndDubbing(movie);
          return (
            <div 
              key={movie.id} 
              className="flex-none w-56 relative"
            >
              <div className="h-80 w-full rounded-lg overflow-hidden relative group">
                <img 
                  src={imageUrl} 
                  alt={displayTitle}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="flex gap-2 mb-2">
                    {movie.genre?.slice(0, 2).map((genre, idx) => (
                      <span key={idx} className="bg-gray-800/80 text-xs px-2 py-1 rounded">
                        {genre}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    {movie.hasSubtitles && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">P.Đề</span>
                    )}
                    {movie.hasDubbing && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">T.Minh</span>
                    )}
                    {(movie.hasSubtitles === false && movie.hasDubbing === false) && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">L.Tiếng</span>
                    )}
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-medium mt-2 truncate">{displayTitle}</h3>
              <p className="text-sm text-gray-400 truncate">{originalTitle}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}