"use client";

import { Search, ArrowRight, ChevronLeft } from "lucide-react";

export interface Game {
  _id?: string;
  id?: number | string;
  title: string;
  image?: string;
  coverImage?: string;
  price?: number | string;
  category: string;
  description?: string;
  requirements?: Record<string, unknown>;
}

export interface SidebarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  view?: string;
  setView?: (value: string) => void;
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (value: string | null) => void;
  filteredGames: Game[];
  setSelectedGame?: (game: Game) => void;
  selectedGame?: Game | null;
}

function Sidebar({
  searchTerm,
  setSearchTerm,
  view = "categories",
  setView,
  categories,
  selectedCategory,
  setSelectedCategory,
  filteredGames,
  setSelectedGame,
  selectedGame,
}: SidebarProps) {
  return (
    <aside className="w-full lg:w-1/4 space-y-4">
      {/* Search Box */}
      <div className="bg-[#171a21] rounded-lg p-3 shadow-2xl border border-white/5">
        <div className="relative">
          <input
            type="text"
            placeholder="جستجوی سریع..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value !== "" && setView) setView("games");
            }}
            className="w-full bg-[#316282] border-none rounded p-2 pr-9 text-xs text-white placeholder-blue-300 outline-none focus:ring-1 focus:ring-blue-400"
          />
          <Search className="absolute right-3 top-2.5 text-blue-300" size={14} />
        </div>
      </div>

      <div className="bg-[#171a21] rounded-lg overflow-hidden border border-white/5 shadow-2xl">
        {view === "games" && !searchTerm && (
          <button
            onClick={() => {
              setSelectedCategory(null);
              if (setView) setView("categories");
            }}
            className="w-full flex items-center gap-2 p-4 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition border-b border-blue-500/20 font-bold text-sm"
          >
            <ArrowRight size={18} /> بازگشت به ژانرها
          </button>
        )}

        {view === "categories" && !searchTerm ? (
          <div className="p-2 space-y-1">
            <span className="text-[10px] text-gray-500 uppercase font-bold p-2 tracking-widest block">
              انتخاب سبک
            </span>
            {categories.map((cat) => (
              <div
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  if (setView) setView("games");
                  setSearchTerm("");
                }}
                className={`flex justify-between items-center p-3 rounded cursor-pointer group transition ${
                  selectedCategory === cat ? "bg-blue-600/30 text-blue-400 font-bold" : "hover:bg-white/5 text-gray-300"
                }`}
              >
                <span className="font-medium text-sm">{cat}</span>
                <ChevronLeft size={16} className="text-gray-600 group-hover:text-blue-400 transition" />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-2">
            <span className="text-[10px] text-blue-400 uppercase font-bold p-2 tracking-widest italic block">
              {searchTerm ? "نتایج جستجو" : selectedCategory || "همه بازی‌ها"}
            </span>
            <div className="max-h-[500px] overflow-y-auto space-y-1 custom-scrollbar">
              {filteredGames.length > 0 ? (
                filteredGames.map((game) => {
                  const gameId = game._id || game.id;
                  const activeId = selectedGame?._id || selectedGame?.id;
                  const isSelected = gameId && activeId && gameId === activeId;

                  return (
                    <div
                      key={gameId || game.title}
                      onClick={() => {
                        if (setSelectedGame) setSelectedGame(game);
                        if (view === "download" && setView) setView("games");
                      }}
                      className={`flex items-center gap-3 p-3 rounded cursor-pointer transition-all ${
                        isSelected ? "bg-blue-600/50 border-r-4 border-blue-400 text-white" : "hover:bg-white/5 text-gray-300"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={game.coverImage || game.image || "/placeholder.jpg"}
                        className="w-12 h-8 object-cover rounded"
                        alt={game.title}
                      />
                      <span className="text-xs font-bold truncate">{game.title}</span>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-xs text-gray-500 text-center">بازی یافت نشد</div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;