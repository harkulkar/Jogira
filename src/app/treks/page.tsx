"use client";

import { useEffect, useState, useCallback } from "react";
import TrekCard from "@/components/treks/TrekCard";
import TrekFiltersBar from "@/components/treks/TrekFiltersBar";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { Trek, TrekFilters } from "@/types";
import { SEED_TREKS } from "@/lib/seed-data";

export default function TreksPage() {
  const [treks, setTreks] = useState<Trek[]>([]);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<string[]>([]);

  const fetchTreks = useCallback(async (filters: TrekFilters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== "") params.set(k, String(v));
      });
      const res = await fetch(`/api/treks?${params}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setTreks(data);
        setLocations([...new Set(data.map((t: Trek) => t.location))]);
      } else {
        let filtered = SEED_TREKS as unknown as Trek[];
        if (filters.search) {
          const q = filters.search.toLowerCase();
          filtered = filtered.filter(
            (t) =>
              t.title.toLowerCase().includes(q) ||
              t.location.toLowerCase().includes(q)
          );
        }
        if (filters.difficulty)
          filtered = filtered.filter((t) => t.difficulty === filters.difficulty);
        if (filters.location)
          filtered = filtered.filter((t) =>
            t.location.toLowerCase().includes(filters.location!.toLowerCase())
          );
        if (filters.minPrice)
          filtered = filtered.filter((t) => t.price >= filters.minPrice!);
        if (filters.maxPrice)
          filtered = filtered.filter((t) => t.price <= filters.maxPrice!);
        setTreks(filtered);
        setLocations([...new Set(filtered.map((t) => t.location))]);
      }
    } catch {
      const seed = SEED_TREKS as unknown as Trek[];
      setTreks(seed);
      setLocations([...new Set(seed.map((t) => t.location))]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTreks();
  }, [fetchTreks]);

  return (
    <div className="pt-24 pb-16 bg-white dark:bg-gray-950 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Trips & Treks
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover your next adventure in the Sahyadri mountains
          </p>
        </div>

        <TrekFiltersBar onFilter={fetchTreks} locations={locations} />

        {loading ? (
          <PageSkeleton />
        ) : treks.length === 0 ? (
          <p className="text-center text-gray-500 py-12">
            No treks found. Try adjusting your filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {treks.map((trek, i) => (
              <TrekCard key={trek._id || trek.slug} trek={trek} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
