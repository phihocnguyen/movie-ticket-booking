'use client'
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Search, Menu, X, User, Bell, ShoppingCart } from 'lucide-react';
import TheaterModal from './TheaterModal';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTheaterModalOpen, setIsTheaterModalOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  console.log(pathname);
  const isSeatSelection = pathname.includes("/seat-selection") || pathname.includes("/theaters")  ;
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
  console.log(isSeatSelection);
  return (
    <>
      <header 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/90 shadow-xl backdrop-blur-sm' : isSeatSelection ? 'bg-black' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3 z-10">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-white tracking-tight">
                MOVIE<span className="text-red-600">TICKETS</span>
              </span>
            </Link>
          </div>
          <nav className="hidden lg:flex space-x-8">
            <Link href="/" className="text-white hover:text-red-500 transition font-medium">Trang chủ</Link>
            <div className="group relative">
              <Link href="/movies" className="text-white hover:text-red-500 transition font-medium flex items-center">
                Phim
                <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <div className="absolute left-0 mt-2 w-48 bg-black/90 rounded-md shadow-lg overflow-hidden z-20 transform scale-0 group-hover:scale-100 transition-transform origin-top duration-200">
                <Link href="/now-showing-movies" className="block px-4 py-3 text-white hover:bg-red-600 transition">Phim đang chiếu</Link>
                <Link href="/upcoming-movies" className="block px-4 py-3 text-white hover:bg-red-600 transition">Phim sắp chiếu</Link>
                <Link href="/top-rated-movies" className="block px-4 py-3 text-white hover:bg-red-600 transition">Phim đánh giá cao</Link>
              </div>
            </div>
            <button
              onClick={openTheaterModal}
              className="text-white hover:text-red-500 transition font-medium flex items-center"
            >
              Rạp
              <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Link href="/promotions" className="text-white hover:text-red-500 transition font-medium">Khuyến mãi</Link>
            <Link href="/news" className="text-white hover:text-red-500 transition font-medium">Tin tức</Link>
          </nav>
          <div className="flex items-center space-x-6 z-10">
            <div className={`hidden md:flex items-center transition-all duration-300 ${isSearchOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Tìm kiếm phim..."
                className="w-full bg-gray-800/70 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <button onClick={toggleSearch} className="text-white hover:text-red-500 transition">
              <Search size={20} />
            </button>
            
            <Link href="/cart" className="text-white hover:text-red-500 transition relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
            </Link>
            
            <Link href="/notifications" className="text-white hover:text-red-500 transition relative hidden md:block">
              <Bell size={20} />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
            </Link>
            
            <div className="hidden md:block">
              <Link href="/login" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-4 py-2 rounded-md transition font-medium">
                Đăng nhập
              </Link>
            </div>
            <button className="lg:hidden text-white focus:outline-none" onClick={toggleMenu}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        <div className={`lg:hidden absolute top-full left-0 w-full bg-black/95 shadow-xl transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="container mx-auto px-4 py-4">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Tìm kiếm phim..."
                className="w-full bg-gray-800/70 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-white hover:text-red-500 transition py-2 border-b border-gray-700">Trang chủ</Link>
              <div>
                <Link href="/movies" className="text-white hover:text-red-500 transition py-2 border-b border-gray-700 block">Phim</Link>
                <div className="pl-4 mt-2 space-y-2">
                  <Link href="/now-showing-movies" className="text-gray-300 hover:text-red-500 transition py-1 block">Phim đang chiếuuu</Link>
                  <Link href="/upcoming-movies" className="text-gray-300 hover:text-red-500 transition py-1 block">Phim sắp chiếu</Link>
                  <Link href="/top-rated-movies" className="text-gray-300 hover:text-red-500 transition py-1 block">Phim đánh giá cao</Link>
                </div>
              </div>
              <div>
                <button
                  onClick={openTheaterModal}
                  className="text-white hover:text-red-500 transition py-2 border-b border-gray-700 block w-full text-left"
                >
                  Rạp
                </button>
              </div>
              <Link href="/promotions" className="text-white hover:text-red-500 transition py-2 border-b border-gray-700">Khuyến mãi</Link>
              <Link href="/news" className="text-white hover:text-red-500 transition py-2 border-b border-gray-700">Tin tức</Link>
              <div className="flex items-center pt-2">
                <Link href="/login" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-6 py-3 rounded-md transition w-full text-center font-medium">
                  Đăng nhập
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