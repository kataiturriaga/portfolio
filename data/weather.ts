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

/**
 * La franja de trayectoria se lee como una previsión por horas: cada etapa
 * avanza en el día (noche → amanecer → mediodía → tarde) y el icono adopta
 * además la condición que el visitante tenga puesta en los controles.
 */
export const trajectoryPhases = ["noche", "amanecer", "mediodia", "tarde"] as const;
export type TrajectoryPhase = (typeof trajectoryPhases)[number];

const TRAJECTORY_ICONS: Record<TrajectoryPhase, Record<SkyCondition, WeatherIconName>> = {
  noche: {
    despejado: "luna",
    nubes: "luna-nube",
    lluvia: "luna-lluvia",
    nieve: "luna-nieve",
  },
  amanecer: {
    despejado: "amanecer",
    nubes: "nube-amanecer",
    lluvia: "sol-lluvia",
    nieve: "sol-nieve",
  },
  mediodia: {
    despejado: "sol",
    nubes: "nube-sol",
    lluvia: "sol-lluvia",
    nieve: "sol-nieve",
  },
  tarde: {
    despejado: "atardecer",
    nubes: "nube",
    lluvia: "lluvia",
    nieve: "nieve",
  },
};

/**
 * Icono de la etapa `index` de `total`, repartiendo las etapas entre las
 * cuatro fases del día (con 4 etapas es 1:1; con más o menos, proporcional).
 */
export function trajectoryIcon(
  index: number,
  total: number,
  condition: SkyCondition,
): WeatherIconName {
  const last = trajectoryPhases.length - 1;
  const phase =
    total <= 1
      ? trajectoryPhases[last]
      : trajectoryPhases[Math.round((index / (total - 1)) * last)];
  return TRAJECTORY_ICONS[phase][condition];
}

/**
 * Rango de temperaturas plausible para cada condición: la barra de la
 * previsión se recolorea según el tiempo que el visitante tenga puesto.
 */
export const conditionTempRange: Record<SkyCondition, [number, number]> = {
  nieve: [0, 10],
  lluvia: [10, 15],
  nubes: [15, 25],
  despejado: [25, 40],
};

/** Escala de color por grados, del frío al calor. */
const TEMP_STOPS: { t: number; c: [number, number, number] }[] = [
  { t: -2, c: [74, 127, 212] },
  { t: 6, c: [90, 200, 250] },
  { t: 13, c: [64, 214, 176] },
  { t: 19, c: [126, 222, 90] },
  { t: 25, c: [255, 214, 10] },
  { t: 33, c: [255, 159, 10] },
  { t: 42, c: [255, 69, 58] },
];

export function tempColor(t: number): string {
  const first = TEMP_STOPS[0];
  const last = TEMP_STOPS[TEMP_STOPS.length - 1];
  if (t <= first.t) return `rgb(${first.c.join(",")})`;
  if (t >= last.t) return `rgb(${last.c.join(",")})`;
  for (let i = 0; i < TEMP_STOPS.length - 1; i++) {
    const a = TEMP_STOPS[i];
    const b = TEMP_STOPS[i + 1];
    if (t >= a.t && t <= b.t) {
      const k = (t - a.t) / (b.t - a.t);
      const mix = a.c.map((v, j) => Math.round(v + (b.c[j] - v) * k));
      return `rgb(${mix.join(",")})`;
    }
  }
  return `rgb(${last.c.join(",")})`;
}

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
