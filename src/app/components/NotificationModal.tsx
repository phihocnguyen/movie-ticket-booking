'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Film, Clock, Calendar } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'new_movie' | 'update' | 'promotion';
  moviePoster?: string;
  releaseDate?: string;
  createdAt: string;
  isRead: boolean;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Movie Added',
    message: 'The new movie "Dune: Part Two" has been added to our collection.',
    type: 'new_movie',
    moviePoster: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    releaseDate: '2024-03-15',
    createdAt: '2024-03-14T10:00:00Z',
    isRead: false,
  },
  {
    id: '2',
    title: 'Movie Update',
    message: 'Showtimes for "Poor Things" have been updated.',
    type: 'update',
    moviePoster: 'https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg',
    releaseDate: '2024-03-20',
    createdAt: '2024-03-13T15:30:00Z',
    isRead: true,
  },
  {
    id: '3',
    title: 'Special Promotion',
    message: 'Get 20% off on all movie tickets this weekend!',
    type: 'promotion',
    createdAt: '2024-03-12T09:15:00Z',
    isRead: false,
  },
];

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed right-4 top-20 w-96 bg-gradient-to-b from-gray-900 to-black rounded-xl shadow-2xl border border-gray-800 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Notifications</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              {mockNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${
                    !notification.isRead ? 'bg-indigo-500/10' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    {notification.type === 'new_movie' && notification.moviePoster ? (
                      <div className="relative w-16 h-24 flex-shrink-0">
                        <img
                          src={notification.moviePoster}
                          alt={notification.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 rounded-lg border border-gray-700 bg-gradient-to-t from-black/50 to-transparent"></div>
                      </div>
                    ) : (
                      <div className="w-16 h-24 flex-shrink-0 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                        <Film className="w-8 h-8 text-indigo-400" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium text-white">{notification.title}</h3>
                        <span className="text-xs text-gray-400">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                      
                      {notification.releaseDate && (
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Release: {formatDate(notification.releaseDate)}</span>
                          </div>
                        </div>
                      )}

                      {!notification.isRead && (
                        <div className="mt-2">
                          <span className="inline-block px-2 py-1 text-xs font-medium text-indigo-400 bg-indigo-500/20 rounded-full">
                            New
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-800">
              <button className="w-full py-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                Mark all as read
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 