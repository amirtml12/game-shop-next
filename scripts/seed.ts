import mongoose from "mongoose";
import dotenv from "dotenv";
import Game from "../models/Game";

dotenv.config({ path: ".env.local" });

const gamesData = [
  {
    category: "Action",
    title: "Cyberpunk 2077",
    price: "29.99$",
    image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/capsule_616x353.jpg",
    desc: "سایبرپانک ۲۰۷۷ یک بازی نقش‌آفرینی اکشن در دنیای آینده است.",
    tags: ["Open World", "RPG"],
    requirements: {
      min: { os: "Windows 10", cpu: "i5-3570K", ram: "8GB", gpu: "GTX 960" },
      rec: { os: "Windows 11", cpu: "i7-12700K", ram: "16GB", gpu: "RTX 3070" },
    },
  },
  {
    category: "Action",
    title: "Elden Ring",
    price: "59.99$",
    image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/capsule_616x353.jpg",
    desc: "یک بازی فانتزی حماسی در دنیایی وسیع و تاریک.",
    tags: ["Souls-like", "Action"],
    requirements: {
      min: { os: "Windows 10", cpu: "i5-8400", ram: "12GB", gpu: "GTX 1060" },
      rec: { os: "Windows 11", cpu: "i7-8700K", ram: "16GB", gpu: "RTX 3060" },
    },
  },
  {
    category: "Sport",
    title: "FC 24",
    price: "69.99$",
    image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2195250/capsule_616x353.jpg",
    desc: "تجربه واقعی فوتبال با تکنولوژی HyperMotion.",
    tags: ["Soccer", "Sports"],
    requirements: {
      min: { os: "Windows 10", cpu: "i5-6600K", ram: "8GB", gpu: "GTX 1050 Ti" },
      rec: { os: "Windows 11", cpu: "i7-6700", ram: "12GB", gpu: "GTX 1660" },
    },
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/steam_store";
  await mongoose.connect(uri);
  console.log("اتصال برقرار شد ✅");

  await Game.deleteMany({});
  await Game.insertMany(gamesData);

  console.log("بازی‌ها با موفقیت وارد دیتابیس شدند ✅");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("خطا در سید کردن:", err);
  process.exit(1);
});