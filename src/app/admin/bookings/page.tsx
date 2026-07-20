"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { Download } from "lucide-react";

interface Booking {
  _id: string;
  bookingId: string;
  customerName: string;
  phone: string;
  email: string;
  trekTitle: string;
  participants: number;
  grandTotal: number;
  paymentStatus: string;
  bookingDate: string;
  trekDate?: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((data) => (Array.isArray(data) ? setBookings(data) : setBookings([])))
      .catch(() => setBookings([]));
  }, []);

  const exportExcel = () => {
    window.open("/api/admin/analytics", "_blank");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manage Bookings
        </h1>
        <Button size="sm" variant="outline" onClick={exportExcel}>
          <Download className="w-4 h-4" /> Export Excel
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
        {bookings.length === 0 ? (
          <p className="p-6 text-gray-500">No bookings yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr className="text-left text-gray-500">
                <th className="p-4">Booking ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Trek</th>
                <th className="p-4">Trek Date</th>
                <th className="p-4">Participants</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Booking Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-t dark:border-gray-700">
                  <td className="p-4 font-mono text-xs">{b.bookingId}</td>
                  <td className="p-4">
                    <p>{b.customerName}</p>
                    <p className="text-xs text-gray-500">{b.phone}</p>
                  </td>
                  <td className="p-4">{b.trekTitle}</td>
                  <td className="p-4">{b.trekDate || "-"}</td>
                  <td className="p-4">{b.participants}</td>
                  <td className="p-4">₹{b.grandTotal}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs capitalize ${
                        b.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4 text-xs">
                    {new Date(b.bookingDate).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
