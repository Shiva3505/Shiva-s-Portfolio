import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, X, Mail, Key, Eye, EyeOff } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'login' | 'email' | 'verify' | 'reset'>('login');
  
  const { 
    login, 
    sendResetCode, 
    verifyResetCode, 
    resetPassword,
    isResetMode,
    setIsResetMode
  } = useAdmin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setPassword('');
      setError('');
      onClose();
    } else {
      setError('Invalid password');
    }
  };

  const handleForgotPassword = () => {
    setStep('email');
    setError('');
    setSuccess('');
    setIsResetMode(true);
  };

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await sendResetCode(email);
      if (success) {
        setSuccess('Verification code sent to your email!');
        setStep('verify');
      } else {
        setError('Email not found or invalid');
      }
    } catch (err) {
      setError('Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyResetCode(verificationCode)) {
      setStep('reset');
      setError('');
      setSuccess('Code verified! Set your new password.');
    } else {
      setError('Invalid verification code');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (resetPassword(newPassword)) {
      setSuccess('Password reset successfully!');
      setTimeout(() => {
        resetForm();
        onClose();
      }, 2000);
    } else {
      setError('Failed to reset password');
    }
  };

  const resetForm = () => {
    setPassword('');
    setEmail('');
    setVerificationCode('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setStep('login');
    setIsResetMode(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Lock className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {step === 'login' ? 'Admin Login' : 
               step === 'email' ? 'Reset Password' :
               step === 'verify' ? 'Verify Code' : 'New Password'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Login Form */}
        {step === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter admin password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            <button
              type="submit"
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 mb-4"
            >
              Login
            </button>

            <button
              type="button"
              onClick={handleForgotPassword}
              className="w-full text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm underline"
            >
              Forgot Password?
            </button>
          </form>
        )}

        {/* Email Form */}
        {step === 'email' && (
          <form onSubmit={handleSendResetCode}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            {success && (
              <p className="text-green-500 text-sm mb-4">{success}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 mb-4 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>

            <button
              type="button"
              onClick={() => setStep('login')}
              className="w-full text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm"
            >
              Back to Login
            </button>
          </form>
        )}

        {/* Verification Code Form */}
        {step === 'verify' && (
          <form onSubmit={handleVerifyCode}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Verification Code
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-lg tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            {success && (
              <p className="text-green-500 text-sm mb-4">{success}</p>
            )}

            <button
              type="submit"
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 mb-4"
            >
              Verify Code
            </button>

            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm"
            >
              Resend Code
            </button>
          </form>
        )}

        {/* Reset Password Form */}
        {step === 'reset' && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter new password"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Confirm new password"
                minLength={6}
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            {success && (
              <p className="text-green-500 text-sm mb-4">{success}</p>
            )}

            <button
              type="submit"
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Reset Password
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default AdminLogin;