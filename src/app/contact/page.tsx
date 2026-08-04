"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { Mail, Phone, MapPin } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export default function ContactPage() {
  const isValidPhoneNumber = (phone: string) => /^\d{10}$/.test(phone);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    };

    if (!isValidPhoneNumber(payload.phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        const errorMessage = Array.isArray(data.error)
          ? data.error[0]?.message
          : data.error;
        toast.error(errorMessage || "Failed to send message");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Contact Us
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Have questions? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-card space-y-4"
          >
            {[
              { key: "name", label: "Name", type: "text" },
              { key: "email", label: "Email", type: "email" },
              { key: "phone", label: "Phone", type: "tel" },
              { key: "subject", label: "Subject", type: "text" },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1">{label}</label>
                <input
                  type={type}
                  required
                  value={form[key as keyof typeof form]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [key]:
                        key === "phone"
                          ? e.target.value.replace(/\D/g, "").slice(0, 10)
                          : e.target.value,
                    })
                  }
                  inputMode={key === "phone" ? "numeric" : undefined}
                  maxLength={key === "phone" ? 10 : undefined}
                  pattern={key === "phone" ? "\\d{10}" : undefined}
                  className="w-full px-4 py-3 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {key === "phone" && (
                  <p className="mt-1 text-xs text-gray-500">
                    Enter exactly 10 digits.
                  </p>
                )}
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </form>

          <div className="space-y-6">
            {[
              { icon: Mail, label: "Email", value: SITE_CONFIG.email },
              { icon: Phone, label: "Phone", value: SITE_CONFIG.phone },
              { icon: MapPin, label: "Location", value: SITE_CONFIG.location },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-start gap-4 p-6 rounded-2xl bg-surface-muted dark:bg-gray-800"
              >
                <Icon className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
                  <p className="text-gray-600 dark:text-gray-300">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
