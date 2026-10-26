"use client";

import { useEffect, useState } from "react";

const format = () =>
  new Date().toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  });

/** Hora real de Barcelona. En el servidor no se pinta para no desajustar la hidratación. */
export default function LocalTime() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- primera lectura de la hora tras hidratar
    setNow(format());
    const id = window.setInterval(() => setNow(format()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return <time suppressHydrationWarning>{now ?? "--:--"}</time>;
}
