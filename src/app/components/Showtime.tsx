'use client'
import { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Image from 'next/image';

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

interface CalendarDay {
  date: number;
  day: number;
  month: number;
  year: number;
  dayName: string;
  isToday: boolean;
  isSelected: boolean;
}

const ShowtimeComponent: React.FC<ShowtimeProps> = ({ movieId, movieTitle }) => {
  const [selectedTheater, setSelectedTheater] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendar, setCalendar] = useState<CalendarDay[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [showSeatSelection, setShowSeatSelection] = useState<boolean>(false);
  
  const theaters: Theater[] = [
    {
      id: 'bhd-star-le-van-viet',
      name: 'BHD Star Lê Văn Việt',
      logo: '/images/bhd-logo.png',
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
      logo: '/images/cgv-logo.png',
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

  useEffect(() => {
    const generateCalendar = () => {
      const today = new Date();
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      const days: CalendarDay[] = [];
      
      const daysInPreviousMonth = new Date(year, month, 0).getDate();
      const firstDayOfWeek = firstDay.getDay();
      
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const date = new Date(year, month - 1, daysInPreviousMonth - i);
        days.push({
          date: date.getDate(),
          day: date.getDay(),
          month: date.getMonth(),
          year: date.getFullYear(),
          dayName: getDayName(date.getDay()),
          isToday: isSameDay(date, today),
          isSelected: isSameDay(date, selectedDate)
        });
      }
      
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(year, month, i);
        days.push({
          date: i,
          day: date.getDay(),
          month: date.getMonth(),
          year: date.getFullYear(),
          dayName: getDayName(date.getDay()),
          isToday: isSameDay(date, today),
          isSelected: isSameDay(date, selectedDate)
        });
      }
      
      const remainingDays = 42 - days.length; // 6 rows * 7 days
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(year, month + 1, i);
        days.push({
          date: i,
          day: date.getDay(),
          month: date.getMonth(),
          year: date.getFullYear(),
          dayName: getDayName(date.getDay()),
          isToday: isSameDay(date, today),
          isSelected: isSameDay(date, selectedDate)
        });
      }
      
      setCalendar(days);
    };
    
    generateCalendar();
  }, [currentMonth, selectedDate]);

  const getDayName = (day: number): string => {
    const days = ['CN', '2', '3', '4', '5', '6', '7'];
    return days[day];
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const getMonthName = (date: Date): string => {
    const months = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    return months[date.getMonth()];
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleSelectDate = (day: CalendarDay) => {
    setSelectedDate(new Date(day.year, day.month, day.date));
  };

  const handleSelectTime = (time: string, theaterId: string) => {
    setSelectedTime(time);
    setSelectedTheater(theaterId);
    setShowSeatSelection(true);
  };

  const handleBackToShowtimes = () => {
    setShowSeatSelection(false);
    setSelectedTime(null);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/');
  };

  if (showSeatSelection) {
    const theater = theaters.find(t => t.id === selectedTheater);
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center">Bước 2: Chọn ghế</h2>
        </div>
        
        <div className="border rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/4">
              <Image
                src="/api/placeholder/200/300"
                alt="Lát Mật 8: Vòng Tay Nắng"
                width={200}
                height={300}
                className="rounded-md object-cover"
              />
            </div>
            <div className="w-full md:w-3/4">
              <h3 className="text-xl font-bold text-green-600">LÁT MẬT 8: VÒNG TAY NẮNG</h3>
              <p className="text-gray-700 my-2">
                Một bộ phim về sự khắc biệt quan điểm giữa ba thế hệ ông bà cha mẹ con cháu. Ai cũng đúng ở góc nhìn của mình nhưng đứng trước hoài bão của tuổi trẻ, cuối cùng thi ai sẽ là người phải nghe theo người còn lại?
              </p>
              <div>
                <p><strong>Đạo diễn:</strong> Lý Hải</p>
                <p><strong>Diễn viên:</strong> Quách Ngọc Tuyên, Long Đẹp Trai, NSƯT Kim Phương, Ngân Quỳnh, NSƯT Hữu Châu, NSƯT Chiếu Xuân</p>
                <p><strong>Thể loại:</strong> Healing</p>
                <p><strong>Khởi chiếu:</strong> 30/04/2026 | Thời lượng: 135 phút</p>
              </div>
              <div className="mt-4">
                <button onClick={handleBackToShowtimes} className="text-green-600 hover:underline font-medium">
                  — CHỌN PHIM KHÁC
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="border-t border-dashed border-gray-300 relative mb-6">
            <div className="text-center text-gray-400 bg-white px-6 absolute -top-3 left-1/2 transform -translate-x-1/2">
              Màn hình
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Seat Legend */}
              <div className="flex justify-center space-x-6 mb-4">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gray-200 mr-2"></div>
                  <span className="text-sm text-gray-600">Standard</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-yellow-200 mr-2"></div>
                  <span className="text-sm text-gray-600">Vip</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-cyan-300 mr-2"></div>
                  <span className="text-sm text-gray-600">Couple</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-200 mr-2"></div>
                  <span className="text-sm text-gray-600">Ghế đã chọn</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-red-500 mr-2"></div>
                  <span className="text-sm text-gray-600">Ghế đã bán</span>
                </div>
              </div>
              
              {/* Seats */}
              <div className="grid grid-cols-20 gap-1 text-center">
                {/* Row headers */}
                <div className="col-span-1 flex flex-col justify-between pt-1 pb-1">
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].map((row) => (
                    <div key={row} className="h-6 flex items-center justify-center text-gray-500">{row}</div>
                  ))}
                </div>
                
                {/* Seats grid */}
                <div className="col-span-18 grid grid-cols-18 gap-1">
                  {/* This is a simplified representation. In a real app, you'd generate this from seat data */}
                  {Array.from({ length: 11 }, (_, rowIndex) => (
                    <>
                      {Array.from({ length: 18 }, (_, seatIndex) => {
                        let seatClass = 'bg-gray-200 cursor-pointer hover:bg-green-200';
                        
                        if (rowIndex === 10) {
                          if (seatIndex % 2 === 0 && seatIndex < 16) {
                            return (
                              <div
                                key={`${rowIndex}-${seatIndex}`}
                                className={`h-6 col-span-2 bg-cyan-300 cursor-pointer hover:bg-green-200`}
                              ></div>
                            );
                          } else if (seatIndex % 2 !== 0 || seatIndex >= 16) {
                            return null;
                          }
                        }
                        
                        if ((rowIndex === 5 || rowIndex === 6 || rowIndex === 7) && (seatIndex >= 7 && seatIndex <= 9)) {
                          seatClass = 'bg-red-500 cursor-not-allowed';
                        }
                        
                        if (rowIndex >= 3 && rowIndex <= 8) {
                          seatClass = 'bg-yellow-200 cursor-pointer hover:bg-green-200';
                        }
                        
                        return (
                          <div
                            key={`${rowIndex}-${seatIndex}`}
                            className={`h-6 ${seatClass}`}
                          ></div>
                        );
                      })}
                    </>
                  ))}
                </div>
                
                <div className="col-span-1 flex flex-col justify-between pt-1 pb-1">
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].map((row) => (
                    <div key={`right-${row}`} className="h-6 flex items-center justify-center text-gray-500">{row}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h3 className="font-bold">BHD Star Lê Văn Việt</h3>
              <p className="text-sm text-gray-600">Screen 6 - {formatDate(selectedDate)} - Suất chiếu: {selectedTime}</p>
              <h2 className="font-bold text-xl text-green-600 mt-1">LÁT MẬT 8: VÒNG TAY NẮNG</h2>
              <div className="flex space-x-2 mt-1">
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">18+</span>
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded">PHỤ ĐỀ</span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">2D</span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 w-full md:w-auto">
              <button className="w-full md:w-auto px-6 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700 transition disabled:bg-gray-400" disabled>
                Bạn chưa chọn ghế nào. Vui lòng chọn ghế.
              </button>
              <div className="text-right mt-2 text-sm text-gray-600">
                <span className="font-medium">— Trở lại</span>
              </div>
              <div className="text-right mt-2 text-sm text-green-600">
                <span>Còn lại <strong>6 phút, 20 giây</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-100 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <button onClick={handlePrevMonth} className="text-gray-600 hover:text-gray-900">
              <FaArrowLeft />
            </button>
            <h3 className="text-center font-medium">
              {getMonthName(currentMonth)} {currentMonth.getFullYear()}
            </h3>
            <button onClick={handleNextMonth} className="text-gray-600 hover:text-gray-900">
              <FaArrowRight />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center">
            <div className="font-medium">2</div>
            <div className="font-medium">3</div>
            <div className="font-medium">4</div>
            <div className="font-medium">5</div>
            <div className="font-medium">6</div>
            <div className="font-medium">7</div>
            <div className="font-medium text-red-600">CN</div>
            
            {calendar.map((day, index) => (
              <div
                key={index}
                onClick={() => handleSelectDate(day)}
                className={`
                  py-2 cursor-pointer transition
                  ${day.isSelected ? 'bg-blue-600 text-white' : day.isToday ? 'border border-blue-600 text-blue-600' : 'text-gray-600 hover:bg-gray-200'}
                  ${day.month !== currentMonth.getMonth() ? 'text-gray-300' : ''}
                  ${day.day === 0 ? 'text-red-500' : ''}
                `}
              >
                {day.date}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Show theaters and showtimes */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Rạp chiếu phim</h2>
        {theaters.map((theater) => (
          <div key={theater.id} className="mb-6 border rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Image
                src={theater.logo}
                alt={theater.name}
                width={40}
                height={40}
                className="mr-3"
              />
              <div>
                <h3 className="font-bold">{theater.name}</h3>
                <p className="text-sm text-gray-600">{theater.address}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {theater.showtimes.map((showtime, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectTime(showtime.time, theater.id)}
                  className="border rounded p-2 text-center hover:bg-blue-50"
                >
                  <div className="font-medium">{showtime.time}</div>
                  <div className="text-sm text-gray-600">
                    {showtime.format} {showtime.subtitle}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowtimeComponent;