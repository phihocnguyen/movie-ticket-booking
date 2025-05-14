'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Clock, Calendar, Film, Info, AlertCircle, Star, Play, Phone, Mail, DollarSign } from 'lucide-react';
import { TheaterData, Movie } from '../types';
import axiosInstance from '@/axiosInstance';

interface Showtime {
  id: number;
  movieId: number;
  theaterId: number;
  screenId: number;
  startTime: string;
  endTime: string;
  price: number;
  isActive: boolean;
  screenName: string;
  movieTitle: string;
  theaterName: string;
  theaterAddress: string;
  moviePosterUrl: string;
}

const theaterLogos: Record<string, string> = {
  'CGV': 'https://banner2.cleanpng.com/20181203/orv/kisspng-cj-cgv-vietnam-cinema-cj-group-film-1713914319903.webp',
  'BETA': 'https://theme.hstatic.net/200000727463/1001067697/14/share_fb_home.jpg?v=210',
  'CINESTAR': 'https://tenpack.com.vn/wp-content/uploads/2016/02/cinestar-logo.png',
  'LOTTE': 'https://play-lh.googleusercontent.com/3JrdBBVW45zS25P_U05KxhfiaMbfvN-iUccLTANtBZYANtWP8KgsRaVeMbn0ghlyvSDI'
};

const theaterFeatures: Record<string, string[]> = {
  'CGV': [
    'Công nghệ chiếu phim 3D',
    'Âm thanh Dolby Atmos',
    'Phòng chờ VIP',
    'Ghế bọc da cao cấp',
    'Màn hình 4K',
    'Dịch vụ ăn uống tại chỗ'
  ],
  'Beta': [
    'Rạp chuẩn Hollywood',
    'Âm thanh Dolby 7.1',
    'Màn hình lớn sắc nét',
    'Ghế VIP',
    'Dịch vụ ăn uống',
    'Phòng chờ riêng biệt'
  ],
  'Lotte': [
    'Âm thanh vòm',
    'Màn hình 4K',
    'Ghế bọc da cao cấp',
    'Dịch vụ ăn uống',
    'Phòng chờ VIP',
    'Công nghệ chiếu phim 3D'
  ]
};

const featureIcons: Record<string, React.ReactNode> = {
  '3D': <span className="text-yellow-500">3D</span>,
  'Dolby': <span className="text-blue-500">DOLBY</span>,
  'VIP': <span className="text-purple-500">VIP</span>,
  '4K': <span className="text-red-500">4K</span>,
};

const movies: Movie[] = [
  {
    id: 'lat-mat-8',
    title: 'Lật Mặt 8: Vòng Tay Nặng',
    poster: 'https://cdn.moveek.com/storage/media/cache/tall/6800eee70e4ed913428686.jpg',
    duration: '2h15\'',
    rating: 'T13',
    genre: 'Hành động',
    showtimes: [
      {
        date: '11/5',
        times: [
          { time: '10:30', price: '80K' },
          { time: '11:30', price: '60K' },
          { time: '12:30', price: '60K' },
        ]
      }
    ]
  }
];

interface TheaterDetailClientProps {
  theaterId: string;
}

const getNextDays = (days: number) => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const dayOfWeek = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'][date.getDay()];
    
    dates.push({
      date: `${day}/${month}/${year}`,
      dayOfWeek
    });
  }
  
  return dates;
};

export default function TheaterDetailClient({ theaterId }: TheaterDetailClientProps) {
  const router = useRouter();
  const [activeDate, setActiveDate] = useState<string>('');
  const [dateOptions, setDateOptions] = useState<{date: string, dayOfWeek: string}[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);
  const [theater, setTheater] = useState<TheaterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'showtimes' | 'info'>('showtimes');
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);

  useEffect(() => {
    const dates = getNextDays(7);
    setDateOptions(dates);
    if (dates.length > 0) {
      setActiveDate(dates[0].date);
    }
  }, []);

  useEffect(() => {
    const fetchTheaterData = async () => {
      try {
        setLoading(true);
        const [theaterResponse, showtimesResponse] = await Promise.all([
          axiosInstance.get<TheaterData>(`/theaters/${theaterId}`),
          axiosInstance.get<Showtime[]>(`/showtimes/theater/${theaterId}`)
        ]);

        const theaterData = theaterResponse.data;
        const showtimesData = showtimesResponse.data;
        const logoKey = Object.keys(theaterLogos).find(key => theaterData.name.toUpperCase().includes(key));
        const theaterChain = Object.keys(theaterFeatures).find(chain => 
          theaterData.name.toUpperCase().includes(chain)
        );
        
        const enhancedTheater: TheaterData = {
          ...theaterData,
          features: theaterChain ? theaterFeatures[theaterChain] : [
            'Công nghệ chiếu phim hiện đại',
            'Âm thanh chất lượng cao',
            'Ghế ngồi thoải mái',
            'Dịch vụ ăn uống',
            'Phòng chờ rộng rãi'
          ],
          logoUrl: theaterLogos[logoKey || ''] || ''
        };

        setTheater(enhancedTheater);
        setShowtimes(showtimesData);
        setError(null);
      } catch (err) {
        setError('Không thể tải thông tin rạp chiếu phim');
        console.error('Error fetching theater data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTheaterData();
  }, [theaterId]);
  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return '2h00\'';
    }
    
    const duration = end.getTime() - start.getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h${minutes}'`;
  };
  const groupedShowtimes = showtimes.reduce((acc, showtime) => {
    const showtimeDate = showtime.startTime.split(' ')[0];
    if (showtimeDate !== activeDate) {
      return acc;
    }

    if (!acc[showtime.movieId]) {
      acc[showtime.movieId] = {
        id: showtime.movieId.toString(),
        title: showtime.movieTitle,
        poster: showtime.moviePosterUrl,
        duration: calculateDuration(showtime.startTime.split(' ')[1], showtime.endTime.split(' ')[1]),
        rating: 'T13',
        genre: 'Hành động',
        showtimes: []
      };
    }
    
    const time = showtime.startTime.split(' ')[1];
    acc[showtime.movieId].showtimes = [{
      date: showtimeDate,
      times: [{ time, price: showtime.price.toString() }]
    }];
    
    return acc;
  }, {} as Record<string, Movie>);

  const movies = Object.values(groupedShowtimes);

  useEffect(() => {
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

  const handleShowtimeClick = (showtime: Showtime) => {
    const params = new URLSearchParams({
      movieTitle: showtime.movieTitle,
      theaterName: showtime.theaterName,
      showTimeId: showtime.id.toString(),
      showtime: showtime.startTime,
      screenId: showtime.screenId.toString(),
      date: new Date().toISOString()
    });
    
    router.push(`/seat-selection?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-white text-lg">Đang tải thông tin rạp chiếu phim...</p>
        </div>
      </div>
    );
  }

  if (error || !theater) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-lg max-w-md shadow-2xl text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Đã xảy ra lỗi</h2>
          <p className="text-gray-300">{error || 'Không tìm thấy thông tin rạp chiếu phim'}</p>
          <button className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const selectedMovieData = movies.find(movie => movie.id === selectedMovie);
  const activeDateShowtimes = selectedMovieData?.showtimes.find(
    showtime => showtime.date === activeDate
  );

  const getTheaterChain = () => {
    const chainNames = ['CGV', 'Beta', 'Lotte', 'Cinestar'];
    return chainNames.find(chain => theater.name.toUpperCase().includes(chain.toUpperCase())) || '';
  };

  const theaterChain = getTheaterChain();
  
  const getBrandColors = () => {
    switch (theaterChain.toUpperCase()) {
      case 'CGV': return { primary: 'from-red-700 to-red-900', button: 'bg-red-600 hover:bg-red-700', accent: 'text-red-500', border: 'border-red-500' };
      case 'BETA': return { primary: 'from-green-700 to-green-900', button: 'bg-green-600 hover:bg-green-700', accent: 'text-green-500', border: 'border-green-500' };
      case 'LOTTE': return { primary: 'from-blue-700 to-blue-900', button: 'bg-blue-600 hover:bg-blue-700', accent: 'text-blue-500', border: 'border-blue-500' };
      case 'CINESTAR': return { primary: 'from-purple-700 to-purple-900', button: 'bg-purple-600 hover:bg-purple-700', accent: 'text-purple-500', border: 'border-purple-500' };
      default: return { primary: 'from-gray-800 to-gray-900', button: 'bg-red-600 hover:bg-red-700', accent: 'text-red-500', border: 'border-red-500' };
    }
  };

  const brandColors = getBrandColors();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-16">
      <div className={`bg-gradient-to-b ${brandColors.primary} relative`}>
        <div className="absolute inset-0 opacity-20 bg-[url('https://api.placeholder.com/1920/1080')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-4 pt-12 pb-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-white border-4 border-white shadow-xl flex-shrink-0">
              <Image 
                src={theater?.logoUrl || '/api/placeholder/128/128'} 
                alt={theater?.name} 
                width={128} 
                height={128} 
                className="object-cover w-full h-full"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{theater.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-300 mb-4">
                <MapPin size={18} />
                <p>{theater.address}</p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <Link 
                  href="#" 
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1"
                >
                  <MapPin size={14} />
                  Bản đồ
                </Link>
                <Link 
                  href="#" 
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                >
                  {theater.city}
                </Link>
                <Link 
                  href="#" 
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                >
                  {theater.name.split(' ')[0]}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation tabs */}
      <div className="bg-gray-800 sticky top-16 z-30 shadow-lg border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex">
            <button 
              onClick={() => setActiveTab('showtimes')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'showtimes' 
                  ? `${brandColors.border} ${brandColors.accent}` 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Lịch chiếu</span>
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('info')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'info' 
                  ? `${brandColors.border} ${brandColors.accent}` 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Info size={16} />
                <span>Thông tin rạp</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {activeTab === 'showtimes' && (
          <>
            {/* Date selection with style improvements */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Calendar className={brandColors.accent} size={22} />
                <span>Chọn ngày</span>
              </h2>
              <div className="flex space-x-3 overflow-x-auto pb-2 hide-scrollbar">
                {dateOptions.map(({date, dayOfWeek}) => (
                  <button
                    key={date}
                    onClick={() => handleDateChange(date)}
                    className={`flex flex-col items-center p-4 min-w-[90px] rounded-lg transition-all transform ${
                      activeDate === date
                        ? `${brandColors.button} text-white shadow-lg shadow-red-900/30 scale-105`
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-2xl font-bold">{date.split('/')[0]}</span>
                    <span className="text-xs opacity-80 mt-1">{date.split('/')[1]}</span>
                    <span className="text-sm mt-1">{dayOfWeek}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Info card */}
            <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg mb-8 flex items-center border-l-4 border-yellow-500">
              <div className="text-yellow-400 mr-4">
                <AlertCircle size={24} />
              </div>
              <div className="text-gray-200 flex-1 text-sm">
                Nhấn vào suất chiếu để tiến hành mua vé. Vui lòng đến trước giờ chiếu 15-20 phút.
              </div>
            </div>

            {/* Movies section */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Film className={brandColors.accent} size={22} />
                <span>Phim đang chiếu</span>
              </h2>
              
              <div className="space-y-6">
                {movies.map(movie => (
                  <div 
                    key={movie.id} 
                    className="bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700 transition-transform hover:shadow-2xl"
                  >
                    <div 
                      className={`p-5 flex flex-col md:flex-row gap-6 cursor-pointer relative overflow-hidden ${
                        selectedMovie === movie.id ? '' : 'hover:bg-gray-750'
                      }`}
                      onClick={() => handleMovieSelect(movie.id)}
                    >
                      {/* Left border indicator */}
                      {selectedMovie === movie.id && (
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${brandColors.button.split(' ')[0]}`}></div>
                      )}
                      
                      {/* Movie poster */}
                      <div className="w-full md:w-36 h-56 md:h-auto rounded-lg overflow-hidden flex-shrink-0 shadow-lg relative group">
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 group-hover:opacity-80 transition-opacity"></div>
                        <Image 
                          src={movie.poster} 
                          alt={movie.title}
                          width={144} 
                          height={214}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full">
                            <Play size={28} fill="white" className="text-white ml-1" />
                          </button>
                        </div>
                        
                        {/* Rating badge */}
                        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                          {movie.rating}
                        </div>
                      </div>
                      
                      {/* Movie info */}
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-bold mb-3 text-white group-hover:text-red-400 transition-colors">
                          {movie.title}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <div className="flex items-center bg-gray-700/50 px-3 py-1 rounded-full text-sm">
                            <Clock size={14} className="mr-1 text-gray-400" />
                            <span>Thời lượng: {movie.duration}</span>
                          </div>
                          <div className="flex items-center bg-gray-700/50 px-3 py-1 rounded-full text-sm">
                            <Film size={14} className="mr-1 text-gray-400" />
                            <span>Thể loại: {movie.genre}</span>
                          </div>
                          <div className="flex items-center bg-gray-700/50 px-3 py-1 rounded-full text-sm">
                            <Star size={14} className="mr-1 text-yellow-400" />
                            <span>8.4/10</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="self-center">
                        <div className={`transform transition-transform ${selectedMovie === movie.id ? 'rotate-180' : ''}`}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Showtimes section */}
                    {selectedMovie === movie.id && (
                      <div className="p-5 pt-0 pb-6 border-t border-gray-700 bg-black/20">
                        <h4 className="text-lg font-medium mb-4 text-gray-300 flex items-center gap-2">
                          <Clock size={16} className={brandColors.accent} />
                          Suất chiếu cho ngày {activeDate}
                        </h4>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                          {activeDateShowtimes?.times.map((showtime, index) => (
                            <button 
                              key={index} 
                              onClick={() => handleShowtimeClick(showtimes.find(s => 
                                s.startTime.split(' ')[1] === showtime.time && 
                                s.startTime.split(' ')[0] === activeDate
                              )!)}
                              className={`px-4 py-3 bg-gray-700/60 hover:bg-gray-700 backdrop-blur-sm border border-gray-600 hover:border-${brandColors.button.split(' ')[0].split('-')[1]}-500 rounded-lg transition-all text-center flex flex-col items-center justify-center group hover:transform hover:scale-105`}
                            >
                              <div className="text-white font-medium text-lg">{showtime.time}</div>
                              <div className={`mt-2 text-xs px-2 py-0.5 bg-gray-800/80 rounded text-gray-400 group-hover:bg-${brandColors.button.split(' ')[0].split('-')[1]}-900/50 group-hover:text-gray-200 transition-colors`}>
                                Còn 40 ghế
                              </div>
                            </button>
                          ))}
                          
                          {!activeDateShowtimes || activeDateShowtimes.times.length === 0 ? (
                            <div className="col-span-full py-8 text-center text-gray-400 italic">
                              Không có suất chiếu cho ngày đã chọn
                            </div>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'info' && (
          <div className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-gray-700">Thông tin chi tiết</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <MapPin size={18} className={`${brandColors.accent} mr-2`} />
                  Địa chỉ & Liên hệ
                </h3>
                <div className="space-y-3 text-gray-300">
                  <p className="flex items-start">
                    <MapPin size={16} className="mr-2 mt-1 text-gray-400 flex-shrink-0" />
                    <span>{theater.address}</span>
                  </p>
                  <p className="flex items-center">
                    <Phone size={16} className="mr-2 text-gray-400 flex-shrink-0" />
                    <span>{theater.phoneNumber}</span>
                  </p>
                  <p className="flex items-center">
                    <Mail size={16} className="mr-2 text-gray-400 flex-shrink-0" />
                    <span>{theater.email}</span>
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Clock size={18} className={`${brandColors.accent} mr-2`} />
                  Giờ hoạt động
                </h3>
                <div className="space-y-3 text-gray-300">
                  <p className="flex items-center">
                    <span className="text-gray-400 w-28">Giờ mở cửa:</span>
                    <span className="font-medium text-white">
                      {theater.openingTime[0]}:{theater.openingTime[1].toString().padStart(2, '0')}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <span className="text-gray-400 w-28">Giờ đóng cửa:</span>
                    <span className="font-medium text-white">
                      {theater.closingTime[0]}:{theater.closingTime[1].toString().padStart(2, '0')}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <span className="text-gray-400 w-28">Phòng chiếu:</span>
                    <span className="font-medium text-white">{theater.totalScreens} phòng</span>
                  </p>
                </div>
              </div>
            </div>
            
            {theater.features && theater.features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Star size={18} className={`${brandColors.accent} mr-2`} />
                  Tiện ích
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {theater.features.map((feature, index) => (
                    <div 
                      key={index} 
                      className="flex items-center p-3 bg-gray-700/30 hover:bg-gray-700/50 border border-gray-700 rounded-lg transition-colors"
                    >
                      <div className="p-2 rounded-full bg-gray-800 mr-3">
                        <Film size={16} className={brandColors.accent} />
                      </div>
                      <span className="text-gray-200 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="text-gray-400 text-sm border-t border-gray-700 pt-4 mt-6">
              <p>Vui lòng liên hệ rạp để biết thêm chi tiết về suất chiếu và dịch vụ. Lịch chiếu có thể thay đổi mà không báo trước.</p>
            </div>
          </div>
        )}
      </div>
      
      <footer className="bg-black py-8 border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold text-white mb-2">{theater.name}</h3>
              <p className="text-gray-400 text-sm">{theater.address}</p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}