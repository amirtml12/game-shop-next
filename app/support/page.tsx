"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeadset, FaPaperPlane, FaCheckCircle, FaLock } from "react-icons/fa";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function SupportPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطا در ارسال پیام");
        return;
      }

      setSubmitted(true);
      setMessage("");
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setSubmitting(false);
    }
  };

  // در حال چک‌کردن وضعیت لاگین
  if (checkingAuth) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-blue-500 font-bold">
        در حال بررسی وضعیت ورود...
      </div>
    );
  }

  // کاربر لاگین نکرده
  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center bg-[#1a1f29] border border-white/5 p-10 rounded-3xl" dir="rtl">
        <FaLock className="text-5xl text-blue-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">برای ارسال پیام باید وارد شوید</h2>
        <p className="text-gray-400 text-sm mb-6">
          تا هویت شما مشخص باشه و بتونیم سریع‌تر بهتون جواب بدیم، لطفاً اول وارد حساب کاربری‌تون بشید.
        </p>
        <Link
          href="/auth"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-all"
        >
          ورود / عضویت
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12" dir="rtl">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="bg-[#1a1f29] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6"
          >
            <div className="flex items-center gap-4 text-blue-500">
              <FaHeadset className="text-4xl" />
              <div>
                <h2 className="text-2xl font-bold text-white">مرکز پشتیبانی</h2>
                <p className="text-sm text-gray-400">پیام خود را بفرستید، کمتر از ۲ ساعت پاسخ می‌دهیم.</p>
              </div>
            </div>

            {/* نمایش هویت کاربر لاگین‌شده */}
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 flex flex-wrap gap-x-6 gap-y-1">
              <span>ارسال به نام: <span className="text-white font-bold">{user.name}</span></span>
              <span>ایمیل: <span className="text-white font-bold">{user.email}</span></span>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs text-gray-500 mr-2">متن پیام</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition resize-none text-white"
                  placeholder="چطور می‌توانیم به شما کمک کنیم؟"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-95"
              >
                <FaPaperPlane /> {submitting ? "در حال ارسال..." : "ارسال پیام"}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-green-500/10 border border-green-500/20 p-12 rounded-3xl"
          >
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">پیام شما دریافت شد!</h2>
            <p className="text-gray-400 mt-2">تیم پشتیبانی به زودی با شما تماس خواهد گرفت.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 text-sm text-green-500 underline underline-offset-4 hover:text-green-400"
            >
              ارسال پیام جدید
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}