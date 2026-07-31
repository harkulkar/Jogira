"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Instagram, MessageCircle, Phone, MapPin } from "lucide-react";
import Button from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "newsletter", email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setEmail("");
      } else {
        toast.error("Subscription failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="bg-primary py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-3 text-3xl font-bold text-white">
          Join Our Adventure Community
        </h2>
        <p className="mx-auto mb-8 max-w-md text-white/80">
          Get exclusive trek updates, early-bird discounts, and adventure tips.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <Button
            type="submit"
            variant="secondary"
            disabled={loading}
            className="whitespace-nowrap"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-white">
          <a
            href={SITE_CONFIG.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="transition-opacity hover:opacity-80"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="transition-opacity hover:opacity-80"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
          <a
            href={`tel:${SITE_CONFIG.phone}`}
            aria-label="Phone"
            className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Phone className="h-5 w-5" />
            <span>{SITE_CONFIG.phone}</span>
          </a>
          <div aria-label="Location" className="inline-flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span>{SITE_CONFIG.location}</span>
          </div>
        </div>
        <p className="mt-6 text-sm text-white/80">
          &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
        </p>
      </div>
    </section>
  );
}
