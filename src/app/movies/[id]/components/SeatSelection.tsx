'use client'
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface SeatSelectionProps {
  movieTitle: string;
  theaterName: string;
  showtime: string;
  date: Date;
  onBack: () => void;
}

interface SelectedSeat {
  row: string;
  number: number;
  type: 'standard' | 'vip' | 'couple';
  price: number;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({
  movieTitle,
  theaterName,
  showtime,
  date,
  onBack
}) => {
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number }>({ minutes: 10, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds === 0) {
          if (prev.minutes === 0) {
            clearInterval(timer);
            return { minutes: 0, seconds: 0 };
          }
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return { ...prev, seconds: prev.seconds - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/');
  };

  const handleSeatClick = (row: string, number: number, type: 'standard' | 'vip' | 'couple') => {
    const seatIndex = selectedSeats.findIndex(seat => seat.row === row && seat.number === number);
    
    if (seatIndex === -1) {
      // Add seat
      const price = type === 'standard' ? 100000 : type === 'vip' ? 150000 : 200000;
      setSelectedSeats([...selectedSeats, { row, number, type, price }]);
    } else {
      // Remove seat
      setSelectedSeats(selectedSeats.filter((_, index) => index !== seatIndex));
    }
  };

  const isSeatSelected = (row: string, number: number) => {
    return selectedSeats.some(seat => seat.row === row && seat.number === number);
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center">Bước 2: Chọn ghế</h2>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side - Seat information */}
        <div className="md:w-1/4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold mb-4">Thông tin ghế</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Image 
                  src="https://www.bhdstar.vn/wp-content/assets/loodo/ghe-thuong.png" 
                  alt="Standard seat" 
                  width={40} 
                  height={40}
                  className="mr-2"
                />
                <div>
                  <p className="font-medium">Ghế Standard</p>
                  <p className="text-sm text-gray-600">100.000 VND</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Image 
                  src="https://www.bhdstar.vn/wp-content/assets/loodo/ghe-vip.png" 
                  alt="VIP seat" 
                  width={40} 
                  height={40}
                  className="mr-2"
                />
                <div>
                  <p className="font-medium">Ghế VIP</p>
                  <p className="text-sm text-gray-600">150.000 VND</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Image 
                  src="https://www.bhdstar.vn/wp-content/assets/loodo/ghe-da-ban.png" 
                  alt="Disabled seat" 
                  width={40} 
                  height={40}
                  className="mr-2"
                />
                <div>
                  <p className="font-medium">Ghế đã bán</p>
                  <p className="text-sm text-gray-600">Không thể chọn</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 border-t pt-4">
              <h4 className="font-bold mb-2">Ghế đã chọn</h4>
              <div className="max-h-[200px] overflow-y-auto">
                {selectedSeats.length === 0 ? (
                  <p className="text-gray-500 text-sm">Chưa có ghế nào được chọn</p>
                ) : (
                  <div className="space-y-2">
                    {selectedSeats.map((seat, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">
                          {seat.row}{seat.number} - {seat.type === 'standard' ? 'Standard' : seat.type === 'vip' ? 'VIP' : 'Couple'}
                        </span>
                        <span className="text-sm font-medium">{seat.price.toLocaleString()} VND</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-4 border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Tổng cộng:</span>
                  <span className="font-bold text-lg text-red-600">{getTotalPrice().toLocaleString()} VND</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Seat selection */}
        <div className="md:w-3/4">
          <div className="relative mb-6">
            <Image src="https://www.bhdstar.vn/wp-content/assets/loodo/seatMapHeader.png" alt="Screen" width={1000} height={1000} />
          </div>
          
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Seat Legend */}
              <div className="flex justify-center space-x-6 mb-4">
                <div className="flex items-center">
                  <Image 
                    src="https://www.bhdstar.vn/wp-content/assets/loodo/ghe-thuong.png" 
                    alt="Standard seat" 
                    width={24} 
                    height={24}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Standard</span>
                </div>
                <div className="flex items-center">
                  <Image 
                    src="https://www.bhdstar.vn/wp-content/assets/loodo/ghe-vip.png" 
                    alt="VIP seat" 
                    width={24} 
                    height={24}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Vip</span>
                </div>
                <div className="flex items-center">
                  <Image 
                    src="https://www.bhdstar.vn/wp-content/assets/loodo/ghe-da-ban.png" 
                    alt="Disabled seat" 
                    width={24} 
                    height={24}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Ghế đã bán</span>
                </div>
              </div>
              
              {/* Seats grid */}
              <div className="grid grid-cols-20 gap-1 text-center">
                {/* Row headers */}
                <div className="col-span-1 flex flex-col justify-between pt-1 pb-1">
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].map((row) => (
                    <div key={row} className="h-8 flex items-center justify-center text-gray-500">{row}</div>
                  ))}
                </div>
                
                {/* Seats grid */}
                <div className="col-span-18 grid grid-cols-18 gap-1">
                  {Array.from({ length: 11 }, (_, rowIndex) => (
                    <>
                      {Array.from({ length: 18 }, (_, seatIndex) => {
                        const row = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'][rowIndex];
                        const number = seatIndex + 1;
                        
                        if (rowIndex === 10) {
                          if (seatIndex % 2 === 0 && seatIndex < 16) {
                            return (
                              <div
                                key={`${rowIndex}-${seatIndex}`}
                                className="h-8 col-span-2 flex items-center justify-center"
                              >
                                <Image 
                                  src={isSeatSelected(row, number) 
                                    ? "https://www.bhdstar.vn/wp-content/assets/loodo/ghe-da-chon.png"
                                    : "https://www.bhdstar.vn/wp-content/assets/loodo/ghe-doi.png"} 
                                  alt="Couple seat" 
                                  width={32} 
                                  height={32}
                                  className="cursor-pointer hover:opacity-80"
                                  onClick={() => handleSeatClick(row, number, 'couple')}
                                />
                              </div>
                            );
                          } else if (seatIndex % 2 !== 0 || seatIndex >= 16) {
                            return null;
                          }
                        }
                        
                        if ((rowIndex === 5 || rowIndex === 6 || rowIndex === 7) && (seatIndex >= 7 && seatIndex <= 9)) {
                          return (
                            <div
                              key={`${rowIndex}-${seatIndex}`}
                              className="h-8 flex items-center justify-center"
                            >
                              <Image 
                                src="https://www.bhdstar.vn/wp-content/assets/loodo/ghe-da-ban.png" 
                                alt="Disabled seat" 
                                width={24} 
                                height={24}
                                className="cursor-not-allowed"
                              />
                            </div>
                          );
                        }
                        
                        if (rowIndex >= 3 && rowIndex <= 8) {
                          return (
                            <div
                              key={`${rowIndex}-${seatIndex}`}
                              className="h-8 flex items-center justify-center"
                            >
                              <Image 
                                src={isSeatSelected(row, number) 
                                  ? "https://www.bhdstar.vn/wp-content/assets/loodo/ghe-da-chon.png"
                                  : "https://www.bhdstar.vn/wp-content/assets/loodo/ghe-vip.png"} 
                                alt="VIP seat" 
                                width={24} 
                                height={24}
                                className="cursor-pointer hover:opacity-80"
                                onClick={() => handleSeatClick(row, number, 'vip')}
                              />
                            </div>
                          );
                        }
                        
                        return (
                          <div
                            key={`${rowIndex}-${seatIndex}`}
                            className="h-8 flex items-center justify-center"
                          >
                            <Image 
                              src={isSeatSelected(row, number) 
                                ? "https://www.bhdstar.vn/wp-content/assets/loodo/ghe-da-chon.png"
                                : "https://www.bhdstar.vn/wp-content/assets/loodo/ghe-thuong.png"} 
                              alt="Standard seat" 
                              width={24} 
                              height={24}
                              className="cursor-pointer hover:opacity-80"
                              onClick={() => handleSeatClick(row, number, 'standard')}
                            />
                          </div>
                        );
                      })}
                    </>
                  ))}
                </div>
                
                <div className="col-span-1 flex flex-col justify-between pt-1 pb-1">
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].map((row) => (
                    <div key={`right-${row}`} className="h-8 flex items-center justify-center text-gray-500">{row}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="border border-dashed border-gray-300 rounded-lg p-4 mt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h3 className="font-bold">{theaterName}</h3>
                <p className="text-sm text-gray-600">Screen 6 - {formatDate(date)} - Suất chiếu: {showtime}</p>
                <h2 className="font-bold text-xl text-green-600 mt-1">{movieTitle}</h2>
                <div className="flex space-x-2 mt-1">
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">18+</span>
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded">PHỤ ĐỀ</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">2D</span>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 w-full md:w-auto">
                <button 
                  className={`block ml-auto w-full md:w-auto px-6 py-2 font-medium rounded transition ${
                    selectedSeats.length > 0 
                      ? 'bg-red-600 text-white hover:bg-red-700 cursor-pointer' 
                      : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
                  disabled={selectedSeats.length === 0}
                >
                  {selectedSeats.length > 0 ? 'Tiếp tục' : 'Bạn chưa chọn ghế nào. Vui lòng chọn ghế.'}
                </button>
                <div className="text-right mt-2 text-sm text-gray-600 cursor-pointer" onClick={onBack}>
                  <span className="font-medium hover:underline">← Trở lại</span>
                </div>
                <div className="text-right mt-2 text-sm text-green-600">
                  <span>Còn lại <strong>{timeLeft.minutes} phút, {timeLeft.seconds} giây</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;