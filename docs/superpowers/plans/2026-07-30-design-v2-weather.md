# Design V2 (app del Tiempo) — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar todo el portfolio como una app del Tiempo de iOS (spec: `docs/superpowers/specs/2026-07-30-design-v2-weather-design.md`), conservando el contenido sustantivo de `data/`.

**Architecture:** Un cielo global fijo (contexto React + localStorage, 16 variantes de degradado con capa ambiental animada) bajo todas las rutas actuales. Componentes nuevos en `components/weather/`; las páginas se migran ruta a ruta (home → caso → índice → procesos) manteniendo el build en verde en cada commit; los componentes de periódico se borran cuando su ruta queda migrada.

**Tech Stack:** Next 16 (App Router, este fork tiene breaking changes — consultar `node_modules/next/dist/docs/` ante cualquier duda), React 19, Tailwind v4 vía PostCSS (aquí casi todo es CSS propio en `styles/weather.css`), framer-motion 12, TypeScript.

## Global Constraints

- **Next 16 de este repo:** `params` en páginas dinámicas es `Promise<{ slug: string }>` y se accede con `await` (patrón existente en `app/casos/[slug]/page.tsx`). `themeColor` va en `export const viewport: Viewport`, NUNCA en `metadata` (deprecado). Leer `node_modules/next/dist/docs/` antes de usar una API que no aparezca en este plan.
- **Idioma:** todo el copy visible en castellano. Textos sustantivos de `data/` se conservan literalmente salvo donde este plan indique la adaptación.
- **Sin emoji en la UI final:** iconos = SVG inline de `WeatherIcon`.
- **Texto sobre el cielo siempre blanco**, jerarquía por opacidad. Tarjetas: blanco ~10% + `backdrop-filter: blur`, radio 20px.
- **`prefers-reduced-motion`:** sin partículas ni animación ambiental (usar `useReducedMotion` de framer-motion + media query CSS).
- **Verificación por tarea:** `npm run build` y `npm run lint` en verde antes de cada commit. No hay framework de tests unitarios; no añadir uno.
- **Commits:** estilo del repo (`feat(weather): …`, `style(weather): …`, `chore(weather): …`) con el trailer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- **Rama:** todo en `design-v2`. No tocar `main`.

## Estructura de archivos (mapa completo)

```
data/weather.ts                          ← NUEVO: tipos de cielo, degradados, labels, meteo por proyecto, rutas de ciudades
data/home.ts                             ← MODIFICAR: copy adaptado a la metáfora (Task 3)
styles/weather.css                       ← NUEVO: todo el CSS del rediseño
components/weather/SkyProvider.tsx       ← NUEVO: contexto momento/condición + localStorage
components/weather/Sky.tsx               ← NUEVO: fondo fijo + capas ambientales
components/weather/SkyControls.tsx       ← NUEVO: segmented controls
components/weather/WeatherIcon.tsx       ← NUEVO: set de iconos SVG
components/weather/GlassCard.tsx         ← NUEVO: tarjeta glass con cabecera
components/weather/CityHeader.tsx        ← NUEVO: cabecera de ciudad con compresión al scroll
components/weather/BottomBar.tsx         ← NUEVO: barra inferior mapa/puntos/lista
components/weather/CityPager.tsx         ← NUEVO: swipe + teclado entre ciudades
components/weather/home/WeatherHome.tsx  ← NUEVO: home completa
components/weather/home/TrajectoryStrip.tsx ← NUEVO: previsión por horas (timeline)
components/weather/home/ContactCard.tsx  ← NUEVO: contacto con click-to-copy
components/weather/caso/CaseCity.tsx     ← NUEVO: página de caso completa
app/layout.tsx                           ← REESCRIBIR (Task 1)
app/page.tsx                             ← REESCRIBIR (Task 3)
app/casos/[slug]/page.tsx                ← REESCRIBIR (Task 4)
app/casos/page.tsx                       ← REESCRIBIR (Task 5)
app/procesos/page.tsx                    ← REESCRIBIR (Task 6)
app/procesos/[slug]/page.tsx             ← REESCRIBIR (Task 6)
app/globals.css                          ← Task 1: añade import; Task 7: reescritura final limpia
components/home/, components/casos/, components/processes/, components/site/  ← BORRAR según se migra su ruta
styles/tokens.css, src/tokens.ts         ← BORRAR en Task 7 si nada los referencia
```

---

### Task 1: Cimientos — datos del cielo, Sky, SkyControls, WeatherIcon y layout nuevo

**Files:**
- Create: `data/weather.ts`
- Create: `components/weather/WeatherIcon.tsx`
- Create: `components/weather/SkyProvider.tsx`
- Create: `components/weather/Sky.tsx`
- Create: `components/weather/SkyControls.tsx`
- Create: `styles/weather.css`
- Modify: `app/layout.tsx` (reescritura completa)
- Modify: `app/globals.css:1-2` (añadir import de weather.css)

**Interfaces:**
- Consumes: nada (tarea raíz).
- Produces:
  - `data/weather.ts`: `type DayMoment = "amanecer" | "dia" | "atardecer" | "noche"`, `type SkyCondition = "despejado" | "nubes" | "lluvia" | "nieve"`, `dayMoments: { id: DayMoment; label: string }[]`, `skyConditions: { id: SkyCondition; label: string }[]`, `skyGradients: Record<DayMoment, Record<SkyCondition, string>>`, `defaultMoment(hour: number): DayMoment`, `projectWeather: Record<string, { icon: WeatherIconName; label: string }>` (clave = `client` del proyecto), `cityRoutes(): { href: string; label: string }[]`.
  - `WeatherIcon.tsx`: `type WeatherIconName` y componente `WeatherIcon({ name, size?, className? })`.
  - `SkyProvider.tsx`: `SkyProvider` (default) y hook `useSky(): { moment, condition, setMoment, setCondition }`.
  - `Sky.tsx` / `SkyControls.tsx`: componentes default sin props.
  - CSS: clases `.weather-body`, `.sky`, `.sky__layer`, `.sky__stars`, `.sky__cloud`, `.sky__drop`, `.sky__flake`, `.sky-controls`, `.seg`, `.glass-card`, `.glass-card__head`, `.city-header`, `.city-compact`, `.weather-shell`, `.small-grid`, `.bottom-bar` (las de tarjetas/cabecera/barra las consumen Tasks 2+).

- [ ] **Step 1: Crear `data/weather.ts`**

```ts
import type { WeatherIconName } from "@/components/weather/WeatherIcon";
import { casos } from "./casos";

export type DayMoment = "amanecer" | "dia" | "atardecer" | "noche";
export type SkyCondition = "despejado" | "nubes" | "lluvia" | "nieve";

export const dayMoments: { id: DayMoment; label: string }[] = [
  { id: "amanecer", label: "Amanecer" },
  { id: "dia", label: "Día" },
  { id: "atardecer", label: "Atardecer" },
  { id: "noche", label: "Noche" },
];

export const skyConditions: { id: SkyCondition; label: string }[] = [
  { id: "despejado", label: "Despejado" },
  { id: "nubes", label: "Nubes" },
  { id: "lluvia", label: "Lluvia" },
  { id: "nieve", label: "Nieve" },
];

export const skyGradients: Record<DayMoment, Record<SkyCondition, string>> = {
  amanecer: {
    despejado: "linear-gradient(180deg, #2e3a59 0%, #7c6a8e 38%, #e8927c 72%, #f7c59f 100%)",
    nubes: "linear-gradient(180deg, #3a4159 0%, #6b6478 40%, #a58a8e 75%, #c9a9a0 100%)",
    lluvia: "linear-gradient(180deg, #2b3247 0%, #4a4a5e 45%, #6d6472 78%, #8a7a7e 100%)",
    nieve: "linear-gradient(180deg, #4a5570 0%, #8a8ba3 45%, #c5b8c4 80%, #e8dcd8 100%)",
  },
  dia: {
    despejado: "linear-gradient(180deg, #1466c4 0%, #3d92e0 55%, #7fbbee 100%)",
    nubes: "linear-gradient(180deg, #4f7396 0%, #7793ab 55%, #a3b7c6 100%)",
    lluvia: "linear-gradient(180deg, #374c60 0%, #546a7e 55%, #758696 100%)",
    nieve: "linear-gradient(180deg, #6d849c 0%, #93a6b8 55%, #c2ccd6 100%)",
  },
  atardecer: {
    despejado: "linear-gradient(180deg, #2a2d52 0%, #7a4a76 42%, #d96d4f 78%, #f2a65a 100%)",
    nubes: "linear-gradient(180deg, #33314f 0%, #5f4a66 45%, #9c5f5c 80%, #c98a68 100%)",
    lluvia: "linear-gradient(180deg, #252940 0%, #494056 48%, #6e4f5c 80%, #8c6a63 100%)",
    nieve: "linear-gradient(180deg, #3d4263 0%, #6f6486 48%, #a884a0 82%, #d3b3b8 100%)",
  },
  noche: {
    despejado: "linear-gradient(180deg, #04081c 0%, #0e1936 55%, #1c2a50 100%)",
    nubes: "linear-gradient(180deg, #0a0f1f 0%, #1c2333 55%, #2e3648 100%)",
    lluvia: "linear-gradient(180deg, #070b16 0%, #141a28 55%, #222b3c 100%)",
    nieve: "linear-gradient(180deg, #0f1424 0%, #222a40 55%, #39435c 100%)",
  },
};

export function defaultMoment(hour: number): DayMoment {
  if (hour >= 6 && hour < 9) return "amanecer";
  if (hour >= 9 && hour < 19) return "dia";
  if (hour >= 19 && hour < 22) return "atardecer";
  return "noche";
}

/** Condición meteorológica asignada a cada proyecto (clave = client en data/home.ts). */
export const projectWeather: Record<string, { icon: WeatherIconName; label: string }> = {
  "El Método": { icon: "amanecer", label: "Amanecer despejado" },
  "Archivo Sur": { icon: "nube-sol", label: "Claros por la tarde" },
  Nexo: { icon: "niebla", label: "Niebla matinal" },
  Cancha: { icon: "sol", label: "Soleado" },
  Común: { icon: "nube", label: "Nubes altas" },
  "Taller 33": { icon: "nieve", label: "Nevada ligera" },
};

/** Iconos por status de proceso. */
export const processStatusWeather: Record<string, { icon: WeatherIconName; label: string }> = {
  Borrador: { icon: "nube", label: "Nublado" },
  Probado: { icon: "nube-sol", label: "Parcialmente despejado" },
  Estable: { icon: "sol", label: "Despejado" },
};

/** Rutas paginables con los puntos de la barra inferior: home + casos con página completa. */
export function cityRoutes(): { href: string; label: string }[] {
  return [
    { href: "/", label: "Kata Iturriaga" },
    ...casos.map((c) => ({ href: `/casos/${c.slug}`, label: c.title })),
  ];
}
```

- [ ] **Step 2: Crear `components/weather/WeatherIcon.tsx`**

Iconos de trazo estilo SF Symbols, `stroke="currentColor"`, sin relleno (salvo puntos).

```tsx
export type WeatherIconName =
  | "sol"
  | "luna"
  | "nube"
  | "nube-sol"
  | "lluvia"
  | "nieve"
  | "niebla"
  | "viento"
  | "brujula"
  | "mapa"
  | "lista"
  | "ubicacion"
  | "amanecer"
  | "termometro"
  | "ojo"
  | "campana"
  | "sobre"
  | "calendario"
  | "flecha";

const PATHS: Record<WeatherIconName, React.ReactNode> = {
  sol: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5 5l1.7 1.7M17.3 17.3 19 19M19 5l-1.7 1.7M6.7 17.3 5 19" />
    </>
  ),
  luna: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />,
  nube: <path d="M7 18h9a4 4 0 0 0 .8-7.9A5.5 5.5 0 0 0 6.2 12 3.5 3.5 0 0 0 7 18Z" />,
  "nube-sol": (
    <>
      <circle cx="16.5" cy="7.5" r="2.6" />
      <path d="M16.5 2.8v1M21.2 7.5h-1M19.8 4.2l-.7.7M19.8 10.8l-.7-.7" />
      <path d="M5.5 19h7.5a3.4 3.4 0 0 0 .7-6.7A4.7 4.7 0 0 0 4.8 14 3 3 0 0 0 5.5 19Z" />
    </>
  ),
  lluvia: (
    <>
      <path d="M7 15h9a4 4 0 0 0 .8-7.9A5.5 5.5 0 0 0 6.2 9 3.5 3.5 0 0 0 7 15Z" />
      <path d="M8.5 17.5 7.5 20M12.5 17.5l-1 2.5M16.5 17.5l-1 2.5" />
    </>
  ),
  nieve: (
    <>
      <path d="M7 14.5h9a4 4 0 0 0 .8-7.9A5.5 5.5 0 0 0 6.2 8.5 3.5 3.5 0 0 0 7 14.5Z" />
      <path d="M8.5 17.4h.01M12 19.4h.01M15.5 17.4h.01" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  niebla: <path d="M4 10h16M4 13.5h16M6.5 17h11" />,
  viento: <path d="M3.5 9h10a2.6 2.6 0 1 0-2.4-3.6M3.5 13h14.5a2.6 2.6 0 1 1-2.4 3.6M3.5 17H10" />,
  brujula: (
    <>
      <circle cx="12" cy="12" r="8.8" />
      <path d="m15.2 8.8-1.8 4.6-4.6 1.8 1.8-4.6Z" />
    </>
  ),
  mapa: <path d="m9 4.5-5 2v13l5-2 6 2 5-2v-13l-5 2Zm0 0v13m6-11v13" />,
  lista: <path d="M8.5 6.5H20M8.5 12H20M8.5 17.5H20M4 6.5h.01M4 12h.01M4 17.5h.01" strokeWidth="2" strokeLinecap="round" />,
  ubicacion: <path d="M20.5 3.5 3.8 10.2l7 2.6 2.6 7Z" />,
  amanecer: (
    <>
      <path d="M12 10.2a4 4 0 0 1 4 4M4 14.2h2.2M17.8 14.2H20M6.6 9l1.6 1.5M17.4 9l-1.6 1.5M12 5.6v2.2" />
      <path d="M3.5 18h17" />
    </>
  ),
  termometro: <path d="M10.5 13.8V5a1.8 1.8 0 0 1 3.6 0v8.8a3.6 3.6 0 1 1-3.6 0ZM12.3 9h2" />,
  ojo: (
    <>
      <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  campana: <path d="M12 4a5.2 5.2 0 0 1 5.2 5.2c0 5 1.8 6.3 1.8 6.3H5s1.8-1.3 1.8-6.3A5.2 5.2 0 0 1 12 4Zm-1.8 15a2 2 0 0 0 3.6 0" />,
  sobre: <path d="M3.5 6.5h17v11h-17Zm0 .5 8.5 6 8.5-6" />,
  calendario: <path d="M4.5 6.5h15V20h-15ZM4.5 10.5h15M8.5 4v3M15.5 4v3" />,
  flecha: <path d="M5 12h13m-5-6 6 6-6 6" />,
};

export default function WeatherIcon({
  name,
  size = 18,
  className,
}: {
  name: WeatherIconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
```

- [ ] **Step 3: Crear `components/weather/SkyProvider.tsx`**

```tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DayMoment,
  SkyCondition,
  defaultMoment,
} from "@/data/weather";

type SkyState = {
  moment: DayMoment;
  condition: SkyCondition;
  setMoment: (m: DayMoment) => void;
  setCondition: (c: SkyCondition) => void;
};

const SkyContext = createContext<SkyState | null>(null);
const STORAGE_KEY = "kata-sky-v2";

export default function SkyProvider({ children }: { children: React.ReactNode }) {
  const [moment, setMomentState] = useState<DayMoment>("noche");
  const [condition, setConditionState] = useState<SkyCondition>("despejado");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<SkyState>;
        if (saved.moment) setMomentState(saved.moment);
        if (saved.condition) setConditionState(saved.condition);
        return;
      }
    } catch {
      /* localStorage no disponible */
    }
    setMomentState(defaultMoment(new Date().getHours()));
  }, []);

  const persist = useCallback((m: DayMoment, c: SkyCondition) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ moment: m, condition: c }));
    } catch {
      /* sin persistencia */
    }
  }, []);

  const setMoment = useCallback(
    (m: DayMoment) => {
      setMomentState(m);
      persist(m, condition);
    },
    [condition, persist],
  );

  const setCondition = useCallback(
    (c: SkyCondition) => {
      setConditionState(c);
      persist(moment, c);
    },
    [moment, persist],
  );

  const value = useMemo(
    () => ({ moment, condition, setMoment, setCondition }),
    [moment, condition, setMoment, setCondition],
  );

  return <SkyContext.Provider value={value}>{children}</SkyContext.Provider>;
}

export function useSky(): SkyState {
  const ctx = useContext(SkyContext);
  if (!ctx) throw new Error("useSky debe usarse dentro de SkyProvider");
  return ctx;
}
```

- [ ] **Step 4: Crear `components/weather/Sky.tsx`**

Crossfade entre degradados con `AnimatePresence` y partículas deterministas (sin `Math.random` para evitar mismatch de hidratación).

```tsx
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
```

- [ ] **Step 5: Crear `components/weather/SkyControls.tsx`**

```tsx
"use client";

import { dayMoments, skyConditions } from "@/data/weather";
import { useSky } from "./SkyProvider";

export default function SkyControls() {
  const { moment, condition, setMoment, setCondition } = useSky();

  return (
    <div className="sky-controls">
      <div className="seg" role="group" aria-label="Momento del día">
        {dayMoments.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={moment === m.id}
            className={moment === m.id ? "is-active" : undefined}
            onClick={() => setMoment(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="seg" role="group" aria-label="Condición meteorológica">
        {skyConditions.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={condition === c.id}
            className={condition === c.id ? "is-active" : undefined}
            onClick={() => setCondition(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Crear `styles/weather.css`**

Todo el sistema visual del rediseño. Las clases de tarjetas/cabecera/barra se consumen desde la Task 2 en adelante.

```css
/* ============ Design V2 — app del Tiempo ============ */

.weather-body {
  background: #0b1530;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI",
    Inter, Roboto, sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

.weather-body ::selection {
  background: rgba(255, 255, 255, 0.9);
  color: #0b1530;
}

.weather-body :focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.9);
  outline-offset: 3px;
  border-radius: 6px;
}

/* ---- Cielo ---- */
.sky {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
}

.sky__layer {
  position: absolute;
  inset: 0;
}

.sky::after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.1);
  pointer-events: none;
}

.sky__stars {
  position: absolute;
  inset: 0;
}

.sky__stars span {
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: #fff;
  animation: star-twinkle 4s ease-in-out infinite;
}

@keyframes star-twinkle {
  50% {
    opacity: 0.15;
  }
}

.sky__cloud {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
  filter: blur(38px);
  animation: cloud-drift linear infinite;
}

@keyframes cloud-drift {
  from {
    transform: translateX(-30vw);
  }
  to {
    transform: translateX(110vw);
  }
}

.sky__precip {
  position: absolute;
  inset: 0;
}

.sky__drop {
  position: absolute;
  top: -30px;
  width: 1.5px;
  height: 22px;
  background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5));
  animation: drop-fall linear infinite;
}

@keyframes drop-fall {
  to {
    transform: translateY(110vh);
  }
}

.sky__flake {
  position: absolute;
  top: -12px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #fff;
  animation: flake-fall linear infinite;
}

@keyframes flake-fall {
  50% {
    margin-left: 18px;
  }
  to {
    transform: translateY(110vh);
  }
}

@media (prefers-reduced-motion: reduce) {
  .sky__stars,
  .sky__cloud,
  .sky__precip {
    display: none;
  }
}

/* ---- Controles del cielo ---- */
.sky-controls {
  position: fixed;
  top: 0.9rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 40;
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  justify-content: center;
  max-width: calc(100vw - 1.6rem);
}

.seg {
  display: flex;
  padding: 3px;
  border-radius: 999px;
  background: rgba(20, 25, 45, 0.42);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.seg button {
  cursor: pointer;
  padding: 0.32rem 0.72rem;
  border-radius: 999px;
  background: transparent;
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  transition: background 200ms ease, color 200ms ease;
}

.seg button.is-active {
  background: rgba(255, 255, 255, 0.28);
  color: #fff;
}

/* ---- Contenedor de página ---- */
.weather-shell {
  width: min(100%, 1120px);
  margin-inline: auto;
  padding: 6.2rem 1.1rem 7.5rem;
}

@media (min-width: 760px) {
  .weather-shell {
    padding-top: 7rem;
  }
}

/* ---- Cabecera de ciudad ---- */
.city-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem 0 2.2rem;
  text-shadow: 0 1px 12px rgba(0, 0, 0, 0.18);
}

.city-header__over {
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.78);
}

.city-header__name {
  margin: 0.2rem 0 0;
  font-size: clamp(2rem, 5vw, 2.6rem);
  font-weight: 400;
  letter-spacing: -0.01em;
}

.city-header__big {
  display: flex;
  align-items: flex-start;
  margin: 0.4rem 0 0.2rem;
  font-size: clamp(5.2rem, 13vw, 7.5rem);
  font-weight: 200;
  line-height: 1;
  letter-spacing: -0.02em;
}

.city-header__big sup {
  margin-top: 0.6rem;
  font-size: 0.35em;
  font-weight: 300;
}

.city-header__condition {
  font-size: 1.15rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.92);
}

.city-header__hilo {
  margin-top: 0.25rem;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
}

.city-compact {
  position: fixed;
  top: 3.6rem;
  left: 0;
  right: 0;
  z-index: 30;
  display: flex;
  justify-content: center;
  gap: 0.7rem;
  padding: 0.55rem 1rem;
  background: rgba(15, 20, 40, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.9rem;
  font-weight: 600;
  pointer-events: none;
}

.city-compact span {
  color: rgba(255, 255, 255, 0.75);
  font-weight: 400;
}

/* ---- Tarjetas glass ---- */
.glass-card {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  overflow: hidden;
}

.glass-card__head {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.75rem 1rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-card__body {
  padding: 0.9rem 1rem 1rem;
}

.glass-card--alert {
  background: rgba(255, 255, 255, 0.16);
}

.glass-card a {
  color: inherit;
}

/* ---- Rejillas ---- */
.card-stack {
  display: grid;
  gap: 0.9rem;
}

@media (min-width: 760px) {
  .card-stack {
    grid-template-columns: repeat(2, 1fr);
  }

  .card-stack > .span-2 {
    grid-column: 1 / -1;
  }
}

.small-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.9rem;
}

@media (min-width: 760px) {
  .small-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.small-card__value {
  font-size: 1.7rem;
  font-weight: 400;
  line-height: 1.15;
}

.small-card__note {
  margin-top: 0.35rem;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.75);
}

.small-card--ok .small-card__value {
  color: #7ef2a0;
}

/* ---- Filas de previsión (proyectos, listas) ---- */
.forecast-row {
  display: grid;
  grid-template-columns: minmax(90px, 1fr) 24px 2fr auto;
  align-items: center;
  gap: 0.8rem;
  padding: 0.75rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.95rem;
}

.forecast-row:first-child {
  border-top: 0;
}

.forecast-row__client {
  font-weight: 600;
}

.forecast-row__title {
  color: rgba(255, 255, 255, 0.85);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.forecast-row__year {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
}

a.forecast-row {
  transition: background 180ms ease;
  border-radius: 10px;
  padding-inline: 0.5rem;
  margin-inline: -0.5rem;
}

a.forecast-row:hover {
  background: rgba(255, 255, 255, 0.09);
}

/* ---- Franja horaria (trayectoria) ---- */
.hour-strip {
  display: flex;
  gap: 0.4rem;
  overflow-x: auto;
  padding-bottom: 0.4rem;
  scrollbar-width: none;
}

.hour-strip::-webkit-scrollbar {
  display: none;
}

.hour-strip button {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.45rem;
  min-width: 92px;
  padding: 0.7rem 0.5rem;
  border-radius: 14px;
  background: transparent;
  color: #fff;
  font-size: 0.72rem;
  transition: background 180ms ease;
}

.hour-strip button:hover {
  background: rgba(255, 255, 255, 0.08);
}

.hour-strip button.is-active {
  background: rgba(255, 255, 255, 0.18);
}

.hour-strip strong {
  font-size: 0.82rem;
  font-weight: 600;
}

.hour-detail {
  margin-top: 0.8rem;
  padding-top: 0.8rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
}

.hour-detail p {
  margin: 0 0 0.5rem;
  font-weight: 600;
}

.hour-detail ul {
  margin: 0;
  padding-left: 1.1rem;
  color: rgba(255, 255, 255, 0.82);
}

.hour-detail li {
  margin: 0.2rem 0;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.7rem;
}

.chip {
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  font-size: 0.68rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

/* ---- Prosa dentro de tarjetas ---- */
.card-prose p {
  max-width: 65ch;
  margin: 0 0 0.9rem;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.65;
}

.card-prose p:last-child {
  margin-bottom: 0;
}

.card-lead {
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.35;
}

/* ---- Barra inferior ---- */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 1.3rem calc(0.7rem + env(safe-area-inset-bottom));
  background: rgba(15, 20, 40, 0.45);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.bottom-bar a {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.85);
  transition: background 180ms ease;
}

.bottom-bar a:hover {
  background: rgba(255, 255, 255, 0.1);
}

.bottom-bar__dots {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.bottom-bar__dots a {
  width: auto;
  height: auto;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.5);
}

.bottom-bar__dots a.is-active {
  color: #fff;
}

.bottom-bar__dots .dot {
  display: block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}

/* ---- Página (transición de entrada) ---- */
.city-screen {
  min-height: 100vh;
}
```

- [ ] **Step 7: Reescribir `app/layout.tsx`**

```tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import SkyProvider from "@/components/weather/SkyProvider";
import Sky from "@/components/weather/Sky";
import SkyControls from "@/components/weather/SkyControls";

export const metadata: Metadata = {
  title: "Kata Iturriaga — Product Designer",
  description:
    "Portfolio de diseño de producto: casos, procesos y trayectoria, contados como una app del tiempo.",
};

export const viewport: Viewport = {
  themeColor: "#0b1530",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full weather-body">
        <SkyProvider>
          <Sky />
          <SkyControls />
          {children}
        </SkyProvider>
      </body>
    </html>
  );
}
```

Nota: se eliminan las fuentes de Google (Geist, Newsreader, Caveat). Las páginas de periódico aún sin migrar perderán sus fuentes personalizadas durante la migración — aceptable, se borran en Tasks 3-6.

- [ ] **Step 8: Añadir el import en `app/globals.css`**

Tras la línea 2 (`@import "../styles/tokens.css";`) añadir:

```css
@import "../styles/weather.css";
```

- [ ] **Step 9: Verificar build y lint**

Run: `npm run build && npm run lint`
Expected: build OK (todas las rutas compilan), lint sin errores.

- [ ] **Step 10: Verificación visual**

Run: `npm run dev` (background) y abrir `http://localhost:3000`.
Expected: el cielo se ve tras el contenido viejo de la home (que aún es de periódico y lo tapa con su fondo — correcto en esta fase), y los dos segmented controls flotan arriba y cambian el fondo (comprobar recargando con localStorage limpio que el momento por defecto corresponde a la hora local).

- [ ] **Step 11: Commit**

```bash
git add data/weather.ts components/weather/ styles/weather.css app/layout.tsx app/globals.css
git commit -m "feat(weather): cielo global con controles, iconos y layout base design-v2"
```

---

### Task 2: Primitivas — GlassCard, CityHeader, BottomBar y CityPager

**Files:**
- Create: `components/weather/GlassCard.tsx`
- Create: `components/weather/CityHeader.tsx`
- Create: `components/weather/BottomBar.tsx`
- Create: `components/weather/CityPager.tsx`
- Modify: `app/layout.tsx` (montar BottomBar y CityPager)

**Interfaces:**
- Consumes: `WeatherIcon` + `WeatherIconName`, `cityRoutes()` de `data/weather.ts`, clases CSS de Task 1.
- Produces:
  - `GlassCard({ icon?: WeatherIconName; title?: string; className?: string; children })` — server component.
  - `CityHeader({ over?: string; name: string; big: string; unit?: string; condition: string; hiLo?: string })` — client, con compresión al scroll.
  - `BottomBar()` — client, sin props.
  - `CityPager({ children })` — client, navegación swipe/teclado entre `cityRoutes()`.

- [ ] **Step 1: Crear `components/weather/GlassCard.tsx`**

```tsx
import WeatherIcon, { WeatherIconName } from "./WeatherIcon";

export default function GlassCard({
  icon,
  title,
  className = "",
  children,
}: {
  icon?: WeatherIconName;
  title?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`glass-card ${className}`.trim()}>
      {title ? (
        <header className="glass-card__head">
          {icon ? <WeatherIcon name={icon} size={13} /> : null}
          <span>{title}</span>
        </header>
      ) : null}
      <div className="glass-card__body">{children}</div>
    </section>
  );
}
```

- [ ] **Step 2: Crear `components/weather/CityHeader.tsx`**

```tsx
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
```

- [ ] **Step 3: Crear `components/weather/BottomBar.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cityRoutes } from "@/data/weather";
import WeatherIcon from "./WeatherIcon";

export default function BottomBar() {
  const pathname = usePathname();
  const routes = cityRoutes();

  return (
    <nav className="bottom-bar" aria-label="Navegación principal">
      <Link href="/procesos" aria-label="Procesos" title="Procesos">
        <WeatherIcon name="mapa" size={20} />
      </Link>
      <div className="bottom-bar__dots">
        {routes.map((route) => {
          const active = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              aria-label={route.label}
              aria-current={active ? "page" : undefined}
              className={active ? "is-active" : undefined}
            >
              {route.href === "/" ? (
                <WeatherIcon name="ubicacion" size={13} />
              ) : (
                <span className="dot" />
              )}
            </Link>
          );
        })}
      </div>
      <Link href="/casos" aria-label="Todos los casos" title="Todos los casos">
        <WeatherIcon name="lista" size={20} />
      </Link>
    </nav>
  );
}
```

- [ ] **Step 4: Crear `components/weather/CityPager.tsx`**

Swipe (táctil) y flechas del teclado solo cuando la ruta actual es una "ciudad". La animación de entrada la da el propio wrapper.

```tsx
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
```

- [ ] **Step 5: Montar en `app/layout.tsx`**

Añadir imports y envolver `children`:

```tsx
import BottomBar from "@/components/weather/BottomBar";
import CityPager from "@/components/weather/CityPager";
```

y en el body, dentro de `SkyProvider`:

```tsx
<SkyProvider>
  <Sky />
  <SkyControls />
  <CityPager>{children}</CityPager>
  <BottomBar />
</SkyProvider>
```

- [ ] **Step 6: Verificar build, lint y visual**

Run: `npm run build && npm run lint`
Expected: verde.
Visual (`npm run dev`): barra inferior visible en todas las rutas; el punto de ubicación activo en `/`; flecha derecha del teclado navega a `/casos/asesorias-v2-app` y la izquierda vuelve.

- [ ] **Step 7: Commit**

```bash
git add components/weather/ app/layout.tsx
git commit -m "feat(weather): primitivas glass, cabecera de ciudad, barra inferior y paginación"
```

---

### Task 3: Home — "Ubicación actual"

**Files:**
- Modify: `data/home.ts` (reescritura del bloque `copy`, eliminación de `quickLinks`)
- Create: `components/weather/home/WeatherHome.tsx`
- Create: `components/weather/home/TrajectoryStrip.tsx`
- Create: `components/weather/home/ContactCard.tsx`
- Modify: `app/page.tsx` (reescritura)
- Delete: `components/home/HomeExperience.tsx` (y el directorio `components/home/`)

**Interfaces:**
- Consumes: `GlassCard`, `CityHeader`, `WeatherIcon`, `projectWeather` de `data/weather.ts`; `stats`, `projects`, `industries`, `timeline`, `articles` de `data/home.ts`.
- Produces: `WeatherHome()` (server), `TrajectoryStrip({ items })` (client), `ContactCard()` (client, sin props — lee `copy.contact` directamente). Nuevo shape de `copy` en `data/home.ts` (ver Step 1 — otros tasks no lo consumen).

- [ ] **Step 1: Reescribir el bloque `copy` de `data/home.ts`**

Eliminar `quickLinks` y su export en `homeContent`. Sustituir el objeto `copy` completo (líneas 175-301) por:

```ts
export const copy = {
  header: {
    over: "Barcelona · ESP",
    name: "Kata Iturriaga",
    big: "4+",
    unit: "años",
    condition: "Product Designer",
    hiLo: "Máx: 12 proyectos · 18 marcas",
  },
  intro:
    "Diseño productos digitales desde la primera pregunta hasta el último detalle, conectando investigación, estrategia, interfaz y código.",
  trajectory: { title: "Previsión por horas · Trayectoria" },
  work: {
    title: "Previsión a 6 proyectos",
    intro: "Una selección de productos lanzados y conceptos de los últimos años.",
    archive: "Explorar el archivo completo",
    next: "En el próximo parte",
    nextItems: [
      "Un sistema de conocimiento para productos con IA",
      "Cómo se construyó este mismo portfolio",
      "Dos proyectos confidenciales, pendientes de publicación",
    ],
  },
  smallCards: {
    sectors: "Sectores",
    reach: "Alcance",
    reachValue: "8M+",
    reachNote: "Personas alcanzadas por los productos en los que he trabajado.",
    brands: "Marcas",
    brandsValue: "18",
    brandsNote: "Marcas acompañadas en cuatro años de práctica.",
    availability: "Condiciones actuales",
    availabilityValue: "Disponible",
    availabilityNote: "Abierta a nuevos proyectos y colaboraciones.",
    location: "Ubicación",
    locationValue: "Barcelona",
    locationNote: "Disponible en remoto · CET",
    lab: "El laboratorio",
    labValue: "Procesos",
    labNote: "Las herramientas, decisiones y rituales que llevo de la idea a la entrega.",
  },
  about: {
    title: "Sobre quien diseña",
    lead: "Diseñador que construye, estratega que pregunta y colaborador que entrega.",
    firstParagraph:
      "Trabajo en los espacios que quedan entre lo que las personas dicen y lo que realmente necesitan; entre lo que un producto puede hacer y lo que debería hacer. Mi práctica combina profundidad en UX, interfaz, investigación y código con pensamiento de negocio.",
    secondParagraph:
      "Me gusta llevar las ideas del boceto a una experiencia real, saber qué detalle importa en cada momento y hacer que equipos distintos avancen en la misma dirección.",
    signature: "Nombre Apellido",
    signatureRole: "Diseño y dirección",
  },
  testimonial: {
    title: "Aviso destacado · Lo que cuentan",
    quote:
      "No se limitó a resolver la pantalla. Ordenó el problema, hizo las preguntas que faltaban y consiguió que producto e ingeniería tomaran decisiones juntos.",
    person: "Marina López",
    role: "Head of Product · Empresa ejemplo",
  },
  articles: { title: "Detrás de cada proyecto · Procesos" },
  contact: {
    title: "Hablemos",
    intro: "Proyectos, equipos, colaboraciones o un café por videollamada. Escríbeme.",
    reads: "Leo todos los mensajes.",
    emailLabel: "Correo",
    email: "hola@tudominio.com",
    emailHint: "Haz clic para copiar",
    copied: "Copiado ✓",
    scheduleLabel: "Agenda",
    schedule: "Reserva 30 minutos",
    availability: "Abierto a nuevos proyectos",
    updatedAt: "Actualizado a las",
  },
} as const;
```

Y actualizar el export final:

```ts
export const homeContent = {
  copy,
  stats,
  projects,
  industries,
  timeline,
  articles,
} as const;
```

(El array `stats` y el resto de datos no cambian.)

- [ ] **Step 2: Crear `components/weather/home/TrajectoryStrip.tsx`**

```tsx
"use client";

import { useState } from "react";
import WeatherIcon, { WeatherIconName } from "../WeatherIcon";
import type { timeline } from "@/data/home";

const STAGE_ICONS: WeatherIconName[] = ["amanecer", "nube-sol", "sol", "sol"];

export default function TrajectoryStrip({
  items,
}: {
  items: typeof timeline;
}) {
  // items llega en orden cronológico inverso; la franja se lee de pasado a presente
  const stages = [...items].reverse();
  const [selected, setSelected] = useState(stages.length - 1);
  const stage = stages[selected];

  return (
    <div>
      <div className="hour-strip">
        {stages.map((item, i) => (
          <button
            key={item.period}
            type="button"
            className={i === selected ? "is-active" : undefined}
            onClick={() => setSelected(i)}
          >
            <span>{item.period}</span>
            <WeatherIcon name={STAGE_ICONS[i] ?? "sol"} size={22} />
            <strong>{item.company}</strong>
          </button>
        ))}
      </div>
      <div className="hour-detail">
        <p>
          {stage.role} · {stage.status}
        </p>
        <ul>
          {stage.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <div className="chip-row">
          {stage.tags.map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Crear `components/weather/home/ContactCard.tsx`**

```tsx
"use client";

import { useState } from "react";
import WeatherIcon from "../WeatherIcon";
import { copy } from "@/data/home";

export default function ContactCard() {
  const contact = copy.contact;
  const [copied, setCopied] = useState(false);
  const [now] = useState(() =>
    new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard no disponible */
    }
  };

  return (
    <div className="card-prose">
      <p className="card-lead">{contact.intro}</p>
      <p>{contact.reads}</p>
      <div className="contact-actions">
        <button type="button" onClick={copyEmail}>
          <WeatherIcon name="sobre" size={16} />
          <strong>{copied ? contact.copied : contact.email}</strong>
          <span>{contact.emailHint}</span>
        </button>
        <a href="#" onClick={(e) => e.preventDefault()}>
          <WeatherIcon name="calendario" size={16} />
          <strong>{contact.schedule}</strong>
          <span>{contact.scheduleLabel}</span>
        </a>
      </div>
      <p className="contact-updated">
        {contact.availability} · {contact.updatedAt} {now}
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Crear `components/weather/home/WeatherHome.tsx`**

```tsx
import Link from "next/link";
import CityHeader from "../CityHeader";
import GlassCard from "../GlassCard";
import WeatherIcon from "../WeatherIcon";
import TrajectoryStrip from "./TrajectoryStrip";
import ContactCard from "./ContactCard";
import { copy, industries, projects, timeline, articles } from "@/data/home";
import { projectWeather } from "@/data/weather";

export default function WeatherHome() {
  return (
    <main className="weather-shell">
      <CityHeader
        over={copy.header.over}
        name={copy.header.name}
        big={copy.header.big}
        unit={copy.header.unit}
        condition={copy.header.condition}
        hiLo={copy.header.hiLo}
      />

      <div className="card-stack">
        <GlassCard icon="termometro" title={copy.trajectory.title} className="span-2">
          <TrajectoryStrip items={timeline} />
        </GlassCard>

        <GlassCard icon="calendario" title={copy.work.title} className="span-2">
          {projects.map((project) => {
            const weather = projectWeather[project.client];
            // Posición del punto en la barra de rango según el año (2023-2026)
            const yearMatch = project.year.match(/\d{4}/);
            const year = yearMatch ? Number(yearMatch[0]) : 2023;
            const dotPosition = Math.min(100, Math.max(0, ((year - 2023) / 3) * 100));
            const row = (
              <>
                <span className="forecast-row__client">{project.client}</span>
                {project.video ? (
                  <video
                    className="forecast-row__thumb"
                    src={project.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <WeatherIcon name={weather?.icon ?? "sol"} size={20} />
                )}
                <span className="forecast-row__title">{project.title}</span>
                <span className="forecast-row__range">
                  <i style={{ left: `${dotPosition}%` }} />
                </span>
                <span className="forecast-row__year">{project.year}</span>
              </>
            );
            return project.href ? (
              <Link key={project.number} href={project.href} className="forecast-row forecast-row--project">
                {row}
              </Link>
            ) : (
              <div key={project.number} className="forecast-row forecast-row--project">
                {row}
              </div>
            );
          })}
          <p className="card-archive-link">
            <Link href="/casos">{copy.work.archive} →</Link>
          </p>
        </GlassCard>

        <GlassCard icon="brujula" title={copy.smallCards.sectors}>
          {industries.map((industry) => (
            <div key={industry.number} className="forecast-row forecast-row--compact">
              <span className="forecast-row__client">{industry.title}</span>
              <span className="forecast-row__year">{industry.clients}</span>
            </div>
          ))}
        </GlassCard>

        <div className="small-grid">
          <GlassCard icon="ojo" title={copy.smallCards.reach}>
            <p className="small-card__value">{copy.smallCards.reachValue}</p>
            <p className="small-card__note">{copy.smallCards.reachNote}</p>
          </GlassCard>
          <GlassCard icon="sol" title={copy.smallCards.brands}>
            <p className="small-card__value">{copy.smallCards.brandsValue}</p>
            <p className="small-card__note">{copy.smallCards.brandsNote}</p>
          </GlassCard>
          <GlassCard icon="campana" title={copy.smallCards.availability} className="small-card--ok">
            <p className="small-card__value">{copy.smallCards.availabilityValue}</p>
            <p className="small-card__note">{copy.smallCards.availabilityNote}</p>
          </GlassCard>
          <GlassCard icon="ubicacion" title={copy.smallCards.location}>
            <p className="small-card__value">{copy.smallCards.locationValue}</p>
            <p className="small-card__note">{copy.smallCards.locationNote}</p>
          </GlassCard>
        </div>

        <GlassCard icon="mapa" title={copy.smallCards.lab}>
          <p className="small-card__value">{copy.smallCards.labValue}</p>
          <p className="small-card__note">{copy.smallCards.labNote}</p>
          <p className="card-archive-link">
            <Link href="/procesos">Entrar →</Link>
          </p>
        </GlassCard>

        <GlassCard icon="sol" title={copy.about.title} className="span-2">
          <div className="card-prose">
            <p className="card-lead">{copy.about.lead}</p>
            <p>{copy.about.firstParagraph}</p>
            <p>{copy.about.secondParagraph}</p>
            <p>
              <strong>{copy.about.signature}</strong> · {copy.about.signatureRole}
            </p>
          </div>
        </GlassCard>

        <GlassCard icon="campana" title={copy.testimonial.title} className="glass-card--alert span-2">
          <div className="card-prose">
            <p className="card-lead">“{copy.testimonial.quote}”</p>
            <p>
              <strong>{copy.testimonial.person}</strong> · {copy.testimonial.role}
            </p>
          </div>
        </GlassCard>

        <GlassCard icon="lista" title={copy.articles.title} className="span-2">
          {articles.map((article) => (
            <Link key={article.number} href={article.href} className="forecast-row">
              <span className="forecast-row__client">{article.category}</span>
              <WeatherIcon name="nube-sol" size={20} />
              <span className="forecast-row__title">{article.title}</span>
              <span className="forecast-row__year">{article.date}</span>
            </Link>
          ))}
        </GlassCard>

        <GlassCard icon="sobre" title={copy.contact.title} className="span-2">
          <ContactCard />
        </GlassCard>
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Añadir a `styles/weather.css` los estilos que faltan**

Al final del archivo:

```css
/* ---- Home ---- */
.forecast-row--project {
  grid-template-columns: minmax(90px, 1fr) 34px 2fr minmax(70px, 110px) auto;
}

.forecast-row__thumb {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.forecast-row__range {
  position: relative;
  display: block;
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(90deg, #5ac8fa, #ffd60a, #ff9f0a);
  opacity: 0.85;
}

.forecast-row__range i {
  position: absolute;
  top: 50%;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #fff;
  border: 1.5px solid rgba(0, 0, 0, 0.35);
  transform: translate(-50%, -50%);
}

@media (max-width: 639px) {
  .forecast-row--project {
    grid-template-columns: minmax(80px, 1fr) 34px 2fr auto;
  }

  .forecast-row__range {
    display: none;
  }
}

.forecast-row--compact {
  grid-template-columns: 1fr auto;
  padding: 0.55rem 0;
  font-size: 0.88rem;
}

.card-archive-link {
  margin: 0.9rem 0 0;
  font-size: 0.9rem;
  font-weight: 600;
}

.card-archive-link a {
  opacity: 0.9;
}

.card-archive-link a:hover {
  opacity: 1;
}

.contact-actions {
  display: grid;
  gap: 0.7rem;
  margin: 1rem 0;
}

@media (min-width: 640px) {
  .contact-actions {
    grid-template-columns: 1fr 1fr;
  }
}

.contact-actions > * {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
  text-align: left;
  transition: background 180ms ease;
}

.contact-actions > *:hover {
  background: rgba(255, 255, 255, 0.18);
}

.contact-actions span {
  margin-left: auto;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.65);
}

.contact-updated {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.65);
}
```

- [ ] **Step 6: Reescribir `app/page.tsx` y borrar la home de periódico**

```tsx
import WeatherHome from "@/components/weather/home/WeatherHome";

export default function Home() {
  return <WeatherHome />;
}
```

```bash
rm -r components/home
```

- [ ] **Step 7: Verificar build, lint y visual**

Run: `npm run build && npm run lint`
Expected: verde (si `data/home.ts` conserva referencias a `quickLinks` o `madlibs` en otros archivos, el build lo detectará — no debe quedar ninguna).
Visual: home completa sobre el cielo; cabecera se comprime al hacer scroll; la fila de El Método navega al caso; click-to-copy muestra "Copiado ✓"; en <760px todo es una columna.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(weather): home como ubicación actual con tarjetas de previsión"
```

---

### Task 4: Página de caso — la "ciudad"

**Files:**
- Create: `components/weather/caso/CaseCity.tsx`
- Modify: `app/casos/[slug]/page.tsx` (reescritura)
- Delete: `components/casos/` (directorio completo)
- Modify: `styles/weather.css` (estilos de caso al final)

**Interfaces:**
- Consumes: `CaseStudy` de `data/casos.ts` (shape completo: `glance`, `impact`, `problem`, `howWeWorked`, `decisions[]` con `media`/`comparison`, `rest`, `reflection`, `nextCase`), `GlassCard`, `CityHeader`, `WeatherIcon`.
- Produces: `CaseCity({ caso }: { caso: CaseStudy })` — server component.

- [ ] **Step 1: Crear `components/weather/caso/CaseCity.tsx`**

```tsx
import Link from "next/link";
import CityHeader from "../CityHeader";
import GlassCard from "../GlassCard";
import type { CaseStudy, Decision } from "@/data/casos";

function DecisionCard({ decision }: { decision: Decision }) {
  return (
    <GlassCard icon="nube-sol" title={`Decisión ${decision.number} · ${decision.area}`} className="span-2">
      <div className="card-prose">
        <p className="card-lead">{decision.title}</p>
        <p className="decision-from">{decision.from}</p>
        <ul className="decision-list">
          {decision.decided.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {decision.alternatives?.length ? (
          <details className="decision-alt">
            <summary>Alternativas descartadas</summary>
            <ul className="decision-list">
              {decision.alternatives.map((alt) => (
                <li key={alt}>{alt}</li>
              ))}
            </ul>
          </details>
        ) : null}
        {decision.finalStructure ? (
          <pre className="decision-schema">{decision.finalStructure}</pre>
        ) : null}
        {decision.media ? (
          <figure className="decision-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={decision.media.src} alt={decision.media.alt} />
            {decision.media.caption ? <figcaption>{decision.media.caption}</figcaption> : null}
          </figure>
        ) : null}
        {decision.comparison ? (
          <div className="decision-compare">
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={decision.comparison.before.src} alt={decision.comparison.before.alt} />
              <figcaption>{decision.comparison.beforeLabel ?? "Antes"}</figcaption>
            </figure>
            <figure>
              <video src={decision.comparison.after.src} autoPlay muted loop playsInline />
              <figcaption>{decision.comparison.afterLabel ?? "Después"}</figcaption>
            </figure>
          </div>
        ) : null}
      </div>
    </GlassCard>
  );
}

export default function CaseCity({ caso }: { caso: CaseStudy }) {
  return (
    <main className="weather-shell">
      <CityHeader
        over={caso.kicker}
        name={caso.glance.product}
        big={caso.heroTitle}
        condition={caso.heroSubtitle}
        hiLo={`${caso.glance.period} · ${caso.glance.role}`}
      />

      <div className="card-stack">
        <GlassCard icon="campana" title="Aviso destacado · La tesis" className="glass-card--alert span-2">
          <div className="card-prose">
            <p className="card-lead">{caso.thesis}</p>
            <p>{caso.subthesis}</p>
          </div>
        </GlassCard>

        <div className="small-grid span-2">
          {(
            [
              ["Rol", caso.glance.role],
              ["Periodo", caso.glance.period],
              ["Equipo", caso.glance.team],
              ["Producto", caso.glance.product],
              ["Problema", caso.glance.problem],
              ["Solución", caso.glance.solution],
            ] as const
          ).map(([label, value]) => (
            <GlassCard key={label} icon="ojo" title={label}>
              <p className="small-card__note glance-value">{value}</p>
            </GlassCard>
          ))}
        </div>

        <GlassCard icon="termometro" title="Impacto" className="span-2">
          <div className="impact-grid">
            {caso.impact.map((metric) => (
              <div key={metric.label} className={metric.pending ? "is-pending" : undefined}>
                <p className="small-card__value">{metric.pending ? "—" : metric.value}</p>
                <p className="small-card__note">
                  {metric.label}
                  {metric.note ? ` · ${metric.note}` : ""}
                  {metric.pending ? " · por medir" : ""}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard icon="nube" title={caso.problem.eyebrow}>
          <div className="card-prose">
            <p className="card-lead">{caso.problem.title}</p>
            {caso.problem.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </GlassCard>

        <GlassCard icon="viento" title={caso.howWeWorked.eyebrow}>
          <div className="card-prose">
            <p className="card-lead">{caso.howWeWorked.title}</p>
            {caso.howWeWorked.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </GlassCard>

        {caso.decisions.map((decision) => (
          <DecisionCard key={decision.number} decision={decision} />
        ))}

        <GlassCard icon="lista" title="El resto">
          {caso.rest.map((item) => (
            <div key={item.title} className="forecast-row forecast-row--compact">
              <span className="forecast-row__client">{item.title}</span>
              <span className="forecast-row__year">{item.summary}</span>
            </div>
          ))}
        </GlassCard>

        <GlassCard icon="luna" title="Reflexión">
          <div className="card-prose">
            {caso.reflection.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </GlassCard>

        {caso.nextCase ? (
          <GlassCard icon="flecha" title="Siguiente ciudad" className="span-2">
            <p className="card-archive-link">
              <Link href={`/casos/${caso.nextCase.slug}`}>{caso.nextCase.title} →</Link>
            </p>
          </GlassCard>
        ) : null}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Reescribir `app/casos/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseCity from "@/components/weather/caso/CaseCity";
import { casos, getCaso } from "@/data/casos";

type CasoPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return casos.map((caso) => ({ slug: caso.slug }));
}

export async function generateMetadata({
  params,
}: CasoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caso = getCaso(slug);
  if (!caso) return {};
  return {
    title: `${caso.title} — Kata Iturriaga`,
    description: caso.thesis,
  };
}

export default async function CasoDetailPage({ params }: CasoPageProps) {
  const { slug } = await params;
  const caso = getCaso(slug);
  if (!caso) notFound();

  return <CaseCity caso={caso} />;
}
```

- [ ] **Step 3: Borrar componentes de periódico del caso**

```bash
rm -r components/casos
```

Comprobar que nada más los importa: `grep -rn "components/casos" app components` debe devolver vacío.

- [ ] **Step 4: Añadir estilos de caso a `styles/weather.css`**

```css
/* ---- Caso ---- */
.glance-value {
  margin-top: 0;
  font-size: 0.92rem;
}

.impact-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 760px) {
  .impact-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.impact-grid .is-pending {
  opacity: 0.55;
}

.decision-from {
  color: rgba(255, 255, 255, 0.75);
  font-style: italic;
}

.decision-list {
  margin: 0 0 0.9rem;
  padding-left: 1.15rem;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.6;
}

.decision-list li {
  margin: 0.3rem 0;
}

.decision-alt summary {
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.decision-schema {
  overflow-x: auto;
  padding: 1rem;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.28);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.78rem;
  line-height: 1.5;
}

.decision-media img,
.decision-compare img,
.decision-compare video {
  width: 100%;
  height: auto;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.16);
}

.decision-media figcaption,
.decision-compare figcaption {
  margin-top: 0.4rem;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.65);
}

.decision-compare {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

@media (min-width: 640px) {
  .decision-compare {
    grid-template-columns: 1fr 1fr;
  }
}

.decision-compare figure {
  margin: 0;
}
```

- [ ] **Step 5: Verificar build, lint y visual**

Run: `npm run build && npm run lint`
Expected: verde.
Visual en `/casos/asesorias-v2-app`: cabecera con "Añadiendo capas", tesis como aviso, glance en cuadrícula, métricas pendientes atenuadas, las 4 decisiones con su media y la comparación imagen/vídeo funcionando, disclosure de alternativas plegable.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(weather): página de caso como ciudad con tarjetas de previsión"
```

---

### Task 5: Índice de casos — "lista de ciudades"

**Files:**
- Modify: `app/casos/page.tsx` (reescritura)
- Modify: `styles/weather.css` (estilos de lista al final)

**Interfaces:**
- Consumes: `projects` de `data/home.ts`, `projectWeather` de `data/weather.ts`, `WeatherIcon`.
- Produces: nada que consuman otras tareas.

- [ ] **Step 1: Reescribir `app/casos/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import WeatherIcon from "@/components/weather/WeatherIcon";
import { projects } from "@/data/home";
import { projectWeather } from "@/data/weather";

export const metadata: Metadata = {
  title: "Casos — Kata Iturriaga",
  description: "Todos los proyectos y casos de estudio, como una lista de ciudades.",
};

export default function CasosPage() {
  return (
    <main className="weather-shell city-list">
      <h1 className="city-list__title">Casos</h1>
      {projects.map((project) => {
        const weather = projectWeather[project.client];
        const card = (
          <>
            <div>
              <strong>{project.client}</strong>
              <p>{project.title}</p>
              <small>
                {project.domain} · {project.role}
              </small>
            </div>
            <div className="city-list__side">
              <WeatherIcon name={weather?.icon ?? "sol"} size={26} />
              <span>{project.year}</span>
            </div>
          </>
        );
        return project.href ? (
          <Link key={project.number} href={project.href} className="glass-card city-list__card">
            {card}
          </Link>
        ) : (
          <div key={project.number} className="glass-card city-list__card is-static">
            {card}
          </div>
        );
      })}
    </main>
  );
}
```

- [ ] **Step 2: Añadir estilos a `styles/weather.css`**

```css
/* ---- Lista de ciudades ---- */
.city-list {
  position: relative;
}

.city-list::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  background: rgba(0, 0, 0, 0.3);
}

.city-list__title {
  margin: 0 0 1.4rem;
  font-size: clamp(2.2rem, 6vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.city-list__card {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 1.2rem;
  margin-bottom: 0.9rem;
  transition: background 180ms ease;
}

.city-list__card:hover {
  background: rgba(255, 255, 255, 0.16);
}

.city-list__card.is-static:hover {
  background: rgba(255, 255, 255, 0.1);
}

.city-list__card strong {
  font-size: 1.25rem;
  font-weight: 600;
}

.city-list__card p {
  margin: 0.15rem 0 0.3rem;
  color: rgba(255, 255, 255, 0.85);
}

.city-list__card small {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.city-list__side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  flex-shrink: 0;
}

.city-list__side span {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
}
```

- [ ] **Step 3: Verificar y commitear**

Run: `npm run build && npm run lint` → verde.
Visual en `/casos`: overlay oscuro sobre el cielo, tarjeta por proyecto, la de El Método navega, las demás no son enlaces.

```bash
git add -A
git commit -m "feat(weather): índice de casos como lista de ciudades"
```

---

### Task 6: Procesos — "el mapa" y "el parte"

**Files:**
- Modify: `app/procesos/page.tsx` (reescritura)
- Modify: `app/procesos/[slug]/page.tsx` (reescritura)
- Delete: `components/processes/` (directorio completo)
- Modify: `styles/weather.css` (estilos de procesos al final)

**Interfaces:**
- Consumes: `processes`, `processCategories`, `featuredProcesses`, `getProcess`, `getProcessNeighbors` de `data/processes.ts`; `processStatusWeather` de `data/weather.ts`; `GlassCard`, `CityHeader`, `WeatherIcon`.
- Produces: nada que consuman otras tareas.

- [ ] **Step 1: Reescribir `app/procesos/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import GlassCard from "@/components/weather/GlassCard";
import WeatherIcon from "@/components/weather/WeatherIcon";
import { processCategories, processes } from "@/data/processes";
import { processStatusWeather } from "@/data/weather";

export const metadata: Metadata = {
  title: "Procesos — Kata Iturriaga",
  description:
    "El mapa del laboratorio: herramientas, decisiones y rituales de la idea a la entrega.",
};

export default function ProcesosPage() {
  return (
    <main className="weather-shell">
      <h1 className="city-list__title">Procesos</h1>
      <p className="map-intro">
        Las herramientas, decisiones y rituales que utilizo para llevar cada
        proyecto de la idea a la entrega.
      </p>
      <div className="card-stack">
        {processCategories.map((category) => (
          <GlassCard
            key={category.number}
            icon="mapa"
            title={`Frente ${category.number} · ${category.shortName}`}
            className="span-2"
          >
            <p className="map-category-desc">{category.description}</p>
            {processes
              .filter((process) => process.category === category.name)
              .sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false))
              .map((process) => {
                const status = processStatusWeather[process.status];
                return (
                  <Link
                    key={process.slug}
                    href={`/procesos/${process.slug}`}
                    className="forecast-row"
                  >
                    <span className="forecast-row__client">{process.number}</span>
                    <WeatherIcon name={status.icon} size={20} />
                    <span className="forecast-row__title">{process.title}</span>
                    <span className="forecast-row__year">{status.label}</span>
                  </Link>
                );
              })}
          </GlassCard>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Reescribir `app/procesos/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CityHeader from "@/components/weather/CityHeader";
import GlassCard from "@/components/weather/GlassCard";
import { getProcess, getProcessNeighbors, processes } from "@/data/processes";
import { processStatusWeather } from "@/data/weather";

type ProcessPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return processes.map((process) => ({ slug: process.slug }));
}

export async function generateMetadata({
  params,
}: ProcessPageProps): Promise<Metadata> {
  const { slug } = await params;
  const process = getProcess(slug);
  if (!process) return {};
  return { title: `${process.title} — Procesos — Kata Iturriaga`, description: process.purpose };
}

export default async function ProcessDetailPage({ params }: ProcessPageProps) {
  const { slug } = await params;
  const process = getProcess(slug);
  if (!process) notFound();

  const status = processStatusWeather[process.status];
  const { previous, next } = getProcessNeighbors(slug);

  return (
    <main className="weather-shell">
      <CityHeader
        over={`${process.category} · ${status.label}`}
        name={process.title}
        big={process.number}
        condition={process.purpose}
      />

      <div className="card-stack">
        <GlassCard icon="sol" title="Cuándo usarlo">
          <div className="card-prose">
            <p>{process.when}</p>
            {process.whenNot ? <p className="decision-from">Cuándo no: {process.whenNot}</p> : null}
          </div>
        </GlassCard>

        <GlassCard icon="viento" title="Entrada → Salida">
          <div className="card-prose">
            <p>
              <strong>Entrada:</strong> {process.input}
            </p>
            <p>
              <strong>Salida:</strong> {process.output}
            </p>
          </div>
        </GlassCard>

        <GlassCard icon="lista" title="Pasos" className="span-2">
          <ol className="process-steps-list">
            {process.steps.map((step) => (
              <li key={step.slice(0, 40)}>{step}</li>
            ))}
          </ol>
        </GlassCard>

        {process.checklist?.length ? (
          <GlassCard icon="ojo" title="Checklist">
            <ul className="decision-list">
              {process.checklist.map((item) => (
                <li key={item.slice(0, 40)}>{item}</li>
              ))}
            </ul>
          </GlassCard>
        ) : null}

        <GlassCard icon="brujula" title="Herramientas">
          <div className="chip-row">
            {process.tools.map((tool) => (
              <span key={tool} className="chip">
                {tool}
              </span>
            ))}
          </div>
        </GlassCard>

        <GlassCard icon="niebla" title="Esquema" className="span-2">
          <pre className="decision-schema">{process.schema}</pre>
        </GlassCard>

        <GlassCard icon="flecha" title="Más procesos" className="span-2">
          <div className="process-pager">
            {previous ? (
              <Link href={`/procesos/${previous.slug}`}>← {previous.title}</Link>
            ) : (
              <span />
            )}
            {next ? <Link href={`/procesos/${next.slug}`}>{next.title} →</Link> : <span />}
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
```

(`getProcessNeighbors` devuelve `{ previous, next }` con elementos `Process | undefined` — verificado en `data/processes.ts:645`.)

- [ ] **Step 3: Borrar componentes de periódico de procesos**

```bash
rm -r components/processes
```

`grep -rn "components/processes" app components` debe devolver vacío.

- [ ] **Step 4: Añadir estilos a `styles/weather.css`**

```css
/* ---- Procesos ---- */
.map-intro {
  max-width: 55ch;
  margin: 0 0 1.6rem;
  color: rgba(255, 255, 255, 0.85);
}

.map-category-desc {
  margin: 0 0 0.7rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.75);
}

.process-steps-list {
  margin: 0;
  padding-left: 1.4rem;
  line-height: 1.7;
}

.process-steps-list li {
  margin: 0.45rem 0;
}

.process-pager {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-weight: 600;
}
```

- [ ] **Step 5: Verificar y commitear**

Run: `npm run build && npm run lint` → verde (el build valida los ~12 procesos por `generateStaticParams`).
Visual: `/procesos` con 4 frentes y filas con condición por status; un detalle cualquiera con pasos/checklist/chips/esquema; navegación anterior/siguiente.

```bash
git add -A
git commit -m "feat(weather): procesos como mapa meteorológico y parte detallado"
```

---

### Task 7: Limpieza final y QA

**Files:**
- Delete: `components/site/` (directorio completo)
- Modify: `app/globals.css` (reescritura completa, lean)
- Delete: `styles/tokens.css`, `src/tokens.ts` (si nada los referencia)

**Interfaces:**
- Consumes: todo lo anterior. Produces: nada.

- [ ] **Step 1: Comprobar referencias muertas**

```bash
grep -rn "components/site\|components/home\|components/casos\|components/processes" app components data
grep -rn "tokens.css\|src/tokens" app components data styles --include="*.ts*" --include="*.css"
```

Expected: solo el import de `tokens.css` en `globals.css` (se elimina en el paso siguiente). Si aparece algo más, migrar ese uso antes de borrar.

- [ ] **Step 2: Borrar restos y reescribir `app/globals.css`**

```bash
rm -r components/site
rm styles/tokens.css src/tokens.ts
```

Contenido completo nuevo de `app/globals.css`:

```css
@import "tailwindcss";
@import "../styles/weather.css";

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  overflow-x: hidden;
}

button,
input {
  font: inherit;
}

button,
a {
  color: inherit;
}

a {
  text-decoration: none;
}

button {
  border: 0;
  background: none;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Build y lint finales**

Run: `npm run build && npm run lint`
Expected: verde, sin warnings de imports muertos.

- [ ] **Step 4: QA visual completo**

Con `npm run dev`, recorrer y comprobar:

1. Home, caso, índice y procesos legibles en las 16 combinaciones de cielo (muestrear al menos: día/despejado —la más clara—, noche/despejado, amanecer/nieve, atardecer/lluvia).
2. Paginación: swipe en viewport móvil (DevTools), flechas de teclado, puntos de la barra.
3. Persistencia del cielo tras recargar; momento por defecto según hora con localStorage limpio.
4. `prefers-reduced-motion` emulado en DevTools: sin partículas.
5. Móvil 390px y desktop 1280px: sin scroll horizontal, tarjetas en 1 y 2-3 columnas.
6. Click-to-copy, disclosure de alternativas, vídeo antes/después reproduciéndose.

Anotar y corregir cualquier defecto visual antes del commit.

- [ ] **Step 5: Commit final**

```bash
git add -A
git commit -m "chore(weather): retirar el diseño de periódico y limpiar estilos"
```
