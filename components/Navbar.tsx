"use client";

import { useState, useEffect } from "react";
import { Gamepad2, ShoppingCart, Sun, Moon, User, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { useTheme } from "@/components/ThemeContext";

export interface NavbarProps {
  onLogoClick?: () => void;
  cartCount?: number;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
}

function Navbar({ onLogoClick, cartCount = 0 }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { darkMode, setDarkMode } = useTheme();

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me", { withCredentials: true });
        if (isMounted) setUser(res.data.user);
      } catch {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
    } catch {
      // ignore
    } finally {
      setUser(null);
      router.push("/");
      router.refresh();
    }
  };

  return (
    <nav className="bg-white dark:bg-[#151921] p-4 border-b border-blue-500/20 sticky top-0 z-50 shadow-xl transition-colors duration-500">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* بخش سمت راست: لوگو و دکمه ادمین */}
        <div className="flex items-center gap-5">
          <Link
            href="/"
            onClick={onLogoClick}
            className="flex items-center gap-2 group"
          >
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20">
              <Gamepad2 className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-black italic tracking-tighter transition-colors text-gray-800 dark:text-white">
              STEAM STORE
            </h1>
          </Link>

          {/* دکمه پنل مدیریت - فقط برای ادمین */}
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isActive("/admin")
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-red-600/10 text-red-500 border-red-600/30 hover:bg-red-600 hover:text-white"
              }`}
            >
              <LayoutDashboard size={14} />
              پنل مدیریت
            </Link>
          )}
        </div>

        {/* بخش میانی: منوی ناوبری */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold">
          <Link
            href="/"
            className={`${
              isActive("/")
                ? "text-blue-500"
                : "hover:text-blue-400 text-gray-600 dark:text-gray-300"
            } transition-colors`}
          >
            صفحه اصلی
          </Link>
          <Link
            href="/about"
            className={`${
              isActive("/about")
                ? "text-blue-500"
                : "hover:text-blue-400 text-gray-600 dark:text-gray-300"
            } transition-colors`}
          >
            درباره ما
          </Link>
          <Link
            href="/support"
            className={`${
              isActive("/support")
                ? "text-blue-500"
                : "hover:text-blue-400 text-gray-600 dark:text-gray-300"
            } transition-colors`}
          >
            پشتیبانی
          </Link>
        </div>

        {/* بخش سمت چپ: تغییر تم، ورود/کاربر و سبد خرید */}
        <div className="flex items-center gap-4 md:gap-6">
          
          {/* سوئیچ تم */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-2xl hover:bg-gray-500/10 transition-all text-blue-400 border border-transparent hover:border-blue-500/20"
            title="تغییر تم"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} className="text-gray-600" />}
          </button>

          {/* وضعیت لاگین: در حال بارگذاری / لاگین شده / لاگین نشده */}
          {loading ? (
            <div className="w-24 h-9 rounded-2xl bg-gray-200 dark:bg-white/5 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-xs font-black px-4 py-2.5 rounded-2xl border text-gray-700 border-gray-200 bg-gray-50 dark:text-gray-200 dark:border-white/10 dark:bg-white/5">
                <User size={16} className="text-blue-500" />
                <span className="hidden sm:inline">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                title="خروج از حساب"
                className="p-2.5 rounded-2xl border border-transparent hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-2 text-xs font-black px-5 py-2.5 rounded-2xl border transition-all text-gray-700 border-gray-200 bg-gray-50 hover:bg-gray-100 dark:text-gray-300 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <User size={16} className="text-blue-500" />
              <span className="hidden sm:inline">ورود / عضویت</span>
            </Link>
          )}

          {/* سبد خرید با نشانگر تعداد */}
          <Link
            href="/cart"
            className={`relative p-2.5 rounded-2xl border transition-all group ${
              isActive("/cart")
                ? "bg-blue-600 border-blue-600 text-white"
                : "border-transparent hover:bg-blue-500/10 text-gray-400 hover:text-blue-400"
            }`}
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-black shadow-lg animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;