'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '../../../../../locales/client';
import { toast, Toaster } from 'react-hot-toast';

interface ForgotPasswordFormProps {
  locale?: string;
}

export default function ForgotPasswordForm({ locale }: ForgotPasswordFormProps) {
  const router = useRouter();
  const t = useI18n();
  const [contact, setContact] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validate phone: starts with 2, 3 or 4 and has 8 digits
  const isValidPhone = (phone: string) => /^[234]\d{7}$/.test(phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!contact) {
      toast.error(t('forgotPassword.phoneRequired'));
      return;
    }

    if (!isValidPhone(contact)) {
      toast.error(t('forgotPassword.phoneInvalid'));
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/${locale}/api/p/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || t('forgotPassword.successMessage'), {
          duration: 5000,
          position: "bottom-right",
          style: {
            background: "#22C55E",
            color: "white",
          },
        });
        
        // Store contact for the reset-password page
        localStorage.setItem('pendingResetContact', contact);
        
        // Redirect to reset-password page after a short delay
        setTimeout(() => {
          router.push(`/${locale}/p/users/reset-password`);
          router.refresh();
        }, 2000);
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="contact" 
            className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5"
          >
            {t('forgotPassword.phoneLabel')}
          </label>
          <input
            id="contact"
            type="tel"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
            dir="ltr"
            placeholder={t('forgotPassword.phonePlaceholder')}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-200 text-gray-900 font-medium placeholder-gray-400"
          />
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
              t('forgotPassword.submitButton')
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

