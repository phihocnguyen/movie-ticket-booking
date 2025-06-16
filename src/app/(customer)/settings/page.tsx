'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Ticket } from 'lucide-react';
import PersonalInformation from './components/PersonalInformation';
import SecuritySettings from './components/SecuritySettings';
import BookingHistory from './components/BookingHistory';

type Tab = 'personal' | 'security' | 'bookings';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setError('');
      setSuccess('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8080/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess('Profile updated successfully');
        setIsEditing(false);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update profile');
      }
    } catch (error) {
      setError('An error occurred while updating profile');
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'security', label: 'Security & Password', icon: Lock },
    { id: 'bookings', label: 'Booking History', icon: Ticket },
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>

            {/* Tabs */}
            <div className="border-b border-gray-700 mb-8">
              <nav className="flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as Tab)}
                      className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-indigo-500 text-indigo-400'
                          : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === 'personal' && (
                <PersonalInformation
                  formData={formData}
                  isEditing={isEditing}
                  onEditToggle={handleEditToggle}
                  onChange={handleInputChange}
                />
              )}

              {activeTab === 'security' && (
                <SecuritySettings
                  formData={formData}
                  isEditing={isEditing}
                  onEditToggle={handleEditToggle}
                  onChange={handleInputChange}
                />
              )}

              {activeTab === 'bookings' && (
                <BookingHistory />
              )}
            </div>

            {/* Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg"
              >
                <p className="text-red-400">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg"
              >
                <p className="text-green-400">{success}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}