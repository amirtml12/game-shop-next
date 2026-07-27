import { FaGithub, FaDiscord, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0b0e14] text-gray-400 py-12 border-t border-white/5 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* ستون اول: درباره ما */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">Steam Clone</h4>
            <p className="text-sm leading-relaxed">
              مرجع بازی‌های دیجیتال و پلتفرم جامع گیمرهای فارسی زبان. بهترین بازی‌ها را با قیمت مناسب دریافت کنید.
            </p>
          </div>

          {/* ستون دوم: لینک‌های سریع */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">دسترسی سریع</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-blue-500 cursor-pointer transition">فروشگاه</li>
              <li className="hover:text-blue-500 cursor-pointer transition">جدیدترین بازی‌ها</li>
              <li className="hover:text-blue-500 cursor-pointer transition">تخفیف‌های ویژه</li>
              <li className="hover:text-blue-500 cursor-pointer transition">سوالات متداول</li>
            </ul>
          </div>

          {/* ستون سوم: پشتیبانی */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">خدمات مشتریان</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-blue-500 cursor-pointer transition">ارتباط با پشتیبانی</li>
              <li className="hover:text-blue-500 cursor-pointer transition">قوانین و مقررات</li>
              <li className="hover:text-blue-500 cursor-pointer transition">حریم خصوصی</li>
              <li className="hover:text-blue-500 cursor-pointer transition">گزارش مشکل</li>
            </ul>
          </div>

          {/* ستون چهارم: شبکه‌های اجتماعی */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">همراه ما باشید</h4>
            <div className="flex gap-4 text-2xl">
              <FaGithub className="hover:text-white cursor-pointer transition" />
              <FaDiscord className="hover:text-blue-500 cursor-pointer transition" />
              <FaTwitter className="hover:text-blue-400 cursor-pointer transition" />
              <FaInstagram className="hover:text-pink-500 cursor-pointer transition" />
            </div>
            <div className="pt-4">
              <p className="text-xs">عضویت در خبرنامه:</p>
              <div className="flex mt-2">
                <input 
                  type="email" 
                  placeholder="ایمیل شما..." 
                  className="bg-white/5 border border-white/10 rounded-r-md px-3 py-2 text-sm w-full outline-none focus:border-blue-500"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-l-md text-sm hover:bg-blue-700 transition">ثبت</button>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-white/5 mt-12 pt-8 text-center text-xs tracking-widest uppercase">
          <p>© 2025 تمامی حقوق برای پروژه استیم محفوظ است</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;