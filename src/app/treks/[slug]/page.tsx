"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Mountain,
  Route,
  Calendar,
  MapPinned,
  Minus,
  Plus,
  Star,
  Check,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { Trek, formatCurrency, DIFFICULTY_COLORS } from "@/types";
import { SEED_TREKS } from "@/lib/seed-data";

export default function TrekDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [trek, setTrek] = useState<Trek | null>(null);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/treks/${slug}`);
        if (res.ok) {
          setTrek(await res.json());
        } else {
          const found = SEED_TREKS.find((t) => t.slug === slug);
          setTrek((found as unknown as Trek) || null);
        }
      } catch {
        const found = SEED_TREKS.find((t) => t.slug === slug);
        setTrek((found as unknown as Trek) || null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-24 pb-16 container mx-auto px-4 animate-pulse">
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-8" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      </div>
    );
  }

  if (!trek) {
    return (
      <div className="pt-24 pb-16 text-center">
        <h1 className="text-2xl font-bold">Trek not found</h1>
      </div>
    );
  }

  const images = [trek.image, ...(trek.gallery || [])];
  const total = trek.price * participants;

  const handleProceed = () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    const session = {
      trekId: trek._id,
      trekTitle: trek.title,
      trekSlug: trek.slug,
      price: trek.price,
      participants,
      image: trek.image,
      total,
      selectedDate,
    };
    sessionStorage.setItem("jogira-checkout", JSON.stringify(session));
    router.push(`/checkout?trek=${trek.slug}&participants=${participants}`);
  };

  const infoCards = [
    { icon: Clock, label: "Duration", value: trek.duration },
    { icon: Mountain, label: "Elevation", value: trek.elevation },
    { icon: Route, label: "Difficulty", value: trek.difficulty },
    { icon: MapPin, label: "Distance", value: trek.distance },
    { icon: Calendar, label: "Best Season", value: trek.bestSeason },
    { icon: MapPinned, label: "Pickup Point", value: trek.pickupPoint },
  ];

  return (
    <div className="pt-20 pb-16 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        {/* Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
          <div className="relative h-72 lg:h-[450px] rounded-2xl overflow-hidden">
            <Image
              src={images[activeImage]}
              alt={trek.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {images.slice(0, 6).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative h-24 lg:h-[140px] rounded-xl overflow-hidden border-2 transition-colors ${
                  activeImage === i ? "border-primary" : "border-transparent"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="200px" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${DIFFICULTY_COLORS[trek.difficulty]}`}
              >
                {trek.difficulty}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {trek.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="w-5 h-5" />
                {trek.location}
              </div>
              <p className="text-2xl font-bold text-primary mt-4">
                {formatCurrency(trek.price)}{" "}
                <span className="text-sm font-normal text-gray-500">/ person</span>
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3">About This Trek</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {trek.description}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {infoCards.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="p-4 rounded-xl bg-surface-muted dark:bg-gray-800"
                >
                  <Icon className="w-5 h-5 text-primary mb-2" />
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="font-semibold text-sm">{value}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" /> Included
                </h3>
                <ul className="space-y-2">
                  {trek.included.map((item, i) => (
                    <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <X className="w-5 h-5 text-secondary" /> Not Included
                </h3>
                <ul className="space-y-2">
                  {trek.excluded.map((item, i) => (
                    <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex gap-2">
                      <X className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-3">Things to Carry</h3>
              <div className="flex flex-wrap gap-2">
                {trek.thingsToCarry.map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Schedule / Itinerary</h3>
              <div className="space-y-4">
                {trek.itinerary.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex gap-4"
                  >
                    <div className="w-24 shrink-0 text-sm font-semibold text-primary">
                      {item.time}
                    </div>
                    <div className="flex-1 pb-4 border-l-2 border-primary/20 pl-4 text-sm text-gray-600 dark:text-gray-300">
                      {item.activity}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {trek.mapEmbedUrl && (
              <div>
                <h3 className="font-bold mb-4">Location</h3>
                <iframe
                  src={trek.mapEmbedUrl}
                  className="w-full h-64 rounded-2xl border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Trek location map"
                />
              </div>
            )}

            {trek.reviews && trek.reviews.length > 0 && (
              <div>
                <h3 className="font-bold mb-4">Reviews</h3>
                <div className="space-y-4">
                  {trek.reviews.map((review, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-surface-muted dark:bg-gray-800"
                    >
                      <div className="flex gap-1 mb-2">
                        {Array.from({ length: review.rating }).map((_, j) => (
                          <Star key={j} className="w-4 h-4 fill-secondary text-secondary" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {review.comment}
                      </p>
                      <p className="text-xs text-gray-500">
                        {review.name} · {review.date}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 rounded-2xl bg-surface-muted dark:bg-gray-800 shadow-card">
            <h3 className="text-lg font-bold mb-6">Book This Trek</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Select Date</label>
              {trek.availableDates && trek.availableDates.length > 0 ? (
                <div className="space-y-2">
                  {trek.availableDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`w-full px-4 py-2 rounded-lg border text-left transition-all ${
                        selectedDate === date
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary"
                      }`}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No dates available yet</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Participants</label>
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => setParticipants(Math.max(1, participants - 1))}
                  className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow hover:bg-gray-50"
                  aria-label="Decrease participants"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-2xl font-bold w-8 text-center">{participants}</span>
                <button
                  onClick={() => setParticipants(Math.min(20, participants + 1))}
                  className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow hover:bg-gray-50"
                  aria-label="Increase participants"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Minimum: 1 · Maximum: 20
              </p>
            </div>

              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Price</span>
                  <span>{formatCurrency(trek.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Participants</span>
                  <span>{participants}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t dark:border-gray-700">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>

              <Button size="lg" className="w-full" onClick={handleProceed}>
                Proceed to Book
              </Button>

              <p className="text-xs text-gray-500 text-center mt-3">
                {trek.availableSeats} seats available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
