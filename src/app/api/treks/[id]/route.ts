import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Trek } from "@/models/Trek";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/types";
import { z } from "zod";

const trekUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  duration: z.string().min(1).optional(),
  elevation: z.string().min(1).optional(),
  difficulty: z.enum(["Easy", "Moderate", "Hard", "Expert"]).optional(),
  distance: z.string().min(1).optional(),
  bestSeason: z.string().min(1).optional(),
  pickupPoint: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  shortDescription: z.string().min(1).optional(),
  itinerary: z
    .array(z.object({ time: z.string(), activity: z.string() }))
    .optional(),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  thingsToCarry: z.array(z.string()).optional(),
  gallery: z.array(z.string()).optional(),
  image: z.string().url().optional(),
  mapEmbedUrl: z.string().optional(),
  availableSeats: z.number().int().positive().optional(),
  featured: z.boolean().optional(),
  availableDates: z.array(z.string()).optional(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await connectDB();

    const trek =
      (await Trek.findOne({ slug: id }).lean()) ||
      (await Trek.findById(id).lean());

    if (!trek) {
      return NextResponse.json({ error: "Trek not found" }, { status: 404 });
    }

    return NextResponse.json(trek);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch trek" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const data = trekUpdateSchema.parse(body);
    await connectDB();

    const update: Record<string, unknown> = { ...data };
    if (data.title) update.slug = slugify(data.title);

    const trek = await Trek.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!trek) {
      return NextResponse.json({ error: "Trek not found" }, { status: 404 });
    }

    return NextResponse.json(trek);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update trek" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectDB();
    const trek = await Trek.findByIdAndDelete(id);

    if (!trek) {
      return NextResponse.json({ error: "Trek not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete trek" },
      { status: 500 }
    );
  }
}
