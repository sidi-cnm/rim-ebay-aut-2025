"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "../../../../../locales/client";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ConnexionFormPhone({ lang = "ar" }) {
  const router = useRouter();
  const t = useI18n();

  // const defaultEmail = "";
  // //"user1@example.com";
  // const defaultPassword = "";
  // //"password123";
  //   const userForTest = {
  //   email:"",
  //   contact: "",
  //   password: "",
  //   confirmPassword: "",
  // }
  // const defaultUser = {
  //   email: "",
  //   contact: "",
  //   password: "",
  //   confirmPassword: "",
  // };
  // // en mode de test, on peut utiliser userForTest
  // defaultUser.email = userForTest.email;
  // defaultUser.contact = userForTest.contact;
  // defaultUser.password = userForTest.password;
  // defaultUser.confirmPassword = userForTest.confirmPassword;
  

  const [phone, setphone] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [showPassword, setShowPassword] = useState(false); 

  // const [email, setEmail] = useState(defaultEmail);
  // const [password, setPassword] = useState(defaultPassword);
  const [errors, setErrors] = useState({ phone: "", password: "" });
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
    const newErrors = { phone: "", password: "" };

    if (!phone) {
      newErrors.phone = t("connexion.emailRequired");
      isValid = false;
    } else if (!/^[234]\d{7}$/.test(phone)) {
      newErrors.phone = t("connexion.emailInvalid");
      isValid = false;
    }

    if (!password) {
      newErrors.password = t("connexion.passwordRequired");
      isValid = false;
    } 
    // else if (password.length < 6) {
    //   newErrors.password = t("connexion.passwordShort");
    //   isValid = false;
    // }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`/${lang}/api/p/users/connexion/phone`, {
        phone,
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
        toast.error("phone ou mot de passe incorrect", {
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
    <>
        <Toaster position="bottom-right" reverseOrder={false} />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5"
            >
              هاتف
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setphone(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-200 text-gray-900 font-medium placeholder-gray-400"
              placeholder="Ex: 36000000"
              dir="ltr"
              required
            />
            {errors.phone && (
              <p className="text-red-500 text-xs font-bold mt-1.5">{errors.phone}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5"
            >
              {t("connexion.passwordLabel")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-200 text-gray-900 font-medium pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary-600 transition-colors"
              >
                {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs font-bold mt-1.5">{errors.password}</p>
            )}
          </div>
          <div className="pt-2">
            <button
              id="submit"
              type="submit"
              className={`w-full flex justify-center items-center font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all duration-200 active:scale-[0.98]
                ${isLoading 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-primary-600 hover:bg-primary-700 text-white shadow-primary-600/30 hover:shadow-primary-600/40"}`}
              disabled={isLoading} 
            >
              {isLoading ? (
                <div className="loader"></div>
              ) : (
                t("connexion.submitButton")
              )}
            </button>
            {submitStatus && (
              <p className="mt-4 text-center text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{submitStatus}</p>
            )}
          </div>
        </form>
        
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center text-sm gap-4">
          <button
            id="register"
            type="button"
            onClick={handleNavigate}
            className="text-primary-600 font-bold hover:text-primary-700 hover:underline transition-colors"
          >
            {t("connexion.registerLink")}
          </button>
          
          <button
            id="forget-password"
            type="button"
            onClick={handleNavigateToForgetPassword}
            className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            {t("connexion.forgotLink")}
          </button>
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
    </>
  );
}
