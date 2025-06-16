'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Edit2, ArrowLeft } from 'lucide-react';

interface PersonalInformationProps {
  formData: {
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
  };
  isEditing: boolean;
  onEditToggle: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PersonalInformation({
  formData,
  isEditing,
  onEditToggle,
  onChange,
}: PersonalInformationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={onEditToggle}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
            isEditing
              ? 'bg-gray-700 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isEditing ? (
            <>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </>
          )}
        </motion.button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-8 pb-8 border-b border-gray-700/30">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
          {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{formData.fullName || 'User'}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-indigo-400" />
            </div>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={onChange}
              disabled={!isEditing}
              className="block w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 text-gray-100"
            />
            {!isEditing && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-800/10 pointer-events-none rounded-lg"></div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-indigo-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              disabled={!isEditing}
              className="block w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 text-gray-100"
            />
            {!isEditing && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-800/10 pointer-events-none rounded-lg"></div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Phone Number</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-indigo-400" />
            </div>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={onChange}
              disabled={!isEditing}
              className="block w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 text-gray-100"
            />
            {!isEditing && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-800/10 pointer-events-none rounded-lg"></div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Date of Birth</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-indigo-400" />
            </div>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={onChange}
              disabled={!isEditing}
              className="block w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 text-gray-100"
            />
            {!isEditing && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-800/10 pointer-events-none rounded-lg"></div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 