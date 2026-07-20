"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#333",
          color: "#fff",
          borderRadius: "12px",
        },
        success: { iconTheme: { primary: "#2E7D32", secondary: "#fff" } },
        error: { iconTheme: { primary: "#FF9800", secondary: "#fff" } },
      }}
    />
  );
}
