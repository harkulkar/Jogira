"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Clock, Heart, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { Trek, formatCurrency, DIFFICULTY_COLORS } from "@/types";
import { useWishlist } from "@/context/WishlistContext";

interface TrekCardProps {
  trek: Trek;
  index?: number;
}

export default function TrekCard({ trek, index = 0 }: TrekCardProps) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(trek._id);

  const handleShare = async () => {
    const url = `${window.location.origin}/treks/${trek.slug}`;
    if (navigator.share) {
      await navigator.share({ title: trek.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={trek.image}
          alt={trek.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${DIFFICULTY_COLORS[trek.difficulty]}`}
        >
          {trek.difficulty}
        </span>
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={() => {
              toggleWishlist(trek._id);
              toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
            }}
            className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 hover:scale-110 transition-transform"
            aria-label="Wishlist"
          >
            <Heart
              className={`w-4 h-4 ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`}
            />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 hover:scale-110 transition-transform"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
          {trek.title}
        </h3>
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-2">
          <MapPin className="w-4 h-4" />
          {trek.location}
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
          {trek.shortDescription}
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Clock className="w-4 h-4" />
          {trek.duration}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            {formatCurrency(trek.price)}
          </span>
          <Link href={`/treks/${trek.slug}`}>
            <Button size="sm">See Details</Button>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
