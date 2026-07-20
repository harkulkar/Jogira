export const SITE_CONFIG = {
  name: "Jogira Treks",
  tagline: "Explore the Beauty of Sahyadri",
  subtitle: "Weekend Treks | Camping | Adventure Tours",
  description:
    "Premium weekend treks, camping, and adventure tours in the Sahyadri mountains. Certified trek leaders, safety-first approach, 500+ happy trekkers.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://jogira-treks.vercel.app",
  email: "hello@jogira.com",
  phone: "+91 98765 43210",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210",
  social: {
    instagram: "https://instagram.com/jogiratreks",
    facebook: "https://facebook.com/jogiratreks",
    youtube: "https://youtube.com/@jogiratreks",
  },
  stats: {
    trekkers: "500+",
    treks: "100+",
    rating: "4+",
  },
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/treks", label: "Trips & Treks" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const HERO_IMAGE =
  "https://res.cloudinary.com/cdslxffp/image/upload/v1783600202/35389b36d8a6d11f7f564aa77738322f_rqqfoc.jpg"