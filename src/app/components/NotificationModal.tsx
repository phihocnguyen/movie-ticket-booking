'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Film, Clock, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { getMovieDetails } from '@/app/(customer)/movies/[id]/api';
import { useAuth } from '../context/AuthContext';
import { onValue, ref } from 'firebase/database';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'NEW_MOVIE' | 'update' | 'promotion';
  moviePoster?: string;
  releaseDate?: string;
  createdAt: string;
  isRead: boolean;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const {userData} = useAuth()

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    const notificationsRef = ref(db, 'notifications');
    const unsubscribe = onValue(notificationsRef, async (snapshot) => {
      const data = snapshot.val();
      console.log('Firebase raw data:', data);
      let notiArr = [];
      if (data) {
        notiArr = Object.entries(data).map(([id, value]: any) => ({ id, ...value }));
      }
      console.log('Mapped notifications:', notiArr);
      const notiPromises = notiArr.map(async (notification) => {
        if (notification.movieId && (!notification.title || !notification.moviePoster)) {
          try {
            const res = await getMovieDetails(notification.movieId);
            if (res && res.data) {
              notification = {
                ...notification,
                title: res.data.title || notification.title,
                moviePoster: res.data.posterUrl || notification.moviePoster,
                releaseDate: res.data.releaseDate || notification.releaseDate,
              };
            }
          } catch (e) { }
        }
        notification.isRead = notification.readUsers?.includes(userData?.id) ?? false;
        return notification;
      });
      const notis = await Promise.all(notiPromises);
      console.log('Final notifications:', notis);
      setNotifications(notis);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isOpen]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  function formatRelativeTime(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // seconds
    if (diff < 60) return `${diff <= 1 ? 'Vừa xong' : diff + ' giây trước'}`;
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  }

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
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${
                    !notification.isRead ? 'bg-indigo-500/10' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    {notification.type === 'NEW_MOVIE' && notification.moviePoster ? (
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
                        <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                        <span className="text-xs text-gray-400">
                          {formatRelativeTime(notification.createdAt)}
                        </span>
                      </div>
                      <h3 className="font-medium text-white mt-1">{notification.title}</h3>
                      
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