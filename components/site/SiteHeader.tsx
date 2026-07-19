"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Trabajo", homeHref: "#trabajo", innerHref: "/#trabajo" },
  { label: "Procesos", homeHref: "/procesos", innerHref: "/procesos" },
  { label: "Trayectoria", homeHref: "#trayectoria", innerHref: "/#trayectoria" },
  { label: "Contacto", homeHref: "#contacto", innerHref: "/#contacto" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => setNow(new Date()), 0);
    const interval = window.setInterval(() => setNow(new Date()), 60_000);
    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
    };
  }, []);

  const date = now
    ? new Intl.DateTimeFormat("es-ES", {
        weekday: "long",
        day: "2-digit",
        month: "short",
      })
        .format(now)
        .toUpperCase()
    : "DOMINGO 19 JUL";
  const time = now
    ? new Intl.DateTimeFormat("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(now)
    : "--:--";

  return (
    <header className="site-header">
      <div className="paper-shell utility-bar">
        <Link href="/" className="utility-bar__brand">
          VOL. I · N.º 01 · EDICIÓN GENERAL
        </Link>
        <nav aria-label="Navegación principal">
          {navItems.map((item) => {
            const href = isHome ? item.homeHref : item.innerHref;
            const isCurrent =
              item.label === "Procesos" && pathname.startsWith("/procesos");
            return (
              <Link
                key={item.label}
                href={href}
                aria-current={isCurrent ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="paper-shell masthead">
        <div className="masthead__date">
          <span>{date.split(" ")[0]}</span>
          <strong>{now?.getDate().toString().padStart(2, "0") ?? "19"}</strong>
          <span>{date.split(" ").at(-1)}</span>
        </div>
        <Link className="masthead__title" href="/" aria-label="Inicio">
          El Diario de Kata
        </Link>
        <div className="masthead__meta">
          <span suppressHydrationWarning>{time} · BCN</span>
          <Link href="/#contacto">Disponible para proyectos</Link>
        </div>
      </div>
      <div className="paper-shell edition-bar">
        <span>Diseño de producto · Estrategia · Sistemas</span>
        <span>{pathname.startsWith("/procesos") ? "Archivo de procesos" : "Edición general"}</span>
        <Link href="/#contacto">Solicitar portfolio ↓</Link>
      </div>
    </header>
  );
}
