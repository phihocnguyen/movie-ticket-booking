'use client'
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

interface Theater {
  id: string;
  name: string;
  address: string;
  logo: string;
  distance?: string;
}

interface TheaterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TheaterModal: React.FC<TheaterModalProps> = ({ isOpen, onClose }) => {
  const theaters: Theater[] = [
    {
      id: 'dong-da',
      name: 'Đống Đa',
      address: '890 Trần Hưng Đạo, Quận 5, Tp. Hồ Chí Minh',
      logo: '/images/theaters/ddc.png'
    },
    {
      id: 'beta-quang-trung',
      name: 'Beta Quang Trung',
      address: '645 Quang Trung, Phường 11, Quận Gò Vấp, Thành phố Hồ Chí Minh',
      logo: '/images/theaters/beta.png'
    },
    {
      id: 'beta-tran-quang-khai',
      name: 'Beta Trần Quang Khải',
      address: 'Tầng 2 & 3, Tòa nhà IMC, 62 Đường Trần Quang Khải, Phường Tân Định, Quận 1, TP. Hồ Chí Minh',
      logo: '/images/theaters/beta.png'
    },
    {
      id: 'beta-ung-van-khiem',
      name: 'Beta Ung Văn Khiêm',
      address: 'Tầng 1, tòa nhà PAX SKY, 26 Ung Văn Khiêm, phường 25, Quận Bình Thạnh, Thành phố Hồ Chí Minh, Việt Nam',
      logo: '/images/theaters/beta.png'
    },
    {
      id: 'cinestar-hai-ba-trung',
      name: 'Cinestar Hai Bà Trưng',
      address: '135 Hai Bà Trưng, P. Bến Nghé, Q.1, Tp. Hồ Chí Minh',
      logo: '/images/theaters/cinestar.png',
      distance: '2.5km'
    },
    {
      id: 'cinestar-quoc-thanh',
      name: 'Cinestar Quốc Thanh',
      address: '271 Nguyễn Trãi, P. Nguyễn Cư Trinh, Q.1, Tp. Hồ Chí Minh',
      logo: '/images/theaters/cinestar.png',
      distance: '3.1km'
    },
    {
      id: 'lotte-ung-van-khiem',
      name: 'Lotte Ung Văn Khiêm',
      address: 'Tầng Trệt, TTTM TTC Plaza, Số 26, Đường Ung Văn Khiêm, Phường 25, Quận Bình Thạnh, TP.HCM',
      logo: '/images/theaters/lotte.png',
      distance: '263m'
    },
    {
      id: 'cgv-saigonres-nguyen-xi',
      name: 'CGV Saigonres Nguyễn Xí',
      address: 'Tầng 4-5, Saigonres Plaza, 79/81 Nguyễn Xí, P 26, Q Bình Thạnh, Tp. Hồ Chí Minh',
      logo: '/images/theaters/cgv.png',
      distance: '915m'
    }
  ];

  if (!isOpen) return null;

  // Create a function to handle theater selection that also closes the modal
  const handleTheaterSelect = () => {
    onClose();
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Chọn rạp chiếu phim</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="divide-y divide-gray-100">
              {theaters.map((theater) => (
                <Link 
                  key={theater.id} 
                  href={`/theaters/${theater.id}`} 
                  className="block py-4 px-2 hover:bg-blue-50/30 transition-all group cursor-pointer"
                  onClick={handleTheaterSelect}
                >
                  <div className="flex items-start">
                    <div className="w-14 h-14 flex-shrink-0 overflow-hidden mr-4 rounded-full">
                      {/* Use logo placeholder for now */}
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        {theater.name.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors text-lg">{theater.name}</h3>
                      <div className="flex items-center mt-1 text-gray-500">
                        <MapPin size={14} className="mr-1 text-gray-400" />
                        <p className="text-sm text-gray-500">{theater.address}</p>
                      </div>
                      {theater.distance && (
                        <div className="mt-1 text-xs text-gray-400">
                          {theater.distance}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TheaterModal; 