import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/steam_store";

if (!MONGODB_URI) {
  throw new Error("لطفاً MONGODB_URI رو تو .env.local تعریف کن");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // اگه اتصال کش‌شده داریم، چک کن واقعاً زنده‌ست یا نه
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // اگه اتصال مرده یا وجود نداره، کش رو ریست کن
  cached.conn = null;
  cached.promise = null;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000, // اگه ۸ ثانیه طول کشید و وصل نشد، خطا بده (نه اینکه هنگ کنه)
      socketTimeoutMS: 20000,
      maxPoolSize: 5,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        return mongoose;
      })
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

export default dbConnect;