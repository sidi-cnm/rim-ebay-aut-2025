'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '../../../../../locales/client';
import { toast, Toaster } from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface ResetPasswordUIProps {
  locale?: string;
}

export default function ResetPasswordUI({ locale }: ResetPasswordUIProps) {
  const router = useRouter();
  const t = useI18n();

  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    // Retrieve contact from localStorage if set by forgot-password page
    const storedContact = localStorage.getItem('pendingResetContact');
    if (storedContact) {
      setContact(storedContact);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validations
    if (!contact) {
      toast.error(t('forgotPassword.phoneRequired'));
      return;
    }
    if (!otp) {
      toast.error(t('resetPassword.otpRequired'));
      return;
    }
    if (password.length < 4) {
      toast.error(t('resetPassword.passwordMinLength'));
      return;
    }
    if (password !== confirm) {
      toast.error(t('resetPassword.passwordsNotMatch'));
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/p/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact, otp, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(t('resetPassword.successMessage'), {
          duration: 3000,
          position: "bottom-right",
          style: {
            background: "#22C55E",
            color: "white",
          },
        });
        // Clear local storage
        localStorage.removeItem('pendingResetContact');
        
        // Redirect to login after a short delay
        setTimeout(() => router.push(`/${locale}/p/users/connexion`), 1500);
      } else {
        toast.error(data.error || t('connexion.unexpectedError'));
      }
    } catch (err) {
      toast.error(t('errors.networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <div className="space-y-6">
        {/* Show contact number if available */}
        {contact && (
          <div className="text-center p-3 bg-primary-50 rounded-xl border border-primary-100">
            <p className="text-primary-800 text-sm font-medium">
              {t('forgotPassword.phoneLabel')} : <span className="font-bold tracking-wider">{contact}</span>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Input */}
          <div>
            <label 
              htmlFor="otp" 
              className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5"
            >
              {t('resetPassword.otpLabel')}
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder={t('resetPassword.otpPlaceholder')}
              className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-200 text-gray-900 font-bold tracking-[0.5em] text-center text-lg placeholder:tracking-normal placeholder:font-medium"
            />
          </div>

          {/* New Password */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5"
            >
              {t('resetPassword.passwordLabel')}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-200 text-gray-900 font-medium pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary-600 transition-colors"
              >
                {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label 
              htmlFor="confirm" 
              className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5"
            >
              {t('resetPassword.confirmPasswordLabel')}
            </label>
            <div className="relative">
              <input
                id="confirm"
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-200 text-gray-900 font-medium pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary-600 transition-colors"
              >
                {showConfirm ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all duration-200 active:scale-[0.98]
                ${isLoading 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-primary-600 hover:bg-primary-700 text-white shadow-primary-600/30 hover:shadow-primary-600/40"}`}
            >
              {isLoading ? (
                <div className="loader"></div>
              ) : (
                t('resetPassword.submitButton')
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 flex justify-center text-sm">
          <button
            type="button"
            onClick={() => router.push(`/${locale}/p/users/connexion`)}
            className="text-primary-600 font-bold hover:text-primary-700 hover:underline transition-colors"
          >
            {t('forgotPassword.backToLogin')}
          </button>
        </div>
      </div>

      <style jsx>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
          margin: auto;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}

