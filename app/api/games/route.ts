import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Game from "@/models/Game";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET() {
  try {
    await dbConnect();
    const games = await Game.find();
    return NextResponse.json(games);
  } catch (err) {
    console.error("خطای دریافت بازی‌ها:", err);
    return NextResponse.json({ error: "خطا در دریافت لیست بازی‌ها" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    await dbConnect();
    const body = await request.json();
    const newGame = new Game(body);
    const savedGame = await newGame.save();
    return NextResponse.json(savedGame, { status: 201 });
  } catch (err: any) {
    console.error("خطای ذخیره بازی:", err);
    return NextResponse.json({ error: "خطا در ذخیره بازی: " + err.message }, { status: 400 });
  }
}