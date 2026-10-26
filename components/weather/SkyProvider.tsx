"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DayMoment, SkyCondition, widgetTones } from "@/data/weather";

type SkyValue = { moment: DayMoment; condition: SkyCondition };

type SkyState = SkyValue & {
  setMoment: (m: DayMoment) => void;
  setCondition: (c: SkyCondition) => void;
};

const SkyContext = createContext<SkyState | null>(null);
// v3: al cambiar el cielo por defecto se invalidan las elecciones guardadas
// con la clave anterior, para que todo el mundo vea el nuevo arranque.
const STORAGE_KEY = "kata-sky-v3";

const DEFAULT_SKY: SkyValue = { moment: "noche", condition: "nubes" };

export default function SkyProvider({ children }: { children: React.ReactNode }) {
  const [sky, setSky] = useState<SkyValue>(DEFAULT_SKY);

  // El servidor no conoce el localStorage del visitante: se pinta el cielo por
  // defecto y, si el visitante ya eligió otro, se aplica tras la hidratación.
  useEffect(() => {
    let saved: Partial<SkyValue> | null = null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw) as Partial<SkyValue>;
    } catch {
      /* localStorage no disponible */
    }
    if (!saved) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincronización única post-hidratación con la elección guardada
    setSky({
      moment: saved.moment ?? DEFAULT_SKY.moment,
      condition: saved.condition ?? DEFAULT_SKY.condition,
    });
  }, []);

  // Los widgets leen sus tonos de dos variables CSS que siguen al cielo activo.
  useEffect(() => {
    const tones = widgetTones(sky.moment, sky.condition);
    const root = document.documentElement.style;
    root.setProperty("--tone-a", tones.a);
    root.setProperty("--tone-b", tones.b);
  }, [sky.moment, sky.condition]);

  // Persistir en un efecto, no dentro del setState: así cada cambio parte del
  // estado más reciente y dos clics seguidos no se pisan.
  const touched = useRef(false);
  useEffect(() => {
    if (!touched.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sky));
    } catch {
      /* sin persistencia */
    }
  }, [sky]);

  const update = useCallback((patch: Partial<SkyValue>) => {
    touched.current = true;
    setSky((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo<SkyState>(
    () => ({
      ...sky,
      setMoment: (moment: DayMoment) => update({ moment }),
      setCondition: (condition: SkyCondition) => update({ condition }),
    }),
    [sky, update],
  );

  return <SkyContext.Provider value={value}>{children}</SkyContext.Provider>;
}

export function useSky(): SkyState {
  const ctx = useContext(SkyContext);
  if (!ctx) throw new Error("useSky debe usarse dentro de SkyProvider");
  return ctx;
}
