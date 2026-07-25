"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import Link from "next/link";

export type NavItem = {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
};

export default function CaseSideNav({ items }: { items: NavItem[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const ids = items.flatMap((i) => [
      i.id,
      ...(i.children?.map((c) => c.id) ?? []),
    ]);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const isActive = (id: string) => active === id;

  return (
    <nav className="case-sidenav" aria-label="Índice del caso">
      <Link href="/casos" className="case-sidenav__back">
        ← Volver a los casos
      </Link>
      <ul className="case-sidenav__list">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={go(item.id)}
              className={`case-sidenav__link ${isActive(item.id) ? "is-active" : ""}`}
              aria-current={isActive(item.id) ? "true" : undefined}
            >
              <span className="case-sidenav__marker" aria-hidden="true" />
              {item.label}
            </a>
            {item.children?.length ? (
              <ul className="case-sidenav__sublist">
                {item.children.map((c) => (
                  <li key={c.id}>
                    <a
                      href={`#${c.id}`}
                      onClick={go(c.id)}
                      className={`case-sidenav__sublink ${isActive(c.id) ? "is-active" : ""}`}
                      aria-current={isActive(c.id) ? "true" : undefined}
                    >
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </nav>
  );
}
