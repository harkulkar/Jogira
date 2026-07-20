"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { CheckoutSession, formatCurrency } from "@/types";
import { SEED_TREKS } from "@/lib/seed-data";

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
  });

  useEffect(() => {
    const stored = sessionStorage.getItem("jogira-checkout");
    if (stored) {
      setSession(JSON.parse(stored));
      return;
    }
    const slug = searchParams.get("trek");
    const participants = Number(searchParams.get("participants") || 1);
    const trek = SEED_TREKS.find((t) => t.slug === slug);
    if (trek) {
      setSession({
        trekId: trek._id,
        trekTitle: trek.title,
        trekSlug: trek.slug,
        price: trek.price,
        participants,
        image: trek.image,
      });
    }
  }, [searchParams]);

  if (!session) {
    return (
      <div className="pt-24 text-center">
        <p>No booking session found.</p>
        <Button onClick={() => router.push("/treks")} className="mt-4">
          Browse Treks
        </Button>
      </div>
    );
  }

  const subtotal = session.price * session.participants;
  const grandTotal = subtotal;

  const handleConfirmBooking = async () => {
    if (!form.customerName || !form.phone) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        participants: session.participants,
        trekId: session.trekId,
        trekDate: session.selectedDate,
      };
      console.log("Sending booking payload:", payload);
      
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Booking response:", res.status, data);
      
      if (!res.ok) {
        toast.error(data.error || "Booking failed");
        setLoading(false);
        return;
      }

      toast.success("Booking confirmed!");
      router.push(`/booking/confirmation?bookingId=${data.booking.bookingId}`);
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 bg-surface-muted dark:bg-gray-950 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card">
              <h2 className="text-lg font-bold mb-4">Your Details</h2>
              <div className="space-y-4">
                {session.selectedDate && (
                  <div className="p-3 bg-surface-muted dark:bg-gray-700 rounded-lg">
                    <label className="block text-sm font-medium mb-1">Selected Date</label>
                    <p className="text-primary font-medium">{session.selectedDate}</p>
                  </div>
                )}
                {[
                  { key: "customerName", label: "Full Name", type: "text" },
                  { key: "phone", label: "Phone Number", type: "tel" },
                ].map(({ key, label, type }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-1">{label}</label>
                    <input
                      type={type}
                      required
                      value={form[key as keyof typeof form]}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card sticky top-24">
              <h2 className="text-lg font-bold mb-4">Booking Summary</h2>
              <p className="font-semibold text-primary mb-4">{session.trekTitle}</p>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Price per person</span>
                  <span>{formatCurrency(session.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Participants</span>
                  <span>{session.participants}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-xl pt-4 border-t dark:border-gray-700 mb-6">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(grandTotal)}</span>
              </div>
              <Button
                size="lg"
                className="w-full"
                onClick={handleConfirmBooking}
                disabled={loading}
              >
                {loading ? "Confirming..." : "Confirm Booking"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="pt-24 text-center">Loading...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
