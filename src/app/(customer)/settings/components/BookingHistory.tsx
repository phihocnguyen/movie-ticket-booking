"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Users,
  Download,
  Eye,
} from "lucide-react";
import axiosInstance from "@/axiosInstance";

interface BookingSeat {
  seatId: number;
  price: number;
  seatName: string;
  seatType: string;
}

interface BookingFood {
  foodInventoryId: number;
  quantity: number;
  price: number;
  foodName: string;
}

interface Showtime {
  id: number;
  movieId: number;
  theaterId: number;
  screenId: number;
  startTime: string;
  endTime: string;
  price: number;
  isActive: boolean;
  screenName: string;
  movieTitle: string;
  theaterName: string;
  theaterAddress: string;
}

interface Booking {
  id: number;
  userId: number;
  showtimeId: number;
  bookingTime: string;
  totalAmount: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  isActive: boolean;
  bookingSeats: BookingSeat[];
  bookingFoods: BookingFood[];
  createdAt: string;
  updatedAt: string;
  showtime: Showtime;
  moviePosterUrl: string;
}

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const response = await axiosInstance.get(`/bookings/user/${userId}`);
        setBookings(response.data.data);
      } catch (error) {
        setError("An error occurred while fetching bookings");
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "COMPLETED":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "CANCELLED":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-300">No bookings found</h3>
        <p className="text-gray-400 mt-2">You haven't made any bookings yet.</p>
      </div>
    );
  }
  // console.log("bookings", bookings);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {bookings.map((booking) => (
        <motion.div
          key={booking.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50"
        >
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-64 relative rounded-lg overflow-hidden">
                <img
                  src={`${booking.moviePosterUrl}`}
                  alt={booking.showtime.movieTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {booking.showtime.movieTitle}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      {booking.totalAmount.toLocaleString("vi-VN")}đ
                    </p>
                    <p className="text-sm text-gray-400">Total Amount</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-indigo-400" />
                    <span className="text-gray-300">
                      {booking.showtime.startTime.split(" ")[0]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-indigo-400" />
                    <span className="text-gray-300">
                      {booking.showtime.startTime.split(" ")[1]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-indigo-400" />
                    <span className="text-gray-300">
                      {booking.showtime.theaterName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-400" />
                    <span className="text-gray-300">
                      {booking.bookingSeats
                        .map((seat) => seat.seatName)
                        .join(", ")}
                    </span>
                  </div>
                </div>

                {booking.bookingFoods.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">
                      Food & Drinks
                    </h4>
                    <div className="space-y-2">
                      {booking.bookingFoods.map((food, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-300">
                            {food.foodName} x{food.quantity}
                          </span>
                          <span className="text-gray-300">
                            {(food.price * food.quantity).toLocaleString(
                              "vi-VN"
                            )}
                            đ
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <button className="px-4 py-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
