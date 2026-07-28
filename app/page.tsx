"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Slider from "@/components/Slider";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// تایپ ساده بازی
interface IGame {
  _id: string;
  title: string;
  category: string;
  price: string;
  image?: string;
  coverImage?: string;
  desc?: string;
  tags?: string[];
}

const categories = ["Action", "RPG", "Sports", "Strategy", "Adventure"];

export default function Home() {
  const [games, setGames] = useState<IGame[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // سبد خرید (همون کلید و فرمتی که CartPage استفاده می‌کنه)
  const [cart, setCart] = useLocalStorage<IGame[]>("cart", []);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch("/api/games");
        if (res.ok) {
          const data = await res.json();
          setGames(data);
        }
      } catch (err) {
        console.error("خطا در دریافت بازی‌ها:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  const filteredGames = games.filter((game) => {
    if (searchTerm) return game.title.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedCategory) return game.category === selectedCategory;
    return true;
  });

  const isInCart = (id: string) => cart.some((item) => item._id === id);

  const handleAddToCart = (e: React.MouseEvent, game: IGame) => {
    // جلوگیری از رفتن به صفحه جزئیات وقتی روی دکمه کلیک می‌شه
    e.preventDefault();
    e.stopPropagation();

    if (isInCart(game._id)) return;
    setCart([...cart, game]);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-blue-500 font-bold">
        در حال دریافت لیست بازی‌ها...
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* سایدبار جستجو و فیلتر */}
      <Sidebar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        filteredGames={filteredGames}
      />

      {/* بخش اصلی (اسلایدر + لیست بازی‌ها) */}
      <section className="flex-1 space-y-8">
        {!searchTerm && !selectedCategory && <Slider />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.length > 0 ? (
            filteredGames.map((game) => (
              <Link
                key={game._id}
                href={`/game/${game._id}`}
                className="bg-[#1a1f29] rounded-2xl p-4 border border-white/5 space-y-3 hover:border-blue-500/50 transition-all block"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={game.coverImage || game.image || "/placeholder.jpg"}
                  alt={game.title}
                  className="w-full h-48 object-cover rounded-xl"
                />
                <h3 className="font-bold text-lg text-white">{game.title}</h3>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-gray-400">{game.category}</span>
                  <span className="text-blue-400 font-bold">
                    {game.price ? game.price : "رایگان"}
                  </span>
                </div>

                <button
                  onClick={(e) => handleAddToCart(e, game)}
                  disabled={isInCart(game._id)}
                  className={`w-full mt-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    isInCart(game._id)
                      ? "bg-green-600/20 text-green-400 cursor-default"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {isInCart(game._id) ? "به سبد اضافه شد ✓" : "افزودن به سبد خرید"}
                </button>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-400">
              هیچ بازی با این مشخصات یافت نشد.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}