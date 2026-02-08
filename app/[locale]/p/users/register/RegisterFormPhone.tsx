"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "../../../../../locales/client";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function RegisterFormPhone({ lang = "ar", urlboot }: { lang?: string; urlboot: string }) {
  const router = useRouter();
  const t = useI18n();

  const [samsar, setSamsar] = useState<boolean>(false);
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({ contact: "", password: "", confirmPassword: "" });
  const [submitStatus, setSubmitStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { contact: "", password: "", confirmPassword: "" };

    if (!contact) {
      newErrors.contact = "Contact is required";
      isValid = false;
    }

    if (!password) {
      newErrors.password = t("register.passwordRequired");
      isValid = false;
    } 
    // else if (password.length < 6) {
    //   newErrors.password = t("register.passwordMinLength");
    //   isValid = false;
    // }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = t("register.passwordsNotMatch");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    const email = `tel${contact}@phone.eddeyar.com`;

    try {
      const response = await axios.post(`/api/p/users/register/phone`, {
        email,
        contact,
        password,
        samsar,
      });

      const userId = response.data.user.id;

      // Optional boot request
      await fetch(`${urlboot}?msg=https://admin-rim.vercel.app/users/${userId}`, {
        method: "GET",
      });


      setSubmitStatus(t("register.success"));

      // Store userId for OTP verification page
      localStorage.setItem("pendingOtpUserId", userId);

      router.push(`/${lang}/p/verification/otp`);
      router.refresh();
    } catch (error: any) {
      setSubmitStatus(error.response?.data?.error || t("nav.labo"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* CONTACT */}
      <div>
        <label htmlFor="contact" className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
          {t("register.Telephone")}
        </label>
        <input
          type="tel"
          id="contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-200 text-gray-900 font-medium"
          dir="ltr"
          placeholder="30000000"
          disabled={isLoading}
          required
        />
        {errors.contact && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.contact}</p>}
      </div>

      {/* PASSWORD */}
      <div>
        <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
          {t("register.passwordLabel")}
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-200 text-gray-900 font-medium pr-10"
            disabled={isLoading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary-600 transition-colors"
          >
            {showPassword ? <FaEyeSlash className="w-5 h-5"/> : <FaEye className="w-5 h-5"/>}
          </button>
        </div>
        {errors.password && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.password}</p>}
      </div>

      {/* CONFIRM PASSWORD */}
      <div>
        <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
          {t("register.confirmPasswordLabel")}
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-200 text-gray-900 font-medium pr-10"
            disabled={isLoading}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary-600 transition-colors"
          >
            {showConfirmPassword ? <FaEyeSlash className="w-5 h-5"/> : <FaEye className="w-5 h-5"/>}
          </button>
        </div>
        {errors.confirmPassword && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.confirmPassword}</p>}
      </div>

      {/* RADIO */}
      <div className="pt-2">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
          {t("register.userTypeLabel")}
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className={`flex items-center justify-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${!samsar ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>
            <input
              type="radio"
              name="userType"
              value="individual"
              checked={!samsar}
              onChange={() => setSamsar(false)}
              className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <span className="font-bold">{t("register.particulier")}</span>
          </label>

          <label className={`flex items-center justify-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${samsar ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>
            <input
              type="radio"
              name="userType"
              value="samsar"
              checked={samsar}
              onChange={() => setSamsar(true)}
              className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <span className="font-bold">{t("register.samsar")}</span>
          </label>
        </div>
      </div>

      {/* SUBMIT */}
      <div className="pt-4">
        <button
          type="submit"
          className={`w-full flex justify-center items-center font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all duration-200 active:scale-[0.98] 
            ${isLoading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-primary-600 hover:bg-primary-700 text-white shadow-primary-600/30 hover:shadow-primary-600/40"}`}
          disabled={isLoading}
        >
          {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/50 border-t-white" /> : t("register.submitButton")}
        </button>
        {submitStatus && (
          <p className={`mt-4 text-center text-sm font-medium p-3 rounded-lg border ${submitStatus === t("register.success") ? "text-green-700 bg-green-50 border-green-200" : "text-red-700 bg-red-50 border-red-200"}`}>
            {submitStatus}
          </p>
        )}
      </div>
    </form>
  );
}
