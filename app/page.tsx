"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Slider from "@/components/Slider";

// تایپ ساده بازی
interface IGame {
  _id: string;
  title: string;
  category: string;
  price: number;
  image?: string;
  coverImage?: string;
}

const categories = ["Action", "RPG", "Sports", "Strategy", "Adventure"];

export default function Home() {
  const [games, setGames] = useState<IGame[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

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
              <div
                key={game._id}
                className="bg-[#1a1f29] rounded-2xl p-4 border border-white/5 space-y-3 hover:border-blue-500/50 transition-all"
              >
                <img
                  src={game.coverImage || game.image || "/placeholder.jpg"}
                  alt={game.title}
                  className="w-full h-48 object-cover rounded-xl"
                />
                <h3 className="font-bold text-lg text-white">{game.title}</h3>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-gray-400">{game.category}</span>
                  <span className="text-blue-400 font-bold">
                    {game.price ? `${game.price.toLocaleString()} تومان` : "رایگان"}
                  </span>
                </div>
              </div>
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