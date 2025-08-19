"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "../../../../../locales/client";
import axios from "axios";

export default function RegisterForm({ lang = "ar" }) {
  const router = useRouter();
  const t = useI18n();
  console.log("lang", lang);
  const userForTest = {
    email:"ely@gmail.com",
    contact: "22334455",
    password: "password123",
    confirmPassword: "password123",
  }
  const defaultUser = {
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
  };
  // en mode de test, on peut utiliser userForTest
  defaultUser.email = userForTest.email;
  defaultUser.contact = userForTest.contact;
  defaultUser.password = userForTest.password;
  defaultUser.confirmPassword = userForTest.confirmPassword;
  

  const [email, setEmail] = useState(defaultUser.email);
  const [contact, setContact] = useState(defaultUser.contact);
  const [password, setPassword] = useState(defaultUser.password);
  const [confirmPassword, setConfirmPassword] = useState(defaultUser.confirmPassword);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
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
    setSubmitStatus(t("nav.labo"));

    if (!validateForm()) {
      setSubmitStatus(t("nav.labo"));
      return;
    }

    setIsLoading(true);
    try {
      setSubmitStatus(t("nav.labo"));

      const response = await axios.post(`/${lang}/api/p/users/register`, {
        email,
        contact,
        password,
      });
      console.log("mailStatus:", response.data.mailStatus)

      // Enregistrement réussi
      setSubmitStatus(t("register.success"));
      console.log("Utilisateur créé:", response.data);

      // Rediriger vers la page de connexion
      router.push(`/${lang}/p/users/connexion`);
      router.refresh();
    } catch (error: any) {
      console.error("Erreur d'enregistrement:", error);

      // Gestion des erreurs Axios
      if (error.response) {
        // Le serveur a répondu avec un statut d'erreur
        setSubmitStatus(error.response.data.error || t("nav.labo"));
      } else if (error.request) {
        // La requête a été faite mais pas de réponse
        setSubmitStatus(t("nav.labo"));
      } else {
        // Erreur lors de la configuration de la requête
        setSubmitStatus(error.message || t("nav.labo"));
      }
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
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("register.emailLabel")}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              telephone
            </label>
            <input
              type="text"
              id="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("register.passwordLabel")}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
              required
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("register.confirmPasswordLabel")}
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
              required
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div>
            <button
              id="submit"
              type="submit"
              className={`w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md 
                ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700"
                } 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                transition-colors duration-300`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t("nav.labo")}
                </span>
              ) : (
                t("register.submitButton")
              )}
            </button>

            {submitStatus && (
              <p
                className={`mt-2 text-center ${
                  submitStatus === t("register.success")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {submitStatus}
              </p>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
