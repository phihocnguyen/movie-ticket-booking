"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import axiosInstance from "@/axiosInstance";

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
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);

  const theaterLogos: Record<string, string> = {
    CGV: "https://banner2.cleanpng.com/20181203/orv/kisspng-cj-cgv-vietnam-cinema-cj-group-film-1713914319903.webp",
    Beta: "https://theme.hstatic.net/200000727463/1001067697/14/share_fb_home.jpg?v=210",
    Cinestar:
      "https://tenpack.com.vn/wp-content/uploads/2016/02/cinestar-logo.png",
    Lotte:
      "https://play-lh.googleusercontent.com/3JrdBBVW45zS25P_U05KxhfiaMbfvN-iUccLTANtBZYANtWP8KgsRaVeMbn0ghlyvSDI",
  };

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const response = await axiosInstance.get("/theaters");
        console.log("response", response);
        const theatersData = response.data.data.map((theater: any) => {
          let logoKey = Object.keys(theaterLogos).find((key) =>
            theater.name.includes(key)
          );
          let logo = logoKey ? theaterLogos[logoKey] : "";

          return {
            id: theater.id.toString(),
            name: theater.name,
            address: theater.address,
            logo: logo,
          };
        });
        setTheaters(theatersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching theaters:", error);
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchTheaters();
    }
  }, [isOpen]);

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
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Chọn rạp chiếu phim
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {loading ? (
              <div className="py-10 text-center">
                <p>Đang tải danh sách rạp...</p>
              </div>
            ) : (
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
                        {theater.logo ? (
                          <div className="w-full h-full relative">
                            <Image
                              src={theater.logo}
                              alt={theater.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            {theater.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors text-lg">
                          {theater.name}
                        </h3>
                        <div className="flex items-center mt-1 text-gray-500">
                          <MapPin size={14} className="mr-1 text-gray-400" />
                          <p className="text-sm text-gray-500">
                            {theater.address}
                          </p>
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
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TheaterModal;
