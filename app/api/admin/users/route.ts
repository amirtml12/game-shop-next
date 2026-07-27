import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    await dbConnect();
    const users = await User.find().select("-password");
    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({ error: "خطا در دریافت لیست کاربران" }, { status: 500 });
  }
}