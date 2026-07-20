"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (trekId: string) => void;
  isWishlisted: (trekId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("jogira-wishlist");
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  const toggleWishlist = useCallback((trekId: string) => {
    setWishlist((prev) => {
      const next = prev.includes(trekId)
        ? prev.filter((id) => id !== trekId)
        : [...prev, trekId];
      localStorage.setItem("jogira-wishlist", JSON.stringify(next));
      return next;
    });
  }, []);

  const isWishlisted = useCallback(
    (trekId: string) => wishlist.includes(trekId),
    [wishlist]
  );

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, isWishlisted }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
