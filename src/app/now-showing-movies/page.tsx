'use client'
import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

type Movie = {
  id: number;
  title: string;
  releaseDate: string;
  rating?: number;
  posterUrl: string;
  isNew?: boolean;
  isPromoted?: boolean;
  genre?: string;
  language?: string;
};

export default function NowShowingMovies() {
  const [favoriteMovies, setFavoriteMovies] = useState<number[]>([]);
  const [sortFilter, setSortFilter] = useState<string>('popular');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [showSortDropdown, setShowSortDropdown] = useState<boolean>(false);
  const [showGenreDropdown, setShowGenreDropdown] = useState<boolean>(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState<boolean>(false);

  const toggleFavorite = (movieId: number) => {
    setFavoriteMovies(prev => 
      prev.includes(movieId) 
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId]
    );
  };
  
  const movies: Movie[] = [
    {
      id: 1,
      title: 'Lật Mặt 8: Vòng Tay Nắng',
      releaseDate: '30/04',
      rating: 80,
      posterUrl: 'https://cdn.moveek.com/storage/media/cache/tall/6800eee70e4ed913428686.jpg',
      isPromoted: true,
      genre: 'Hành động',
      language: 'Tiếng Việt'
    },
    {
      id: 2,
      title: 'Thám Tử Kiến',
      releaseDate: '28/04',
      rating: 98,
      posterUrl: 'https://cdn.moveek.com/storage/media/cache/tall/67c79cebbb949380892915.jpg',
      isNew: true,
      genre: 'Hài',
      language: 'Tiếng Anh'
    },
    {
      id: 3,
      title: 'Địa Đạo: Mặt Trận Bí Mật',
      releaseDate: '04/04',
      rating: 87,
      posterUrl: 'https://cdn.moveek.com/storage/media/cache/tall/67c85e3ee0d6e851549391.jpg',
      genre: 'Hành động',
      language: 'Tiếng Việt'
    },
    {
      id: 4,
      title: 'Looney Tunes: Ngày Trái Đất Nổ Tung',
      releaseDate: '25/04',
      posterUrl: 'https://cdn.moveek.com/storage/media/cache/tall/68060c13a031e847993393.jpg',
      genre: 'Gia Đình',
      language: 'Tiếng Anh'
    },
    {
      id: 5,
      title: 'Lật Mặt 8: Vòng Tay Nắng',
      releaseDate: '30/04',
      rating: 80,
      posterUrl: 'https://cdn.moveek.com/storage/media/cache/tall/6800eee70e4ed913428686.jpg',
      isPromoted: true,
      genre: 'Hành động',
      language: 'Tiếng Việt'
    },
    {
      id: 6,
      title: 'Thám Tử Kiến',
      releaseDate: '28/04',
      rating: 98,
      posterUrl: 'https://cdn.moveek.com/storage/media/cache/tall/67c79cebbb949380892915.jpg',
      isNew: true,
      genre: 'Hài',
      language: 'Tiếng Anh'
    },
    {
      id: 7,
      title: 'Địa Đạo: Mặt Trận Bí Mật',
      releaseDate: '04/04',
      rating: 87,
      posterUrl: 'https://cdn.moveek.com/storage/media/cache/tall/67c85e3ee0d6e851549391.jpg',
      genre: 'Kinh Dị',
      language: 'Tiếng Việt'
    },
    {
      id: 8,
      title: 'Looney Tunes: Ngày Trái Đất Nổ Tung',
      releaseDate: '25/04',
      posterUrl: 'https://cdn.moveek.com/storage/media/cache/tall/68060c13a031e847993393.jpg',
      genre: 'Gia Đình',
      language: 'Tiếng Anh'
    },
    {
      id: 9,
      title: 'Lật Mặt 8: Vòng Tay Nắng',
      releaseDate: '30/04',
      rating: 80,
      posterUrl: 'https://cdn.moveek.com/storage/media/cache/tall/6800eee70e4ed913428686.jpg',
      isPromoted: true,
      genre: 'Tình Cảm',
      language: 'Tiếng Việt'
    },
    {
      id: 10,
      title: 'Thám Tử Kiến',
      releaseDate: '28/04',
      rating: 98,
      posterUrl: 'https://cdn.moveek.com/storage/media/cache/tall/67c79cebbb949380892915.jpg',
      isNew: true,
      genre: 'Tâm lý',
      language: 'Tiếng Trung'
    },
    {
      id: 11,
      title: 'Địa Đạo: Mặt Trận Bí Mật',
      releaseDate: '04/04',
      rating: 87,
      posterUrl: 'https://cdn.moveek.com/storage/media/cache/tall/67c85e3ee0d6e851549391.jpg',
      genre: 'Kinh Dị',
      language: 'Tiếng Hàn'
    },
    {
      id: 12,
      title: 'Looney Tunes: Ngày Trái Đất Nổ Tung',
      releaseDate: '25/04',
      posterUrl: 'https://cdn.moveek.com/storage/media/cache/tall/68060c13a031e847993393.jpg',
      genre: 'Gia Đình',
      language: 'Tiếng Anh'
    },
    {
      id: 13,
      title: 'Địa Đạo: Mặt Trận Bí Mật',
      releaseDate: '04/04',
      rating: 87,
      posterUrl: 'https://cdn.moveek.com/storage/media/cache/tall/67c85e3ee0d6e851549391.jpg',
      genre: 'Kinh Dị',
      language: 'Tiếng Hàn'
    },
    {
      id: 14,
      title: 'Looney Tunes: Ngày Trái Đất Nổ Tung',
      releaseDate: '25/04',
      posterUrl: 'https://cdn.moveek.com/storage/media/cache/tall/68060c13a031e847993393.jpg',
      genre: 'Gia Đình',
      language: 'Tiếng Anh'
    },
  ];

  const filteredMovies = movies.filter(movie => {
    // Filter by genre
    if (genreFilter !== 'all' && movie.genre !== genreFilter) {
      return false;
    }
    
    // Filter by language
    if (languageFilter !== 'all' && movie.language !== languageFilter) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort by selected criteria
    if (sortFilter === 'newest') {
      // Convert DD/MM to comparable dates for sorting
      const dateA = a.releaseDate.split('/').reverse().join('');
      const dateB = b.releaseDate.split('/').reverse().join('');
      return dateB.localeCompare(dateA);
    } else if (sortFilter === 'popular') {
      // Sort by rating (higher first)
      return (b.rating || 0) - (a.rating || 0);
    }
    return 0;
  });

  return (
    <>
      <Head>
        <title>Phim đang chiếu | Moviesite</title>
        <meta name="description" content="Danh sách phim đang chiếu rạp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main>
        {/* Hero Banner */}
        <div className="relative w-full h-64 md:h-80">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-80 z-10"></div>
          <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://cdn.moveek.com/build/images/tix-banner.ed8b6071.png')"}}></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-20 px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Phim đang chiếu</h1>
            <p className="text-sm md:text-base text-center max-w-3xl">
              Danh sách các phim đang được chiếu tại các hệ thống rạp trên toàn quốc.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="inline-block relative">
              <button 
                onClick={() => {
                  setShowSortDropdown(!showSortDropdown);
                  setShowGenreDropdown(false);
                  setShowLanguageDropdown(false);
                }}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                {sortFilter === 'popular' ? 'Phổ biến' : 'Mới nhất'}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showSortDropdown && (
                <div className="absolute mt-1 w-40 bg-white rounded-md shadow-lg z-50">
                  <ul className="py-1">
                    <li 
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${sortFilter === 'popular' ? 'bg-gray-100' : ''}`}
                      onClick={() => {
                        setSortFilter('popular');
                        setShowSortDropdown(false);
                      }}
                    >
                      Phổ biến
                    </li>
                    <li 
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${sortFilter === 'newest' ? 'bg-gray-100' : ''}`}
                      onClick={() => {
                        setSortFilter('newest');
                        setShowSortDropdown(false);
                      }}
                    >
                      Mới nhất
                    </li>
                  </ul>
                </div>
              )}
            </div>
            
            <div className="inline-block relative">
              <button 
                onClick={() => {
                  setShowGenreDropdown(!showGenreDropdown);
                  setShowSortDropdown(false);
                  setShowLanguageDropdown(false);
                }}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Thể loại: {genreFilter === 'all' ? 'Tất cả' : genreFilter}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showGenreDropdown && (
                <div className="absolute mt-1 w-40 bg-white rounded-md shadow-lg z-50">
                  <ul className="py-1">
                    <li 
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${genreFilter === 'all' ? 'bg-gray-100' : ''}`}
                      onClick={() => {
                        setGenreFilter('all');
                        setShowGenreDropdown(false);
                      }}
                    >
                      Tất cả
                    </li>
                    <li 
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${genreFilter === 'Hành động' ? 'bg-gray-100' : ''}`}
                      onClick={() => {
                        setGenreFilter('Hành động');
                        setShowGenreDropdown(false);
                      }}
                    >
                      Hành động
                    </li>
                    <li 
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${genreFilter === 'Hài' ? 'bg-gray-100' : ''}`}
                      onClick={() => {
                        setGenreFilter('Hài');
                        setShowGenreDropdown(false);
                      }}
                    >
                      Hài
                    </li>
                    <li 
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${genreFilter === 'Kinh Dị' ? 'bg-gray-100' : ''}`}
                      onClick={() => {
                        setGenreFilter('Kinh Dị');
                        setShowGenreDropdown(false);
                      }}
                    >
                      Kinh Dị
                    </li>
                    <li 
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${genreFilter === 'Gia Đình' ? 'bg-gray-100' : ''}`}
                      onClick={() => {
                        setGenreFilter('Gia Đình');
                        setShowGenreDropdown(false);
                      }}
                    >
                      Gia Đình
                    </li>
                    <li 
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${genreFilter === 'Tình Cảm' ? 'bg-gray-100' : ''}`}
                      onClick={() => {
                        setGenreFilter('Tình Cảm');
                        setShowGenreDropdown(false);
                      }}
                    >
                      Tình Cảm
                    </li>
                    <li 
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${genreFilter === 'Tâm lý' ? 'bg-gray-100' : ''}`}
                      onClick={() => {
                        setGenreFilter('Tâm lý');
                        setShowGenreDropdown(false);
                      }}
                    >
                      Tâm lý
                    </li>
                  </ul>
                </div>
              )}
            </div>
            
            <div className="inline-block relative">
              <button 
                onClick={() => {
                  setShowLanguageDropdown(!showLanguageDropdown);
                  setShowSortDropdown(false);
                  setShowGenreDropdown(false);
                }}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Ngôn ngữ: {languageFilter === 'all' ? 'Tất cả' : languageFilter}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showLanguageDropdown && (
                <div className="absolute mt-1 w-40 bg-white rounded-md shadow-lg z-50">
                  <ul className="py-1">
                    <li 
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${languageFilter === 'all' ? 'bg-gray-100' : ''}`}
                      onClick={() => {
                        setLanguageFilter('all');
                        setShowLanguageDropdown(false);
                      }}
                    >
                      Tất cả
                    </li>
                    <li 
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${languageFilter === 'Tiếng Việt' ? 'bg-gray-100' : ''}`}
                      onClick={() => {
                        setLanguageFilter('Tiếng Việt');
                        setShowLanguageDropdown(false);
                      }}
                    >
                      Tiếng Việt
                    </li>
                    <li 
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${languageFilter === 'Tiếng Anh' ? 'bg-gray-100' : ''}`}
                      onClick={() => {
                        setLanguageFilter('Tiếng Anh');
                        setShowLanguageDropdown(false);
                      }}
                    >
                      Tiếng Anh
                    </li>
                    <li 
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${languageFilter === 'Tiếng Trung' ? 'bg-gray-100' : ''}`}
                      onClick={() => {
                        setLanguageFilter('Tiếng Trung');
                        setShowLanguageDropdown(false);
                      }}
                    >
                      Tiếng Trung
                    </li>
                    <li 
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${languageFilter === 'Tiếng Hàn' ? 'bg-gray-100' : ''}`}
                      onClick={() => {
                        setLanguageFilter('Tiếng Hàn');
                        setShowLanguageDropdown(false);
                      }}
                    >
                      Tiếng Hàn
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Movies Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredMovies.map((movie) => (
              <div key={movie.id} className="relative rounded-lg overflow-hidden shadow-md bg-white">
                <div className="relative h-56 sm:h-64">
                  <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                    <div className="w-full h-full relative">
                      <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url(${movie.posterUrl})`}}></div>
                    </div>
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {movie.isNew && (
                      <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                        MỚI
                      </span>
                    )}
                    {movie.isPromoted && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        ĐƯỢC TÀI TRỢ
                      </span>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button 
                      onClick={() => toggleFavorite(movie.id)}
                      className="w-8 h-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5" 
                        fill={favoriteMovies.includes(movie.id) ? "currentColor" : "none"} 
                        viewBox="0 0 24 24" 
                        stroke="white"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    
                    <button className="w-8 h-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="white">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="p-3">
                  <h3 className="font-medium text-sm mb-1 truncate" title={movie.title}>
                    {movie.title}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs">{movie.releaseDate}</span>
                    {movie.rating && (
                      <span className="text-green-500 text-xs font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {movie.rating}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
} 