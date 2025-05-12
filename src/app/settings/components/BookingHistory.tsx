'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Calendar, Clock, MapPin, Users, Download, Eye } from 'lucide-react';
import { authService } from '../../services/authService';

interface Booking {
  id: string;
  movieTitle: string;
  moviePoster: string;
  theaterName: string;
  showTime: string;
  showDate: string;
  seats: string[];
  totalAmount: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  bookingDate: string;
}

// Mock data for visualization
const mockBookings: Booking[] = [
  {
    id: '1',
    movieTitle: 'Inception',
    moviePoster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    theaterName: 'CGV Cinemas Central Park',
    showTime: '19:30',
    showDate: '2024-03-20',
    seats: ['A12', 'A13'],
    totalAmount: 24.99,
    status: 'upcoming',
    bookingDate: '2024-03-15',
  },
  {
    id: '2',
    movieTitle: 'The Dark Knight',
    moviePoster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    theaterName: 'BHD Star Bitexco',
    showTime: '20:00',
    showDate: '2024-03-18',
    seats: ['E8'],
    totalAmount: 12.99,
    status: 'completed',
    bookingDate: '2024-03-10',
  },
  {
    id: '3',
    movieTitle: 'Interstellar',
    moviePoster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    theaterName: 'Galaxy Cinema Nguyen Du',
    showTime: '21:15',
    showDate: '2024-03-22',
    seats: ['C5', 'C6', 'C7'],
    totalAmount: 36.99,
    status: 'cancelled',
    bookingDate: '2024-03-12',
  },
];

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings); // Using mock data instead of API call
  const [loading, setLoading] = useState(false); // Set to false since we're using mock data
  const [error, setError] = useState('');

  // Comment out the useEffect since we're using mock data
  /*
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/bookings', {
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
          setError('Failed to fetch bookings');
        }
      } catch (error) {
        setError('An error occurred while fetching bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);
  */

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
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
              {/* Movie Poster */}
              <div className="w-full md:w-48 h-64 relative rounded-lg overflow-hidden">
                <img
                  src={booking.moviePoster}
                  alt={booking.movieTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>

              {/* Booking Details */}
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white">{booking.movieTitle}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">${booking.totalAmount}</p>
                    <p className="text-sm text-gray-400">Total Amount</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-indigo-400" />
                    <span className="text-gray-300">{booking.showDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-indigo-400" />
                    <span className="text-gray-300">{booking.showTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-indigo-400" />
                    <span className="text-gray-300">{booking.theaterName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-400" />
                    <span className="text-gray-300">{booking.seats.join(', ')}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    className="px-4 py-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>
                  <button
                    className="px-4 py-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2"
                  >
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