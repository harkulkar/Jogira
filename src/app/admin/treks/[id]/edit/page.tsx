"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { Plus, Trash2 } from "lucide-react";

export default function EditTrekPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState<any>(null);
  const [tempGalleryInput, setTempGalleryInput] = useState("");
  const [tempIncludedInput, setTempIncludedInput] = useState("");
  const [tempExcludedInput, setTempExcludedInput] = useState("");
  const [tempThingsToCarryInput, setTempThingsToCarryInput] = useState("");
  const [tempDateInput, setTempDateInput] = useState("");

  const addGalleryImage = () => {
    if (tempGalleryInput.trim() && form) {
      setForm({
        ...form,
        gallery: [...form.gallery, tempGalleryInput.trim()],
      });
      setTempGalleryInput("");
    }
  };

  const removeGalleryImage = (index: number) => {
    if (form) {
      setForm({
        ...form,
        gallery: form.gallery.filter((_: string, i: number) => i !== index),
      });
    }
  };

  const addIncludedItem = () => {
    if (tempIncludedInput.trim() && form) {
      setForm({
        ...form,
        included: [...form.included, tempIncludedInput.trim()],
      });
      setTempIncludedInput("");
    }
  };

  const removeIncludedItem = (index: number) => {
    if (form) {
      setForm({
        ...form,
        included: form.included.filter((_: string, i: number) => i !== index),
      });
    }
  };

  const addExcludedItem = () => {
    if (tempExcludedInput.trim() && form) {
      setForm({
        ...form,
        excluded: [...form.excluded, tempExcludedInput.trim()],
      });
      setTempExcludedInput("");
    }
  };

  const removeExcludedItem = (index: number) => {
    if (form) {
      setForm({
        ...form,
        excluded: form.excluded.filter((_: string, i: number) => i !== index),
      });
    }
  };

  const addThingsToCarryItem = () => {
    if (tempThingsToCarryInput.trim() && form) {
      setForm({
        ...form,
        thingsToCarry: [...form.thingsToCarry, tempThingsToCarryInput.trim()],
      });
      setTempThingsToCarryInput("");
    }
  };

  const removeThingsToCarryItem = (index: number) => {
    if (form) {
      setForm({
        ...form,
        thingsToCarry: form.thingsToCarry.filter((_: string, i: number) => i !== index),
      });
    }
  };

  const addItineraryItem = () => {
    if (form) {
      setForm({
        ...form,
        itinerary: [...form.itinerary, { time: "", activity: "" }],
      });
    }
  };

  const updateItineraryItem = (index: number, field: "time" | "activity", value: string) => {
    if (form) {
      const newItinerary = [...form.itinerary];
      newItinerary[index] = { ...newItinerary[index], [field]: value };
      setForm({ ...form, itinerary: newItinerary });
    }
  };

  const removeItineraryItem = (index: number) => {
    if (form) {
      setForm({
        ...form,
        itinerary: form.itinerary.filter((_: any, i: number) => i !== index),
      });
    }
  };

  const addDate = () => {
    if (tempDateInput.trim() && form) {
      setForm({
        ...form,
        availableDates: [...(form.availableDates || []), tempDateInput.trim()],
      });
      setTempDateInput("");
    }
  };

  const removeDate = (index: number) => {
    if (form) {
      setForm({
        ...form,
        availableDates: (form.availableDates || []).filter((_: string, i: number) => i !== index),
      });
    }
  };

  useEffect(() => {
    const fetchTrek = async () => {
      try {
        const res = await fetch(`/api/treks/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setForm(data);
        } else {
          toast.error("Failed to fetch trek");
          router.push("/admin/treks");
        }
      } catch {
        toast.error("Failed to fetch trek");
        router.push("/admin/treks");
      } finally {
        setFetching(false);
      }
    };

    fetchTrek();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/treks/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Trek updated!");
        router.push("/admin/treks");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update trek");
      }
    } catch {
      toast.error("Failed to update trek");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-gray-900 dark:text-white">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Edit Trek
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
              value={String(form[key as keyof typeof form] || "")}
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
            {form.gallery?.map((url: string, index: number) => (
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
            {(!form.gallery || form.gallery.length === 0) && (
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
            {form.included?.map((item: string, index: number) => (
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
            {form.excluded?.map((item: string, index: number) => (
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
            {form.thingsToCarry?.map((item: string, index: number) => (
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
            {form.itinerary?.map((item: any, index: number) => (
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
            {(form.availableDates || []).map((date: string, index: number) => (
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
            {(!form.availableDates || form.availableDates.length === 0) && (
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

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Trek"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/treks")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
