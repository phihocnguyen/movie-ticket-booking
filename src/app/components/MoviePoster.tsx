'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlayIcon, 
  PlusIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  HeartIcon,
  StarIcon
} from '@heroicons/react/24/solid';
import { getRandomMovies } from '../movies/[id]/api';

interface Movie {
  id: string | number;
  title: string;
  titleVi: string;
  description: string;
  duration: number;
  language: string;
  genre: string[];
  releaseDate: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  director: string;
  actor: string;
  rating: number;
  country: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  showtimes: any[];
}

const MoviePoster: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const [isFavorited, setIsFavorited] = useState<boolean[]>([]);

  useEffect(() => {
    getRandomMovies().then((data) => {
      // Chuẩn hóa genre thành mảng nếu cần
      const normalized = data.map((item: any) => ({
        ...item,
        genre: item.genre
          ? (Array.isArray(item.genre)
              ? item.genre
              : item.genre.split(/\n|,/).map((g: string) => g.trim()).filter(Boolean))
          : [],
      }));
      setMovies(normalized);
      setIsFavorited(Array(normalized.length).fill(false));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white text-xl">Đang tải phim ngẫu nhiên...</div>
    );
  }
  if (!movies.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white text-xl">Không có phim nào!</div>
    );
  }

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

  const toggleFavorite = (index: number): void => {
    const newFavorites = [...isFavorited];
    newFavorites[index] = !newFavorites[index];
    setIsFavorited(newFavorites);
  };

  const currentMovie = movies[currentIndex];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 1.05
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    })
  };

  const contentVariants = {
    enter: {
      opacity: 0,
      y: 30
    },
    center: { 
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  const staggerChildren = {
    enter: { opacity: 0 },
    center: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    enter: { y: 20, opacity: 0 },
    center: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: { 
      y: 10, 
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon key={i} className="w-4 h-4 text-yellow-400" aria-hidden="true" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-4 h-4">
            <StarIcon className="absolute text-gray-400 w-4 h-4" aria-hidden="true" />
            <div className="absolute overflow-hidden w-2 h-4">
              <StarIcon className="text-yellow-400 w-4 h-4" aria-hidden="true" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <StarIcon key={i} className="w-4 h-4 text-gray-400" aria-hidden="true" />
        );
      }
    }
    
    return stars;
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute w-3/4 h-3/4 -top-1/4 -left-1/4 rounded-full bg-purple-600/20 blur-3xl"></div>
        <div className="absolute w-3/4 h-3/4 -bottom-1/4 -right-1/4 rounded-full bg-blue-600/20 blur-3xl"></div>
      </div>
      
      <div className="relative w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/10 to-black/60 z-10" />
        
        <div className="absolute inset-0 opacity-10 z-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(#111 1px, transparent 1px), linear-gradient(to right, #111 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
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
              opacity: { duration: 0.4 },
              scale: { duration: 0.5 }
            }}
            className="relative w-full h-full"
          >
            <Image 
              src={currentMovie.backdropUrl}
              alt={currentMovie.title}
              fill
              priority
              className="object-cover object-center"
              style={{ filter: 'brightness(0.95) contrast(1.05)' }}
              unoptimized
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/api/placeholder/1200/600';
              }}
            />
            
            <div 
              className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay" 
              style={{ 
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                backgroundRepeat: 'repeat',
                backgroundSize: '100px 100px'
              }}
            />
          </motion.div>
        </AnimatePresence>
        
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={`content-container-${currentIndex}`}
            className="absolute bottom-0 left-0 z-20 p-10 w-full max-w-4xl"
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <motion.div
              variants={staggerChildren}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <motion.div variants={itemVariants} className="flex items-center gap-4 mb-4">
                {currentMovie.rating && (
                  <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 shadow-sm">
                    <div className="flex items-center gap-1 mr-1.5">
                      {renderStars(currentMovie.rating)}
                    </div>
                    <span className="text-yellow-400 font-bold">
                      {currentMovie.rating.toFixed(1)}
                    </span>
                  </div>
                )}
                
                {currentMovie.releaseDate && (
                  <span className="bg-black/30 backdrop-blur-sm text-gray-200 text-sm font-medium px-3 py-1.5 rounded-full border border-white/10 shadow-sm">
                    {currentMovie.releaseDate}
                  </span>
                )}
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-white text-5xl font-bold mb-2 tracking-tight">
                {currentMovie.title}
              </motion.h1>
              <motion.h2 variants={itemVariants} className="text-gray-300 text-2xl mb-4 font-medium">
                {currentMovie.titleVi}
              </motion.h2>
              
              {currentMovie.genre && (
                <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-5">
                  {currentMovie.genre.map((g: string, i: number) => (
                    <span key={i} className="text-gray-200 text-sm bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 font-medium shadow-sm">
                      {g}
                    </span>
                  ))}
                </motion.div>
              )}
              
              <motion.p variants={itemVariants} className="text-gray-200 mb-8 max-w-2xl leading-relaxed text-lg py-2 rounded-xl">
                {currentMovie.description}
              </motion.p>
            
              <motion.div variants={itemVariants} className="flex gap-4 mb-6">
                <Link 
                  href={`/movies/${currentMovie.id}`} 
                  className="bg-red-600 hover:bg-red-700 text-white py-3.5 px-8 rounded-full flex items-center gap-2.5 transition-all duration-300 transform hover:scale-105 shadow-md shadow-red-600/20 font-medium text-lg"
                >
                  <PlayIcon className="w-5 h-5" />
                  <span>Xem chi tiết</span>
                </Link>
                
                <button 
                  className="bg-white/10 hover:bg-white/20 text-white py-3.5 px-7 rounded-full flex items-center gap-2.5 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/10 shadow-md font-medium"
                  onClick={() => console.log(`Added ${currentMovie.title} to watchlist`)}
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Danh sách</span>
                </button>
                
                <motion.button 
                  className={`p-3.5 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/10 shadow-sm ${
                    isFavorited[currentIndex] ? 'bg-red-600/80 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  onClick={() => toggleFavorite(currentIndex)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <HeartIcon className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center z-30">
        <div className="flex items-center gap-2 mx-6 bg-black/30 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/10 shadow-sm">
          {movies.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                currentIndex === index 
                  ? 'w-6 h-2 bg-white rounded-sm' 
                  : 'w-2 h-2 bg-gray-500 rounded-full hover:bg-gray-300'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-10 right-10 flex items-center gap-4 z-30">
        <motion.button 
          onClick={prevSlide}
          className="bg-black/30 hover:bg-black/40 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center shadow-sm border border-white/10"
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
          whileTap={{ scale: 0.9 }}
          aria-label="Previous movie"
        >
          <ChevronLeftIcon className="w-6 h-6 text-white" />
        </motion.button>
        
        <motion.button 
          onClick={nextSlide}
          className="bg-black/30 hover:bg-black/40 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center shadow-sm border border-white/10"
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
          whileTap={{ scale: 0.9 }}
          aria-label="Next movie"
        >
          <ChevronRightIcon className="w-6 h-6 text-white" />
        </motion.button>
      </div>
    </div>
  );
};

export default MoviePoster;