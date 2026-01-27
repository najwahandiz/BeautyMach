/**
 * AdminLogin.jsx
 * 
 * Admin login page with hardcoded credentials.
 * Simple authentication using localStorage.
 * 
 * Credentials:
 * - Username: admin
 * - Password: admin123
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  
  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Hardcoded admin credentials
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'admin123';

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate a small delay for better UX
    setTimeout(() => {
      // Check credentials
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // ✅ Correct credentials - save to localStorage and redirect
        localStorage.setItem('isAdmin', 'true');
        navigate('/Dashboard');
      } else {
        // ❌ Wrong credentials - show error
        setError('Incorrect username or password');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffaf5] via-[#fff5ee] to-[#ffe4d4] flex items-center justify-center px-4 py-8">
      
      {/* Back to Home Link */}
      <Link 
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-[#9E3B3B] transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      {/* Login Card */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#9E3B3B] to-[#b54949] px-8 py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Admin Login</h1>
            <p className="text-white/80 text-sm">Enter your credentials to access the dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                <AlertCircle size={20} className="flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#9E3B3B] focus:ring-2 focus:ring-[#9E3B3B]/20 outline-none transition-all text-gray-800"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 focus:border-[#9E3B3B] focus:ring-2 focus:ring-[#9E3B3B]/20 outline-none transition-all text-gray-800"
                  required
                />
                {/* Toggle password visibility */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-4 rounded-xl font-semibold text-white transition-all duration-300
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#9E3B3B] to-[#b54949] hover:shadow-lg hover:shadow-[#9E3B3B]/30 hover:-translate-y-0.5'
                }
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer hint */}
          <div className="px-8 pb-8">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-amber-800 text-sm text-center">
                <strong>Demo credentials:</strong> admin / admin123
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-gray-400 text-sm mt-6">
          © 2024 BeautyMatch. Admin Portal.
        </p>
      </div>
    </div>
  );
}

