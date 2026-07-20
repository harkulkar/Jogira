"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

const QUICK_REPLIES: Record<string, string> = {
  "Upcoming Treks":
    "We have exciting treks every weekend! Visit our Trips & Treks page or check Harishchandragad, Kalsubai, and Rajmachi.",
  "Trek Prices":
    "Our treks start from ₹999. Prices vary by difficulty and duration. Browse individual trek pages for exact pricing.",
  "Custom Trip":
    "We organize custom trips for groups of 10+. Share your preferred dates and destination via Contact form or WhatsApp!",
  "Group Booking":
    "Group bookings get special discounts! Contact us with your group size and preferred trek for a custom quote.",
  "Contact Us":
    `Reach us at ${SITE_CONFIG.phone} or ${SITE_CONFIG.email}. We're happy to help!`,
};

const BUTTONS = [
  "Upcoming Treks",
  "Trek Prices",
  "Custom Trip",
  "Group Booking",
  "Contact Us",
  "Talk to Human",
];

export default function WhatsAppChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<
    { from: "bot" | "user"; text: string }[]
  >([]);
  const [bookingDetails, setBookingDetails] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("jogira-checkout");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setBookingDetails(
          `Trek: ${data.trekTitle}, Participants: ${data.participants}, Total: ₹${data.total}`
        );
      } catch {
        /* ignore */
      }
    }
  }, [open]);

  const greet = () => {
    setMessages([
      {
        from: "bot",
        text: "👋 Welcome to our Trekking Community!\n\nHow can I help you today?",
      },
    ]);
  };

  const handleOpen = () => {
    setOpen(true);
    if (messages.length === 0) greet();
  };

  const handleQuickReply = (label: string) => {
    if (label === "Talk to Human") {
      let text = "Hi, I'd like to speak with someone about trekking.";
      if (bookingDetails) text += `\n\nMy booking details:\n${bookingDetails}`;
      window.open(
        `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(text)}`,
        "_blank"
      );
      return;
    }

    setMessages((prev) => [
      ...prev,
      { from: "user", text: label },
      { from: "bot", text: QUICK_REPLIES[label] },
    ]);
  };

  return (
    <>
      <motion.button
        onClick={handleOpen}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
        aria-label="WhatsApp chat"
      >
        <MessageCircle className="w-7 h-7" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[340px] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border dark:border-gray-700"
          >
            <div className="bg-[#25D366] text-white px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold">{SITE_CONFIG.name}</p>
                <p className="text-xs text-white/80">Typically replies instantly</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-72 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm whitespace-pre-line ${
                      msg.from === "user"
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm shadow"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t dark:border-gray-700 flex flex-wrap gap-2">
              {BUTTONS.map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleQuickReply(btn)}
                  className="text-xs px-3 py-1.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  {btn}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
