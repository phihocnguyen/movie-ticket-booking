"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BookingTimeline from "../../movies/[id]/components/BookingTimeline";
import { paymentMethods, PaymentMethod } from "@/data/paymentMethods";
import axiosInstance from "@/axiosInstance";
import { decodePaymentParams } from "@/app/utils/searchParams";

interface FoodOrder {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'Snack' | 'Drinks' | 'Fast Food';
}

interface BookingData {
  movieTitle: string;
  theaterName: string;
  showtime: string;
  date: string;
  seats: { 
    seatId: number; 
    seatName: string;
    price: number;  // Add price to seat data
  }[];
  food: Record<string, { id: string; name: string; quantity: number }>;
}

const PaymentClient = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [foodOrders, setFoodOrders] = useState<FoodOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const showtimeId = searchParams.get('showtimeId'); 
  useEffect(() => {
    setMounted(true);
    setUserId(localStorage.getItem('userId') || "");
  }, []);

  useEffect(() => {
    const url = window.location.href; 
    const params = decodePaymentParams(url);
    setBookingData({
      movieTitle: params.movieTitle as string,
      theaterName: params.theaterName as string,
      showtime: params.showtime as string,
      date: params.date as string,
      seats: params.seats.map((seat: any) => ({
        seatId: seat.seatId,
        seatName: seat.seatName,
        price: seat.price || 100000 // Default to standard price if not provided
      })),
      food: params.food as Record<string, { id: string; name: string; quantity: number }>
    });
  }, []);

  useEffect(() => {
    const fetchFoodItems = async () => {
      if (!bookingData?.food) return;
      console.log(Object.entries(bookingData.food))
      try {
        setIsLoading(true);
        const foodPromises = Object.entries(bookingData.food).map(async ([id, data]) => {
          try {
            const response = await axiosInstance.get(`/theater-food/${data.id}`);
            const foodItem: FoodItem = response.data;
            return {  
              id: data.id,
              name: data.name,
              quantity: data.quantity,
              price: foodItem.price
            };
          } catch (error) {
            console.error(`Error fetching food item ${id}:`, error);
            return {
              id,
              name: data.name,
              quantity: data.quantity,
              price: 0
            };
          }
        });

        const orders = await Promise.all(foodPromises);

        setFoodOrders(orders);
      } catch (error) {
        console.error('Error fetching food items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoodItems();
  }, [bookingData?.food]);

  const ticketPrice = bookingData?.seats.reduce((total, seat) => total + (seat.price || 100000), 0) || 0;

  const foodPrice = foodOrders.reduce((total, order) => {
    return total + (order.price * order.quantity);
  }, 0);

  const totalAmount = ticketPrice + foodPrice;

  if (!mounted || !bookingData) {
    return null;
  }


  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán');
      return;
    }

    try {
      setIsProcessing(true);
      const response = await axiosInstance.post('/bookings?paymentMethod=VNPAY', {
        userId: parseInt(userId),
        showtimeId: parseInt(showtimeId || "0"),
        bookingTime: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }).replace(/\//g, '/').replace(',', ''),
        status: "PENDING",
        totalAmount: totalAmount,
        bookingSeats: bookingData?.seats.map(seat => ({
          seatId: seat.seatId, 
          price: seat.price || 100000
        })),
        bookingFoods: foodOrders.map(food => ({
          foodInventoryId: food.id, 
          quantity: food.quantity, 
          price: food.price
        }))
      });
      if (response?.data?.data && typeof response.data.data === 'string' && response.data.data.startsWith('http')) {
        window.location.href = response.data.data;
        return;
      }
      
      // Create query parameters for booking success page
      const queryParams = new URLSearchParams({
        movieTitle: bookingData?.movieTitle || '',
        theaterName: bookingData?.theaterName || '',
        showtime: bookingData?.showtime || '',
        date: bookingData?.date || '',
        seats: bookingData?.seats.map(seat => `${seat.seatName}:${seat.price}`).join(',') || '',
        food: foodOrders.map(food => `${food.id}:${encodeURIComponent(food.name)}:${food.quantity}`).join(',') || '',
        paymentMethod: selectedPaymentMethod
      });

      router.push(`/booking-success?${queryParams.toString()}`);
    } catch (error: any) {
      if (error.response?.status === 409) {
        alert(error.response.data.message || "Ghế đã được đặt bởi người khác. Vui lòng chọn ghế khác.");
        router.back();
      } else {
        alert('Có lỗi xảy ra khi đặt vé. Vui lòng thử lại sau.');
      }
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <BookingTimeline currentStep={4} />
      <div className="mt-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Thanh toán</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Thông tin đặt vé</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">Phim</p>
                <p className="font-medium text-gray-900">{bookingData.movieTitle}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">Rạp</p>
                <p className="font-medium text-gray-900">{bookingData.theaterName}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">Ngày</p>
                <p className="font-medium text-gray-900">{bookingData.date ? new Date(bookingData.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">Giờ chiếu</p>
                <p className="font-medium text-gray-900">{bookingData.showtime ? new Date(bookingData.showtime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">Ghế</p>
                <p className="font-medium text-gray-900">{bookingData.seats.map(seat => seat.seatName).join(", ")}</p>
              </div>
            </div>

            {isLoading ? (
              <div className="mt-8 text-center">
                <p className="text-gray-600">Đang tải thông tin đồ ăn...</p>
              </div>
            ) : foodOrders.length > 0 ? (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Đồ ăn và thức uống</h3>
                <div className="space-y-4">
                  {foodOrders.map(order => (
                    <div key={order.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{order.name}</p>
                        <p className="text-sm text-gray-600">
                          {order.price.toLocaleString('vi-VN')}đ x {order.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {(order.price * order.quantity).toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Phương thức thanh toán</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all
                  ${selectedPaymentMethod === method.id 
                    ? 'border-[var(--color-indigo-600)] bg-[var(--color-indigo-50)]' 
                    : 'border-gray-200 hover:border-[var(--color-indigo-300)] hover:bg-gray-50'
                  }`}
                onClick={() => setSelectedPaymentMethod(method.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    {/* Payment method icon placeholder */}
                    <span className="text-2xl text-gray-400">{method.name[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{method.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Chi tiết thanh toán</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3">
              <div>
                <span className="text-gray-700">Vé xem phim ({bookingData?.seats.length} vé)</span>
                <div className="mt-1 space-y-1">
                  {bookingData?.seats.map((seat, index) => (
                    <p key={index} className="text-sm text-gray-600">
                      {seat.seatName}: {seat.price.toLocaleString('vi-VN')}đ
                    </p>
                  ))}
                </div>
              </div>
              <span className="font-medium text-gray-900">{ticketPrice.toLocaleString('vi-VN')}đ</span>
            </div>
            {foodPrice > 0 && (
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-700">Đồ ăn và thức uống</span>
                <span className="font-medium text-gray-900">{foodPrice.toLocaleString('vi-VN')}đ</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Tổng cộng</span>
                <span className="text-2xl font-bold text-[var(--color-indigo-600)]">
                  {totalAmount.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => router.back()}
            disabled={isProcessing}
            className={`px-8 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium transition-colors duration-200 ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
            }`}
          >
            Quay lại
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`relative px-8 py-3 bg-[var(--color-indigo-600)] text-white rounded-lg text-lg font-medium transition-colors duration-200 ${
              isProcessing ? 'opacity-90 cursor-not-allowed' : 'hover:bg-[var(--color-indigo-700)]'
            }`}
          >
            {isProcessing ? (
              <>
                <span className="opacity-0">Thanh toán</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              </>
            ) : (
              'Thanh toán'
            )}
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-[var(--color-indigo-600)] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-medium text-gray-900">Đang xử lý thanh toán...</p>
            <p className="text-sm text-gray-600">Vui lòng không tắt trình duyệt</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentClient; 