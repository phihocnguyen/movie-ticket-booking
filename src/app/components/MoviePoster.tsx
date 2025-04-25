'use client'
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface Movie {
  id: string;
  title: string;
  titleVi: string;
  imagePath: string;
  description: string;
  detailsLink: string;
}

const movies: Movie[] = [
  {
    id: 'house-with-clock',
    title: "House with a Clock in Its Walls",
    titleVi: "Ngôi Nhà Có Chiếc Đồng Hồ Ma Thuật",
    imagePath: "https://assets.glxplay.io/images/w1600/title/house-with-a-clock-in-its-walls_web_spotlight_62b8e08d26fa40510ca1bf18bddbc2fb.jpg",
    description: "Sau tai nạn thương tâm của bố mẹ, Lewis Barnavelt đến sống cùng người bác phù thủy ở một căn nhà dị thường. Trong lúc cậu mải mê khám phá phép thuật, một chiếc đồng hồ bí ẩn cũng đang rình rập cậu.",
    detailsLink: "/movies/house-with-clock"
  },
  {
    id: 'movie-2',
    title: "Movie 2",
    titleVi: "Phim Thứ Hai",
    imagePath: "https://assets.glxplay.io/images/w1600/title/moonbound_web_spotlight_5806ba2804204733f96815aa75c3c445.jpg",
    description: "Mô tả phim thứ hai sẽ hiển thị ở đây khi chuyển đến poster này.",
    detailsLink: "/movies/movie-2"
  },
  {
    id: 'movie-3',
    title: "Movie 3",
    titleVi: "Phim Thứ Ba",
    imagePath: "https://assets.glxplay.io/images/w1600/title/ainbo_web_spotlight_3e58b4acfb8799c9c766034c237b34de.jpg",
    description: "Mô tả phim thứ ba sẽ hiển thị ở đây khi chuyển đến poster này.",
    detailsLink: "/movies/movie-3"
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
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10" />
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
        
        {/* Content section with synchronized animation */}
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
            className="absolute bottom-0 left-0 z-20 p-6 w-full"
          >
            <h1 className="text-yellow-400 text-3xl font-bold mb-1">
              {currentMovie.title}
            </h1>
            <h2 className="text-yellow-400 text-xl mb-4">
              {currentMovie.titleVi}
            </h2>
            
            <p className="text-white mb-4 max-w-xl">
              {currentMovie.description}
            </p>
            
            <div className="flex space-x-4">
              <Link href={`/watch/${currentMovie.id}`} className="bg-blue-600 text-white py-2 px-6 rounded-full flex items-center hover:bg-blue-700 transition-colors">
                <span className="mr-2">▶</span> Xem phim
              </Link>
              <button 
                className="bg-gray-700 text-white py-2 px-6 rounded-full flex items-center hover:bg-gray-600 transition-colors"
                onClick={() => console.log(`Added ${currentMovie.title} to watchlist`)}
              >
                <span className="mr-2">+</span> Thêm vào danh sách
              </button>
            </div>
            
            <div className="mt-4">
              <Link href={currentMovie.detailsLink} className="text-gray-400 hover:text-white transition-colors">
                Xem chi tiết &gt;
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center z-30">
        <div className="flex items-center space-x-2 mx-6">
          {movies.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                currentIndex === index 
                  ? 'w-8 h-1 bg-white' 
                  : 'w-1 h-1 bg-gray-400'
              } rounded-full`}
              whileHover={{ scale: 1.2 }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-6 right-4 flex items-center space-x-2 z-30">
        <motion.button 
          onClick={prevSlide}
          className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Previous movie"
        >
          <FaChevronLeft size={16} className="text-black" />
        </motion.button>
        <motion.button 
          onClick={nextSlide}
          className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Next movie"
        >
          <FaChevronRight size={16} className="text-black" />
        </motion.button>
      </div>
    </div>
  );
};

export default MoviePoster;