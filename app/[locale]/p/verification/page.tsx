import { MailCheck } from "lucide-react";

export default function VerificationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center  to-indigo-900 px-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border border-gray-200">
        
        {/* Icône */}
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
            <MailCheck className="h-8 w-8" />
          </div>
        </div>

        {/* Titre */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          تحقق من بريدك الإلكتروني
        </h1>

        {/* Texte */}
        <p className="text-gray-600 leading-relaxed">
          يجب توثيق حسابك أولاً.  
          الرجاء التحقق من بريدك الإلكتروني (Email) لتفعيل حسابك.
        </p>
        
        <p className="text-gray-600 leading-relaxed" >
        انتظر من 5 إلى 10 دقائق لتصلك الرسالة
        </p>

      </div>
    </div>
  );
}
