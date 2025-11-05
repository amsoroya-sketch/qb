#!/usr/bin/env node

/**
 * arQ Frontend Generator
 * Generates: API client, stores, pages, components for Next.js 14
 */

const fs = require('fs');
const path = require('path');

const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

// ============================================
// API CLIENT
// ============================================

const apiClient = {
  'lib/api/client.ts': `import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(\`\${API_URL}/auth/refresh\`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = \`Bearer \${accessToken}\`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
`,

  'lib/api/auth.ts': `import apiClient from './client';

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },
};
`,

  'lib/api/lessons.ts': `import apiClient from './client';

export interface Lesson {
  id: string;
  title: string;
  titleArabic: string;
  description: string;
  content: string;
  track: 'A' | 'B';
  stage: number;
  order: number;
  grammarTopic: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedTime: number;
  xpReward: number;
  isPublished: boolean;
}

export const lessonsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    track?: string;
    stage?: number;
    difficulty?: string;
  }) => {
    const response = await apiClient.get('/lessons', { params });
    return response.data;
  },

  getOne: async (id: string): Promise<Lesson> => {
    const response = await apiClient.get(\`/lessons/\${id}\`);
    return response.data;
  },

  start: async (id: string) => {
    const response = await apiClient.post(\`/lessons/\${id}/start\`);
    return response.data;
  },

  complete: async (id: string, timeSpent: number) => {
    const response = await apiClient.post(\`/lessons/\${id}/complete\`, { timeSpent });
    return response.data;
  },

  getProgress: async (id: string) => {
    const response = await apiClient.get(\`/lessons/\${id}/progress\`);
    return response.data;
  },
};
`,

  'lib/api/exercises.ts': `import apiClient from './client';

export interface Exercise {
  id: string;
  lessonId: string;
  title: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_IN_BLANK' | 'WORD_ANALYSIS' | 'DRAG_DROP' | 'MATCHING';
  question: string;
  questionArabic?: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  order: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  xpReward: number;
}

export const exercisesApi = {
  getAll: async (params?: {
    lessonId?: string;
    type?: string;
    difficulty?: string;
  }) => {
    const response = await apiClient.get('/exercises', { params });
    return response.data;
  },

  getOne: async (id: string): Promise<Exercise> => {
    const response = await apiClient.get(\`/exercises/\${id}\`);
    return response.data;
  },

  getByLesson: async (lessonId: string) => {
    const response = await apiClient.get(\`/exercises/lesson/\${lessonId}\`);
    return response.data;
  },

  submit: async (id: string, userAnswer: string, timeSpent: number) => {
    const response = await apiClient.post(\`/exercises/\${id}/submit\`, {
      userAnswer,
      timeSpent,
    });
    return response.data;
  },

  getAttempts: async (id: string) => {
    const response = await apiClient.get(\`/exercises/\${id}/attempts\`);
    return response.data;
  },
};
`,

  'lib/api/progress.ts': `import apiClient from './client';

export const progressApi = {
  getMyProgress: async () => {
    const response = await apiClient.get('/progress/me');
    return response.data;
  },

  getDashboard: async () => {
    const response = await apiClient.get('/progress/me/dashboard');
    return response.data;
  },

  getLessonProgress: async () => {
    const response = await apiClient.get('/progress/me/lessons');
    return response.data;
  },

  getAchievements: async () => {
    const response = await apiClient.get('/progress/me/achievements');
    return response.data;
  },

  updateStreak: async () => {
    const response = await apiClient.post('/progress/me/streak');
    return response.data;
  },
};
`,

  'lib/api/index.ts': `export * from './client';
export * from './auth';
export * from './lessons';
export * from './exercises';
export * from './progress';
`,
};

// ============================================
// ZUSTAND STORES
// ============================================

const stores = {
  'lib/stores/auth-store.ts': `import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        set({ user, accessToken, refreshToken, isAuthenticated: true });
      },

      clearAuth: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
`,

  'lib/stores/progress-store.ts': `import { create } from 'zustand';

interface ProgressState {
  currentXP: number;
  currentLevel: number;
  currentStreak: number;
  lessonsCompleted: number;
  exercisesCompleted: number;
  setProgress: (progress: Partial<ProgressState>) => void;
  addXP: (xp: number) => void;
  incrementLessons: () => void;
  incrementExercises: () => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  currentXP: 0,
  currentLevel: 1,
  currentStreak: 0,
  lessonsCompleted: 0,
  exercisesCompleted: 0,

  setProgress: (progress) => set(progress),

  addXP: (xp) => set((state) => ({ currentXP: state.currentXP + xp })),

  incrementLessons: () => set((state) => ({ lessonsCompleted: state.lessonsCompleted + 1 })),

  incrementExercises: () => set((state) => ({ exercisesCompleted: state.exercisesCompleted + 1 })),
}));
`,

  'lib/stores/index.ts': `export * from './auth-store';
export * from './progress-store';
`,
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const utils = {
  'lib/utils/cn.ts': `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`,

  'lib/utils/format.ts': `export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return \`\${hours}h \${minutes}m\`;
  }
  if (minutes > 0) {
    return \`\${minutes}m \${secs}s\`;
  }
  return \`\${secs}s\`;
}

export function formatXP(xp: number): string {
  if (xp >= 1000000) {
    return \`\${(xp / 1000000).toFixed(1)}M\`;
  }
  if (xp >= 1000) {
    return \`\${(xp / 1000).toFixed(1)}K\`;
  }
  return xp.toString();
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}
`,

  'lib/utils/validation.ts': `import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
`,

  'lib/utils/index.ts': `export * from './cn';
export * from './format';
export * from './validation';
`,
};

// ============================================
// TYPES
// ============================================

const types = {
  'types/index.ts': `export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'STUDENT';
  createdAt: Date;
}

export interface Lesson {
  id: string;
  title: string;
  titleArabic: string;
  description: string;
  content: string;
  track: 'A' | 'B';
  stage: number;
  order: number;
  grammarTopic: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedTime: number;
  xpReward: number;
  isPublished: boolean;
}

export interface Exercise {
  id: string;
  lessonId: string;
  title: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_IN_BLANK' | 'WORD_ANALYSIS' | 'DRAG_DROP' | 'MATCHING';
  question: string;
  questionArabic?: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  order: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  xpReward: number;
}

export interface UserProgress {
  id: string;
  userId: string;
  currentXP: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
  lessonsCompleted: number;
  exercisesCompleted: number;
  totalTimeSpent: number;
  averageAccuracy: number;
}

export interface Achievement {
  id: string;
  name: string;
  nameArabic: string;
  description: string;
  icon: string;
  category: string;
  requirement: Record<string, any>;
  xpReward: number;
}
`,
};

// ============================================
// PAGES
// ============================================

const pages = {
  'app/page.tsx': `import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            arQ
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            Master Quranic Arabic Grammar
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            A comprehensive platform for learning Quranic Arabic grammar through interactive lessons,
            exercises, and word-level analysis of the Quran.
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Login
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">250+ Lessons</h3>
              <p className="text-gray-600">
                Comprehensive curriculum across Track A (grammar-first) and Track B (verse-first)
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-xl font-semibold mb-2">77,429 Words</h3>
              <p className="text-gray-600">
                Complete grammatical analysis of every word in the Quran
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold mb-2">Gamification</h3>
              <p className="text-gray-600">
                XP system, levels, achievements, and streaks to keep you motivated
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
`,

  'app/auth/login/page.tsx': `'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/lib/stores';
import { authApi } from '@/lib/api';
import { loginSchema, type LoginFormData } from '@/lib/utils/validation';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError('');

    try {
      const response = await authApi.login(data);
      setAuth(response.user, response.accessToken, response.refreshToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Login to continue your learning journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@arq.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
              Register
            </Link>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-xs text-gray-600 text-center">
              <strong>Test Account:</strong> student@arq.com / student123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
`,

  'app/auth/register/page.tsx': `'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/lib/stores';
import { authApi } from '@/lib/api';
import { registerSchema, type RegisterFormData } from '@/lib/utils/validation';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError('');

    try {
      const { confirmPassword, ...registerData } = data;
      const response = await authApi.register(registerData);
      setAuth(response.user, response.accessToken, response.refreshToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
          <CardDescription>Join arQ and start learning today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Ahmed Khan" {...register('name')} />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Register'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
`,

  'app/dashboard/page.tsx': `'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useProgressStore } from '@/lib/stores';
import { progressApi } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const setProgress = useProgressStore((state) => state.setProgress);
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const data = await progressApi.getDashboard();
        setDashboard(data);
        setProgress({
          currentXP: data.currentXP,
          currentLevel: data.currentLevel,
          currentStreak: data.currentStreak,
          lessonsCompleted: data.lessonsCompleted,
          exercisesCompleted: data.exercisesCompleted,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [isAuthenticated, router, setProgress]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Continue your Quranic Arabic learning journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Level {dashboard?.currentLevel}</CardTitle>
              <CardDescription>Current Progress</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{dashboard?.currentXP} XP</p>
              <p className="text-sm text-gray-600">
                {dashboard?.xpForNextLevel - dashboard?.currentXP} XP to next level
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{dashboard?.currentStreak} Days</CardTitle>
              <CardDescription>Current Streak</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">🔥</p>
              <p className="text-sm text-gray-600">
                Longest: {dashboard?.longestStreak} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{dashboard?.lessonsCompleted}</CardTitle>
              <CardDescription>Lessons Completed</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">📚</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{dashboard?.accuracy}%</CardTitle>
              <CardDescription>Average Accuracy</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">🎯</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
              <CardDescription>Pick up where you left off</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/lessons">
                <Button className="w-full">Browse Lessons</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest progress</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboard?.recentActivity?.length > 0 ? (
                <ul className="space-y-2">
                  {dashboard.recentActivity.slice(0, 5).map((activity: any) => (
                    <li key={activity.id} className="text-sm">
                      {activity.lesson.title}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">No recent activity</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
`,

  'app/layout.tsx': `import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'arQ - Quranic Arabic Grammar Learning',
  description: 'Master Quranic Arabic grammar through interactive lessons and exercises',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
`,
};

// ============================================
// FILE WRITING LOGIC
// ============================================

console.log('🚀 Generating frontend files...\n');

const allFiles = {
  ...apiClient,
  ...stores,
  ...utils,
  ...types,
  ...pages,
};

let filesCreated = 0;

Object.entries(allFiles).forEach(([filePath, content]) => {
  const fullPath = path.join(FRONTEND_DIR, filePath);
  const dir = path.dirname(fullPath);

  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(fullPath, content);
  console.log(`  ✓ Created: ${filePath}`);
  filesCreated++;
});

// Create .env.local template
const envTemplate = `# arQ Frontend Environment Variables

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# Optional: Analytics, Error Tracking
# NEXT_PUBLIC_SENTRY_DSN=
# NEXT_PUBLIC_GA_TRACKING_ID=
`;

fs.writeFileSync(path.join(FRONTEND_DIR, '.env.local.example'), envTemplate);
console.log(`  ✓ Created: .env.local.example`);
filesCreated++;

console.log(`\n✅ Successfully created ${filesCreated} frontend files!\n`);
console.log('📦 Generated:');
console.log('  • API Client with axios interceptors and token refresh');
console.log('  • Zustand stores for auth and progress');
console.log('  • Utility functions (cn, format, validation)');
console.log('  • TypeScript types');
console.log('  • Pages: Home, Login, Register, Dashboard\n');

console.log('🎯 Next steps:');
console.log('  1. cd frontend');
console.log('  2. Copy .env.local.example to .env.local');
console.log('  3. npm install');
console.log('  4. npm run dev');
console.log('  5. Visit http://localhost:3000\n');
