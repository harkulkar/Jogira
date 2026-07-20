"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { Plus, Trash2 } from "lucide-react";

const emptyTrek: {
  title: string;
  location: string;
  price: number;
  duration: string;
  elevation: string;
  difficulty: string;
  distance: string;
  bestSeason: string;
  pickupPoint: string;
  description: string;
  shortDescription: string;
  itinerary: { time: string; activity: string }[];
  included: string[];
  excluded: string[];
  thingsToCarry: string[];
  gallery: string[];
  image: string;
  mapEmbedUrl: string;
  availableSeats: number;
  featured: boolean;
  availableDates: string[];
} = {
  title: "",
  location: "",
  price: 999,
  duration: "1 Day",
  elevation: "3000 ft",
  difficulty: "Moderate",
  distance: "5 km",
  bestSeason: "Oct - Feb",
  pickupPoint: "",
  description: "",
  shortDescription: "",
  itinerary: [{ time: "6:00 AM", activity: "Start" }],
  included: ["Guide", "Breakfast"],
  excluded: ["Transport"],
  thingsToCarry: ["Shoes", "Water"],
  gallery: [],
  image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  mapEmbedUrl: "",
  availableSeats: 20,
  featured: false,
  availableDates: [],
};

export default function NewTrekPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyTrek);
  const [tempGalleryInput, setTempGalleryInput] = useState("");
  const [tempIncludedInput, setTempIncludedInput] = useState("");
  const [tempExcludedInput, setTempExcludedInput] = useState("");
  const [tempThingsToCarryInput, setTempThingsToCarryInput] = useState("");
  const [tempDateInput, setTempDateInput] = useState("");

  const addGalleryImage = () => {
    if (tempGalleryInput.trim()) {
      setForm({
        ...form,
        gallery: [...form.gallery, tempGalleryInput.trim()],
      });
      setTempGalleryInput("");
    }
  };

  const removeGalleryImage = (index: number) => {
    setForm({
      ...form,
      gallery: form.gallery.filter((_, i) => i !== index),
    });
  };

  const addIncludedItem = () => {
    if (tempIncludedInput.trim()) {
      setForm({
        ...form,
        included: [...form.included, tempIncludedInput.trim()],
      });
      setTempIncludedInput("");
    }
  };

  const removeIncludedItem = (index: number) => {
    setForm({
      ...form,
      included: form.included.filter((_, i) => i !== index),
    });
  };

  const addExcludedItem = () => {
    if (tempExcludedInput.trim()) {
      setForm({
        ...form,
        excluded: [...form.excluded, tempExcludedInput.trim()],
      });
      setTempExcludedInput("");
    }
  };

  const removeExcludedItem = (index: number) => {
    setForm({
      ...form,
      excluded: form.excluded.filter((_, i) => i !== index),
    });
  };

  const addThingsToCarryItem = () => {
    if (tempThingsToCarryInput.trim()) {
      setForm({
        ...form,
        thingsToCarry: [...form.thingsToCarry, tempThingsToCarryInput.trim()],
      });
      setTempThingsToCarryInput("");
    }
  };

  const removeThingsToCarryItem = (index: number) => {
    setForm({
      ...form,
      thingsToCarry: form.thingsToCarry.filter((_, i) => i !== index),
    });
  };

  const addItineraryItem = () => {
    setForm({
      ...form,
      itinerary: [...form.itinerary, { time: "", activity: "" }],
    });
  };

  const updateItineraryItem = (index: number, field: "time" | "activity", value: string) => {
    const newItinerary = [...form.itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setForm({ ...form, itinerary: newItinerary });
  };

  const removeItineraryItem = (index: number) => {
    setForm({
      ...form,
      itinerary: form.itinerary.filter((_, i) => i !== index),
    });
  };

  const addDate = () => {
    if (tempDateInput.trim()) {
      setForm({
        ...form,
        availableDates: [...form.availableDates, tempDateInput.trim()],
      });
      setTempDateInput("");
    }
  };

  const removeDate = (index: number) => {
    setForm({
      ...form,
      availableDates: form.availableDates.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/treks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Trek created!");
        router.push("/admin/treks");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create trek");
      }
    } catch {
      toast.error("Failed to create trek");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Add New Trek
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm space-y-6 max-w-2xl"
      >
        {[
          { key: "title", label: "Title" },
          { key: "location", label: "Location" },
          { key: "shortDescription", label: "Short Description" },
          { key: "pickupPoint", label: "Pickup Point" },
          { key: "image", label: "Main Image URL" },
          { key: "duration", label: "Duration" },
          { key: "elevation", label: "Elevation" },
          { key: "distance", label: "Distance" },
          { key: "bestSeason", label: "Best Season" },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">{label}</label>
            <input
              required={key !== "image"}
              value={String(form[key as keyof typeof form])}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        ))}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Price (₹)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Available Seats</label>
            <input
              type="number"
              value={form.availableSeats}
              onChange={(e) =>
                setForm({ ...form, availableSeats: Number(e.target.value) })
              }
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Difficulty</label>
          <select
            value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option>Easy</option>
            <option>Moderate</option>
            <option>Hard</option>
            <option>Expert</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Description</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
            Gallery Images
          </label>
          <div className="flex gap-2 mb-4">
            <input
              type="url"
              value={tempGalleryInput}
              onChange={(e) => setTempGalleryInput(e.target.value)}
              placeholder="Enter image URL"
              onKeyPress={(e) => e.key === "Enter" && addGalleryImage()}
              className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <Button type="button" size="sm" onClick={addGalleryImage}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {form.gallery.map((url, index) => (
              <div key={index} className="flex gap-2 items-center">
                <img
                  src={url}
                  alt={`Gallery ${index + 1}`}
                  className="w-16 h-16 object-cover rounded border"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                <span className="text-sm text-gray-600 dark:text-gray-300 truncate flex-1">
                  {url}
                </span>
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {form.gallery.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No gallery images yet
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
            Included Items
          </label>
          <div className="flex gap-2 mb-4">
            <input
              value={tempIncludedInput}
              onChange={(e) => setTempIncludedInput(e.target.value)}
              placeholder="Add included item"
              onKeyPress={(e) => e.key === "Enter" && addIncludedItem()}
              className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <Button type="button" size="sm" onClick={addIncludedItem}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {form.included.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300 flex-1">
                  {item}
                </span>
                <button
                  type="button"
                  onClick={() => removeIncludedItem(index)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
            Excluded Items
          </label>
          <div className="flex gap-2 mb-4">
            <input
              value={tempExcludedInput}
              onChange={(e) => setTempExcludedInput(e.target.value)}
              placeholder="Add excluded item"
              onKeyPress={(e) => e.key === "Enter" && addExcludedItem()}
              className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <Button type="button" size="sm" onClick={addExcludedItem}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {form.excluded.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300 flex-1">
                  {item}
                </span>
                <button
                  type="button"
                  onClick={() => removeExcludedItem(index)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
            Things to Carry
          </label>
          <div className="flex gap-2 mb-4">
            <input
              value={tempThingsToCarryInput}
              onChange={(e) => setTempThingsToCarryInput(e.target.value)}
              placeholder="Add item to carry"
              onKeyPress={(e) => e.key === "Enter" && addThingsToCarryItem()}
              className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <Button type="button" size="sm" onClick={addThingsToCarryItem}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {form.thingsToCarry.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300 flex-1">
                  {item}
                </span>
                <button
                  type="button"
                  onClick={() => removeThingsToCarryItem(index)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
            Schedule / Itinerary
          </label>
          <Button type="button" size="sm" onClick={addItineraryItem} className="mb-4">
            <Plus className="w-4 h-4 mr-2" />
            Add Schedule Item
          </Button>
          <div className="space-y-4">
            {form.itinerary.map((item, index) => (
              <div key={index} className="flex gap-2 items-start">
                <input
                  value={item.time}
                  onChange={(e) => updateItineraryItem(index, "time", e.target.value)}
                  placeholder="Time"
                  className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <input
                  value={item.activity}
                  onChange={(e) => updateItineraryItem(index, "activity", e.target.value)}
                  placeholder="Activity"
                  className="flex-2 px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <button
                  type="button"
                  onClick={() => removeItineraryItem(index)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
            Available Dates
          </label>
          <div className="flex gap-2 mb-4">
            <input
              type="date"
              value={tempDateInput}
              onChange={(e) => setTempDateInput(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <Button type="button" size="sm" onClick={addDate}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {form.availableDates.map((date, index) => (
              <div key={index} className="flex gap-2 items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300 flex-1">
                  {date}
                </span>
                <button
                  type="button"
                  onClick={() => removeDate(index)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {form.availableDates.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No dates added yet
              </p>
            )}
          </div>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Featured trek</span>
        </label>

        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Trek"}
        </Button>
      </form>
    </div>
  );
}
