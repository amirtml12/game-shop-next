"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export interface Requirements {
  minOS?: string;
  minCPU?: string;
  minRAM?: string;
  minGPU?: string;
  recOS?: string;
  recCPU?: string;
  recRAM?: string;
  recGPU?: string;
  storage?: string;
}

export interface Game {
  id: number | string;
  _id?: string;
  title: string;
  price: string;
  category: string;
  image: string;
  description?: string;
  requirements?: Requirements;
}

interface GameDetailsProps {
  game?: Game | null;
  setView?: (view: string) => void;
  addToCart?: (game: Game) => void;
  featuredGames?: Game[];
  setSelectedGame?: (game: Game) => void;
}

export default function GameDetails({
  game,
  setView,
  addToCart,
  featuredGames = [],
  setSelectedGame,
}: GameDetailsProps) {
  const router = useRouter();

  // حالت ۱: اگر بازی انتخاب نشده باشد (نمایش بازی‌های پیشنهادی)
  if (!game) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold bg-gradient-to-l from-blue-500 to-transparent pr-4 border-r-4 border-blue-600 text-white">
            بازی‌های پیشنهادی برای شما
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {featuredGames.map((item) => (
            <motion.div
              key={item.id}
              onClick={() => {
                if (setSelectedGame) setSelectedGame(item);
                router.push(`/game/${item.id}`);
              }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="relative bg-[#1a1f29] p-4 rounded-2xl border border-white/5 cursor-pointer overflow-hidden group transition-all"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>

              <div className="relative flex gap-5 items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  className="w-28 h-28 object-cover rounded-xl shadow-lg group-hover:rotate-2 transition-transform duration-300"
                  alt={item.title}
                />
                <div className="flex-1">
                  <h4 className="font-bold text-white group-hover:text-blue-400 transition">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                    تجربه‌ای متفاوت در سبک {item.category} با گرافیک خیره‌کننده.
                  </p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-green-400 font-mono font-bold">
                      {item.price}
                    </span>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded">
                      مشاهده جزئیات
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // حالت ۲: نمایش جزئیات بازی انتخاب شده
  return (
    <div className="space-y-8" dir="rtl">
      {/* دکمه بازگشت سریع */}
      <button
        onClick={() => router.push("/")}
        className="text-sm text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2"
      >
        ← بازگشت به لیست بازی‌ها
      </button>

      <div className="bg-[#1a1f29] p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={game.image}
          alt={game.title}
          className="w-full md:w-80 h-48 object-cover rounded-xl shadow-2xl"
        />
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-start">
            <h2 className="text-3xl font-bold text-white">{game.title}</h2>
            <span className="bg-blue-500/10 text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-500/20">
              {game.category}
            </span>
          </div>
          <p className="text-gray-400 leading-relaxed">{game.description}</p>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            {addToCart && (
              <button
                onClick={() => addToCart(game)}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold transition-all transform hover:scale-105"
              >
                افزودن به سبد خرید
              </button>
            )}

            <button
              onClick={() => router.push(`/download/${game.id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-all"
            >
              دانلود بازی
            </button>

            <span className="text-2xl font-mono text-green-400 mr-auto">
              {game.price}
            </span>
          </div>
        </div>
      </div>

      {/* بخش مشخصات سیستم */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 p-6 rounded-xl border border-white/5">
          <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            حداقل سیستم مورد نیاز
          </h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li>
              <span className="text-gray-500">OS:</span>{" "}
              {game.requirements?.minOS || "Windows 10"}
            </li>
            <li>
              <span className="text-gray-500">Processor:</span>{" "}
              {game.requirements?.minCPU || "Intel Core i5"}
            </li>
            <li>
              <span className="text-gray-500">Memory:</span>{" "}
              {game.requirements?.minRAM || "8 GB"}
            </li>
            <li>
              <span className="text-gray-500">Graphics:</span>{" "}
              {game.requirements?.minGPU || "GTX 1050"}
            </li>
          </ul>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-white/5">
          <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
            سیستم پیشنهادی
          </h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li>
              <span className="text-gray-500">OS:</span>{" "}
              {game.requirements?.recOS || "Windows 11"}
            </li>
            <li>
              <span className="text-gray-500">Processor:</span>{" "}
              {game.requirements?.recCPU || "Intel Core i7"}
            </li>
            <li>
              <span className="text-gray-500">Memory:</span>{" "}
              {game.requirements?.recRAM || "16 GB"}
            </li>
            <li>
              <span className="text-gray-500">Graphics:</span>{" "}
              {game.requirements?.recGPU || "RTX 3060"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}