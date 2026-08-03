export const SITE_CONFIG = {
  name: "Jogira",
  tagline: "Explore the Beauty of Sahyadri",
  subtitle: "Weekend Treks | Camping | Adventure Tours",
  description:
    "Premium weekend treks, camping, and adventure tours in the Sahyadri mountains. Certified trek leaders, safety-first approach, 500+ happy trekkers.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://jogiratrek.vercel.app",
  email: "jogiratrek@gmail.com",
  phone: "+91 6355 085 583",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "916355085583",
  location: "Pune",
  social: {
    instagram:
      "https://www.instagram.com/_jogira_?igsh=enVscnhxb3hjcHA%3D&utm_source=qr",
    facebook: "https://facebook.com/jogiratreks",
    youtube: "https://youtube.com/@jogiratreks",
    maps: "https://maps.app.goo.gl/fnQ8jjQZCFqc4QY67",
  },
  stats: {
    trekkers: "500+",
    treks: "50+",
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
