import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import SupportMessage from "@/models/SupportMessage";
import User from "@/models/User";
import { requireAdmin, requireUser } from "@/lib/adminAuth";

// ثبت پیام جدید - فقط کاربر لاگین‌کرده، اسم/ایمیل از حساب خودش گرفته می‌شه
export async function POST(request: NextRequest) {
  const auth = requireUser(request);
  if (!auth.ok) return auth.response;

  try {
    await dbConnect();
    const body = await request.json();
    const { message } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "متن پیام نمی‌تواند خالی باشد" }, { status: 400 });
    }

    // اسم و ایمیل رو از دیتابیس (بر اساس کاربر لاگین‌شده) می‌گیریم، نه از بدنه‌ی درخواست
    const userDoc = await User.findById(auth.user.userId).select("name email");
    if (!userDoc) {
      return NextResponse.json({ error: "کاربر پیدا نشد" }, { status: 404 });
    }

    const newMessage = new SupportMessage({
      name: userDoc.name,
      email: userDoc.email,
      message,
      userId: userDoc._id,
    });
    await newMessage.save();

    return NextResponse.json({ message: "پیام با موفقیت ارسال شد" }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: "خطا در ارسال پیام: " + err.message }, { status: 400 });
  }
}

// دریافت لیست پیام‌ها - فقط ادمین
export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    await dbConnect();
    const messages = await SupportMessage.find().sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (err) {
    return NextResponse.json({ error: "خطا در دریافت پیام‌ها" }, { status: 500 });
  }
}