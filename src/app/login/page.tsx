'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import { supabase } from '@/lib/supabase';
// import bcrypt from 'bcryptjs';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting login for username:', username);
      
      // Simple admin login for testing
      if (username === 'admin' && password === 'admin123') {
        console.log('Admin login successful');
        localStorage.setItem('isAdminLoggedIn', 'true');
        localStorage.setItem('adminUsername', 'admin');
        localStorage.setItem('adminRole', 'admin');
        localStorage.setItem('adminName', 'Kustominspira Admin');
        
        console.log('Redirecting to admin dashboard');
        router.push('/admin');
        return;
      } else {
        setError('Username atau password salah');
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Terjadi kesalahan saat login: ' + error.message);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1ca4bc] to-[#159bb3] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <img 
              src="/assets/Kustom Inspira.png" 
              alt="Kustom Inspira" 
              className="h-16 w-auto mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Administrator Login
            </h1>
            <p className="text-gray-600">
              Masuk ke dashboard admin Kustom Inspira
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] transition-colors text-gray-900"
                placeholder="username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] transition-colors text-gray-900"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1ca4bc] text-white py-3 px-4 rounded-lg hover:bg-[#159bb3] focus:ring-2 focus:ring-[#1ca4bc] focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>

        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="text-white hover:text-white/80 transition-colors"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}