"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BookingTimeline from "../../movies/[id]/components/BookingTimeline";
import { paymentMethods, PaymentMethod } from "@/data/paymentMethods";
import { foodItems } from "@/data/foodItems";

interface PaymentClientProps {
  movieTitle: string;
  theaterName: string;
  showtime: string;
  dateStr: string;
  selectedSeats: string[];
  selectedFood: string[];
}

interface FoodOrder {
  id: string;
  quantity: number;
}

const PaymentClient: React.FC<PaymentClientProps> = ({
  movieTitle,
  theaterName,
  showtime,
  dateStr,
  selectedSeats,
  selectedFood,
}) => {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate ticket price (mock price)
  const ticketPrice = selectedSeats.length * 75000;

  // Parse food orders and calculate total
  const foodOrders: FoodOrder[] = selectedFood.map(food => {
    const [id, quantity] = food.split(':');
    return { id, quantity: parseInt(quantity) };
  });

  // Calculate food price
  const foodPrice = foodOrders.reduce((total, order) => {
    const food = foodItems.find(item => item.id === order.id);
    return total + (food?.price || 0) * order.quantity;
  }, 0);

  const totalAmount = ticketPrice + foodPrice;

  if (!mounted) {
    return null; // Prevent hydration mismatch
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
              <span className="text-gray-700">Vé xem phim ({selectedSeats.length} vé)</span>
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
            className="px-8 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors duration-200"
          >
            Quay lại
          </button>
          <button
            onClick={() => {
              if (!selectedPaymentMethod) {
                alert('Vui lòng chọn phương thức thanh toán');
                return;
              }
              // Handle payment submission
              router.push("/booking-success");
            }}
            className="px-8 py-3 bg-[var(--color-indigo-600)] text-white rounded-lg hover:bg-[var(--color-indigo-700)] text-lg font-medium transition-colors duration-200"
          >
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentClient; 