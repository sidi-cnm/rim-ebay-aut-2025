"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function VerifyOtpPage({ lang = "ar", urlboot }: { lang?: string; urlboot: string }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const uid = localStorage.getItem("pendingOtpUserId");
    if (!uid) router.push("/");
    setUserId(uid);

    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerify = async () => {
    if (!userId) return;
    console.log("Verifying OTP for userId:", userId);

    setIsLoading(true);                     
    try {
      const res = await axios.post(`/${lang}/api/otp/verify`, {
        userId,
        code: otp,
      });

      setMsg("Verification successful!");
      localStorage.removeItem("pendingOtpUserId");

      router.push("/"); // go to home or dashboard
    } catch (err: any) {
      setMsg(err.response?.data?.error || "Verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!userId || cooldown > 0) return;

    setCooldown(60);

    try {
      const res = await axios.post(`/${lang}/api/otp/re-send`, { userId });
      setMsg("OTP sent!");
    } catch (err: any) {
      setMsg(err.response?.data?.error || "Error sending OTP.");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded-lg shadow">
      <h1 className="text-xl font-semibold mb-4">أدخل رمز التحقق</h1>

      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="6-digit code"
        className="w-full mb-3 p-2 border rounded"
      />

      <button
        onClick={handleVerify}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-3"
      >
        تحقق من الرمز
      </button>

      <button
        onClick={handleResend}
        disabled={cooldown > 0}
        className="w-full bg-gray-200 py-2 rounded hover:bg-gray-300"
      >
        {cooldown > 0 ? `إعادة الإرسال خلال ${cooldown} ثانية` : "إعادة إرسال الرمز"}
      </button>

      {msg && <p className="mt-4 text-center text-red-600">{msg}</p>}
    </div>
  );
}
