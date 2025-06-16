'use client';

import { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

const TrailerModal: React.FC<TrailerModalProps> = ({ isOpen, onClose, videoId }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    console.log(videoId);

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl mx-4">
        <div className="relative bg-black rounded-lg overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition"
          >
            <FaTimes size={24} />
          </button>
          
          <div className="relative pt-[56.25%]">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="Movie Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal; 