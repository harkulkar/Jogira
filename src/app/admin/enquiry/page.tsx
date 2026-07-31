"use client";

import { useEffect, useState } from "react";

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function AdminEnquiryPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((data) => {
        setEnquiries(Array.isArray(data) ? data : []);
      })
      .catch(() => setEnquiries([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Enquiry
      </h1>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-gray-800">
        {loading ? (
          <p className="p-6 text-gray-500">Loading enquiries...</p>
        ) : enquiries.length === 0 ? (
          <p className="p-6 text-gray-500">No enquiries yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr className="text-left text-gray-500">
                <th className="p-4">Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Message</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enquiry) => (
                <tr key={enquiry._id} className="border-t dark:border-gray-700">
                  <td className="p-4 font-medium">{enquiry.name}</td>
                  <td className="p-4">
                    <p>{enquiry.email}</p>
                    <p className="text-xs text-gray-500">{enquiry.phone}</p>
                  </td>
                  <td className="p-4">{enquiry.subject}</td>
                  <td className="max-w-md p-4 text-gray-600 dark:text-gray-300">
                    {enquiry.message}
                  </td>
                  <td className="p-4 text-xs">
                    {new Date(enquiry.createdAt).toLocaleString("en-IN")}
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
