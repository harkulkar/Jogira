export type Difficulty = "Easy" | "Moderate" | "Hard" | "Expert";

export interface Trek {
  _id: string;
  title: string;
  slug: string;
  location: string;
  price: number;
  duration: string;
  elevation: string;
  difficulty: Difficulty;
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
  reviews: { name: string; rating: number; comment: string; date: string }[];
}

export interface BookingFormData {
  customerName: string;
  phone: string;
  email: string;
  emergencyContact: string;
  address: string;
  couponCode?: string;
}

export interface CheckoutSession {
  trekId: string;
  trekTitle: string;
  trekSlug: string;
  price: number;
  participants: number;
  image: string;
  selectedDate?: string;
}

export interface TrekFilters {
  search?: string;
  difficulty?: string;
  duration?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Easy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Moderate:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Hard: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  Expert: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export const FAQ_ITEMS = [
  {
    question: "What should I carry for a trek?",
    answer:
      "Carry comfortable trekking shoes, water (2L minimum), raincoat, cap, sunscreen, personal medicines, and a small backpack. A detailed list is provided on each trek page.",
  },
  {
    question: "Are treks suitable for beginners?",
    answer:
      "Yes! We offer Easy and Moderate treks perfect for first-timers. Check the difficulty badge on each trek card.",
  },
  {
    question: "What is the cancellation policy?",
    answer:
      "Cancellations 7+ days before the trek receive a full refund. 3-6 days: 50% refund. Less than 3 days: no refund.",
  },
  {
    question: "Is food included?",
    answer:
      "Most treks include breakfast and lunch. Check the 'Included' section on each trek detail page.",
  },
  {
    question: "How do I reach the pickup point?",
    answer:
      "Pickup points are listed on each trek page. We also share exact location via WhatsApp after booking.",
  },
];

export const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "Amazing experience! The trek leaders were professional and the views were breathtaking.",
  },
  {
    name: "Rahul Patel",
    location: "Pune",
    rating: 5,
    text: "Best weekend getaway. Well organized, safe, and absolutely worth every rupee.",
  },
  {
    name: "Ananya Desai",
    location: "Thane",
    rating: 4,
    text: "Loved the Harishchandragad trek. Great group, good food, and unforgettable sunrise!",
  },
];
