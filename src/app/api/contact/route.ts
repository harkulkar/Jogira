import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ContactMessage } from "@/models/ContactMessage";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  subject: z.string().min(3),
  message: z.string().min(10),
});

const newsletterSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const type = body.type as string;

    if (type === "newsletter") {
      const { email } = newsletterSchema.parse(body);
      await connectDB();
      // Store in a simple collection or log for demo
      console.log("Newsletter subscription:", email);
      return NextResponse.json({ success: true, message: "Subscribed!" });
    }

    const data = contactSchema.parse(body);
    await connectDB();
    await ContactMessage.create(data);
    return NextResponse.json({
      success: true,
      message: "Message sent! We will contact you soon.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to submit" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(JSON.parse(JSON.stringify(messages)));
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}
