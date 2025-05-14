'use client'
import { useState, useEffect } from 'react';
import Calendar from './Calendar';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTheaterMasks, FaRegClock } from 'react-icons/fa';
import { getShowtimesByMovieId } from '@/app/movies/[id]/api';
import BookingTimeline from './BookingTimeline';
import Link from 'next/link';

interface ShowtimeProps {
  movieId: string;
  movieTitle: string;
}

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
}

const theaterLogos: Record<string, string> = {
  'CGV': 'https://banner2.cleanpng.com/20181203/orv/kisspng-cj-cgv-vietnam-cinema-cj-group-film-1713914319903.webp',
  'Beta': 'https://theme.hstatic.net/200000727463/1001067697/14/share_fb_home.jpg?v=210',
  'Cinestar': 'https://tenpack.com.vn/wp-content/uploads/2016/02/cinestar-logo.png',
  'Lotte': 'https://play-lh.googleusercontent.com/3JrdBBVW45zS25P_U05KxhfiaMbfvN-iUccLTANtBZYANtWP8KgsRaVeMbn0ghlyvSDI'
};

const ShowtimeComponent: React.FC<ShowtimeProps> = ({ movieId, movieTitle }) => {
  const router = useRouter();
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTheater, setSelectedTheater] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const data = await getShowtimesByMovieId(movieId);
        console.log(data);
        setShowtimes(data);
      } catch (error) {
        console.error('Error fetching showtimes:', error);
      }
    };
    fetchShowtimes();
  }, [movieId]);

  const formatTime = (dateTimeStr: string) => {
    console.log(dateTimeStr);
    if (dateTimeStr.includes('/')) {
      const [datePart, timePart] = dateTimeStr.split(' ');
      return timePart;
    }
    
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };


  const getDateFromDateTime = (dateTimeStr: string) => {
    const [datePart] = dateTimeStr.split(' ');
    const [day, month, year] = datePart.split('/');
    return `${day}/${month}/${year}`;
  };

  const groupShowtimesByTheater = (showtimes: Showtime[]) => {
    return showtimes.reduce((acc, showtime) => {
      if (!acc[showtime.theaterId]) {
        acc[showtime.theaterId] = {
          theaterName: showtime.theaterName,
          theaterAddress: showtime.theaterAddress,
          showtimes: []
        };
      }
      acc[showtime.theaterId].showtimes.push(showtime);
      return acc;
    }, {} as Record<number, { theaterName: string; theaterAddress: string; showtimes: Showtime[] }>);
  };

  const filteredShowtimes = showtimes.filter(showtime => {
    const showtimeDate = getDateFromDateTime(showtime.startTime);
    const selectedDateStr = `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}`;
    console.log('Showtime date:', showtimeDate);
    console.log('Selected date:', selectedDateStr);
    return showtimeDate === selectedDateStr;
  });

  const groupedTheaters = groupShowtimesByTheater(filteredShowtimes);

  const handleSelectTime = (showtime: Showtime) => {
    const params = new URLSearchParams({
      movieTitle,
      theaterName: showtime.theaterName,
      showTimeId: showtime.id.toString(), 
      showtime: showtime.startTime,
      screenId: showtime.screenId.toString(),
      date: selectedDate.toISOString(),
    });
    router.push(`/seat-selection?${params.toString()}`);
  };
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('vi-VN', options);
  };

  const getTheaterLogo = (theaterName: string) => {
    const chain = Object.keys(theaterLogos).find(key => 
      theaterName.toUpperCase().includes(key.toUpperCase())
    );
    return chain ? theaterLogos[chain] : '/images/default-theater-logo.png';
  };

  return (
    <div className="animate-fadeIn">
      <BookingTimeline currentStep={currentStep} />
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3 bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <FaTheaterMasks className="text-green-500 mr-2" />
              <h3 className="text-lg font-medium text-white">Danh sách rạp</h3>
            </div>
            
            {Object.entries(groupedTheaters).map(([theaterId, theaterData]) => (
              <div 
                key={theaterId} 
                className={`mb-6 p-4 rounded-lg transition-all ${
                  selectedTheater === theaterId 
                    ? 'bg-gray-700/70 border-l-4 border-green-500' 
                    : 'bg-gray-800/50 hover:bg-gray-700/30'
                }`}
                onClick={() => setSelectedTheater(theaterId)}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center mb-4">
                  <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center p-2 mr-4 mb-4 md:mb-0">
                    <div className="relative w-full h-full">
                      <Image 
                        src={getTheaterLogo(theaterData.theaterName)} 
                        alt={theaterData.theaterName}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <Link href={`/theaters/${theaterId}`} className="text-xl font-bold text-white mb-1 hover:text-red-500 transition-colors duration-300">{theaterData.theaterName}</Link>
                    <div className="flex items-start text-gray-300">
                      <FaMapMarkerAlt className="mt-1 mr-2 text-gray-400 flex-shrink-0" />
                      <p>{theaterData.theaterAddress}</p>
                    </div>
                  </div>
                </div>
                
                {selectedTheater === theaterId && (
                  <div className="mt-6 animate-fadeIn">
                    <div className="mb-4 flex items-center">
                      <FaClock className="text-green-500 mr-2" />
                      <h4 className="text-lg font-medium text-white">Suất chiếu</h4>
                    </div>
                    
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                      {theaterData.showtimes.map((showtime) => (
                        <button
                          key={showtime.id}
                          className="px-3 py-3 bg-gray-700 hover:bg-green-600 rounded-lg text-white font-medium transition-colors flex flex-col items-center justify-center hover:scale-105 transform transition"
                          onClick={() => handleSelectTime(showtime)}
                        >
                          <span className="text-lg">{formatTime(showtime.startTime)}</span>
                          <span className="text-xs text-gray-300">{showtime.screenName}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {Object.keys(groupedTheaters).length === 0 && (
              <div className="text-center py-8 text-gray-400">
                Không có suất chiếu cho ngày đã chọn
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/3 bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center mb-4">
            <FaCalendarAlt className="text-green-500 mr-2" />
            <h3 className="text-lg font-medium text-white">Chọn ngày xem phim</h3>
          </div>
          
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
          
          <div className="mt-4 flex items-center justify-between">
            <div className="text-white flex items-center">
              <FaRegClock className="text-yellow-400 mr-2" />
              <span>Ngày được chọn: {formatDate(selectedDate)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowtimeComponent;