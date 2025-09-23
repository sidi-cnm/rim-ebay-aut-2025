"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "../../../../../locales/client";
import axios from "axios";

export default function RegisterForm({ lang = "ar" , urlboot}: { lang?: string; urlboot: string }) {
  const router = useRouter();
  const t = useI18n();

  // --- Nouvel état pour le radio ---
  // const [userType, setUserType] = useState<"individual" | "company">("individual");
  const [samsar, setSamsar] = useState<boolean>(false);


  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", confirmPassword: "" });
  const [submitStatus, setSubmitStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "", confirmPassword: "" };

    if (!email) {
      newErrors.email = t("register.emailRequired");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t("register.emailInvalid");
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
    try {
      const response = await axios.post(`/${lang}/api/p/users/register`, {
        email,
        contact,
        password,
        samsar, // 👈 envoi du choix radio
      });

      console.log("response email : " ,response.data.user.email)

      const ress = await fetch(
        `${urlboot}?msg=https://admin-rim.vercel.app/users/${response.data.user.id}`,
        { method: "GET" }
      );

      console.log("ress boot : " ,ress)
      
      

      setSubmitStatus(t("register.success"));
      router.push(`/${lang}/p/verification`);
      router.refresh();
    } catch (error: any) {
      setSubmitStatus(error.response?.data?.error || t("nav.labo"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {t("register.title")}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* EMAIL */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t("register.emailLabel")}
            </label>
            <input
              type="email" id="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              disabled={isLoading} required
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* CONTACT */}
          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
              {t("register.Telephone")}
            </label>
            <input
              type="text" id="contact"
              value={contact} onChange={(e) => setContact(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              disabled={isLoading} required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              {t("register.passwordLabel")}
            </label>
            <input
              type="password" id="password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              disabled={isLoading} required
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              {t("register.confirmPasswordLabel")}
            </label>
            <input
              type="password" id="confirmPassword"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              disabled={isLoading} required
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

          {/* ✅ RADIO BUTTONS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("register.userTypeLabel") }
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="userType"
                  value="individual"
                  checked={!samsar}
                  onChange={() => setSamsar(false)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
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
                ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"} 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
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
      </div>
    </main>
  );
}
