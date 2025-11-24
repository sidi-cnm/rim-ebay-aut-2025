"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "../../../../../locales/client";
import axios from "axios";

export default function RegisterFormPhone({ lang = "ar", urlboot }: { lang?: string; urlboot: string }) {
  const router = useRouter();
  const t = useI18n();

  const [samsar, setSamsar] = useState<boolean>(false);
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    } else if (password.length < 6) {
      newErrors.password = t("register.passwordMinLength");
      isValid = false;
    }

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
      const response = await axios.post(`/${lang}/api/p/users/register/phone`, {
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* CONTACT */}
      <div>
        <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
          {t("register.Telephone")}
        </label>
        <input
          type="text"
          id="contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
          required
        />
        {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact}</p>}
      </div>

      {/* PASSWORD */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          {t("register.passwordLabel")}
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
          required
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      </div>

      {/* CONFIRM PASSWORD */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          {t("register.confirmPasswordLabel")}
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
          required
        />
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
      </div>

      {/* RADIO */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("register.userTypeLabel")}
        </label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="userType"
              value="individual"
              checked={!samsar}
              onChange={() => setSamsar(false)}
              className="h-4 w-4 text-blue-600"
            />
            <span>{t("register.particulier")}</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="userType"
              value="samsar"
              checked={samsar}
              onChange={() => setSamsar(true)}
              className="h-4 w-4 text-blue-600"
            />
            <span>{t("register.samsar")}</span>
          </label>
        </div>
      </div>

      {/* SUBMIT */}
      <div>
        <button
          type="submit"
          className={`w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md 
            ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"} `}
          disabled={isLoading}
        >
          {isLoading ? t("nav.labo") : t("register.submitButton")}
        </button>
        {submitStatus && (
          <p className={`mt-2 text-center ${submitStatus === t("register.success") ? "text-green-600" : "text-red-600"}`}>
            {submitStatus}
          </p>
        )}
      </div>
    </form>
  );
}
