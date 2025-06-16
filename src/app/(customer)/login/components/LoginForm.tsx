'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { authService } from '@/app/services/authService';
import { useRouter } from 'next/navigation';
import { User, Lock, ArrowRight } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authService.login(formData);
      router.push('/'); // Redirect to home page after successful login
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

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
              <h3 className="text-xl font-bold mb-2">Welcome Back!</h3>
              <p className="text-sm opacity-80">Sign in to continue your cinematic journey</p>
            </div>
          </div>
        </div>
        
        {/* Right side - Form */}
        <div className="w-full md:w-7/12 p-5 md:p-8 bg-white overflow-y-auto max-h-[90vh]">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Sign In
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                Create one
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
                  autoComplete="username"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

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
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                  Forgot password?
                </Link>
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
                  <>Signing in...</>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </motion.div>

            <div className="text-center text-xs text-gray-500 mt-2">
              By signing in, you agree to our 
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