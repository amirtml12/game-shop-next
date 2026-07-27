import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Game from "@/models/Game";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const game = await Game.findById(id);
    if (!game) {
      return NextResponse.json({ error: "بازی پیدا نشد" }, { status: 404 });
    }
    return NextResponse.json(game);
  } catch (err) {
    return NextResponse.json({ error: "خطا در دریافت بازی" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const updated = await Game.findByIdAndUpdate(id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "بازی پیدا نشد" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: "خطا در ویرایش بازی: " + err.message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    await dbConnect();
    const { id } = await params;
    await Game.findByIdAndDelete(id);
    return NextResponse.json({ message: "بازی با موفقیت حذف شد" });
  } catch (err) {
    return NextResponse.json({ error: "خطا در حذف بازی" }, { status: 500 });
  }
}