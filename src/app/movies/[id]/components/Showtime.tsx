'use client'
import { useState, useEffect } from 'react';
import Calendar from './Calendar';
import TheaterList from './TheaterList';
import SeatSelection from './SeatSelection';
import BookingTimeline from './BookingTimeline';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTicketAlt, FaFilm, FaRegClock, FaTheaterMasks } from 'react-icons/fa';

interface ShowtimeProps {
  movieId: string;
  movieTitle: string;
}

interface Theater {
  id: string;
  name: string;
  logo: string;
  address: string;
  showtimes: Showtime[];
}

interface Showtime {
  time: string;
  format: string;
  subtitle: string;
  is3D: boolean;
}

const ShowtimeComponent: React.FC<ShowtimeProps> = ({ movieId, movieTitle }) => {
  const router = useRouter();
  const [selectedTheater, setSelectedTheater] = useState<string | null>(null);
  const [selectedTheaterId, setSelectedTheaterId] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showSeatSelection, setShowSeatSelection] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  const theaters: Theater[] = [
    {
      id: 'bhd-star-le-van-viet',
      name: 'BHD Star Lê Văn Việt',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrlRNmKqyKLsuQMm-hf3tdLm7q-NXM6O5jkw&s',
      address: 'Tầng 4, Vincom Plaza Lê Văn Việt, 50 Lê Văn Việt, P.Hiệp Phú, Quận 9, TP.HCM',
      showtimes: [
        { time: '09:00', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '09:55', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '10:35', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '11:25', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '11:55', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '12:20', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '13:00', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '13:50', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '14:45', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '15:10', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '15:45', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '16:15', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '17:10', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '17:40', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '18:10', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '18:40', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '19:05', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '19:35', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '20:05', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '20:35', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
      ]
    },
    {
      id: 'cgv-vincom-thu-duc',
      name: 'CGV Vincom Thủ Đức',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJSWzIAiubfu2dVmmHyRN8NQlLeBK_NXIoNA&s',
      address: 'Tầng 5, TTTM Vincom Thủ Đức, 216 Võ Văn Ngân, P. Bình Thọ, TP.Thủ Đức, TP.HCM',
      showtimes: [
        { time: '09:30', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '11:45', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '14:00', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '16:30', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '19:15', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
        { time: '21:30', format: '2D', subtitle: 'PHỤ ĐỀ', is3D: false },
      ]
    }
  ];

  // Group showtimes by format for better organization
  const groupShowtimesByFormat = (showtimes: Showtime[]) => {
    const groups: Record<string, Showtime[]> = {};
    
    showtimes.forEach(showtime => {
      const key = `${showtime.format}-${showtime.subtitle}-${showtime.is3D}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(showtime);
    });
    
    return groups;
  };

  const handleSelectTheater = (theaterId: string) => {
    setSelectedTheaterId(theaterId);
    const theater = theaters.find(t => t.id === theaterId);
    if (theater) {
      setSelectedTheater(theater.name);
    }
  };

  const handleSelectTime = (time: string, theaterId: string) => {
    const theater = theaters.find(t => t.id === theaterId);
    if (!theater) return;
    const params = new URLSearchParams({
      movieTitle,
      theaterName: theater.name,
      showtime: time,
      date: selectedDate.toISOString(),
    });
    router.push(`/seat-selection?${params.toString()}`);
  };

  const handleBackToShowtimes = () => {
    setShowSeatSelection(false);
    setSelectedTime(null);
    setCurrentStep(1);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('vi-VN', options);
  };

  if (showSeatSelection && selectedTheater && selectedTime) {
    const theater = theaters.find(t => t.id === selectedTheaterId);
    if (!theater) return null;

    return (
      <div>
        <BookingTimeline currentStep={currentStep} />
        <SeatSelection
          movieTitle={movieTitle}
          theaterName={theater.name}
          showtime={selectedTime}
          date={selectedDate}
          onBack={handleBackToShowtimes}
        />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <BookingTimeline currentStep={currentStep} />
      
      {/* Date Selection Panel */}
      <div className="mb-6 bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
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
      
      {/* Main Content Area */}
      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-4">
          <div className="flex items-center mb-4">
            <FaTheaterMasks className="text-green-500 mr-2" />
            <h3 className="text-lg font-medium text-white">Danh sách rạp</h3>
          </div>
          
          {theaters.map((theater) => (
            <div 
              key={theater.id} 
              className={`mb-6 p-4 rounded-lg transition-all ${selectedTheaterId === theater.id ? 'bg-gray-700/70 border-l-4 border-green-500' : 'bg-gray-800/50 hover:bg-gray-700/30'}`}
              onClick={() => handleSelectTheater(theater.id)}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center mb-4">
                <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center p-2 mr-4 mb-4 md:mb-0">
                  <div className="relative w-full h-full">
                    <Image 
                      src={theater.logo} 
                      alt={theater.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{theater.name}</h3>
                  <div className="flex items-start text-gray-300">
                    <FaMapMarkerAlt className="mt-1 mr-2 text-gray-400 flex-shrink-0" />
                    <p>{theater.address}</p>
                  </div>
                </div>
              </div>
              
              {selectedTheaterId === theater.id && (
                <div className="mt-6 animate-fadeIn">
                  <div className="mb-4 flex items-center">
                    <FaFilm className="text-green-500 mr-2" />
                    <h4 className="text-lg font-medium text-white">Suất chiếu</h4>
                  </div>
                  
                  {Object.entries(groupShowtimesByFormat(theater.showtimes)).map(([key, showtimes], index) => (
                    <div key={key} className="mb-6">
                      <div className="mb-3 pb-2 border-b border-gray-700 flex items-center">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs mr-2">
                          {showtimes[0].format}
                        </span>
                        <span className="text-gray-300 text-sm">
                          {showtimes[0].subtitle}
                        </span>
                        {showtimes[0].is3D && (
                          <span className="ml-2 bg-purple-600 text-white px-3 py-1 rounded-full text-xs">
                            3D
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                        {showtimes.map((showtime) => (
                          <button
                            key={showtime.time}
                            className="px-3 py-3 bg-gray-700 hover:bg-green-600 rounded-lg text-white font-medium transition-colors flex flex-col items-center justify-center hover:scale-105 transform transition"
                            onClick={() => handleSelectTime(showtime.time, theater.id)}
                          >
                            <span className="text-lg">{showtime.time}</span>
                            <span className="text-xs text-gray-300">Còn chỗ</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowtimeComponent;