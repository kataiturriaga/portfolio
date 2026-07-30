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
