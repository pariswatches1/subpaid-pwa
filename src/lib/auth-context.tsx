'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, company: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user for development - use string dates to avoid hydration mismatch
const DEMO_USER_BASE = {
  id: 'demo-user-1',
  name: 'Sam Johnson',
  email: 'sam@electricalpros.com',
  company: 'Electrical Pros LLC',
  phone: '(555) 123-4567',
  address: '123 Main St, Orlando, FL 32801',
  role: 'user' as const,
  plan: 'pro' as const,
};

const DEMO_ADMIN_BASE = {
  id: 'demo-admin-1',
  name: 'Admin User',
  email: 'admin@subpaid.com',
  role: 'admin' as const,
  plan: 'autopilot' as const,
};

// Create user with Date object only when needed (client-side)
function createDemoUser(): User {
  return {
    ...DEMO_USER_BASE,
    createdAt: new Date('2025-01-01'),
  };
}

function createDemoAdmin(): User {
  return {
    ...DEMO_ADMIN_BASE,
    createdAt: new Date('2024-01-01'),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const stored = localStorage.getItem('subpaid_auth');
        if (stored) {
          const { user, expiry } = JSON.parse(stored);
          if (expiry > Date.now()) {
            setState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          }
          // Session expired
          localStorage.removeItem('subpaid_auth');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('subpaid_auth');
      }
      setState(prev => ({ ...prev, isLoading: false }));
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Demo authentication logic
    // In production, this would call your auth API
    let user: User | null = null;

    if (email === 'admin@subpaid.com' && password === 'admin123') {
      user = createDemoAdmin();
    } else if (email && password.length >= 6) {
      // Accept any valid-looking credentials for demo
      user = {
        ...createDemoUser(),
        email,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      };
    }

    if (user) {
      const authData = {
        user,
        expiry: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };
      localStorage.setItem('subpaid_auth', JSON.stringify(authData));
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }

    setState(prev => ({ ...prev, isLoading: false }));
    return false;
  };

  const signup = async (name: string, email: string, password: string, company: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Demo signup - in production, call your signup API
    if (email && password.length >= 6 && name) {
      const user: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        company,
        role: 'user',
        plan: 'starter', // New users start on starter (free trial)
        createdAt: new Date(),
      };

      const authData = {
        user,
        expiry: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };
      localStorage.setItem('subpaid_auth', JSON.stringify(authData));
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }

    setState(prev => ({ ...prev, isLoading: false }));
    return false;
  };

  const logout = () => {
    localStorage.removeItem('subpaid_auth');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
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

// HOC for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: { adminOnly?: boolean }
) {
  return function ProtectedComponent(props: P) {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#9FE870] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#1a1a2e]/60">Loading...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
      return null;
    }

    if (options?.adminOnly && user?.role !== 'admin') {
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard';
      }
      return null;
    }

    return <Component {...props} />;
  };
}
