"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/types";

interface BookingData {
  bookingId: string;
  customerName: string;
  trekTitle: string;
  participants: number;
  grandTotal: number;
  paymentStatus: string;
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const isDev = searchParams.get("dev");
  const [booking, setBooking] = useState<BookingData | null>(null);

  useEffect(() => {
    if (!bookingId) return;
    fetch(`/api/bookings/verify?bookingId=${bookingId}`)
      .then((r) => r.json())
      .then(setBooking)
      .catch(() => {
        if (isDev) {
          setBooking({
            bookingId,
            customerName: "Guest",
            trekTitle: "Your Trek",
            participants: 1,
            grandTotal: 0,
            paymentStatus: "paid",
          });
        }
      });
  }, [bookingId, isDev]);

  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-card">
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          Booking Confirmed!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Thank you for booking with Jogira Treks. Your adventure awaits!
        </p>

        {booking && (
          <div className="text-left bg-surface-muted dark:bg-gray-900 rounded-xl p-4 mb-6 space-y-2 text-sm">
            <p>
              <span className="text-gray-500">Booking ID:</span>{" "}
              <strong>{booking.bookingId}</strong>
            </p>
            <p>
              <span className="text-gray-500">Trek:</span> {booking.trekTitle}
            </p>
            <p>
              <span className="text-gray-500">Participants:</span>{" "}
              {booking.participants}
            </p>
            <p>
              <span className="text-gray-500">Total:</span>{" "}
              {formatCurrency(booking.grandTotal)}
            </p>
            <p>
              <span className="text-gray-500">Status:</span>{" "}
              <span className="text-primary capitalize">{booking.paymentStatus}</span>
            </p>
          </div>
        )}

        <p className="text-sm text-gray-500 mb-6">
          A confirmation has been sent to your email. Our team will contact you on
          WhatsApp with trek details.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/treks">
            <Button className="w-full">Explore More Treks</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="pt-24 text-center">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
