import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthStorage } from '../services/authStorage';
import { apiService } from '../services/api';

interface User {
  id: string;
  email: string;
  full_name: string;
  university: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user?: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        AuthStorage.getToken(),
        AuthStorage.getUser()
      ]);

      if (storedToken) {
        setToken(storedToken);
        setUser(storedUser);
        apiService.setToken(storedToken);
        console.log('Restored token in API service:', storedToken.substring(0, 20) + '...');
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (newToken: string, newUser?: User) => {
    setToken(newToken);
    apiService.setToken(newToken);
    console.log('Token set in API service:', newToken.substring(0, 20) + '...');
    if (newUser) {
      setUser(newUser);
      await AuthStorage.saveUser(newUser);
    }
    await AuthStorage.saveToken(newToken);
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    apiService.setToken(null);
    await AuthStorage.logout();
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
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