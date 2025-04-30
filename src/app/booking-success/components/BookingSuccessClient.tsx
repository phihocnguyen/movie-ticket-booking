"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { foodItems } from "@/data/foodItems";
import { paymentMethods } from "@/data/paymentMethods";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

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
  quantity: number;
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

  useEffect(() => {
    setMounted(true);
  }, []);

  // Parse food orders
  const foodOrders: FoodOrder[] = selectedFood.map(food => {
    const [id, quantity] = food.split(':');
    return { id, quantity: parseInt(quantity) };
  });

  // Calculate prices
  const ticketPrice = selectedSeats.length * 75000;
  const foodPrice = foodOrders.reduce((total, order) => {
    const food = foodItems.find(item => item.id === order.id);
    return total + (food?.price || 0) * order.quantity;
  }, 0);
  const totalAmount = ticketPrice + foodPrice;

  // Get payment method name
  const paymentMethodName = paymentMethods.find(m => m.id === paymentMethod)?.name || paymentMethod;

  if (!mounted) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12 bg-white rounded-lg shadow-md p-8">
          <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Đặt vé thành công!</h1>
          <p className="text-lg text-gray-600">
            Cảm ơn bạn đã đặt vé. Chi tiết đặt vé đã được gửi đến email của bạn.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Thông tin đặt vé</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">Phim</p>
                <p className="font-medium text-gray-900">{movieTitle}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">Rạp</p>
                <p className="font-medium text-gray-900">{theaterName}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">Suất chiếu</p>
                <p className="font-medium text-gray-900">{showtime}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">Ngày</p>
                <p className="font-medium text-gray-900">{new Date(dateStr).toLocaleDateString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">Ghế</p>
                <p className="font-medium text-gray-900">{selectedSeats.join(", ")}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">Phương thức thanh toán</p>
                <p className="font-medium text-gray-900">{paymentMethodName}</p>
              </div>
            </div>

            {foodOrders.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Đồ ăn và thức uống</h3>
                <div className="space-y-4">
                  {foodOrders.map(order => {
                    const food = foodItems.find(item => item.id === order.id);
                    return food ? (
                      <div key={order.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{food.name}</p>
                          <p className="text-sm text-gray-600">
                            {food.price.toLocaleString('vi-VN')}đ x {order.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {(food.price * order.quantity).toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Tổng cộng</span>
                <span className="text-2xl font-bold text-[var(--color-indigo-600)]">
                  {totalAmount.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 bg-[var(--color-indigo-600)] text-white rounded-lg hover:bg-[var(--color-indigo-700)] text-lg font-medium transition-colors duration-200"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessClient; 