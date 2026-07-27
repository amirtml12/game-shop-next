import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User";

dotenv.config({ path: ".env.local" });

const ADMIN_NAME = "Admin";
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "12345678";

async function seedAdmin() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/steam_store";
  await mongoose.connect(uri);
  console.log("اتصال برقرار شد ✅");

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    existing.role = "admin";
    existing.password = hashedPassword;
    await existing.save();
    console.log("یوزر موجود بود، به ادمین تبدیل شد و رمزش آپدیت شد ✅");
  } else {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
    });
    console.log("اکانت ادمین با موفقیت ساخته شد ✅");
  }

  console.log(`ایمیل: ${ADMIN_EMAIL}`);
  console.log(`رمز عبور: ${ADMIN_PASSWORD}`);

  await mongoose.disconnect();
}

seedAdmin().catch((err) => {
  console.error("خطا در ساخت اکانت ادمین:", err);
  process.exit(1);
});