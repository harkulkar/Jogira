import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";
import { Trek } from "@/models/Trek";
import { requireAdmin } from "@/lib/auth";
import {
  calculateTotals,
  generateBookingId,
} from "@/lib/razorpay";
import { z } from "zod";

const bookingSchema = z.object({
  customerName: z.string().min(2),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  participants: z.number().int().min(1).max(20),
  trekId: z.string(),
  trekDate: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const bookings = await Booking.find()
      .sort({ bookingDate: -1 })
      .populate("trekId", "title slug")
      .lean();
    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received booking request:", body);
    
    const data = bookingSchema.parse(body);
    console.log("Validated data:", data);

    await connectDB();
    const trek = await Trek.findById(data.trekId);
    console.log("Found trek:", trek);
    
    if (!trek) {
      return NextResponse.json({ error: "Trek not found" }, { status: 404 });
    }

    if (trek.availableSeats < data.participants) {
      return NextResponse.json(
        { error: "Not enough seats available" },
        { status: 400 }
      );
    }

    const { grandTotal } = calculateTotals(
      trek.price,
      data.participants
    );

    const bookingId = generateBookingId();
    console.log("Generated booking ID:", bookingId);

    const booking = await Booking.create({
      bookingId,
      customerName: data.customerName,
      phone: data.phone,
      participants: data.participants,
      trekId: trek._id,
      trekTitle: trek.title,
      paymentStatus: "pending",
      grandTotal,
      trekDate: data.trekDate,
    });
    console.log("Created booking:", booking);

    // Decrease available seats
    await Trek.findByIdAndUpdate(trek._id, {
      $inc: { availableSeats: -data.participants },
    });

    return NextResponse.json({
      booking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
