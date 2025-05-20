"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { paymentMethods } from "@/data/paymentMethods";
import { CheckCircleIcon, TicketIcon, CalendarIcon, ClockIcon, MapPinIcon, UserGroupIcon, CreditCardIcon, ShoppingBagIcon, HomeIcon } from "@heroicons/react/24/outline";
import axiosInstance from "@/axiosInstance";

interface BookingSuccessClientProps {
  movieTitle: string;
  theaterName: string;
  showtime: string;
  dateStr: string;
  selectedSeats: string[];
  selectedFood: string[];
  paymentMethod: string;
}

interface FoodOrder {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface SeatPrice {
  seatName: string;
  price: number;
}

const BookingSuccessClient: React.FC<BookingSuccessClientProps> = ({
  movieTitle,
  theaterName,
  showtime,
  dateStr,
  selectedSeats,
  selectedFood,
  paymentMethod,
}) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [foodOrders, setFoodOrders] = useState<FoodOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [seatPrices, setSeatPrices] = useState<SeatPrice[]>([]);

  useEffect(() => {
    setMounted(true);
    // Parse seat prices from selectedSeats
    const prices = selectedSeats.map(seat => {
      const [seatName, priceStr] = seat.split(':');
      return {
        seatName,
        price: parseInt(priceStr) || 0
      };
    });
    setSeatPrices(prices);
  }, [selectedSeats]);

  useEffect(() => {
    const fetchFoodItems = async () => {
      if (!selectedFood.length) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const foodPromises = selectedFood.map(async (food) => {
          try {
            const [id, name, quantity] = food.split(':');
            const parsedQuantity = parseInt(quantity) || 0;
            
            const response = await axiosInstance.get(`/theater-food/${id}`);
            const foodItem = response.data;
            
            return {
              id,
              name: decodeURIComponent(name || ''),
              quantity: parsedQuantity,
              price: foodItem.price
            };
          } catch (error) {
            console.error('Error fetching food item:', food, error);
            return {
              id: '',
              name: '',
              quantity: 0,
              price: 0
            };
          }
        });

        const orders = await Promise.all(foodPromises);
        setFoodOrders(orders.filter(order => order.quantity > 0));
      } catch (error) {
        console.error('Error fetching food items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoodItems();
  }, [selectedFood]);

  // Calculate prices with safety checks
  const ticketPrice = seatPrices.reduce((total, seat) => total + (seat.price || 0), 0);
  const foodPrice = foodOrders.reduce((total, order) => {
    const itemTotal = (order.price || 0) * (order.quantity || 0);
    return total + (isNaN(itemTotal) ? 0 : itemTotal);
  }, 0);
  const totalAmount = (ticketPrice || 0) + (foodPrice || 0);

  // Ensure all displayed numbers are valid
  const formatPrice = (price: number) => {
    return (isNaN(price) ? 0 : price).toLocaleString('vi-VN');
  };

  // Get payment method name
  const paymentMethodName = paymentMethods.find(m => m.id === paymentMethod)?.name || paymentMethod;

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 md:p-6 font-sans">
      <div className="relative w-full max-w-3xl">
        <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-pink-500 to-red-600 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-20"></div>

        <div className="mt-20 relative backdrop-blur-sm bg-gray-900/90 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600"></div>
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_70%)]"></div>
            <div className="relative p-10 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-white rounded-full p-4 shadow-lg transform hover:scale-105 transition-transform duration-200">
                  <CheckCircleIcon className="w-10 h-10 text-red-600" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Đặt vé thành công!
              </h1>
              <p className="text-lg text-gray-100 max-w-lg mx-auto">
                Cảm ơn bạn đã đặt vé. Chi tiết đặt vé đã được gửi đến email của bạn.
              </p>
            </div>
          </div>

          {/* Ticket Modal */}
          <div className="relative">
            {/* Perforated line */}
            <div className="absolute -top-4 left-0 right-0 flex justify-between px-4">
              <div className="w-8 h-8 bg-gray-900 rounded-full border-4 border-gray-800 -mt-4"></div>
              <div className="w-8 h-8 bg-gray-900 rounded-full border-4 border-gray-800 -mt-4"></div>
            </div>
            
            {/* Dotted line */}
            <div className="absolute -top-2 left-0 right-0 border-t-2 border-dashed border-gray-700"></div>

            {/* Modal Content */}
            <div className="p-6 md:p-10 text-white bg-gray-900/95 backdrop-blur-sm">
              <div className="max-w-xl mx-auto">
                {/* Movie Title with Ticket Icon */}
                <div className="flex items-center justify-center mb-8">
                  <TicketIcon className="w-8 h-8 text-red-500 mr-3" />
                  <h2 className="text-3xl font-bold text-white">{movieTitle}</h2>
                </div>

                {/* Movie Info Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8 bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">Rạp</p>
                      <p className="text-white font-medium">{theaterName}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CalendarIcon className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">Ngày</p>
                      <p className="text-white font-medium">{new Date(dateStr).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <ClockIcon className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">Suất chiếu</p>
                      <p className="text-white font-medium">{showtime}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <UserGroupIcon className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">Ghế</p>
                      <p className="text-white font-medium">
                        {seatPrices.map(seat => seat.seatName).join(", ")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-8 bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
                  <div className="flex items-center mb-4">
                    <CreditCardIcon className="w-6 h-6 text-red-400 mr-3" />
                    <h3 className="text-lg font-semibold text-white">Phương thức thanh toán</h3>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-xl">
                    <p className="font-medium text-white">{paymentMethodName}</p>
                  </div>
                </div>

                {/* Food Orders */}
                {isLoading ? (
                  <div className="mb-8 bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
                    <div className="flex items-center mb-4">
                      <ShoppingBagIcon className="w-6 h-6 text-red-400 mr-3" />
                      <h3 className="text-lg font-semibold text-white">Đồ ăn & Thức uống</h3>
                    </div>
                    <p className="text-gray-400">Đang tải thông tin đồ ăn...</p>
                  </div>
                ) : foodOrders.length > 0 ? (
                  <div className="mb-8 bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
                    <div className="flex items-center mb-4">
                      <ShoppingBagIcon className="w-6 h-6 text-red-400 mr-3" />
                      <h3 className="text-lg font-semibold text-white">Đồ ăn & Thức uống</h3>
                    </div>
                    <div className="space-y-3">
                      {foodOrders.map(order => (
                        <div key={order.id} className="flex items-center justify-between bg-gray-700/50 p-4 rounded-xl">
                          <div className="flex items-center">
                            <div className="w-8 h-8 flex items-center justify-center bg-red-500/20 rounded-lg mr-3 text-red-400 font-medium">
                              {order.quantity}
                            </div>
                            <div>
                              <p className="font-medium text-white">{order.name}</p>
                              <p className="text-sm text-gray-400">
                                {formatPrice(order.price)}đ x {order.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold text-white">
                            {formatPrice(order.price * order.quantity)}đ
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Price Summary */}
                <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 mb-8">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Vé ({seatPrices.length || 0})</span>
                      <span className="text-white font-medium">{formatPrice(ticketPrice)}đ</span>
                    </div>
                    {foodPrice > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Đồ ăn & Thức uống</span>
                        <span className="text-white font-medium">{formatPrice(foodPrice)}đ</span>
                      </div>
                    )}
                    <div className="border-t border-gray-700 my-3 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-white">Tổng cộng</span>
                        <span className="text-2xl font-bold text-red-500">
                          {formatPrice(totalAmount)}đ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back to Home Button */}
                <div className="text-center">
                  <button
                    onClick={() => router.push('/')}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-full hover:from-red-700 hover:to-pink-700 transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <HomeIcon className="w-6 h-6 mr-2" />
                    Về trang chủ
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Perforated line */}
            <div className="absolute -bottom-4 left-0 right-0 flex justify-between px-4">
              <div className="w-8 h-8 bg-gray-900 rounded-full border-4 border-gray-800 -mb-4"></div>
              <div className="w-8 h-8 bg-gray-900 rounded-full border-4 border-gray-800 -mb-4"></div>
            </div>
            <div className="absolute -bottom-2 left-0 right-0 border-t-2 border-dashed border-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessClient;