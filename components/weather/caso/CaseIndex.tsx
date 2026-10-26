"use client";

import { useEffect, useRef, useState } from "react";

type Item = { id: string; label: string; sub: string; metric?: string };

/**
 * Índice sticky del caso, como la lista de ciudades del Tiempo. Resalta la
 * sección que se está leyendo, marca las ya leídas y muestra el progreso.
 * Cada fila es un ancla normal: funciona sin JavaScript.
 */
export default function CaseIndex({ items, flowId }: { items: Item[]; flowId: string }) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      // La sección activa es la última cuyo borde superior ya pasó el 35% de la pantalla
      const line = window.innerHeight * 0.35;
      let current = 0;
      items.forEach((item, i) => {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= line) current = i;
      });
      setActive(current);

      const flow = document.getElementById(flowId);
      if (flow) {
        const rect = flow.getBoundingClientRect();
        const total = rect.height - window.innerHeight * 0.65;
        const done = Math.min(Math.max(-rect.top + line, 0), Math.max(total, 1));
        setProgress(Math.round((done / Math.max(total, 1)) * 100));
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [items, flowId]);

  // En móvil el índice es una tira horizontal: la píldora activa se centra sola.
  // Solo se mueve la tira, nunca la página.
  const listRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelectorAll("a")[active];
    if (!list || !link || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({
      left: link.offsetLeft - list.clientWidth / 2 + link.clientWidth / 2,
      behavior: "smooth",
    });
  }, [active]);

  return (
    <nav className="case-index" aria-label="Secciones del caso">
      <p className="case-index__title">Ciudades del caso</p>
      <div className="case-index__progress" aria-hidden="true">
        <span>
          <i style={{ width: `${progress}%` }} />
        </span>
        {progress}% leído
      </div>
      <ol ref={listRef}>
        {items.map((item, i) => {
          const state = i === active ? "is-active" : i < active ? "is-done" : "";
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={state || undefined}
                aria-current={i === active ? "location" : undefined}
              >
                <span className="case-index__dot" aria-hidden="true">
                  {i < active ? "✓" : null}
                </span>
                <span className="case-index__text">
                  <strong>{item.label}</strong>
                  {item.sub ? <span>{item.sub}</span> : null}
                </span>
                {item.metric ? <span className="case-index__metric">{item.metric}</span> : null}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
