'use client'
import { useState } from 'react';
import { Gift, Ticket, Zap, Star, Clock } from 'lucide-react';

interface Voucher {
  id: number;
  name: string;
  quantity: number;
  description?: string;
  discount?: string;
  expiryDate?: string;
  category?: 'movie' | 'food' | 'special';
}

const mockVouchers: Voucher[] = [
  { 
    id: 1, 
    name: 'Giảm 50% vé xem phim', 
    quantity: 10,
    description: 'Áp dụng cho tất cả suất chiếu',
    discount: '50%',
    expiryDate: '31/12/2025',
    category: 'movie'
  },
  { 
    id: 2, 
    name: 'Tặng bắp rang miễn phí', 
    quantity: 5,
    description: 'Size M khi mua vé xem phim',
    discount: 'FREE',
    expiryDate: '15/01/2026',
    category: 'food'
  },
  { 
    id: 3, 
    name: 'Mua 1 tặng 1 vé', 
    quantity: 2,
    description: 'Khuyến mãi đặc biệt cuối tuần',
    discount: 'BUY 1 GET 1',
    expiryDate: '28/02/2026',
    category: 'special'
  },
];

const categoryIcons = {
  movie: Ticket,
  food: Gift,
  special: Star
};

const categoryColors = {
  movie: 'from-blue-500 to-purple-600',
  food: 'from-orange-500 to-red-600',
  special: 'from-yellow-500 to-pink-600'
};

export default function Promotions() {
  const [claimedVouchers, setClaimedVouchers] = useState<Set<number>>(new Set());
  const [vouchers, setVouchers] = useState(mockVouchers);

  const handleClaim = (voucherId: number) => {
    setVouchers(prev => 
      prev.map(voucher => 
        voucher.id === voucherId 
          ? { ...voucher, quantity: Math.max(0, voucher.quantity - 1) }
          : voucher
      )
    );
    setClaimedVouchers(prev => new Set([...prev, voucherId]));
    
    // Remove from claimed after animation
    setTimeout(() => {
      setClaimedVouchers(prev => {
        const newSet = new Set(prev);
        newSet.delete(voucherId);
        return newSet;
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#181922] from-slate-50 via-blue-50 to-indigo-100 py-22 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Voucher của bạn
          </h1>
          <p className="text-gray-600 text-lg">Nhận ngay những ưu đãi hấp dẫn</p>
        </div>

        {/* Voucher Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vouchers.map(voucher => {
            const IconComponent = categoryIcons[voucher.category || 'movie'];
            const gradientColor = categoryColors[voucher.category || 'movie'];
            const isClaimed = claimedVouchers.has(voucher.id);
            const isOutOfStock = voucher.quantity === 0;

            return (
              <div 
                key={voucher.id} 
                className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                  isClaimed ? 'scale-105 ring-4 ring-green-400 ring-opacity-50' : ''
                } ${isOutOfStock ? 'opacity-60' : ''}`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50" />
                
                {/* Top Gradient Bar */}
                <div className={`h-2 bg-gradient-to-r ${gradientColor}`} />
                
                {/* Content */}
                <div className="relative p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${gradientColor} shadow-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${gradientColor}`}>
                      {voucher.discount}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-xl text-gray-800 mb-2 leading-tight">
                    {voucher.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4">
                    {voucher.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Còn lại</span>
                      <span className={`font-semibold ${
                        voucher.quantity > 5 ? 'text-green-600' : 
                        voucher.quantity > 0 ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {voucher.quantity} voucher
                      </span>
                    </div>
                    {voucher.expiryDate && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Hạn sử dụng
                        </span>
                        <span className="text-gray-700 font-medium">
                          {voucher.expiryDate}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Độ phổ biến</span>
                      <span>{Math.max(0, 15 - voucher.quantity)}/15</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${gradientColor} transition-all duration-700`}
                        style={{ width: `${Math.min(100, ((15 - voucher.quantity) / 15) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleClaim(voucher.id)}
                    disabled={isOutOfStock}
                    className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                      isOutOfStock
                        ? 'bg-gray-400 cursor-not-allowed'
                        : isClaimed
                        ? 'bg-green-500 scale-105'
                        : `bg-gradient-to-r ${gradientColor} hover:shadow-lg hover:scale-105 active:scale-95`
                    }`}
                  >
                    {isOutOfStock ? (
                      'Hết voucher'
                    ) : isClaimed ? (
                      <div className="flex items-center justify-center">
                        <Zap className="w-5 h-5 mr-2" />
                        Đã nhận!
                      </div>
                    ) : (
                      'Nhận ngay'
                    )}
                  </button>
                </div>

                {/* Claimed Effect */}
                {isClaimed && (
                  <div className="absolute inset-0 bg-green-400 bg-opacity-20 flex items-center justify-center rounded-2xl">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg animate-bounce">
                      ✨ Đã nhận thành công!
                    </div>
                  </div>
                )}

                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center rounded-2xl">
                    <div className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                      Hết voucher
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            💡 Voucher sẽ được thêm vào tài khoản của bạn sau khi nhận
          </p>
        </div>
      </div>
    </div>
  );
}