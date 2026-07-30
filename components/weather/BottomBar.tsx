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
