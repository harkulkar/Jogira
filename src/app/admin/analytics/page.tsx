"use client";

import { useEffect, useState } from "react";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<{
    totalBookings: number;
    paidBookings: number;
    totalRevenue: number;
    trekCount: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics", { method: "POST" })
      .then((r) => r.json())
      .then(setData)
      .catch(() => null);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Analytics
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold mb-4">Booking Overview</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Bookings</span>
              <span className="font-bold">{data?.totalBookings ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Conversion Rate</span>
              <span className="font-bold">
                {data && data.totalBookings
                  ? `${Math.round((data.paidBookings / data.totalBookings) * 100)}%`
                  : "0%"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Avg. Revenue/Booking</span>
              <span className="font-bold">
                ₹
                {data && data.paidBookings
                  ? Math.round(data.totalRevenue / data.paidBookings).toLocaleString(
                      "en-IN"
                    )
                  : 0}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold mb-4">Revenue</h2>
          <p className="text-4xl font-bold text-primary">
            ₹{(data?.totalRevenue ?? 0).toLocaleString("en-IN")}
          </p>
          <p className="text-sm text-gray-500 mt-2">Total paid bookings revenue</p>
        </div>
      </div>
    </div>
  );
}
