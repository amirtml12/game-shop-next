"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";

interface RequirementSpec {
  os?: string;
  cpu?: string;
  ram?: string;
  gpu?: string;
}

interface Game {
  _id: string;
  title: string;
  price: string;
  category: string;
  image: string;
  desc?: string;
  tags?: string[];
  requirements?: {
    min?: RequirementSpec;
    rec?: RequirementSpec;
  };
}

export default function GameDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const { addToCart, isInCart } = useCart();
  const inCart = game ? isInCart(game._id) : false;

  useEffect(() => {
    if (!id) return;

    const fetchGame = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/games/${id}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setGame(data);
      } catch (err) {
        console.error("خطا در دریافت بازی:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  const handleAddToCart = () => {
    if (!game || inCart) return;
    addToCart(game);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-blue-500 font-bold">
        در حال دریافت اطلاعات بازی...
      </div>
    );
  }

  if (notFound || !game) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-gray-400">
        <p>بازی مورد نظر پیدا نشد.</p>
        <button
          onClick={() => router.push("/")}
          className="text-blue-400 hover:underline text-sm"
        >
          ← بازگشت به لیست بازی‌ها
        </button>
      </div>
    );
  }

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
          <p className="text-gray-400 leading-relaxed">{game.desc}</p>

          {game.tags && game.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {game.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] bg-white/5 text-gray-300 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={inCart}
              className={`px-8 py-3 rounded-lg font-bold transition-all transform hover:scale-105 ${
                inCart
                  ? "bg-green-600/20 text-green-400 cursor-default"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {inCart ? "به سبد اضافه شد ✓" : "افزودن به سبد خرید"}
            </button>

            <button
              onClick={() => router.push(`/download/${game._id}`)}
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
              {game.requirements?.min?.os || "Windows 10"}
            </li>
            <li>
              <span className="text-gray-500">Processor:</span>{" "}
              {game.requirements?.min?.cpu || "Intel Core i5"}
            </li>
            <li>
              <span className="text-gray-500">Memory:</span>{" "}
              {game.requirements?.min?.ram || "8 GB"}
            </li>
            <li>
              <span className="text-gray-500">Graphics:</span>{" "}
              {game.requirements?.min?.gpu || "GTX 1050"}
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
              {game.requirements?.rec?.os || "Windows 11"}
            </li>
            <li>
              <span className="text-gray-500">Processor:</span>{" "}
              {game.requirements?.rec?.cpu || "Intel Core i7"}
            </li>
            <li>
              <span className="text-gray-500">Memory:</span>{" "}
              {game.requirements?.rec?.ram || "16 GB"}
            </li>
            <li>
              <span className="text-gray-500">Graphics:</span>{" "}
              {game.requirements?.rec?.gpu || "RTX 3060"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}