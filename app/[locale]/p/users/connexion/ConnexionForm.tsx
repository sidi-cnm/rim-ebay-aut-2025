"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "../../../../../locales/client";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

export default function ConnexionForm({ lang = "ar" }) {
  const router = useRouter();
  const t = useI18n();

  const defaultEmail = "";
  //"user1@example.com";
  const defaultPassword = "";
  //"password123";
    const userForTest = {
    email:"",
    contact: "",
    password: "",
    confirmPassword: "",
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
  const [password, setPassword] = useState(defaultUser.password); 

  // const [email, setEmail] = useState(defaultEmail);
  // const [password, setPassword] = useState(defaultPassword);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [submitStatus, setSubmitStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = () => {
    router.push(`/${lang}/p/users/register`);
  };
 const handleNavigateToForgetPassword = () => {
  // fr/p/users/forgot-password
    router.push(`/${lang}/p/users/forgot-password`);
  };
  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = t("connexion.emailRequired");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t("connexion.emailInvalid");
      isValid = false;
    }

    if (!password) {
      newErrors.password = t("connexion.passwordRequired");
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = t("connexion.passwordShort");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`/${lang}/api/p/users/connexion`, {
        email,
        password,
      });

      const userid = response.data.user.id;
      if (response.status === 200) {
        toast.success("Connexion réussie!", {
          duration: 3000,
          position: "bottom-right",
          style: {
            background: "#22C55E",
            color: "white",
          },
        });
        router.push(`/${lang}/my/list`);
        router.refresh();
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Email ou mot de passe incorrect", {
          duration: 4000,
          position: "bottom-right",
          style: {
            background: "#FF4444",
            color: "white",
          },
        });
      } else {
        toast.error("Une erreur est survenue lors de la connexion", {
          duration: 4000,
          position: "bottom-right",
          style: {
            background: "#FF4444",
            color: "white",
          },
        });
      }
      console.error("Erreur lors de la connexion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <Toaster position="bottom-right" reverseOrder={false} />
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {t("connexion.title")}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("connexion.emailLabel")}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("connexion.passwordLabel")}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <div>
            <button
              id="submit"
              type="submit"
              className={`w-full font-bold py-2 px-4 rounded-md transition-colors duration-300 
                ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? (
                <div className="loader"></div>
              ) : (
                t("connexion.submitButton")
              )}
            </button>
            {submitStatus && (
              <p className="mt-4 text-center text-sm">{submitStatus}</p>
            )}
          </div>
        </form>
        
        <div className="mt-4 flex justify-between text-sm">
          <div
            id="register"
            onClick={handleNavigate}
            className="text-blue-600 font-medium cursor-pointer hover:text-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-colors duration-200"
          >
            {t("connexion.registerLink")}
          </div>
          
          <div
            id="forget-password"
            onClick={handleNavigateToForgetPassword}
            className="text-blue-600 font-medium cursor-pointer hover:text-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-colors duration-200"
          >
            {t("connexion.forgotLink")}
          </div>
        </div>



      </div>

      {/* CSS for the loader */}
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
    </main>
  );
}
