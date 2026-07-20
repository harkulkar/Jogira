import { COUPONS } from "@/lib/razorpay";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = new URL(req.url).searchParams.get("code")?.toUpperCase();
  if (!code || !COUPONS[code]) {
    return NextResponse.json(
      { valid: false, error: "Invalid coupon" },
      { status: 400 }
    );
  }
  return NextResponse.json({ valid: true, discount: COUPONS[code], code });
}
