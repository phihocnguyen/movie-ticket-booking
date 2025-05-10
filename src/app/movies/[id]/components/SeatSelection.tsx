'use client'
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import axiosInstance from "@/axiosInstance";

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

interface SeatData {
  id: number;
  seatNumber: string;
  seatTypeId: number;
  isActive: boolean;
  seatTypeName: string;
  priceMultiplier: number;
}

const SeatSelection = ({
  movieTitle,
  theaterName,
  showtime,
  date,
  onBack
}: SeatSelectionProps) => {
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [timeLeft, setTimeLeft] = useState({ minutes: 10, seconds: 0 });
  const [activeSummary, setActiveSummary] = useState(false);
  const [seats, setSeats] = useState<SeatData[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axiosInstance.get('/seats');
        setSeats(response.data);
      } catch (error) {
        console.error('Error fetching seats:', error);
      }
    };

    fetchSeats();
  }, []);

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

  const formatDate = (date: Date) => {
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

  const toggleSummary = () => {
    setActiveSummary(!activeSummary);
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;
    const seatsParam = selectedSeats
      .map(seat =>
        seat.type === "couple"
          ? `${seat.row}${seat.number}-${seat.number + 1}`
          : `${seat.row}${seat.number}`
      )
      .join(",");
    router.push(
      `/food-selection?movieTitle=${encodeURIComponent(movieTitle)}&theaterName=${encodeURIComponent(theaterName)}&showtime=${encodeURIComponent(showtime)}&date=${encodeURIComponent(date.toISOString())}&seats=${encodeURIComponent(seatsParam)}`
    );
  };

  const getSeatType = (seatTypeId: number): 'standard' | 'vip' | 'couple' => {
    if (seatTypeId === 1) return 'standard';
    if (seatTypeId === 2) return 'vip';
    if (seatTypeId === 3) return 'couple';
    return 'standard';
  };

  const parseSeatNumber = (seatNumber: string) => {
    const match = seatNumber.match(/^([A-Z]+)(\d+)$/i);
    if (!match) return { row: '', number: 0 };
    return { row: match[1].toUpperCase(), number: parseInt(match[2], 10) };
  };

  const renderSeatGrid = () => {
    const rows: { [row: string]: SeatData[] } = {};
    seats.forEach(seat => {
      const { row } = parseSeatNumber(seat.seatNumber);
      if (!rows[row]) rows[row] = [];
      rows[row].push(seat);
    });
    const sortedRows = Object.keys(rows).sort((a, b) => a.localeCompare(b));
    return (
      <div className="overflow-x-auto">
        <div className="min-w-[600px] px-4">
          <div className="flex flex-col gap-1 text-center">
            {sortedRows.map(row => {
              const seatsInRow = rows[row].sort((a, b) => {
                const na = parseSeatNumber(a.seatNumber).number;
                const nb = parseSeatNumber(b.seatNumber).number;
                return na - nb;
              });
              const seatElements = [];
              for (let i = 0; i < seatsInRow.length; i++) {
                const seat = seatsInRow[i];
                const { row, number } = parseSeatNumber(seat.seatNumber);
                const type = getSeatType(seat.seatTypeId);
                if (type === 'couple') {
                  seatElements.push(
                    <div key={seat.id} className="h-8 flex items-center justify-center flex-[2_2_0%] max-w-[112px] min-w-[56px]">
                      {renderSeat(row, number, type, !seat.isActive)}
                    </div>
                  );
                  i++;
                } else {
                  seatElements.push(
                    <div key={seat.id} className="h-8 flex items-center justify-center flex-1 min-w-[56px] max-w-[56px]">
                      {renderSeat(row, number, type, !seat.isActive)}
                    </div>
                  );
                }
              }
              return (
                <div key={row} className="flex items-center gap-1 mb-1">
                  <div className="w-8 flex-shrink-0 flex items-center justify-center text-gray-500 font-medium">{row}</div>
                  <div className="flex flex-1 justify-between gap-1">{seatElements}</div>
                  <div className="w-8 flex-shrink-0 flex items-center justify-center text-gray-500 font-medium">{row}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderSeat = (row: string, number: number, type: 'standard' | 'vip' | 'couple', disabled = false) => {
    const isSelected = isSeatSelected(row, number);
    
    let bgColor = '';
    let textColor = 'text-gray-700';
    let seatType = '';
    
    if (disabled) {
      bgColor = 'bg-gray-200';
      textColor = 'text-gray-400';
      seatType = 'Đã bán';
    } else if (isSelected) {
      bgColor = 'bg-indigo-600';
      textColor = 'text-white';
      seatType = type === 'standard' ? 'STD' : type === 'vip' ? 'VIP' : 'CPL';
    } else if (type === 'standard') {
      bgColor = 'bg-blue-100 hover:bg-blue-200';
      seatType = 'STD';
    } else if (type === 'vip') {
      bgColor = 'bg-purple-100 hover:bg-purple-200';
      seatType = 'VIP';
    } else if (type === 'couple') {
      bgColor = 'bg-pink-100 hover:bg-pink-200';
      seatType = 'CPL';
      return (
        <div
          className={`w-20 h-8 col-span-2 flex items-center justify-center cursor-pointer ${isSelected ? 'bg-indigo-600 text-white' : 'bg-pink-100 hover:bg-pink-200'} rounded-md transition-all duration-200 shadow-sm`}
          onClick={() => !disabled && handleSeatClick(row, number, type)}
        >
          <span className="text-xs font-semibold">{row}{number}-{number+1}</span>
        </div>
      );
    }

    return (
      <div
        className={`w-10 h-8 flex items-center justify-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${bgColor} ${textColor} rounded-md transition-all duration-200 shadow-sm ${isSelected ? 'ring-2 ring-indigo-300' : ''}`}
        onClick={() => !disabled && handleSeatClick(row, number, type)}
      >
        <span className="text-xs font-semibold">{row}{number}</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 max-w-6xl mx-auto relative">
      {/* Mobile Seat Summary Overlay */}
      <div className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${activeSummary ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 transition-transform duration-300 ${activeSummary ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Ghế đã chọn ({selectedSeats.length})</h3>
            <button onClick={toggleSummary} className="text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {selectedSeats.length === 0 ? (
              <p className="text-gray-500 text-sm">Chưa có ghế nào được chọn</p>
            ) : (
              <div className="space-y-2">
                {selectedSeats.map((seat, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${seat.type === 'standard' ? 'bg-blue-500' : seat.type === 'vip' ? 'bg-purple-500' : 'bg-pink-500'}`}>
                        {seat.row}{seat.number}
                      </div>
                      <span className="ml-2 font-medium">
                        {seat.type === 'standard' ? 'Standard' : seat.type === 'vip' ? 'VIP' : 'Couple'}
                      </span>
                    </div>
                    <span className="font-medium">{seat.price.toLocaleString()} VND</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-bold">Tổng cộng:</span>
              <span className="font-bold text-lg text-indigo-600">{getTotalPrice().toLocaleString()} VND</span>
            </div>
            
            <button 
              className={`mt-4 w-full py-3 font-medium rounded-lg transition ${
                selectedSeats.length > 0 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              disabled={selectedSeats.length === 0}
              onClick={handleContinue}
            >
              {selectedSeats.length > 0 ? 'Tiếp tục thanh toán' : 'Vui lòng chọn ghế'}
            </button>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Chọn ghế</h2>
          <div className="flex items-center text-sm text-indigo-600 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{timeLeft.minutes}:{timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}</span>
          </div>
        </div>
        
        <div className="mt-2 flex flex-wrap items-center text-sm text-gray-600">
          <div className="mr-4 mb-2">
            <span className="font-medium text-indigo-600">{movieTitle}</span>
          </div>
          <div className="mr-4 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>{theaterName}</span>
          </div>
          <div className="mr-4 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(date)}</span>
          </div>
          <div className="mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{showtime}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side - Seat selection */}
        <div className="lg:w-2/3 order-2 lg:order-1">
          {/* Screen */}
          <div className="relative mb-12">
            <div className="bg-gradient-to-b from-indigo-100 to-white h-8 rounded-t-full mx-auto w-4/5 mb-1"></div>
            <div className="bg-indigo-200 h-2 w-4/5 mx-auto rounded-t-full"></div>
            <p className="text-center text-sm text-gray-500 mt-2">Màn hình</p>
          </div>
          
          {/* Seat Legend */}
          <div className="flex flex-wrap justify-center space-x-4 mb-8">
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 bg-blue-100 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Standard</span>
            </div>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 bg-purple-100 rounded mr-2"></div>
              <span className="text-sm text-gray-600">VIP</span>
            </div>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 bg-pink-100 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Couple</span>
            </div>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 bg-indigo-600 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Đã chọn</span>
            </div>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Đã bán</span>
            </div>
          </div>
          
          {/* Seats grid */}
          {renderSeatGrid()}

          {/* Mobile continue button */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg border-t z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{selectedSeats.length} ghế đã chọn</p>
                <p className="font-bold text-indigo-600">{getTotalPrice().toLocaleString()} VND</p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={toggleSummary}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium"
                >
                  Chi tiết
                </button>
                
                <button
                  className={`px-4 py-2 rounded-lg font-medium ${
                    selectedSeats.length > 0 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-400'
                  }`}
                  disabled={selectedSeats.length === 0}
                  onClick={handleContinue}
                >
                  Tiếp tục
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Seat information */}
        <div className="lg:w-1/3 order-1 lg:order-2">
          <div className="bg-gray-50 p-6 rounded-xl shadow-sm sticky top-4">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Thông tin đặt vé</h3>
            
            <div className="space-y-6">
              {/* Seat types */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Ghế Standard</p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-700">100.000 VND</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Ghế VIP</p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-700">150.000 VND</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Ghế Couple</p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-700">200.000 VND</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-bold mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Ghế đã chọn
                </h4>
                
                <div className="max-h-[200px] overflow-y-auto">
                  {selectedSeats.length === 0 ? (
                    <div className="text-center py-8">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <p className="text-gray-500 mt-2">Chưa có ghế nào được chọn</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedSeats.map((seat, index) => (
                        <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${seat.type === 'standard' ? 'bg-blue-500' : seat.type === 'vip' ? 'bg-purple-500' : 'bg-pink-500'}`}>
                              {seat.row}{seat.number}
                            </div>
                            <span className="ml-2 font-medium">
                              {seat.type === 'standard' ? 'Standard' : seat.type === 'vip' ? 'VIP' : 'Couple'}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium text-gray-700">{seat.price.toLocaleString()}</span>
                            <button
                              onClick={() => handleSeatClick(seat.row, seat.number, seat.type)}
                              className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Số lượng ghế:</span>
                  <span className="font-medium">{selectedSeats.length}</span>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Phí dịch vụ:</span>
                  <span className="font-medium">0 VND</span>
                </div>
                
                <div className="flex justify-between items-center mt-4 pb-4 border-b border-gray-200">
                  <span className="font-bold text-lg">Tổng cộng:</span>
                  <span className="font-bold text-xl text-indigo-600">{getTotalPrice().toLocaleString()} VND</span>
                </div>
                
                <div className="mt-6 hidden lg:block">
                  <button 
                    className={`w-full py-3 font-medium rounded-lg transition text-center ${
                      selectedSeats.length > 0 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={selectedSeats.length === 0}
                    onClick={handleContinue}
                  >
                    {selectedSeats.length > 0 ? 'Tiếp tục thanh toán' : 'Vui lòng chọn ghế'}
                  </button>
                  
                  <div className="flex justify-center mt-4">
                    <button onClick={onBack} className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Trở lại
                    </button>
                  </div>
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