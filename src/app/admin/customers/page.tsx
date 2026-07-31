"use client";

import { useEffect, useState } from "react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookings: number;
  totalSpent: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((bookings) => {
        if (!Array.isArray(bookings)) return;
        const map = new Map<string, Customer>();
        bookings.forEach(
          (b: {
            customerName: string;
            email: string;
            phone: string;
            grandTotal: number;
            paymentStatus: string;
          }) => {
            const key = [b.email || "no-email", b.phone || "no-phone", b.customerName || "unknown"]
              .map((value) => value.trim().toLowerCase())
              .join("|");
            const existing = map.get(key);
            if (existing) {
              existing.bookings += 1;
              if (b.paymentStatus === "paid")
                existing.totalSpent += b.grandTotal;
            } else {
              map.set(key, {
                id: key,
                name: b.customerName,
                email: b.email,
                phone: b.phone,
                bookings: 1,
                totalSpent: b.paymentStatus === "paid" ? b.grandTotal : 0,
              });
            }
          }
        );
        setCustomers(Array.from(map.values()));
      })
      .catch(() => setCustomers([]));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Customer List
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
        {customers.length === 0 ? (
          <p className="p-6 text-gray-500">No customers yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr className="text-left text-gray-500">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Bookings</th>
                <th className="p-4">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-t dark:border-gray-700">
                  <td className="p-4">{c.name}</td>
                  <td className="p-4">{c.email}</td>
                  <td className="p-4">{c.phone}</td>
                  <td className="p-4">{c.bookings}</td>
                  <td className="p-4">₹{c.totalSpent.toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
