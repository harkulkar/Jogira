"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CheckCircle, Star } from "lucide-react";
import Button from "@/components/ui/Button";
import { HERO_IMAGE, SITE_CONFIG } from "@/lib/constants";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen min-h-[600px] overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="Sahyadri mountains"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-6 left-6 md:top-8 md:left-12 flex items-center"
        >
          <Image
            src="/logo.png"
            alt="Jogira Logo"
            width={200}
            height={100}
            className="h-24 w-auto object-contain drop-shadow-2xl"
            priority
          />
          {/* <span className="text-4xl font-bold text-blue drop-shadow-lg">
    Jogira
</span> */}

        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-100 mb-4 max-w-4xl"
        >
          {SITE_CONFIG.tagline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl text-gray-200 mb-8"
        >
          {SITE_CONFIG.subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/treks">
            <Button size="lg" className="text-lg px-10">
              Explore Treks
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-4 px-4 flex-wrap"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileInView={{ y: [0, -5, 0] }}
          viewport={{ once: false }}
          className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-gray-100"
        >
          <CheckCircle className="w-6 h-6 text-secondary" />
          <div className="text-left">
            <p className="font-bold text-lg">{SITE_CONFIG.stats.trekkers}</p>
            <p className="text-sm text-white/80">Happy Trekkers</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileInView={{ y: [0, -5, 0] }}
          viewport={{ once: false }}
          className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-gray-100"
        >
          <Star className="w-6 h-6 text-secondary fill-secondary" />
          <div className="text-left">
            <p className="font-bold text-lg">{SITE_CONFIG.stats.rating} Google Rating</p>
            <p className="text-sm text-white/80">Trusted by adventurers</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
