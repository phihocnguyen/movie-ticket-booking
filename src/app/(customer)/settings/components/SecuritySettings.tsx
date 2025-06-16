'use client';

import { motion } from 'framer-motion';
import { Lock, Edit2, ArrowLeft } from 'lucide-react';

interface SecuritySettingsProps {
  formData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  isEditing: boolean;
  onEditToggle: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SecuritySettings({
  formData,
  isEditing,
  onEditToggle,
  onChange,
}: SecuritySettingsProps) {
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
              Edit Security
            </>
          )}
        </motion.button>
      </div>

      <div className="p-6 border border-indigo-900/40 bg-indigo-900/10 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-indigo-300 mb-2">Password Security</h3>
        <p className="text-gray-400">Update your password regularly to maintain account security.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Current Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-indigo-400" />
            </div>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
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
          <label className="block text-sm font-medium text-gray-300">New Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-indigo-400" />
            </div>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
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
          <label className="block text-sm font-medium text-gray-300">Confirm New Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-indigo-400" />
            </div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
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

      <div className="bg-gray-900/20 p-4 rounded-lg border-l-4 border-indigo-500 mt-6">
        <p className="text-sm text-gray-300">
          <span className="font-medium text-indigo-400">Password requirements:</span> At least 8 characters with a combination of uppercase, lowercase, numbers, and special characters.
        </p>
      </div>
    </motion.div>
  );
} 