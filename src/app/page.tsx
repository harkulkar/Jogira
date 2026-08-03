import { connectDB } from "@/lib/mongodb";
import { Trek as TrekModel } from "@/models/Trek";
import { SEED_TREKS } from "@/lib/seed-data";
import Hero from "@/components/home/Hero";
import TrekCard from "@/components/treks/TrekCard";
import FAQ from "@/components/home/FAQ";
import { TESTIMONIALS, Trek } from "@/types";
import { Star } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

async function getFeaturedTreks(): Promise<Trek[]> {
  try {
    await connectDB();
    const treks = await TrekModel.find({ featured: true }).limit(6).lean();
    if (treks.length > 0) {
      return JSON.parse(JSON.stringify(treks));
    }
  } catch {
    /* fallback to seed data */
  }
  return SEED_TREKS.filter((t) => t.featured).slice(0, 6) as unknown as Trek[];
}

export default async function HomePage() {
  const featuredTreks = await getFeaturedTreks();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Jogira Trek",
    description:
      "Premium weekend treks and adventure tours in the Sahyadri mountains",
    url: process.env.NEXT_PUBLIC_APP_URL,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: "500",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />

      <section id="treks" className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Popular Treks & Adventures
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Handpicked weekend getaways in the majestic Sahyadri range
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTreks.map((trek, i) => (
              <TrekCard key={trek._id || trek.slug} trek={trek} index={i} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/treks">
              <Button variant="outline" size="lg">
                View All Treks
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface-muted dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
            What Trekkers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-card"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 fill-secondary text-secondary"
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                  &ldquo;{t.text}&rdquo;
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {t.name}
                </p>
                <p className="text-sm text-gray-500">{t.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ />
    </>
  );
}
