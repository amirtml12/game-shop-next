"use client";

import { useState } from "react";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthPageProps {
  setUser?: (user: UserData) => void;
}

export default function AuthPage({ setUser }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === "login") {
        const response = await axios.post(
          "/api/login",
          { email: email.trim(), password },
          { withCredentials: true }
        );

        const userData = response.data.user;

        if (setUser) {
          setUser(userData);
        }

        if (userData.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
        alert("ورود با موفقیت انجام شد!");
      } else if (mode === "register") {
        const response = await axios.post(
          "/api/register",
          { name, email: email.trim(), password },
          { withCredentials: true }
        );
        console.log("ثبت‌نام موفق:", response.data);
        alert("ثبت‌نام با موفقیت انجام شد! حالا می‌توانید وارد شوید.");
        setMode("login");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          alert(error.response.data?.error || "خطایی رخ داد");
        } else if (error.request) {
          alert("سرور پاسخ نمی‌دهد. مطمئن شوید سرور روشن است.");
        } else {
          alert("خطای ناشناخته: " + error.message);
        }
      } else {
        alert("خطای غیرمنتظره رخ داد");
      }
    }
  };

  return (
    <div className="min-h-[500px] flex items-center justify-center animate-in fade-in zoom-in duration-300">
      <div className="w-full max-w-md bg-[#171a21] border border-white/5 p-8 rounded-xl shadow-2xl">

        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">
            {mode === "login" ? "ورود به حساب" : mode === "register" ? "ساخت حساب جدید" : "بازیابی رمز عبور"}
          </h2>
          <p className="text-xs text-gray-500">خوش آمدید، لطفاً اطلاعات خود را وارد کنید</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="relative">
              <User className="absolute right-3 top-3 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="نام کاربری"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#316282]/20 border border-white/10 rounded p-3 pr-10 text-sm text-white focus:border-blue-500 outline-none"
                required
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute right-3 top-3 text-gray-500" size={18} />
            <input
              type="email"
              placeholder="ایمیل"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#316282]/20 border border-white/10 rounded p-3 pr-10 text-sm text-white focus:border-blue-500 outline-none"
              required
            />
          </div>

          {mode !== "forgot" && (
            <div className="relative">
              <Lock className="absolute right-3 top-3 text-gray-500" size={18} />
              <input
                type="password"
                placeholder="رمز عبور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#316282]/20 border border-white/10 rounded p-3 pr-10 text-sm text-white focus:border-blue-500 outline-none"
                required
              />
            </div>
          )}

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded transition-all shadow-lg shadow-blue-900/20">
            {mode === "login" ? "ورود" : mode === "register" ? "ثبت‌نام" : "ارسال ایمیل بازیابی"}
          </button>
        </form>

        <div className="mt-6 space-y-3 text-center">
          {mode === "login" ? (
            <>
              <button onClick={() => setMode("forgot")} className="block w-full text-xs text-gray-400 hover:text-white transition">
                فراموشی رمز عبور؟
              </button>
              <p className="text-xs text-gray-500">
                حساب ندارید؟{" "}
                <button onClick={() => setMode("register")} className="text-blue-400 font-bold hover:underline">
                  ایجاد حساب
                </button>
              </p>
            </>
          ) : (
            <button
              onClick={() => setMode("login")}
              className="flex items-center justify-center gap-2 w-full text-xs text-gray-400 hover:text-white transition"
            >
              <ArrowRight size={14} /> بازگشت به صفحه ورود
            </button>
          )}
        </div>

        <button
          onClick={() => router.push("/")}
          className="mt-8 w-full border border-white/5 text-[10px] text-gray-600 hover:text-gray-400 py-2 rounded transition"
        >
          انصراف و بازگشت به فروشگاه
        </button>
      </div>
    </div>
  );
}
