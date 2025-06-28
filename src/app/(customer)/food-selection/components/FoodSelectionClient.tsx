"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BookingTimeline from "../../movies/[id]/components/BookingTimeline";
import axiosInstance from "@/axiosInstance";
import Image from "next/image";

interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  category: 'Snack' | 'Drinks' | 'Fast Food';
}

interface FoodSelectionClientProps {
  movieTitle: string;
  theaterName: string;
  showtime: string;
  dateStr: string;
  selectedSeats: string[];
}

interface SelectedItem extends FoodItem {
  quantity: number;
}

const FoodSelectionClient: React.FC<FoodSelectionClientProps> = ({
  movieTitle,
  theaterName,
  showtime,
  dateStr,
  selectedSeats,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);

  const fetchFoodItems = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/theater-food');
      setFoodItems(response.data.data);
    } catch (error) {
      console.error('Error fetching food items:', error);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchFoodItems();
  }, [fetchFoodItems]);

  const handleQuantityChange = (item: FoodItem, change: number) => {
    setSelectedItems(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + change;
        if (newQuantity <= 0) {
          return prev.filter(i => i.id !== item.id);
        }
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: newQuantity } : i
        );
      } else if (change > 0) {
        return [...prev, { ...item, quantity: 1 }];
      }
      return prev;
    });
  };

  const totalAmount = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!mounted) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <BookingTimeline currentStep={3} />
      <div className="mt-8">
        <h1 className="text-2xl font-bold mb-6">Chọn thức ăn và đồ uống</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column - Food items */}
          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {foodItems.map((item) => {
                const selectedItem = selectedItems.find(i => i.id === item.id);
                const quantity = selectedItem?.quantity || 0;
                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-lg shadow-md p-4 transition-all
                      ${quantity > 0 ? 'ring-2 ring-[var(--color-indigo-600)]' : ''}`}
                  >
                    <div className="aspect-video bg-gray-200 rounded-lg mb-4 relative overflow-hidden">
                      <Image 
                        src={item.imageUrl} 
                        alt={item.name} 
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-[var(--color-indigo-600)] font-semibold">
                        {item.price.toLocaleString('vi-VN')}đ
                      </p>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                          disabled={quantity === 0}
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column - Order summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Đơn hàng của bạn</h2>
              {selectedItems.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {selectedItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            {item.price.toLocaleString('vi-VN')}đ x {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">
                          {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
                    <span>Tổng cộng:</span>
                    <span>{totalAmount.toLocaleString('vi-VN')}đ</span>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">Chưa có món nào được chọn</p>
              )}

              <div className="mt-6 space-y-4">
                <button
                  onClick={() => router.back()}
                  className="w-full px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Quay lại
                </button>
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    if (selectedItems.length > 0) {
                      const foodItems = selectedItems
                        .map(item => `${item.id}:${encodeURIComponent(item.name)}:${item.quantity}`)
                        .join(',');
                      params.set('food', foodItems);
                    }
                    router.push(`/payment?${params.toString()}`);
                  }}
                  className="w-full px-6 py-2 bg-[var(--color-indigo-600)] text-white rounded-lg hover:bg-[var(--color-indigo-700)]"
                >
                  Tiếp tục
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodSelectionClient;