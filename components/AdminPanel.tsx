"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaSearch,
  FaGamepad, FaTags, FaDesktop, FaServer, FaUsers, FaUserShield,
  FaHeadset, FaEnvelope, FaEnvelopeOpen
} from "react-icons/fa";

export interface RequirementSpec {
  os?: string;
  cpu?: string;
  ram?: string;
  gpu?: string;
}

export interface Game {
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

export interface AppUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface SupportMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const emptyGameForm = {
  title: "",
  price: "",
  category: "",
  image: "",
  desc: "",
  tagsInput: "",
  requirements: {
    min: { os: "Windows 10", cpu: "", ram: "", gpu: "" },
    rec: { os: "Windows 11", cpu: "", ram: "", gpu: "" },
  },
};

export default function AdminPanel({ categories = ["Action", "RPG", "Sports", "Strategy", "Adventure"] }: { categories?: string[] }) {
  const [activeTab, setActiveTab] = useState<"games" | "users" | "support">("games");

  // ---------- بازی‌ها ----------
  const [games, setGames] = useState<Game[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [adminSearch, setAdminSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Game>>({});
  const [newGame, setNewGame] = useState(emptyGameForm);

  const fetchGames = useCallback(async () => {
    setLoadingGames(true);
    try {
      const res = await fetch("/api/games");
      const data = await res.json();
      setGames(data);
    } catch {
      alert("خطا در دریافت لیست بازی‌ها");
    } finally {
      setLoadingGames(false);
    }
  }, []);

  useEffect(() => { fetchGames(); }, [fetchGames]);

  const handleAddGame = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: newGame.title,
      price: newGame.price,
      category: newGame.category || categories[0],
      image: newGame.image,
      desc: newGame.desc,
      tags: newGame.tagsInput.split(",").map(t => t.trim()).filter(Boolean),
      requirements: newGame.requirements,
    };
    try {
      const res = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "خطا در افزودن بازی");
        return;
      }
      setGames([data, ...games]);
      alert("بازی جدید با موفقیت اضافه شد!");
      setNewGame(emptyGameForm);
    } catch {
      alert("خطا در ارتباط با سرور");
    }
  };

  const startEdit = (game: Game) => {
    setEditingId(game._id);
    setEditForm({ ...game });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { _id, ...payload } = editForm;
    try {
      const res = await fetch(`/api/games/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "خطا در ویرایش");
        return;
      }
      setGames(games.map(g => g._id === editingId ? data : g));
      setEditingId(null);
      alert("تغییرات ذخیره شد.");
    } catch {
      alert("خطا در ارتباط با سرور");
    }
  };

  const deleteGame = async (id: string) => {
    if (!confirm("مطمئنی می‌خوای این بازی رو حذف کنی؟")) return;
    try {
      const res = await fetch(`/api/games/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "خطا در حذف");
        return;
      }
      setGames(games.filter(g => g._id !== id));
    } catch {
      alert("خطا در ارتباط با سرور");
    }
  };

  const filteredAdminGames = games.filter(g =>
    g.title.toLowerCase().includes(adminSearch.toLowerCase())
  );

  // ---------- کاربران ----------
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "خطا در دریافت لیست کاربران");
        return;
      }
      setUsers(data);
    } catch {
      alert("خطا در ارتباط با سرور");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
  }, [activeTab, fetchUsers]);

  const toggleRole = async (user: AppUser) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    if (!confirm(`نقش ${user.email} به «${newRole}» تغییر کنه؟`)) return;
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "خطا در ویرایش کاربر");
        return;
      }
      setUsers(users.map(u => u._id === user._id ? data : u));
    } catch {
      alert("خطا در ارتباط با سرور");
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("مطمئنی می‌خوای این کاربر رو حذف کنی؟")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "خطا در حذف کاربر");
        return;
      }
      setUsers(users.filter(u => u._id !== id));
    } catch {
      alert("خطا در ارتباط با سرور");
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  // ---------- پیام‌های پشتیبانی ----------
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageSearch, setMessageSearch] = useState("");

  const fetchMessages = useCallback(async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch("/api/support");
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "خطا در دریافت پیام‌ها");
        return;
      }
      setMessages(data);
    } catch {
      alert("خطا در ارتباط با سرور");
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "support") fetchMessages();
  }, [activeTab, fetchMessages]);

  const toggleRead = async (msg: SupportMessage) => {
    try {
      const res = await fetch(`/api/support/${msg._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !msg.isRead }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "خطا در ویرایش پیام");
        return;
      }
      setMessages(messages.map(m => m._id === msg._id ? data : m));
    } catch {
      alert("خطا در ارتباط با سرور");
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("مطمئنی می‌خوای این پیام رو حذف کنی؟")) return;
    try {
      const res = await fetch(`/api/support/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "خطا در حذف پیام");
        return;
      }
      setMessages(messages.filter(m => m._id !== id));
    } catch {
      alert("خطا در ارتباط با سرور");
    }
  };

  const filteredMessages = messages.filter(m =>
    m.name.toLowerCase().includes(messageSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(messageSearch.toLowerCase())
  );

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500" dir="rtl">

      {/* تب‌ها */}
      <div className="flex gap-3 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab("games")}
          className={`px-5 py-2 rounded-xl font-bold flex items-center gap-2 transition ${activeTab === "games" ? "bg-blue-600 text-white" : "bg-white/5 text-gray-400"}`}
        >
          <FaGamepad /> بازی‌ها
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-5 py-2 rounded-xl font-bold flex items-center gap-2 transition ${activeTab === "users" ? "bg-blue-600 text-white" : "bg-white/5 text-gray-400"}`}
        >
          <FaUsers /> کاربران
        </button>
        <button
          onClick={() => setActiveTab("support")}
          className={`relative px-5 py-2 rounded-xl font-bold flex items-center gap-2 transition ${activeTab === "support" ? "bg-blue-600 text-white" : "bg-white/5 text-gray-400"}`}
        >
          <FaHeadset /> پیام‌های پشتیبانی
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-black">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {activeTab === "games" && (
        <>
          {/* آمار */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-3xl flex items-center gap-4">
              <div className="bg-blue-500 p-4 rounded-2xl text-white"><FaGamepad size={24} /></div>
              <div>
                <p className="text-gray-400 text-sm">کل بازی‌ها</p>
                <h3 className="text-2xl font-bold text-white">{games.length} مورد</h3>
              </div>
            </div>
            <div className="bg-purple-600/10 border border-purple-500/20 p-6 rounded-3xl flex items-center gap-4">
              <div className="bg-purple-500 p-4 rounded-2xl text-white"><FaTags size={24} /></div>
              <div>
                <p className="text-gray-400 text-sm">دسته‌بندی‌ها</p>
                <h3 className="text-2xl font-bold text-white">{categories.length} ژانر</h3>
              </div>
            </div>
          </div>

          {/* فرم افزودن */}
          <form onSubmit={handleAddGame} className="bg-[#1a1f29] border border-white/5 p-8 rounded-3xl space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
              افزودن محصول جدید به فروشگاه
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <input required placeholder="نام بازی" className="admin-input" value={newGame.title} onChange={e => setNewGame({ ...newGame, title: e.target.value })} />
              <input required placeholder="قیمت (مثلاً 59.99$)" className="admin-input" value={newGame.price} onChange={e => setNewGame({ ...newGame, price: e.target.value })} />
              <select required className="admin-input" value={newGame.category} onChange={e => setNewGame({ ...newGame, category: e.target.value })}>
                <option value="">انتخاب دسته‌بندی</option>
                {categories.map(c => <option key={c} value={c} className="bg-[#1a1f29]">{c}</option>)}
              </select>
              <input required placeholder="لینک تصویر (URL)" className="admin-input md:col-span-2 lg:col-span-2" value={newGame.image} onChange={e => setNewGame({ ...newGame, image: e.target.value })} />
              <input placeholder="تگ‌ها (با کاما جدا کن، مثلاً Open World, RPG)" className="admin-input" value={newGame.tagsInput} onChange={e => setNewGame({ ...newGame, tagsInput: e.target.value })} />
              <textarea placeholder="توضیحات کوتاه بازی..." className="admin-input md:col-span-2 lg:col-span-3" rows={3} value={newGame.desc} onChange={e => setNewGame({ ...newGame, desc: e.target.value })} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-2xl">
              <div className="space-y-3">
                <p className="text-orange-400 font-bold flex items-center gap-2 text-sm"><FaDesktop /> حداقل سیستم</p>
                <input placeholder="CPU" className="admin-input-sm" value={newGame.requirements.min.cpu} onChange={e => setNewGame({ ...newGame, requirements: { ...newGame.requirements, min: { ...newGame.requirements.min, cpu: e.target.value } } })} />
                <input placeholder="RAM" className="admin-input-sm" value={newGame.requirements.min.ram} onChange={e => setNewGame({ ...newGame, requirements: { ...newGame.requirements, min: { ...newGame.requirements.min, ram: e.target.value } } })} />
                <input placeholder="GPU" className="admin-input-sm" value={newGame.requirements.min.gpu} onChange={e => setNewGame({ ...newGame, requirements: { ...newGame.requirements, min: { ...newGame.requirements.min, gpu: e.target.value } } })} />
              </div>
              <div className="space-y-3">
                <p className="text-purple-400 font-bold flex items-center gap-2 text-sm"><FaServer /> سیستم پیشنهادی</p>
                <input placeholder="CPU" className="admin-input-sm" value={newGame.requirements.rec.cpu} onChange={e => setNewGame({ ...newGame, requirements: { ...newGame.requirements, rec: { ...newGame.requirements.rec, cpu: e.target.value } } })} />
                <input placeholder="RAM" className="admin-input-sm" value={newGame.requirements.rec.ram} onChange={e => setNewGame({ ...newGame, requirements: { ...newGame.requirements, rec: { ...newGame.requirements.rec, ram: e.target.value } } })} />
                <input placeholder="GPU" className="admin-input-sm" value={newGame.requirements.rec.gpu} onChange={e => setNewGame({ ...newGame, requirements: { ...newGame.requirements, rec: { ...newGame.requirements.rec, gpu: e.target.value } } })} />
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
              <FaPlus /> تایید و انتشار بازی
            </button>
          </form>

          {/* لیست */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-xl font-bold text-gray-300">لیست محصولات موجود</h2>
              <div className="relative w-full md:w-80">
                <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  placeholder="جستجو در مدیریت..."
                  className="w-full bg-[#1a1f29] border border-white/10 rounded-full py-2 pr-10 pl-4 text-sm focus:border-blue-500 outline-none text-white"
                  value={adminSearch}
                  onChange={e => setAdminSearch(e.target.value)}
                />
              </div>
            </div>

            {loadingGames ? (
              <p className="text-gray-400 text-center py-10">در حال بارگذاری...</p>
            ) : (
              <div className="grid gap-4">
                {filteredAdminGames.map(game => (
                  <div key={game._id} className="bg-[#1a1f29] border border-white/5 p-4 rounded-2xl flex flex-wrap md:flex-nowrap items-center gap-4 group hover:border-blue-500/30 transition-all">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={game.image} className="w-20 h-20 object-cover rounded-xl shadow-lg" alt={game.title} />

                    {editingId === game._id ? (
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input className="admin-input-edit" value={editForm.title || ""} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                        <input className="admin-input-edit" value={editForm.price || ""} onChange={e => setEditForm({ ...editForm, price: e.target.value })} />
                        <textarea className="admin-input-edit md:col-span-2" value={editForm.desc || ""} onChange={e => setEditForm({ ...editForm, desc: e.target.value })} />
                      </div>
                    ) : (
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-lg">{game.title}</h4>
                        <div className="flex gap-3 mt-1">
                          <span className="text-blue-400 text-xs bg-blue-400/10 px-2 py-0.5 rounded-full">{game.category}</span>
                          <span className="text-green-500 text-xs font-mono">{game.price}</span>
                        </div>
                        <p className="text-gray-500 text-xs mt-2 line-clamp-1 italic">{game.desc}</p>
                      </div>
                    )}

                    <div className="flex gap-2 mr-auto">
                      {editingId === game._id ? (
                        <>
                          <button onClick={saveEdit} className="admin-btn-save"><FaSave /></button>
                          <button onClick={() => setEditingId(null)} className="admin-btn-cancel"><FaTimes /></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(game)} className="admin-btn-edit"><FaEdit /></button>
                          <button onClick={() => deleteGame(game._id)} className="admin-btn-delete"><FaTrash /></button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-gray-300">مدیریت کاربران</h2>
            <div className="relative w-full md:w-80">
              <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                placeholder="جستجو بر اساس نام یا ایمیل..."
                className="w-full bg-[#1a1f29] border border-white/10 rounded-full py-2 pr-10 pl-4 text-sm focus:border-blue-500 outline-none text-white"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
              />
            </div>
          </div>

          {loadingUsers ? (
            <p className="text-gray-400 text-center py-10">در حال بارگذاری...</p>
          ) : (
            <div className="grid gap-4">
              {filteredUsers.map(user => (
                <div key={user._id} className="bg-[#1a1f29] border border-white/5 p-4 rounded-2xl flex flex-wrap md:flex-nowrap items-center gap-4 hover:border-blue-500/30 transition-all">
                  <div className={`p-3 rounded-xl ${user.role === "admin" ? "bg-purple-500/20 text-purple-400" : "bg-blue-500/20 text-blue-400"}`}>
                    <FaUserShield />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-lg">{user.name}</h4>
                    <div className="flex gap-3 mt-1 items-center">
                      <span className="text-gray-400 text-xs">{user.email}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${user.role === "admin" ? "bg-purple-400/10 text-purple-400" : "bg-gray-500/10 text-gray-400"}`}>
                        {user.role === "admin" ? "ادمین" : "کاربر عادی"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mr-auto">
                    <button onClick={() => toggleRole(user)} className="admin-btn-edit text-xs px-4">
                      {user.role === "admin" ? "تنزل به کاربر" : "ارتقا به ادمین"}
                    </button>
                    <button onClick={() => deleteUser(user._id)} className="admin-btn-delete"><FaTrash /></button>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <p className="text-gray-500 text-center py-10">کاربری یافت نشد.</p>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === "support" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-gray-300">پیام‌های پشتیبانی</h2>
            <div className="relative w-full md:w-80">
              <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                placeholder="جستجو بر اساس نام یا ایمیل..."
                className="w-full bg-[#1a1f29] border border-white/10 rounded-full py-2 pr-10 pl-4 text-sm focus:border-blue-500 outline-none text-white"
                value={messageSearch}
                onChange={e => setMessageSearch(e.target.value)}
              />
            </div>
          </div>

          {loadingMessages ? (
            <p className="text-gray-400 text-center py-10">در حال بارگذاری...</p>
          ) : (
            <div className="grid gap-4">
              {filteredMessages.map(msg => (
                <div
                  key={msg._id}
                  className={`bg-[#1a1f29] border p-5 rounded-2xl transition-all ${msg.isRead ? "border-white/5" : "border-blue-500/40"}`}
                >
                  <div className="flex flex-wrap md:flex-nowrap items-start gap-4">
                    <div className={`p-3 rounded-xl ${msg.isRead ? "bg-gray-500/10 text-gray-400" : "bg-blue-500/20 text-blue-400"}`}>
                      {msg.isRead ? <FaEnvelopeOpen /> : <FaEnvelope />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="font-bold text-white text-base">{msg.name}</h4>
                        <span className="text-blue-400 text-xs">{msg.email}</span>
                        {!msg.isRead && (
                          <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-bold">
                            جدید
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mt-2 leading-relaxed whitespace-pre-wrap">
                        {msg.message}
                      </p>
                      <p className="text-gray-600 text-[11px] mt-2">
                        {new Date(msg.createdAt).toLocaleString("fa-IR")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => toggleRead(msg)} className="admin-btn-edit text-xs px-4">
                        {msg.isRead ? "علامت‌گذاری نخوانده" : "علامت‌گذاری خوانده‌شده"}
                      </button>
                      <button onClick={() => deleteMessage(msg._id)} className="admin-btn-delete"><FaTrash /></button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredMessages.length === 0 && (
                <p className="text-gray-500 text-center py-10">پیامی یافت نشد.</p>
              )}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .admin-input { background: #0f1218; border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 12px; color: white; outline: none; transition: 0.3s; width: 100%; }
        .admin-input:focus { border-color: #3b82f6; background: #161b22; }
        .admin-input-sm { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 8px; color: white; width: 100%; font-size: 12px; outline: none; }
        .admin-input-edit { background: #0a0c10; border: 1px solid #333; border-radius: 10px; padding: 8px 12px; color: white; font-size: 14px; outline: none; width: 100%; }
        .admin-btn-edit { background: rgba(59,130,246,0.1); color: #3b82f6; border-radius: 12px; padding: 12px; transition: all 0.2s; }
        .admin-btn-edit:hover { background: #3b82f6; color: white; }
        .admin-btn-delete { background: rgba(239,68,68,0.1); color: #ef4444; border-radius: 12px; padding: 12px; transition: all 0.2s; }
        .admin-btn-delete:hover { background: #ef4444; color: white; }
        .admin-btn-save { background: #22c55e; color: white; border-radius: 12px; padding: 12px; }
        .admin-btn-cancel { background: #4b5563; color: white; border-radius: 12px; padding: 12px; }
      `}</style>
    </div>
  );
}