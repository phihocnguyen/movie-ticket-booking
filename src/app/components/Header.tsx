"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Menu,
  X,
  User,
  Bell,
  ShoppingCart,
  Film,
  Ticket,
  Settings,
  LogOut,
} from "lucide-react";
import TheaterModal from "./TheaterModal";
import { authService } from "@/app/services/authService";
import { useAuth } from "../context/AuthContext";
import NotificationModal from "./NotificationModal";

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

interface UserData {
  username: string;
  role: string;
  fullName: string;
}

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTheaterModalOpen, setIsTheaterModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const isSeatSelection =
    pathname?.includes("/seat-selection") ||
    pathname?.includes("/theaters") ||
    pathname?.includes("/login") ||
    pathname?.includes("/register") ||
    pathname?.includes("/food-selection") ||
    pathname?.includes("/payment") ||
    pathname?.includes("/booking-success");
  const { userData, isAuthenticated, updateAuthState } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3); // Mock unread count

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) {
      setSearchResults([]);
      setSearchValue("");
      return;
    }

    if (searchValue.trim() === "") {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(() => {
      const mockMovies: Movie[] = [
        {
          id: 1,
          title: "Người Hòa Giải",
          originalTitle: "Peacemaker",
          poster:
            "https://image.tmdb.org/t/p/w92/7R6rNMiQz2l3QHh2KQ6lVnQh5ZL.jpg",
          season: "T13",
          episode: "Tập 8",
        },
        {
          id: 2,
          title: "Giải Phóng Sài Gòn",
          originalTitle: "Liberation of Saigon",
          poster:
            "https://image.tmdb.org/t/p/w92/2uNW4WbgBXL25BAbXGLnLqX71Sw.jpg",
          season: "T16",
          year: "2005",
          duration: "2h 00m",
        },
        {
          id: 3,
          title: "Giải Mã Kỳ Án",
          originalTitle: "Fringe",
          poster:
            "https://image.tmdb.org/t/p/w92/6u1fYtxG5eqjhtCPDx04pJphQRW.jpg",
          season: "T16",
          episode: "Tập 13",
        },
        {
          id: 4,
          title: "Giải Mã Mê Cung",
          originalTitle: "The Maze Runner",
          poster:
            "https://image.tmdb.org/t/p/w92/coss7RgL0NH6g4fC2s5atvf3dFO.jpg",
          season: "T16",
          year: "2014",
          duration: "1h 53m",
        },
        {
          id: 5,
          title: "Giải Mã Gonjiam",
          originalTitle: "Gonjiam: Haunted Asylum",
          poster:
            "https://image.tmdb.org/t/p/w92/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
          season: "T16",
          year: "2018",
          duration: "1h 35m",
        },
      ];

      const filtered = mockMovies.filter((movie) =>
        movie.title.toLowerCase().includes(searchValue.toLowerCase())
      );
      setSearchResults(filtered);
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchValue, isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Register auth state change listener
    authService.onAuthStateChange(updateAuthState);
    return () => authService.removeAuthStateChangeListener();
  }, [updateAuthState]);

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

  const toggleNotificationModal = () => {
    setIsNotificationModalOpen(!isNotificationModalOpen);
  };

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-gradient-to-b from-black/95 to-black/80 shadow-xl backdrop-blur-md shadow-black/40"
            : isSeatSelection
            ? "bg-black"
            : "bg-gradient-to-b from-black/80 to-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          {/* Film strip decoration at top */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-black via-indigo-600 to-black"></div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 z-10">
              <Link href="/" className="flex items-center group">
                <div className="relative mr-2">
                  <Ticket
                    size={28}
                    className="text-indigo-500 group-hover:text-white transition-colors duration-300"
                    fill="rgba(99, 102, 241, 0.2)"
                  />
                  <Film
                    size={20}
                    className="absolute -top-1 -right-1 text-white group-hover:text-indigo-500 transition-colors duration-300"
                  />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight flex items-center">
                  MOVIE
                  <span className="text-indigo-500 relative">
                    TICKETS
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </span>
                </span>
              </Link>
            </div>

            <nav className="hidden lg:flex space-x-8">
              <NavLink href="/" label="Trang chủ" />

              <div className="group relative">
                <NavLink
                  href="#"
                  label={
                    <span className="flex items-center">
                      Phim
                      <svg
                        className="ml-1 w-4 h-4 group-hover:rotate-180 transition-transform duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  }
                />
                <div className="absolute left-0 mt-2 w-48 bg-gradient-to-b from-black/95 to-gray-900/95 rounded-md shadow-lg overflow-hidden z-20 transform scale-0 group-hover:scale-100 transition-transform origin-top duration-200 border border-gray-800">
                  <Link
                    href="/now-showing-movies"
                    className="block px-4 py-3 text-white hover:bg-indigo-600/20 transition-colors flex items-center"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                    Phim đang chiếu
                  </Link>
                  <Link
                    href="/upcoming-movies"
                    className="block px-4 py-3 text-white hover:bg-indigo-600/20 transition-colors flex items-center"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                    Phim sắp chiếu
                  </Link>
                  <Link
                    href="/top-rated-movies"
                    className="block px-4 py-3 text-white hover:bg-indigo-600/20 transition-colors flex items-center"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                    Phim đánh giá cao
                  </Link>
                </div>
              </div>

              <button
                onClick={openTheaterModal}
                className="text-white hover:text-indigo-500 transition-colors duration-300 font-medium flex items-center relative group"
              >
                <span className="relative">
                  Rạp
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </span>
                <svg
                  className="ml-1 w-4 h-4 group-hover:rotate-180 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <NavLink href="/promotions" label="Khuyến mãi" />
              <NavLink href="/news" label="Tin tức" />
            </nav>

            <div className="flex items-center space-x-6 z-10">
              <div
                className={`hidden md:flex items-center transition-all duration-300 ${
                  isSearchOpen ? "w-80" : "w-0 overflow-hidden"
                } relative`}
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Tìm kiếm phim..."
                  className="w-full bg-black/50 border border-gray-700 focus:border-indigo-500 text-white pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />

                {isSearchOpen && searchValue && (
                  <div className="absolute top-12 left-0 w-full bg-gradient-to-b from-black/95 to-gray-900/95 rounded-lg shadow-xl shadow-black/50 z-50 max-h-96 overflow-y-auto p-2 border border-gray-800">
                    <div className="px-2 pt-2 pb-1 text-gray-300 text-sm font-semibold border-b border-gray-800">
                      Danh sách phim
                    </div>
                    {isSearching ? (
                      <div className="p-4 text-gray-500 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-gray-500 border-t-indigo-500 rounded-full animate-spin mr-2"></div>
                        Đang tìm kiếm...
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((movie) => (
                        <Link
                          key={movie.id}
                          href={`/movies/${movie.id}`}
                          className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-indigo-600/10 transition-colors"
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchValue("");
                          }}
                        >
                          <div className="relative w-12 h-16 flex-shrink-0">
                            <img
                              src={movie.poster}
                              alt={movie.title}
                              className="w-12 h-16 object-cover rounded-md flex-shrink-0"
                            />
                            <div className="absolute inset-0 rounded-md border border-gray-700 bg-gradient-to-t from-black/50 to-transparent"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-base font-semibold text-white truncate">
                              {movie.title}
                            </div>
                            <div className="text-xs text-gray-400 truncate">
                              {movie.originalTitle}
                            </div>
                            <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-400 mt-1">
                              {movie.season && (
                                <span className="px-1.5 py-0.5 bg-gray-800 rounded">
                                  {movie.season}
                                </span>
                              )}
                              {movie.year && (
                                <span className="px-1.5 py-0.5 bg-gray-800 rounded">
                                  {movie.year}
                                </span>
                              )}
                              {movie.duration && (
                                <span className="px-1.5 py-0.5 bg-gray-800 rounded">
                                  {movie.duration}
                                </span>
                              )}
                              {movie.episode && (
                                <span className="px-1.5 py-0.5 bg-gray-800 rounded">
                                  {movie.episode}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="p-4 text-gray-500 flex items-center justify-center">
                        <span className="mr-2">⚠️</span>
                        Không tìm thấy phim nào
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={toggleSearch}
                className="text-white hover:text-indigo-500 transition-colors duration-300 relative group"
              >
                <Search
                  size={20}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                <span className="absolute -bottom-1 left-1/2 w-6 h-0.5 bg-indigo-500 transform -translate-x-1/2 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </button>

              <Link
                href="/cart"
                className="text-white hover:text-indigo-500 transition-colors duration-300 relative group"
              >
                <ShoppingCart
                  size={20}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </span>
                <span className="absolute -bottom-1 left-1/2 w-6 h-0.5 bg-indigo-500 transform -translate-x-1/2 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>

              <button
                onClick={toggleNotificationModal}
                className="text-white hover:text-indigo-500 transition-colors duration-300 relative hidden md:block group"
              >
                <Bell
                  size={20}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
                <span className="absolute -bottom-1 left-1/2 w-6 h-0.5 bg-indigo-500 transform -translate-x-1/2 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </button>

              <div className="hidden md:block" ref={userMenuRef}>
                {userData ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 w-10 h-10 text-white transition-all duration-300 shadow-md hover:shadow-indigo-500/50 hover:scale-105 group"
                      title={userData.fullName}
                    >
                      <span className="text-sm font-medium">
                        {authService.getInitials(userData.fullName)}
                      </span>
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-gradient-to-b from-black/95 to-gray-900/95 rounded-lg shadow-xl shadow-black/50 border border-gray-800 overflow-hidden z-50">
                        <div className="p-3 border-b border-gray-800">
                          <div className="text-white font-medium">
                            {userData.fullName}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {userData.role}
                          </div>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/settings"
                            className="flex items-center px-4 py-2 text-gray-300 hover:bg-indigo-600/20 hover:text-white transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings size={16} className="mr-2" />
                            Settings
                          </Link>
                          <button
                            onClick={() => {
                              authService.logout();
                              updateAuthState();
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center px-4 py-2 text-gray-300 hover:bg-indigo-600/20 hover:text-white transition-colors"
                          >
                            <LogOut size={16} className="mr-2" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 w-10 h-10 text-white transition-all duration-300 shadow-md hover:shadow-indigo-500/50 hover:scale-105 group"
                    title="Đăng nhập"
                  >
                    <User
                      size={20}
                      className="group-hover:scale-110 transition-transform duration-300"
                    />
                  </Link>
                )}
              </div>

              <button
                className="lg:hidden text-white focus:outline-none hover:text-indigo-500 transition-colors duration-300"
                onClick={toggleMenu}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Film strip decoration at bottom */}
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-black via-indigo-600 to-black"></div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden absolute top-full left-0 w-full bg-gradient-to-b from-black/95 to-gray-900/95 shadow-xl shadow-black/30 transition-all duration-500 ease-in-out border-b border-gray-800 ${
            isMenuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Tìm kiếm phim..."
                className="w-full bg-black/50 border border-gray-700 focus:border-indigo-500 text-white pl-10 pr-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />

              {isMenuOpen && searchValue && (
                <div className="absolute top-14 left-0 w-full bg-gradient-to-b from-black/95 to-gray-900/95 rounded-lg shadow-xl shadow-black/50 z-50 max-h-96 overflow-y-auto p-2 border border-gray-800">
                  <div className="px-2 pt-2 pb-1 text-gray-300 text-sm font-semibold border-b border-gray-800">
                    Danh sách phim
                  </div>
                  {isSearching ? (
                    <div className="p-4 text-gray-500 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-gray-500 border-t-indigo-500 rounded-full animate-spin mr-2"></div>
                      Đang tìm kiếm...
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((movie) => (
                      <Link
                        key={movie.id}
                        href={`/movies/${movie.id}`}
                        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-indigo-600/10 transition-colors"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setSearchValue("");
                        }}
                      >
                        <div className="relative w-12 h-16 flex-shrink-0">
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-12 h-16 object-cover rounded-md flex-shrink-0"
                          />
                          <div className="absolute inset-0 rounded-md border border-gray-700 bg-gradient-to-t from-black/50 to-transparent"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-base font-semibold text-white truncate">
                            {movie.title}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            {movie.originalTitle}
                          </div>
                          <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-400 mt-1">
                            {movie.season && (
                              <span className="px-1.5 py-0.5 bg-gray-800 rounded">
                                {movie.season}
                              </span>
                            )}
                            {movie.year && (
                              <span className="px-1.5 py-0.5 bg-gray-800 rounded">
                                {movie.year}
                              </span>
                            )}
                            {movie.duration && (
                              <span className="px-1.5 py-0.5 bg-gray-800 rounded">
                                {movie.duration}
                              </span>
                            )}
                            {movie.episode && (
                              <span className="px-1.5 py-0.5 bg-gray-800 rounded">
                                {movie.episode}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-gray-500 flex items-center justify-center">
                      <span className="mr-2">⚠️</span>
                      Không tìm thấy phim nào
                    </div>
                  )}
                </div>
              )}
            </div>

            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className="text-white hover:text-indigo-500 transition-colors py-3 border-b border-gray-800 pl-2 flex items-center group"
              >
                <span className="w-1 h-6 bg-indigo-600 rounded-r-full opacity-0 group-hover:opacity-100 -ml-2 mr-2 transition-opacity duration-300"></span>
                Trang chủ
              </Link>

              <div>
                <Link
                  href="/movies"
                  className="text-white hover:text-indigo-500 transition-colors py-3 border-b border-gray-800 pl-2 flex items-center group"
                >
                  <span className="w-1 h-6 bg-indigo-600 rounded-r-full opacity-0 group-hover:opacity-100 -ml-2 mr-2 transition-opacity duration-300"></span>
                  Phim
                </Link>
                <div className="pl-6 mt-2 space-y-2">
                  <Link
                    href="/now-showing-movies"
                    className="text-gray-300 hover:text-indigo-500 transition-colors py-2 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                    Phim đang chiếu
                  </Link>
                  <Link
                    href="/upcoming-movies"
                    className="text-gray-300 hover:text-indigo-500 transition-colors py-2 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                    Phim sắp chiếu
                  </Link>
                  <Link
                    href="/top-rated-movies"
                    className="text-gray-300 hover:text-indigo-500 transition-colors py-2 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                    Phim đánh giá cao
                  </Link>
                </div>
              </div>

              <div>
                <button
                  onClick={openTheaterModal}
                  className="text-white hover:text-indigo-500 transition-colors py-3 border-b border-gray-800 pl-2 flex items-center group w-full text-left"
                >
                  <span className="w-1 h-6 bg-indigo-600 rounded-r-full opacity-0 group-hover:opacity-100 -ml-2 mr-2 transition-opacity duration-300"></span>
                  Rạp
                </button>
              </div>

              <Link
                href="/promotions"
                className="text-white hover:text-indigo-500 transition-colors py-3 border-b border-gray-800 pl-2 flex items-center group"
              >
                <span className="w-1 h-6 bg-indigo-600 rounded-r-full opacity-0 group-hover:opacity-100 -ml-2 mr-2 transition-opacity duration-300"></span>
                Khuyến mãi
              </Link>

              <Link
                href="/news"
                className="text-white hover:text-indigo-500 transition-colors py-3 border-b border-gray-800 pl-2 flex items-center group"
              >
                <span className="w-1 h-6 bg-indigo-600 rounded-r-full opacity-0 group-hover:opacity-100 -ml-2 mr-2 transition-opacity duration-300"></span>
                Tin tức
              </Link>

              <div className="flex items-center pt-3">
                {userData ? (
                  <div className="relative mx-auto">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 shadow-lg hover:shadow-indigo-500/50 hover:scale-105"
                      title={userData.fullName}
                    >
                      <span className="text-base font-medium">
                        {authService.getInitials(userData.fullName)}
                      </span>
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-gradient-to-b from-black/95 to-gray-900/95 rounded-lg shadow-xl shadow-black/50 border border-gray-800 overflow-hidden z-50">
                        <div className="p-3 border-b border-gray-800">
                          <div className="text-white font-medium">
                            {userData.fullName}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {userData.role}
                          </div>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/settings"
                            className="flex items-center px-4 py-2 text-gray-300 hover:bg-indigo-600/20 hover:text-white transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings size={16} className="mr-2" />
                            Settings
                          </Link>
                          <button
                            onClick={() => {
                              authService.logout();
                              updateAuthState();
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center px-4 py-2 text-gray-300 hover:bg-indigo-600/20 hover:text-white transition-colors"
                          >
                            <LogOut size={16} className="mr-2" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 shadow-lg hover:shadow-indigo-500/50 hover:scale-105 mx-auto"
                    title="Đăng nhập"
                  >
                    <User size={24} />
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      <TheaterModal isOpen={isTheaterModalOpen} onClose={closeTheaterModal} />
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
    </>
  );
};

// NavLink component for consistent styling
const NavLink: React.FC<{ href: string; label: string | React.ReactNode }> = ({
  href,
  label,
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`group relative ${
        isActive ? "text-indigo-500" : "text-white hover:text-indigo-500"
      } transition-colors duration-300 font-medium`}
    >
      <span className="relative">
        {label}
        <span
          className={`absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-500 transform ${
            isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          } transition-transform duration-300 origin-left`}
        ></span>
      </span>
    </Link>
  );
};

export default Header;
