"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DayMoment, SkyCondition } from "@/data/weather";

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

  const update = useCallback((next: SkyValue) => {
    setSky(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* sin persistencia */
    }
  }, []);

  const value = useMemo<SkyState>(
    () => ({
      ...sky,
      setMoment: (m: DayMoment) => update({ ...sky, moment: m }),
      setCondition: (c: SkyCondition) => update({ ...sky, condition: c }),
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
