import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITrek extends Document {
  title: string;
  slug: string;
  location: string;
  price: number;
  duration: string;
  elevation: string;
  difficulty: "Easy" | "Moderate" | "Hard" | "Expert";
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
  createdAt: Date;
  updatedAt: Date;
}

const TrekSchema = new Schema<ITrek>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    elevation: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Moderate", "Hard", "Expert"],
      required: true,
    },
    distance: { type: String, required: true },
    bestSeason: { type: String, required: true },
    pickupPoint: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    itinerary: [{ time: String, activity: String }],
    included: [String],
    excluded: [String],
    thingsToCarry: [String],
    gallery: [String],
    image: { type: String, required: true },
    mapEmbedUrl: { type: String, default: "" },
    availableSeats: { type: Number, default: 20 },
    featured: { type: Boolean, default: false },
    availableDates: { type: [String], default: [] },
    reviews: [
      {
        name: String,
        rating: Number,
        comment: String,
        date: String,
      },
    ],
  },
  { timestamps: true }
);

export const Trek: Model<ITrek> =
  mongoose.models.Trek || mongoose.model<ITrek>("Trek", TrekSchema);
