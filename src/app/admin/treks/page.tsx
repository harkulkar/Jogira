"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Trek } from "@/types";
import { SEED_TREKS } from "@/lib/seed-data";

export default function AdminTreksPage() {
  const [treks, setTreks] = useState<Trek[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTreks = () => {
    fetch("/api/treks")
      .then((r) => r.json())
      .then((data) => {
        setTreks(Array.isArray(data) && data.length ? data : (SEED_TREKS as unknown as Trek[]));
      })
      .catch(() => setTreks(SEED_TREKS as unknown as Trek[]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTreks();
  }, []);

  const deleteTrek = async (id: string) => {
    if (!confirm("Delete this trek?")) return;
    try {
      const res = await fetch(`/api/treks/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Trek deleted");
        fetchTreks();
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Treks</h1>
        <Link href="/admin/treks/new">
          <Button size="sm">
            <Plus className="w-4 h-4" /> Add Trek
          </Button>
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr className="text-left text-gray-500">
                <th className="p-4">Title</th>
                <th className="p-4">Location</th>
                <th className="p-4">Price</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4">Seats</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {treks.map((trek) => (
                <tr key={trek._id} className="border-t dark:border-gray-700">
                  <td className="p-4 font-medium">{trek.title}</td>
                  <td className="p-4">{trek.location}</td>
                  <td className="p-4">₹{trek.price}</td>
                  <td className="p-4">{trek.difficulty}</td>
                  <td className="p-4">{trek.availableSeats}</td>
                  <td className="p-4 flex gap-2">
                    <Link href={`/admin/treks/${trek._id}/edit`}>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <Pencil className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => deleteTrek(trek._id)}
                      className="p-2 hover:bg-red-50 text-red-500 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
