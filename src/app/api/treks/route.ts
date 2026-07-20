import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Trek } from "@/models/Trek";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/types";
import { z } from "zod";

const trekSchema = z.object({
  title: z.string().min(1),
  location: z.string().min(1),
  price: z.number().positive(),
  duration: z.string().min(1),
  elevation: z.string().min(1),
  difficulty: z.enum(["Easy", "Moderate", "Hard", "Expert"]),
  distance: z.string().min(1),
  bestSeason: z.string().min(1),
  pickupPoint: z.string().min(1),
  description: z.string().min(1),
  shortDescription: z.string().min(1),
  itinerary: z.array(z.object({ time: z.string(), activity: z.string() })),
  included: z.array(z.string()),
  excluded: z.array(z.string()),
  thingsToCarry: z.array(z.string()),
  gallery: z.array(z.string()),
  image: z.string().url(),
  mapEmbedUrl: z.string().optional(),
  availableSeats: z.number().int().positive().default(20),
  featured: z.boolean().optional(),
  availableDates: z.array(z.string()).default([]),
});

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const difficulty = searchParams.get("difficulty");
    const duration = searchParams.get("duration");
    const location = searchParams.get("location");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const featured = searchParams.get("featured");

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
      ];
    }
    if (difficulty) filter.difficulty = difficulty;
    if (duration) filter.duration = { $regex: duration, $options: "i" };
    if (location) filter.location = { $regex: location, $options: "i" };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice) (filter.price as Record<string, number>).$lte = Number(maxPrice);
    }
    if (featured === "true") filter.featured = true;

    const treks = await Trek.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(treks);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch treks" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = trekSchema.parse(body);
    await connectDB();

    let slug = slugify(data.title);
    const existing = await Trek.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const trek = await Trek.create({ ...data, slug });
    return NextResponse.json(trek, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create trek" },
      { status: 500 }
    );
  }
}
