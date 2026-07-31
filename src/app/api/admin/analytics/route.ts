import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";
import { Trek } from "@/models/Trek";
import { requireAdmin } from "@/lib/auth";
import * as XLSX from "xlsx";

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const bookings = await Booking.find().sort({ bookingDate: -1 }).lean();

    const rows = bookings.map((b) => ({
      "Booking ID": b.bookingId,
      "Customer Name": b.customerName,
      Phone: b.phone,
      Email: b.email,
      Trek: b.trekTitle,
      Participants: b.participants,
      "Grand Total": b.grandTotal,
      "Payment Status": b.paymentStatus,
      "Booking Date": new Date(b.bookingDate).toLocaleDateString("en-IN"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=bookings-${Date.now()}.xlsx`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Export failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const [totalBookings, paidBookings, totalRevenue, trekCount, recentBookings] =
      await Promise.all([
        Booking.countDocuments(),
        Booking.countDocuments({ paymentStatus: "paid" }),
        Booking.aggregate([
          { $match: { paymentStatus: "paid" } },
          { $group: { _id: null, total: { $sum: "$grandTotal" } } },
        ]),
        Trek.countDocuments(),
        Booking.find()
          .sort({ bookingDate: -1 })
          .limit(5)
          .select("bookingId customerName trekTitle grandTotal paymentStatus bookingDate")
          .lean(),
      ]);

    return NextResponse.json({
      totalBookings,
      paidBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      trekCount,
      recentBookings,
    });
  } catch {
    return NextResponse.json(
      { error: "Analytics failed" },
      { status: 500 }
    );
  }
}
