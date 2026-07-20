"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { TrekFilters } from "@/types";

interface TrekFiltersBarProps {
  onFilter: (filters: TrekFilters) => void;
  locations: string[];
}

export default function TrekFiltersBar({
  onFilter,
  locations,
}: TrekFiltersBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const applyFilters = () => {
    onFilter({
      search: search || undefined,
      difficulty: difficulty || undefined,
      duration: duration || undefined,
      location: location || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  };

  const clearFilters = () => {
    setSearch("");
    setDifficulty("");
    setDuration("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    onFilter({});
  };

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search treks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            className="w-full pl-10 pr-4 py-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filters
        </button>
        <button
          onClick={applyFilters}
          className="px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors"
        >
          Search
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4 rounded-xl bg-surface-muted dark:bg-gray-800">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Hard">Hard</option>
            <option value="Expert">Expert</option>
          </select>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700"
          >
            <option value="">All Durations</option>
            <option value="3">Half Day</option>
            <option value="6">Full Day</option>
            <option value="12">Overnight</option>
          </select>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700"
          />
          <button
            onClick={clearFilters}
            className="sm:col-span-2 lg:col-span-5 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-primary"
          >
            <X className="w-4 h-4" /> Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
