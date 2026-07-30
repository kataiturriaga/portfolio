"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { skyGradients } from "@/data/weather";
import { useSky } from "./SkyProvider";

const rand = (i: number, salt: number) =>
  (((i + 1) * 9301 + (salt + 1) * 49297) % 233280) / 233280;

export default function Sky() {
  const { moment, condition } = useSky();
  const reduced = useReducedMotion();
  const key = `${moment}-${condition}`;

  return (
    <div className="sky" aria-hidden="true">
      <AnimatePresence initial={false}>
        <motion.div
          key={key}
          className="sky__layer"
          style={{ background: skyGradients[moment][condition] }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {!reduced && moment === "noche" && condition === "despejado" && (
        <div className="sky__stars">
          {Array.from({ length: 70 }, (_, i) => (
            <span
              key={i}
              style={{
                left: `${rand(i, 1) * 100}%`,
                top: `${rand(i, 2) * 62}%`,
                animationDelay: `${rand(i, 3) * 4}s`,
                opacity: 0.35 + rand(i, 4) * 0.6,
              }}
            />
          ))}
        </div>
      )}

      {!reduced && condition !== "despejado" && (
        <>
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className="sky__cloud"
              style={{
                left: `${-20 + rand(i, 5) * 110}%`,
                top: `${rand(i, 6) * 45}%`,
                width: `${220 + rand(i, 7) * 280}px`,
                height: `${70 + rand(i, 8) * 60}px`,
                animationDuration: `${70 + rand(i, 9) * 60}s`,
                animationDelay: `${-rand(i, 10) * 70}s`,
              }}
            />
          ))}
        </>
      )}

      {!reduced && condition === "lluvia" && (
        <div className="sky__precip">
          {Array.from({ length: 60 }, (_, i) => (
            <span
              key={i}
              className="sky__drop"
              style={{
                left: `${rand(i, 11) * 100}%`,
                animationDuration: `${0.7 + rand(i, 12) * 0.6}s`,
                animationDelay: `${-rand(i, 13) * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {!reduced && condition === "nieve" && (
        <div className="sky__precip">
          {Array.from({ length: 45 }, (_, i) => (
            <span
              key={i}
              className="sky__flake"
              style={{
                left: `${rand(i, 14) * 100}%`,
                animationDuration: `${5 + rand(i, 15) * 6}s`,
                animationDelay: `${-rand(i, 16) * 10}s`,
                opacity: 0.4 + rand(i, 17) * 0.5,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
