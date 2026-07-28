import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import SupportMessage from "@/models/SupportMessage";
import { requireAdmin } from "@/lib/adminAuth";

// ثبت پیام جدید - عمومی، هرکسی می‌تونه بفرسته
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "همه فیلدها الزامی هستند" }, { status: 400 });
    }

    const newMessage = new SupportMessage({ name, email, message });
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