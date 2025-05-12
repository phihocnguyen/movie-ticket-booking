'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

interface UserData {
  username: string;
  role: string;
  fullName: string;
}

interface AuthContextType {
  userData: UserData | null;
  isAuthenticated: boolean;
  updateAuthState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const updateAuthState = () => {
    const data = authService.getUserData();
    setUserData(data);
    setIsAuthenticated(!!data);
  };

  useEffect(() => {
    updateAuthState();
  }, []);

  return (
    <AuthContext.Provider value={{ userData, isAuthenticated, updateAuthState }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 