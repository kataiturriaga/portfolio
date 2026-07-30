"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function CityHeader({
  over,
  name,
  big,
  unit,
  condition,
  hiLo,
}: {
  over?: string;
  name: string;
  big: string;
  unit?: string;
  condition: string;
  hiLo?: string;
}) {
  const { scrollY } = useScroll();
  const bigOpacity = useTransform(scrollY, [40, 240], [1, 0]);
  const compactOpacity = useTransform(scrollY, [200, 280], [0, 1]);

  return (
    <>
      <header className="city-header">
        {over ? <p className="city-header__over">{over}</p> : null}
        <h1 className="city-header__name">{name}</h1>
        <motion.p className="city-header__big" style={{ opacity: bigOpacity }}>
          {big}
          {unit ? <sup>{unit}</sup> : null}
        </motion.p>
        <motion.p className="city-header__condition" style={{ opacity: bigOpacity }}>
          {condition}
        </motion.p>
        {hiLo ? (
          <motion.p className="city-header__hilo" style={{ opacity: bigOpacity }}>
            {hiLo}
          </motion.p>
        ) : null}
      </header>
      <motion.div className="city-compact" style={{ opacity: compactOpacity }}>
        <strong>{name}</strong>
        <span>
          {big}
          {unit} · {condition}
        </span>
      </motion.div>
    </>
  );
}
