"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeadset, FaPaperPlane, FaCheckCircle } from "react-icons/fa";

export default function SupportPage() {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطا در ارسال پیام");
        return;
      }

      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setSubmitting(false);
    }
  };

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

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 mr-2">نام شما</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition text-white"
                    placeholder="مثلاً علی..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 mr-2">ایمیل</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition text-white"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 mr-2">موضوع پیام</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
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