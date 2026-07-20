import { SITE_CONFIG } from "@/lib/constants";
import { TESTIMONIALS } from "@/types";
import { Shield, Award, Users, Mountain, Star } from "lucide-react";

export const metadata = {
  title: "About Us",
  description: "Learn about Jogira Treks - your trusted Sahyadri adventure partner.",
};

const WHY_CHOOSE = [
  {
    icon: Mountain,
    title: "Adventure Experience",
    desc: "10+ years organizing treks across Maharashtra's most scenic trails.",
  },
  {
    icon: Award,
    title: "Certified Trek Leaders",
    desc: "All our guides are certified in first aid and wilderness safety.",
  },
  {
    icon: Shield,
    title: "Safety Measures",
    desc: "Safety kits, route planning, and small group sizes on every trek.",
  },
  {
    icon: Users,
    title: "Community First",
    desc: "Join 500+ happy trekkers who trust us for their weekend adventures.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16">
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About Jogira Treks</h1>
          <p className="max-w-2xl mx-auto text-white/90">
            Born from a passion for the Sahyadri mountains, we create unforgettable
            trekking experiences for adventurers of all levels.
          </p>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Our Story
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Jogira Treks started in 2015 when a group of college friends decided
              to share their love for the Western Ghats with fellow Mumbaikars and
              Punekars seeking escape from city life.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Today, we&apos;ve guided over 500 trekkers through 100+ successful
              expeditions, from beginner-friendly fort treks to challenging
              multi-day camping adventures.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Happy Trekkers", value: SITE_CONFIG.stats.trekkers },
              { label: "Treks Completed", value: SITE_CONFIG.stats.treks },
              { label: "Google Rating", value: SITE_CONFIG.stats.rating },
              { label: "Years Experience", value: "10+" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-6 rounded-2xl bg-surface-muted dark:bg-gray-800 text-center"
              >
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface-muted dark:bg-gray-900">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-white dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-3 text-primary">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300">
              To make the beauty of Sahyadri accessible to everyone through safe,
              affordable, and well-organized trekking experiences that foster a love
              for nature and adventure.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-white dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-3 text-secondary">Our Vision</h2>
            <p className="text-gray-600 dark:text-gray-300">
              To become India&apos;s most trusted community-driven trekking platform,
              promoting sustainable tourism and environmental conservation in the
              Western Ghats.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_CHOOSE.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-card text-center"
            >
              <Icon className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">{title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-surface-muted dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
            Customer Testimonials
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-card"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  &ldquo;{t.text}&rdquo;
                </p>
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-gray-500">{t.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
