import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBooking extends Document {
  bookingId: string;
  customerName: string;
  phone: string;
  email?: string;
  emergencyContact?: string;
  address?: string;
  participants: number;
  trekId: mongoose.Types.ObjectId;
  trekTitle: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  grandTotal: number;
  couponCode?: string;
  discount?: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  bookingDate: Date;
  trekDate?: string;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: false },
    emergencyContact: { type: String, required: false },
    address: { type: String, required: false },
    participants: { type: Number, required: true },
    trekId: { type: Schema.Types.ObjectId, ref: "Trek", required: true },
    trekTitle: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    grandTotal: { type: Number, required: true },
    couponCode: String,
    discount: { type: Number, default: 0 },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    bookingDate: { type: Date, default: Date.now },
    trekDate: { type: String, required: false },
  },
  { timestamps: true }
);

export const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
