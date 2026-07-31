import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.png"
                alt="Jogira Logo"
                width={64}
                height={64}
                className="h-12 w-auto object-contain"
                priority
              />
              <span className="text-xl font-bold text-white">
                {SITE_CONFIG.name}
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Premium weekend treks and adventure tours in the Sahyadri mountains.
              Your gateway to unforgettable experiences.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/treks" className="hover:text-secondary transition-colors">Trips</Link></li>
              <li><Link href="/treks" className="hover:text-secondary transition-colors">Treks</Link></li>
              <li><Link href="/privacy" className="hover:text-secondary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-secondary transition-colors">Terms</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex gap-4">
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="group"
                title="Instagram"
              >
                <Instagram className="w-5 h-5 hover:text-secondary transition-colors" />
              </a>
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="group"
                title="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 hover:text-secondary transition-colors" />
              </a>
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                aria-label="Phone"
                className="group"
                title={SITE_CONFIG.phone}
              >
                <Phone className="w-5 h-5 hover:text-secondary transition-colors" />
              </a>
              <div
                aria-label="Location"
                className="group"
                title={SITE_CONFIG.location}
              >
                <MapPin className="w-5 h-5 hover:text-secondary transition-colors" />
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <p>{SITE_CONFIG.phone}</p>
              <p>{SITE_CONFIG.location}</p>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-light" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-secondary">{SITE_CONFIG.email}</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-light" />
                <a href={`tel:${SITE_CONFIG.phone}`} className="hover:text-secondary">
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-light" />
                <span>{SITE_CONFIG.location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
