'use client'
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight, FaPlay, FaPlus, FaInfoCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface Movie {
  id: string;
  title: string;
  titleVi: string;
  imagePath: string;
  description: string;
  detailsLink: string;
  genre?: string[];
  year?: number;
  rating?: number;
}

const movies: Movie[] = [
  {
    id: 'house-with-clock',
    title: "House with a Clock in Its Walls",
    titleVi: "Ngôi Nhà Có Chiếc Đồng Hồ Ma Thuật",
    imagePath: "https://assets.glxplay.io/images/w1600/title/house-with-a-clock-in-its-walls_web_spotlight_62b8e08d26fa40510ca1bf18bddbc2fb.jpg",
    description: "Sau tai nạn thương tâm của bố mẹ, Lewis Barnavelt đến sống cùng người bác phù thủy ở một căn nhà dị thường. Trong lúc cậu mải mê khám phá phép thuật, một chiếc đồng hồ bí ẩn cũng đang rình rập cậu.",
    detailsLink: "/movies/house-with-clock",
    genre: ["Fantasy", "Adventure", "Family"],
    year: 2018,
    rating: 7.2
  },
  {
    id: 'movie-2',
    title: "Movie 2",
    titleVi: "Phim Thứ Hai",
    imagePath: "https://assets.glxplay.io/images/w1600/title/moonbound_web_spotlight_5806ba2804204733f96815aa75c3c445.jpg",
    description: "Mô tả phim thứ hai sẽ hiển thị ở đây khi chuyển đến poster này.",
    detailsLink: "/movies/movie-2",
    genre: ["Animation", "Adventure"],
    year: 2021,
    rating: 6.8
  },
  {
    id: 'movie-3',
    title: "Movie 3",
    titleVi: "Phim Thứ Ba",
    imagePath: "https://assets.glxplay.io/images/w1600/title/ainbo_web_spotlight_3e58b4acfb8799c9c766034c237b34de.jpg",
    description: "Mô tả phim thứ ba sẽ hiển thị ở đây khi chuyển đến poster này.",
    detailsLink: "/movies/movie-3",
    genre: ["Animation", "Action"],
    year: 2022,
    rating: 7.5
  },
];

const MoviePoster: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  
  const nextSlide = (): void => {
    setDirection(1);
    setCurrentIndex((prevIndex) => 
      prevIndex === movies.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = (): void => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number): void => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const currentMovie = movies[currentIndex];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const contentVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div className="relative w-full h-screen">
      <div className="relative w-full h-full bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent z-10" />
        
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={`image-${currentIndex}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="relative w-full h-full"
          >
            <Image 
              src={currentMovie.imagePath}
              alt={currentMovie.title}
              fill
              priority
              className="object-cover"
              unoptimized
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/api/placeholder/1200/600';
              }}
            />
          </motion.div>
        </AnimatePresence>
        
        <AnimatePresence initial={false} custom={direction}>
          <motion.div 
            key={`content-${currentIndex}`}
            custom={direction}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 }
            }}
            className="absolute bottom-0 left-0 z-20 p-8 w-full max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-3">
              {currentMovie.rating && (
                <div className="flex items-center bg-yellow-500/20 px-2 py-1 rounded">
                  <span className="text-yellow-400 font-bold text-sm">
                    {currentMovie.rating.toFixed(1)}
                  </span>
                  <span className="text-yellow-400/80 text-xs ml-1">★</span>
                </div>
              )}
              {currentMovie.year && (
                <span className="text-gray-300 text-sm">{currentMovie.year}</span>
              )}
              {currentMovie.genre && (
                <div className="flex gap-2">
                  {currentMovie.genre.slice(0, 2).map((g, i) => (
                    <span key={i} className="text-gray-300 text-sm border border-gray-500 px-2 py-0.5 rounded-full">
                      {g}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <h1 className="text-white text-4xl font-bold mb-1 drop-shadow-lg">
              {currentMovie.title}
            </h1>
            <h2 className="text-gray-300 text-2xl mb-4 drop-shadow-lg">
              {currentMovie.titleVi}
            </h2>
            
            <p className="text-gray-200 mb-6 max-w-2xl leading-relaxed drop-shadow-lg">
              {currentMovie.description}
            </p>
          
            <div className="flex gap-4 mb-6">
              <Link 
                href={`/watch/${currentMovie.id}`} 
                className="bg-red-600 hover:bg-red-700 text-white py-3 px-8 rounded-full flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
              >
                <FaInfoCircle className="text-sm" />
                <span>Xem chi tiết</span>
              </Link>
              <button 
                className="bg-gray-700/80 hover:bg-gray-600/90 text-white py-3 px-6 rounded-full flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
                onClick={() => console.log(`Added ${currentMovie.title} to watchlist`)}
              >
                <FaPlus className="text-sm" />
                <span>Danh sách</span>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center z-30">
        <div className="flex items-center gap-2 mx-6 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
          {movies.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                currentIndex === index 
                  ? 'w-4 h-2 bg-white rounded-sm' 
                  : 'w-2 h-2 bg-gray-500 rounded-full hover:bg-gray-300'
              }`}
              whileHover={{ scale: 1.2 }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-8 right-8 flex items-center gap-3 z-30">
        <motion.button 
          onClick={prevSlide}
          className="bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center shadow-lg border border-gray-600/30"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Previous movie"
        >
          <FaChevronLeft size={18} className="text-white" />
        </motion.button>
        <motion.button 
          onClick={nextSlide}
          className="bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center shadow-lg border border-gray-600/30"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Next movie"
        >
          <FaChevronRight size={18} className="text-white" />
        </motion.button>
      </div>
    </div>
  );
};

export default MoviePoster;