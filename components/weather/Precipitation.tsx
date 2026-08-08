"use client";

import { useEffect, useRef } from "react";
import type { SkyCondition } from "@/data/weather";

/**
 * Precipitación con Canvas 2D, emulando la app del Tiempo de iOS:
 * - La lluvia cae totalmente vertical, con profundidad (las gotas lejanas son
 *   más cortas, lentas y transparentes).
 * - Las cards actúan de suelo: la gota aterriza en su borde superior y rebota
 *   (arco expansivo + gotitas que saltan y caen). Solo en los huecos entre
 *   cards la lluvia llega hasta el fondo. Los elementos con [data-sky-ledge]
 *   son superficie de aterrizaje.
 * - Con `light` (movimiento reducido) hay menos partículas y más lentas, y el
 *   rebote se simplifica a un arco suave.
 */

type Drop = { x: number; y: number; z: number };
type Splash = { x: number; y: number; life: number };
type Droplet = { x: number; y: number; vx: number; vy: number; floor: number; life: number };
type Flake = {
  x: number;
  y: number;
  r: number;
  speed: number;
  phase: number;
  sway: number;
  alpha: number;
};
type Ledge = { left: number; right: number; top: number };

const LEDGE_SELECTOR = "[data-sky-ledge]";
const GRAVITY = 900; // px/s² para las gotitas del rebote

export default function Precipitation({
  condition,
  light = false,
}: {
  condition: Extract<SkyCondition, "lluvia" | "nieve">;
  /** Versión ligera para prefers-reduced-motion: menos partículas, más lentas */
  light?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    // Bordes superiores de las cards visibles (coordenadas de viewport: el
    // canvas es fijo, así que getBoundingClientRect ya viene en su sistema)
    let ledges: Ledge[] = [];
    const collectLedges = () => {
      ledges = [];
      for (const el of document.querySelectorAll(LEDGE_SELECTOR)) {
        const r = el.getBoundingClientRect();
        if (r.width < 24 || r.bottom < 0 || r.top > h) continue;
        ledges.push({ left: r.left + 6, right: r.right - 6, top: r.top });
      }
    };

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      collectLedges();
    };
    resize();

    // Leer los rects es costoso (fuerza reflow), así que en vez de hacerlo en
    // cada evento de scroll se marca el estado como sucio y se relee una sola
    // vez por frame, justo antes de dibujar.
    let ledgesDirty = false;
    const markDirty = () => {
      ledgesDirty = true;
    };
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", markDirty, { passive: true });
    // Cubre lo que el scroll no ve: cambio de ruta, imágenes que cargan,
    // <details> que se despliega... todo lo que mueva las cards.
    const ro = new ResizeObserver(markDirty);
    ro.observe(document.body);

    /** Primera superficie que la partícula encontraría cayendo desde y. */
    const landingBelow = (x: number, y: number): number => {
      let land = h;
      for (const l of ledges) {
        if (x >= l.left && x <= l.right && l.top > y && l.top < land) {
          land = l.top;
        }
      }
      return land;
    };

    const isRain = condition === "lluvia";
    const density = light ? 2.6 : 1; // divisor de partículas en modo ligero
    const speedMul = light ? 0.55 : 1;
    const count = Math.min(
      isRain ? 170 : 130,
      Math.floor((w * h) / ((isRain ? 11000 : 14000) * density)),
    );

    const drops: Drop[] = [];
    const splashes: Splash[] = [];
    const droplets: Droplet[] = [];
    const flakes: Flake[] = [];

    if (isRain) {
      for (let i = 0; i < count; i++) {
        const x = Math.random() * w;
        // Spawn solo por encima de su superficie de aterrizaje: nunca dentro de una card
        const land = landingBelow(x, -60);
        drops.push({
          x,
          y: -60 + Math.random() * (land + 60),
          z: 0.35 + Math.random() * 0.65,
        });
      }
    } else {
      for (let i = 0; i < count; i++) {
        const x = Math.random() * w;
        const land = landingBelow(x, -30);
        flakes.push({
          x,
          y: -30 + Math.random() * (land + 30),
          r: 0.8 + Math.random() * 2.4,
          speed: (26 + Math.random() * 48) * speedMul,
          phase: Math.random() * Math.PI * 2,
          sway: (14 + Math.random() * 36) * (light ? 0.5 : 1),
          alpha: 0.35 + Math.random() * 0.55,
        });
      }
    }

    let raf = 0;
    let last = performance.now();
    let t = 0;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      if (ledgesDirty) {
        collectLedges();
        ledgesDirty = false;
      }
      ctx.clearRect(0, 0, w, h);

      if (isRain) {
        ctx.lineCap = "round";
        for (const d of drops) {
          const vy = (620 + 780 * d.z) * speedMul;
          const prevY = d.y;
          d.y += vy * dt;

          const len = 10 + 26 * d.z;
          // La superficie se busca desde la posición ANTERIOR: si se usa la
          // nueva, al cruzar el borde en un salto el ledge deja de estar "por
          // debajo" y la gota tunela a través de la card
          const landing = landingBelow(d.x, prevY);

          if (d.y >= landing) {
            // Tramo final: la gota toca la superficie antes de aterrizar
            ctx.strokeStyle = `rgba(255, 255, 255, ${(0.08 + 0.3 * d.z).toFixed(3)})`;
            ctx.lineWidth = 0.8 + d.z * 1.1;
            ctx.beginPath();
            ctx.moveTo(d.x, landing - len);
            ctx.lineTo(d.x, landing);
            ctx.stroke();

            // Aterriza: la card (o el fondo) actúa de suelo
            if (d.z > 0.5 && Math.random() < (light ? 0.35 : 0.55)) {
              splashes.push({ x: d.x, y: landing, life: 0 });
              if (!light && d.z > 0.7) {
                // Gotitas que rebotan como si la card fuese un suelo
                const n = 2 + Math.floor(Math.random() * 2);
                for (let k = 0; k < n; k++) {
                  droplets.push({
                    x: d.x,
                    y: landing - 1,
                    vx: (Math.random() - 0.5) * 90,
                    vy: -(90 + Math.random() * 110),
                    floor: landing,
                    life: 0,
                  });
                }
              }
            }
            d.y = -len - Math.random() * 80;
            d.x = Math.random() * w;
            continue;
          }

          ctx.strokeStyle = `rgba(255, 255, 255, ${(0.08 + 0.3 * d.z).toFixed(3)})`;
          ctx.lineWidth = 0.8 + d.z * 1.1;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y - len);
          ctx.lineTo(d.x, d.y);
          ctx.stroke();
        }

        // Arcos expansivos sobre la superficie
        ctx.lineWidth = 1.4;
        for (let i = splashes.length - 1; i >= 0; i--) {
          const s = splashes[i];
          s.life += dt;
          const p = s.life / 0.38;
          if (p >= 1) {
            splashes.splice(i, 1);
            continue;
          }
          const r = 1 + s.life * 90;
          ctx.strokeStyle = `rgba(255, 255, 255, ${(0.5 * (1 - p)).toFixed(3)})`;
          ctx.beginPath();
          // Media elipse hacia arriba: rebota sobre el borde de la superficie
          ctx.ellipse(s.x, s.y, r, r * 0.38, 0, Math.PI, Math.PI * 2);
          ctx.stroke();
        }

        // Gotitas con física: saltan y vuelven a caer al borde
        for (let i = droplets.length - 1; i >= 0; i--) {
          const g = droplets[i];
          g.life += dt;
          g.vy += GRAVITY * dt;
          g.x += g.vx * dt;
          g.y += g.vy * dt;
          if (g.y >= g.floor || g.life > 0.6) {
            droplets.splice(i, 1);
            continue;
          }
          ctx.fillStyle = `rgba(255, 255, 255, ${(0.6 * (1 - g.life / 0.6)).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(g.x, g.y, 1.3, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        for (const f of flakes) {
          const prevY = f.y;
          f.y += f.speed * dt;
          f.x += 8 * speedMul * dt; // deriva lenta
          const x = f.x + Math.sin(t * 0.9 + f.phase) * f.sway;

          // El copo desaparece al tocar una card o el fondo (superficie
          // calculada desde la posición anterior, igual que la lluvia)
          if (f.y >= landingBelow(x, prevY)) {
            f.y = -f.r - Math.random() * 20;
            f.x = Math.random() * w;
            continue;
          }
          if (f.x - f.sway > w) f.x = -f.sway;

          ctx.fillStyle = `rgba(255, 255, 255, ${f.alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, f.y, f.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", markDirty);
    };
  }, [condition, light]);

  return <canvas ref={canvasRef} className="sky__fx-canvas" />;
}
