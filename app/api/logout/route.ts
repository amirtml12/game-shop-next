import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "خروج موفقیت‌آمیز بود" });
  response.cookies.set("token", "", { maxAge: 0, path: "/" });
  return response;
}