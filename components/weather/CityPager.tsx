"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cityRoutes } from "@/data/weather";

export default function CityPager({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const touch = useRef<{ x: number; y: number } | null>(null);

  const goTo = useCallback(
    (delta: number) => {
      const routes = cityRoutes();
      const index = routes.findIndex((r) => r.href === pathname);
      if (index === -1) return;
      const next = routes[index + delta];
      if (next) router.push(next.href);
    },
    [pathname, router],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === "ArrowRight") goTo(1);
      if (e.key === "ArrowLeft") goTo(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo]);

  return (
    <motion.div
      key={pathname}
      className="city-screen"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      onTouchStart={(e) => {
        touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        if (!touch.current) return;
        const dx = e.changedTouches[0].clientX - touch.current.x;
        const dy = e.changedTouches[0].clientY - touch.current.y;
        touch.current = null;
        if (Math.abs(dx) > 70 && Math.abs(dy) < 50) goTo(dx < 0 ? 1 : -1);
      }}
    >
      {children}
    </motion.div>
  );
}
