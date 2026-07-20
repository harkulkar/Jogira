"use client";

import { useEffect, useState } from "react";
import { Users, Calendar, Mountain, IndianRupee } from "lucide-react";
import Link from "next/link";

interface Analytics {
  totalBookings: number;
  paidBookings: number;
  totalRevenue: number;
  trekCount: number;
  recentBookings: {
    bookingId: string;
    customerName: string;
    trekTitle: string;
    grandTotal: number;
    paymentStatus: string;
  }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics", { method: "POST" })
      .then((r) => r.json())
      .then(setData)
      .catch(() =>
        setData({
          totalBookings: 0,
          paidBookings: 0,
          totalRevenue: 0,
          trekCount: 6,
          recentBookings: [],
        })
      );
  }, []);

  const stats = [
    {
      label: "Total Bookings",
      value: data?.totalBookings ?? "—",
      icon: Calendar,
      color: "text-blue-500",
    },
    {
      label: "Paid Bookings",
      value: data?.paidBookings ?? "—",
      icon: Users,
      color: "text-primary",
    },
    {
      label: "Revenue",
      value: data ? `₹${data.totalRevenue.toLocaleString("en-IN")}` : "—",
      icon: IndianRupee,
      color: "text-secondary",
    },
    {
      label: "Active Treks",
      value: data?.trekCount ?? "—",
      icon: Mountain,
      color: "text-purple-500",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">{label}</span>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 dark:text-white">
            Recent Bookings
          </h2>
          <Link href="/admin/bookings" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        {data?.recentBookings?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b dark:border-gray-700">
                  <th className="pb-3 pr-4">ID</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Trek</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentBookings.map((b) => (
                  <tr key={b.bookingId} className="border-b dark:border-gray-700/50">
                    <td className="py-3 pr-4 font-mono text-xs">{b.bookingId}</td>
                    <td className="py-3 pr-4">{b.customerName}</td>
                    <td className="py-3 pr-4">{b.trekTitle}</td>
                    <td className="py-3 pr-4">₹{b.grandTotal}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          b.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No bookings yet.</p>
        )}
      </div>
    </div>
  );
}
