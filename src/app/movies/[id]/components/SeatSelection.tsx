'use client'
import Image from 'next/image';

interface SeatSelectionProps {
  movieTitle: string;
  theaterName: string;
  showtime: string;
  date: Date;
  onBack: () => void;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({
  movieTitle,
  theaterName,
  showtime,
  date,
  onBack
}) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/');
  };

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
              alt={movieTitle}
              width={200}
              height={300}
              className="rounded-md object-cover"
            />
          </div>
          <div className="w-full md:w-3/4">
            <h3 className="text-xl font-bold text-green-600">{movieTitle}</h3>
            <div className="mt-4">
              <button onClick={onBack} className="text-green-600 hover:underline font-medium">
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
};

export default SeatSelection; 