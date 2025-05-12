'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { authService } from '@/app/services/authService';
import { useRouter } from 'next/navigation';
import { Calendar, User, Mail, Phone, Lock, Check, ArrowRight } from 'lucide-react';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    fullName: '',
    dateOfBirth: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateSelect = (date: Date) => {
    // Format the date to DD/MM/YYYY
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    
    setFormData(prev => ({
      ...prev,
      dateOfBirth: formattedDate
    }));
    setIsDatePickerOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await authService.register({
        username: formData.username,
        password: formData.password,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth
      });
      
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate array of years for the date picker (from 100 years ago to today)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  
  // Array of months
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Date picker state
  const [selectedYear, setSelectedYear] = useState(currentYear - 20);
  const [selectedMonth, setSelectedMonth] = useState(0);
  
  // Function to get days in a month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Generate array of days for selected month and year
  const days = Array.from(
    { length: getDaysInMonth(selectedYear, selectedMonth) },
    (_, i) => i + 1
  );

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl flex rounded-xl overflow-hidden shadow-2xl bg-white"
      >
        {/* Left side - Poster */}
        <div className="hidden md:block md:w-5/12 relative">
          <img 
            src="https://cdn.vectorstock.com/i/1000v/37/80/vintage-cinema-posters-for-a-film-festival-event-vector-54413780.jpg" 
            alt="Cinema Poster" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-end p-6">
            <div className="text-white">
              <h3 className="text-xl font-bold mb-2">Film Festival Registration</h3>
              <p className="text-sm opacity-80">Join our exclusive film community</p>
            </div>
          </div>
        </div>
        
        {/* Right side - Form */}
        <div className="w-full md:w-7/12 p-5 md:p-8 bg-white overflow-y-auto max-h-[90vh]">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Create Account
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-500 p-2 rounded-lg text-sm flex items-center mb-4"
            >
              <span className="mr-2">⚠️</span> {error}
            </motion.div>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="text"
                    required
                    readOnly
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer text-sm"
                    placeholder="Click to select date"
                    value={formData.dateOfBirth}
                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  />
                  
                  {/* Custom Date Picker */}
                  {isDatePickerOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden"
                    >
                      <div className="p-2 bg-gray-50 border-b flex justify-between">
                        <div className="w-1/2 pr-1">
                          <select
                            className="w-full p-1 rounded-md border border-gray-300 text-sm"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                          >
                            {months.map((month, idx) => (
                              <option key={month} value={idx}>{month}</option>
                            ))}
                          </select>
                        </div>
                        <div className="w-1/2 pl-1">
                          <select
                            className="w-full p-1 rounded-md border border-gray-300 text-sm"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                          >
                            {years.map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="p-1 grid grid-cols-7 gap-1">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                          <div key={day} className="text-center text-xs font-semibold p-1 text-gray-500">
                            {day}
                          </div>
                        ))}
                        
                        {/* Calculate offset for first day of month */}
                        {Array.from({
                          length: new Date(selectedYear, selectedMonth, 1).getDay()
                        }).map((_, idx) => (
                          <div key={`empty-${idx}`} />
                        ))}
                        
                        {days.map(day => (
                          <button
                            key={day}
                            type="button"
                            className="rounded-full w-6 h-6 mx-auto flex items-center justify-center hover:bg-indigo-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                            onClick={() => handleDateSelect(new Date(selectedYear, selectedMonth, day))}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                      <div className="p-1 border-t flex justify-between">
                        <button
                          type="button"
                          className="px-2 py-1 text-xs text-gray-600 hover:text-gray-900"
                          onClick={() => setIsDatePickerOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="px-2 py-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                          onClick={() => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            handleDateSelect(today);
                          }}
                        >
                          Today
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="pt-2"
            >
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>Creating Account...</>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </motion.div>
            
            <div className="text-center text-xs text-gray-500 mt-2">
              By creating an account, you agree to our 
              <a href="#" className="text-indigo-600 hover:text-indigo-500"> Terms of Service </a> 
              and 
              <a href="#" className="text-indigo-600 hover:text-indigo-500"> Privacy Policy</a>.
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}