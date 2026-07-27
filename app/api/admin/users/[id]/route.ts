import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { requireAdmin } from "@/lib/adminAuth";

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

    // فقط اجازه تغییر name و role رو می‌دیم (نه ایمیل و پسورد از این مسیر)
    const updateData: { name?: string; role?: string } = {};
    if (body.name) updateData.name = body.name;
    if (body.role) updateData.role = body.role;

    const updated = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
    if (!updated) {
      return NextResponse.json({ error: "کاربر پیدا نشد" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: "خطا در ویرایش کاربر: " + err.message }, { status: 400 });
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

    // جلوگیری از اینکه ادمین خودش رو حذف کنه
    if (id === auth.user.userId) {
      return NextResponse.json({ error: "نمی‌توانید حساب خودتان را حذف کنید" }, { status: 400 });
    }

    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: "کاربر با موفقیت حذف شد" });
  } catch (err) {
    return NextResponse.json({ error: "خطا در حذف کاربر" }, { status: 500 });
  }
}