'use client'
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, User, Bell, ShoppingCart } from 'lucide-react';
import TheaterModal from './TheaterModal';

interface Movie {
  id: number;
  title: string;
  originalTitle: string;
  poster: string;
  season?: string;
  year?: string;
  duration?: string;
  episode?: string;
}

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTheaterModalOpen, setIsTheaterModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const isSeatSelection = pathname?.includes("/seat-selection") || 
                         pathname?.includes("/theaters") || 
                         pathname?.includes('/login') || 
                         pathname?.includes('/register') ||
                         pathname?.includes('/food-selection') || 
                         pathname?.includes('/payment') || 
                         pathname?.includes('/booking-success');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) {
      setSearchResults([]);
      setSearchValue('');
      return;
    }

    if (searchValue.trim() === '') {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(() => {
      const mockMovies: Movie[] = [
        {
          id: 1,
          title: 'Người Hòa Giải',
          originalTitle: 'Peacemaker',
          poster: 'https://image.tmdb.org/t/p/w92/7R6rNMiQz2l3QHh2KQ6lVnQh5ZL.jpg',
          season: 'T13',
          episode: 'Tập 8',
        },
        {
          id: 2,
          title: 'Giải Phóng Sài Gòn',
          originalTitle: 'Liberation of Saigon',
          poster: 'https://image.tmdb.org/t/p/w92/2uNW4WbgBXL25BAbXGLnLqX71Sw.jpg',
          season: 'T16',
          year: '2005',
          duration: '2h 00m',
        },
        {
          id: 3,
          title: 'Giải Mã Kỳ Án',
          originalTitle: 'Fringe',
          poster: 'https://image.tmdb.org/t/p/w92/6u1fYtxG5eqjhtCPDx04pJphQRW.jpg',
          season: 'T16',
          episode: 'Tập 13',
        },
        {
          id: 4,
          title: 'Giải Mã Mê Cung',
          originalTitle: 'The Maze Runner',
          poster: 'https://image.tmdb.org/t/p/w92/coss7RgL0NH6g4fC2s5atvf3dFO.jpg',
          season: 'T16',
          year: '2014',
          duration: '1h 53m',
        },
        {
          id: 5,
          title: 'Giải Mã Gonjiam',
          originalTitle: 'Gonjiam: Haunted Asylum',
          poster: 'https://image.tmdb.org/t/p/w92/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
          season: 'T16',
          year: '2018',
          duration: '1h 35m',
        },
      ];

      const filtered = mockMovies.filter(movie =>
        movie.title.toLowerCase().includes(searchValue.toLowerCase())
      );
      setSearchResults(filtered);
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchValue, isSearchOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const openTheaterModal = () => {
    setIsTheaterModalOpen(true);
  };

  const closeTheaterModal = () => {
    setIsTheaterModalOpen(false);
  };

  return (
    <>
      <header 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/90 shadow-xl backdrop-blur-sm' : isSeatSelection ? 'bg-black' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 z-10">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-white tracking-tight">
                MOVIE<span className="text-[var(--color-indigo-600)]">TICKETS</span>
              </span>
            </Link>
          </div>
          <nav className="hidden lg:flex space-x-8">
            <Link href="/" className="text-white hover:text-[var(--color-indigo-600)] transition font-medium">Trang chủ</Link>
            <div className="group relative">
              <Link href="/movies" className="text-white hover:text-[var(--color-indigo-600)] transition font-medium flex items-center">
                Phim
                <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <div className="absolute left-0 mt-2 w-48 bg-black/90 rounded-md shadow-lg overflow-hidden z-20 transform scale-0 group-hover:scale-100 transition-transform origin-top duration-200">
                <Link href="/now-showing-movies" className="block px-4 py-3 text-white hover:bg-[var(--color-indigo-600)] transition">Phim đang chiếu</Link>
                <Link href="/upcoming-movies" className="block px-4 py-3 text-white hover:bg-[var(--color-indigo-600)] transition">Phim sắp chiếu</Link>
                <Link href="/top-rated-movies" className="block px-4 py-3 text-white hover:bg-[var(--color-indigo-600)] transition">Phim đánh giá cao</Link>
              </div>
            </div>
            <button
              onClick={openTheaterModal}
              className="text-white hover:text-[var(--color-indigo-600)] transition font-medium flex items-center"
            >
              Rạp
              <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Link href="/promotions" className="text-white hover:text-[var(--color-indigo-600)] transition font-medium">Khuyến mãi</Link>
            <Link href="/news" className="text-white hover:text-[var(--color-indigo-600)] transition font-medium">Tin tức</Link>
          </nav>
          <div className="flex items-center space-x-6 z-10">
            <div className={`hidden md:flex items-center transition-all duration-300 ${isSearchOpen ? 'w-80' : 'w-0 overflow-hidden'} relative`}>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Tìm kiếm phim..."
                className="w-full bg-gray-800/70 text-white px-4 py-2 rounded-full"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              {isSearchOpen && searchValue && (
                <div className="absolute top-12 left-0 w-full bg-[#181A20] rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto p-2">
                  <div className="px-2 pt-2 pb-1 text-gray-300 text-sm font-semibold">Danh sách phim</div>
                  {isSearching ? (
                    <div className="p-4 text-gray-500">Đang tìm kiếm...</div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map(movie => (
                      <Link
                        key={movie.id}
                        href={`/movies/${movie.id}`}
                        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#23242b] transition-colors"
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchValue('');
                        }}
                      >
                        <img src={movie.poster} alt={movie.title} className="w-12 h-16 object-cover rounded-md flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-base font-semibold text-white truncate">{movie.title}</div>
                          <div className="text-xs text-gray-400 truncate">{movie.originalTitle}</div>
                          <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-400 mt-1">
                            {movie.season && <span>{movie.season}</span>}
                            {movie.year && <span>{movie.year}</span>}
                            {movie.duration && <span>{movie.duration}</span>}
                            {movie.episode && <span>{movie.episode}</span>}
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-gray-500">Không tìm thấy phim nào</div>
                  )}
                </div>
              )}
            </div>
            
            <button onClick={toggleSearch} className="text-white hover:text-[var(--color-indigo-600)] transition">
              <Search size={20} />
            </button>
            
            <Link href="/cart" className="text-white hover:text-[var(--color-indigo-600)] transition relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-[var(--color-indigo-600)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
            </Link>
            
            <Link href="/notifications" className="text-white hover:text-[var(--color-indigo-600)] transition relative hidden md:block">
              <Bell size={20} />
              <span className="absolute -top-2 -right-2 bg-[var(--color-indigo-600)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
            </Link>
            
            <div className="hidden md:block">
              <Link 
                href="/login" 
                className="flex items-center justify-center rounded-full text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                title="Đăng nhập"
              >
                <User size={20} />
              </Link>
            </div>
            <button className="lg:hidden text-white focus:outline-none" onClick={toggleMenu}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        <div className={`lg:hidden absolute top-full left-0 w-full bg-black/95 shadow-xl transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="container mx-auto px-4 py-4">
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Tìm kiếm phim..."
                className="w-full bg-gray-800/70 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo-600)]"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              {isMenuOpen && searchValue && (
                <div className="absolute top-14 left-0 w-full bg-[#181A20] rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto p-2">
                  <div className="px-2 pt-2 pb-1 text-gray-300 text-sm font-semibold">Danh sách phim</div>
                  {isSearching ? (
                    <div className="p-4 text-gray-500">Đang tìm kiếm...</div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map(movie => (
                      <Link
                        key={movie.id}
                        href={`/movies/${movie.id}`}
                        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#23242b] transition-colors"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setSearchValue('');
                        }}
                      >
                        <img src={movie.poster} alt={movie.title} className="w-12 h-16 object-cover rounded-md flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-base font-semibold text-white truncate">{movie.title}</div>
                          <div className="text-xs text-gray-400 truncate">{movie.originalTitle}</div>
                          <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-400 mt-1">
                            {movie.season && <span>{movie.season}</span>}
                            {movie.year && <span>{movie.year}</span>}
                            {movie.duration && <span>{movie.duration}</span>}
                            {movie.episode && <span>{movie.episode}</span>}
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-gray-500">Không tìm thấy phim nào</div>
                  )}
                </div>
              )}
            </div>
            
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-white hover:text-[var(--color-indigo-600)] transition py-2 border-b border-gray-700">Trang chủ</Link>
              <div>
                <Link href="/movies" className="text-white hover:text-[var(--color-indigo-600)] transition py-2 border-b border-gray-700 block">Phim</Link>
                <div className="pl-4 mt-2 space-y-2">
                  <Link href="/now-showing-movies" className="text-gray-300 hover:text-[var(--color-indigo-600)] transition py-1 block">Phim đang chiếu</Link>
                  <Link href="/upcoming-movies" className="text-gray-300 hover:text-[var(--color-indigo-600)] transition py-1 block">Phim sắp chiếu</Link>
                  <Link href="/top-rated-movies" className="text-gray-300 hover:text-[var(--color-indigo-600)] transition py-1 block">Phim đánh giá cao</Link>
                </div>
              </div>
              <div>
                <button
                  onClick={openTheaterModal}
                  className="text-white hover:text-[var(--color-indigo-600)] transition py-2 border-b border-gray-700 block w-full text-left"
                >
                  Rạp
                </button>
              </div>
              <Link href="/promotions" className="text-white hover:text-[var(--color-indigo-600)] transition py-2 border-b border-gray-700">Khuyến mãi</Link>
              <Link href="/news" className="text-white hover:text-[var(--color-indigo-600)] transition py-2 border-b border-gray-700">Tin tức</Link>
              <div className="flex items-center pt-2">
                <Link 
                  href="/login" 
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-indigo-600)] hover:bg-[var(--color-indigo-700)] text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 mx-auto"
                  title="Đăng nhập"
                >
                  <User size={24} />
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <TheaterModal isOpen={isTheaterModalOpen} onClose={closeTheaterModal} />
    </>
  );
};

export default Header;