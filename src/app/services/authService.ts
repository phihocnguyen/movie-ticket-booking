interface RegisterData {
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  dateOfBirth: string;
}

interface LoginData {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  username: string;
  role: string;
  fullName: string;
  userId: number;
}

interface UserData {
  username: string;
  role: string;
  fullName: string;
  id: number;
}

const API_URL = 'http://localhost:8080/api';

let authStateChangeCallback: (() => void) | null = null;

export const authService = {
  async register(data: RegisterData): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async login(data: LoginData): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const loginData: LoginResponse = await response.json();
      console.log('Login response:', loginData);
      
      // Store the token and user data in localStorage
      localStorage.setItem('token', loginData.token);
      localStorage.setItem('username', loginData.username);
      localStorage.setItem('role', loginData.role);
      localStorage.setItem('fullName', loginData.fullName);
      localStorage.setItem('userId', loginData.userId.toString());

      // Notify about auth state change
      if (authStateChangeCallback) {
        authStateChangeCallback();
      }

      return loginData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('fullName');
    localStorage.removeItem('userId');

    // Notify about auth state change
    if (authStateChangeCallback) {
      authStateChangeCallback();
    }
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUserData(): UserData | null {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const fullName = localStorage.getItem('fullName');
    const userId = localStorage.getItem('userId');

    console.log('Getting user data:', { username, role, fullName, userId }); // Debug log

    if (!username || !role || !fullName) {
      return null;
    }

    const userData = {
      username,
      role,
      fullName,
      id: userId ? parseInt(userId, 10) : 0
    };

    console.log('Returning user data:', userData); // Debug log
    return userData;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  },

  onAuthStateChange(callback: () => void): void {
    authStateChangeCallback = callback;
  },

  removeAuthStateChangeListener(): void {
    authStateChangeCallback = null;
  }
}; 