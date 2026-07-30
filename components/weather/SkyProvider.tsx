"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DayMoment, SkyCondition, defaultMoment } from "@/data/weather";

type SkyValue = { moment: DayMoment; condition: SkyCondition };

type SkyState = SkyValue & {
  setMoment: (m: DayMoment) => void;
  setCondition: (c: SkyCondition) => void;
};

const SkyContext = createContext<SkyState | null>(null);
const STORAGE_KEY = "kata-sky-v2";

export default function SkyProvider({ children }: { children: React.ReactNode }) {
  // El servidor no conoce la hora ni el localStorage del visitante: se renderiza
  // un cielo por defecto y se sincroniza una sola vez tras la hidratación.
  const [sky, setSky] = useState<SkyValue>({ moment: "noche", condition: "despejado" });

  useEffect(() => {
    let saved: Partial<SkyValue> | null = null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw) as Partial<SkyValue>;
    } catch {
      /* localStorage no disponible */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincronización única post-hidratación con localStorage/hora local
    setSky({
      moment: saved?.moment ?? defaultMoment(new Date().getHours()),
      condition: saved?.condition ?? "despejado",
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
