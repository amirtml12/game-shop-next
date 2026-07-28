import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import SupportMessage from "@/models/SupportMessage";
import { requireAdmin } from "@/lib/adminAuth";

// تغییر وضعیت خوانده‌شده/نشده - فقط ادمین
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const updated = await SupportMessage.findByIdAndUpdate(
      id,
      { isRead: body.isRead },
      { new: true }
    );
    if (!updated) {
      return NextResponse.json({ error: "پیام پیدا نشد" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: "خطا در ویرایش پیام: " + err.message }, { status: 400 });
  }
}

// حذف پیام - فقط ادمین
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    await dbConnect();
    const { id } = await params;
    await SupportMessage.findByIdAndDelete(id);
    return NextResponse.json({ message: "پیام حذف شد" });
  } catch (err) {
    return NextResponse.json({ error: "خطا در حذف پیام" }, { status: 500 });
  }
}