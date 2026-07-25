# Hero editorial + navegación lateral (scrollspy) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rehacer el hero del case study al estilo Strique (título en cursiva de 1-2 palabras, subtítulo, deck v1→v2, imagen abstracta full-width), reestilar los chips como pill con el activo en rojo, y añadir una navegación lateral izquierda tipo índice con scrollspy cuyas secciones cambian según la vista (reclutador / design lead).

**Architecture:** Se amplía `CaseStudy` con `heroTitle`/`heroSubtitle`. `CaseHero` se rehace. `CaseViewToggle` se reestila. `CaseStudyView` (client) pasa a un layout de dos columnas: una barra lateral sticky `CaseSideNav` (nueva, con IntersectionObserver) y la columna de contenido, donde cada sección va envuelta en un ancla con `id`. Los ítems del índice se derivan de la vista activa. Sin dependencias nuevas.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, CSS propio en `app/globals.css`, `next/image`.

## Global Constraints

- **Sin framework de tests.** Verificación = `npm run lint && npm run build` + render en dev. No añadir tests (YAGNI).
- **No comitear en `main`.** Ya en `feat/caso-asesorias-v2-app`. Commit por tarea.
- **Puerto de dev:** `npm run dev -- -p 3001` (el 3000 puede estar ocupado; si ya hay uno corriendo para este proyecto en 3001, reutilizarlo, no matarlo).
- **Estética editorial:** reutilizar tokens (`--paper`, `--ink`, `--ink-soft`, `--red`, `--rule`, `--paper-deep`, `--serif`, `--sans`, `--mono`, `--gutter`, `--page`). Prefijar clases nuevas con `case-`.
- **Idioma:** español (es-ES). El guion largo solo en títulos/etiquetas, no en prosa.
- **Índice en móvil:** se oculta bajo `@media (max-width: 980px)`; en móvil el contenido va a una columna sin índice.
- **Índice en vista design lead:** secciones + las 4 decisiones anidadas bajo "Decisiones clave". En vista reclutador: solo las 3 secciones de esa vista.
- **Imagen del hero:** `caso.heroMedia` es opcional; el hero se renderiza igual sin imagen. El fichero `public/casos/asesorias-v2-app/hero-abstracto.png` puede no existir todavía: dejar `heroMedia` COMENTADO en los datos hasta que exista, para que `next/image` no falle. NO añadir el fichero en este plan.
- **Vista por defecto:** sigue siendo `corta`.

---

## File Structure

- `data/casos.ts` — MODIFICAR: añadir `heroTitle: string` y `heroSubtitle: string` a `CaseStudy`; poblarlos en `asesorias-v2-app`. `heroMedia` queda comentado.
- `components/casos/CaseHero.tsx` — REESCRIBIR: eyebrow → título cursiva → subtítulo → deck (thesis+subthesis) → imagen opcional. Quitar el back link (pasa a la barra lateral).
- `components/casos/CaseViewToggle.tsx` — MODIFICAR: textos de las opciones (formato "ETIQUETA · pista").
- `components/casos/CaseSideNav.tsx` — CREAR (client): índice lateral con scrollspy (IntersectionObserver) + back link.
- `components/casos/CaseStudyView.tsx` — MODIFICAR: layout de dos columnas (`CaseSideNav` + contenido), envolver cada sección en un ancla con `id`, derivar los ítems del índice según la vista.
- `app/globals.css` — MODIFICAR: estilos del hero nuevo, chips pill, y layout + barra lateral + scrollspy.

---

## Task 1: Datos — `heroTitle` y `heroSubtitle`

**Files:**
- Modify: `data/casos.ts`
- Test: `npm run lint && npm run build`.

**Interfaces:**
- Produces: `CaseStudy` gana `heroTitle: string` y `heroSubtitle: string` (requeridos).

- [ ] **Step 1: Añadir los campos al tipo**

En `data/casos.ts`, en `type CaseStudy`, añadir tras `kicker`:
```ts
  heroTitle: string; // título grande en cursiva (1-2 palabras)
  heroSubtitle: string; // subtítulo de una línea
```
(Se conservan `thesis` y `subthesis`; ahora se renderizan como deck del hero.)

- [ ] **Step 2: Poblar en `asesorias-v2-app`**

Añadir tras `kicker` en el objeto `asesorias-v2-app`:
```ts
    heroTitle: "Añadiendo capas",
    heroSubtitle: "La v1 era plana; la v2 le dio profundidad a cada flujo.",
```
Dejar `thesis` y `subthesis` como están (serán el deck).

- [ ] **Step 3: Verificar**

Run: `npm run lint && npm run build`
Expected: pasa; TypeScript obliga a que ambos campos existan.

- [ ] **Step 4: Commit**
```bash
git add data/casos.ts
git commit -m "feat(casos): add heroTitle and heroSubtitle fields

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Rediseño del hero (`CaseHero` + CSS)

**Files:**
- Modify: `components/casos/CaseHero.tsx`
- Modify: `app/globals.css` (reemplazar el bloque `.case-hero*` existente)
- Test: `npm run lint && npm run build` + render.

**Interfaces:**
- Consumes: `CaseStudy` (con `heroTitle`, `heroSubtitle`, `thesis`, `subthesis`, `kicker`, `heroMedia?`).
- Produces: `CaseHero({ caso }: { caso: CaseStudy })` sin cambio de firma.

- [ ] **Step 1: Reescribir `CaseHero.tsx`**

```tsx
import Image from "next/image";
import type { CaseStudy } from "@/data/casos";

export default function CaseHero({ caso }: { caso: CaseStudy }) {
  return (
    <header className="case-hero">
      <p className="eyebrow">✶ {caso.kicker}</p>
      <h1 className="case-hero__title">{caso.heroTitle}</h1>
      <p className="case-hero__subtitle">{caso.heroSubtitle}</p>
      <div className="case-hero__deck">
        <p>{caso.thesis}</p>
        <p>{caso.subthesis}</p>
      </div>
      {caso.heroMedia ? (
        <figure className="case-hero__media">
          <Image
            src={caso.heroMedia.src}
            alt={caso.heroMedia.alt}
            width={1600}
            height={700}
            priority
          />
          {caso.heroMedia.caption ? (
            <figcaption>{caso.heroMedia.caption}</figcaption>
          ) : null}
        </figure>
      ) : null}
    </header>
  );
}
```

Nota: se elimina el antiguo `.case-hero__back` (el enlace "Volver" pasa a `CaseSideNav` en la Task 4).

- [ ] **Step 2: Estilos del hero**

En `app/globals.css`, sustituir las reglas `.case-hero`, `.case-hero__back`, `.case-hero__thesis`, `.case-hero__subthesis`, `.case-hero__media` existentes por el nuevo set (borrar `.case-hero__back` y `.case-hero__thesis`/`.case-hero__subthesis` si ya no se usan):

- `.case-hero`: bloque vertical, sin `paper-shell` (irá dentro de la columna de contenido en la Task 4). Separación vertical entre elementos.
- `.case-hero__title`: `font-family: var(--serif)`; **`font-style: italic`**; tamaño display grande `clamp(3.2rem, 8vw, 6rem)`; `line-height: 0.95`; color `--ink`.
- `.case-hero__subtitle`: `font-family: var(--sans)`; `clamp(1.2rem, 2.4vw, 1.6rem)`; color `--ink`; `max-width: 52ch`.
- `.case-hero__deck`: dos párrafos; `font-family: var(--serif)` o `--sans` a ~`1.05rem`; color `--ink-soft`; `max-width: 60ch`; separación entre párrafos; un filete sutil `border-top: 1px solid var(--rule)` con padding superior para separarlo del subtítulo.
- `.case-hero__media`: figura full-width de la columna, `img { width: 100%; height: auto; display: block; border: 1px solid var(--rule); }`; margen superior generoso.

Responsive: en 720px el título baja de tamaño con el `clamp` ya definido; comprobar que no desborda.

- [ ] **Step 3: Build + render**

Run: `npm run lint && npm run build`, luego dev en 3001 y `curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3001/casos/asesorias-v2-app` → 200. Confirmar en el HTML: `curl -sS http://localhost:3001/casos/asesorias-v2-app | grep -c "case-hero__title"` → ≥ 1. (Sin imagen aún: `heroMedia` comentado, no debe romper.)

- [ ] **Step 4: Commit**
```bash
git add components/casos/CaseHero.tsx app/globals.css
git commit -m "feat(casos): editorial hero with italic title, subtitle, deck, media

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Chips estilo Strique (pill, activo en rojo)

**Files:**
- Modify: `components/casos/CaseViewToggle.tsx`
- Modify: `app/globals.css` (reglas `.case-toggle*`)
- Test: `npm run lint && npm run build` + render.

**Interfaces:**
- Produces: sin cambio de firma; `CaseView` sigue exportándose igual. Cambia el texto de `OPTIONS` y el render inline etiqueta·pista.

- [ ] **Step 1: Actualizar textos y render de `CaseViewToggle.tsx`**

Sustituir el array `OPTIONS` y el interior del `<button>` para render inline `ETIQUETA · pista`:

```tsx
const OPTIONS: { value: CaseView; label: string; hint: string }[] = [
  { value: "corta", label: "Vista reclutador", hint: "Resumen 30 seg" },
  { value: "extensa", label: "Vista design lead", hint: "Caso completo" },
];
```

Y el contenido del botón (dentro del `.map`, manteniendo `aria-pressed` y clases ya existentes de la feature anterior):
```tsx
          <button
            key={opt.value}
            type="button"
            aria-pressed={selected}
            className={`case-toggle__option ${selected ? "is-active" : ""}`}
            onClick={() => onChange(opt.value)}
          >
            <span className="case-toggle__label">{opt.label}</span>
            <span className="case-toggle__sep" aria-hidden="true"> · </span>
            <span className="case-toggle__hint">{opt.hint}</span>
          </button>
```
(El `.case-toggle__sep` es nuevo; mantener `.case-toggle__label` y `.case-toggle__hint`.)

- [ ] **Step 2: Reestilar `.case-toggle*` en `app/globals.css`**

Sustituir las reglas del toggle por el estilo pill:
- `.case-toggle`: contenedor pill, `display: inline-flex` (no full-width), `border: 1px solid var(--rule)`; `border-radius: 999px`; `padding: 4px`; fondo `--surface`/`--paper`; `gap: 0`.
- `.case-toggle__option`: `display: inline-flex; align-items: baseline; gap: 0`; `border-radius: 999px`; `padding: 0.6rem 1.2rem`; `font-family: var(--mono)`; `text-transform: uppercase`; `letter-spacing: 0.04em`; `font-size: 0.8rem`; cursor pointer; borde transparente; foco visible con `outline` `--red`.
- `.case-toggle__label`: peso fuerte (bold), color `--ink`.
- `.case-toggle__hint`, `.case-toggle__sep`: color `--ink-soft`, peso normal, un pelín más pequeño.
- `.case-toggle__option.is-active`: **fondo `var(--red)`**, pill redondeado; `.is-active .case-toggle__label` en `--paper` (blanco); `.is-active .case-toggle__hint`, `.is-active .case-toggle__sep` en `--paper` al ~72% de opacidad.
- Responsive 720px: el contenedor pasa a `display: flex; width: 100%`, las dos opciones se reparten (`flex: 1`, `justify-content: center`), manteniendo la forma pill. Si etiqueta·pista no cabe en una línea en móvil, permitir que la pista baje de línea centrada (mantener legible; nunca overflow horizontal).

- [ ] **Step 3: Build + render**

Run: `npm run lint && npm run build`; dev 3001; `curl ... /casos/asesorias-v2-app` → 200; abrir en navegador y confirmar el pill con "Vista reclutador · Resumen 30 seg" activo en rojo, y que al pulsar cambia el activo. En ~390px comprobar que no desborda.

- [ ] **Step 4: Commit**
```bash
git add components/casos/CaseViewToggle.tsx app/globals.css
git commit -m "feat(casos): pill-style view toggle with red active state

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Navegación lateral con scrollspy + layout de dos columnas

**Files:**
- Create: `components/casos/CaseSideNav.tsx`
- Modify: `components/casos/CaseStudyView.tsx`
- Modify: `app/globals.css` (layout + `.case-sidenav*`)
- Test: `npm run lint && npm run build` + render (ambas vistas, desktop + móvil).

**Interfaces:**
- Consumes: `CaseStudy` y `CaseView`.
- Produces:
  - `export type NavItem = { id: string; label: string; children?: { id: string; label: string }[] }`
  - `CaseSideNav({ items }: { items: NavItem[] })` (default export, client component).

- [ ] **Step 1: Crear `CaseSideNav.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";

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
      <a href="/casos" className="case-sidenav__back">
        ← Volver a los casos
      </a>
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
```

- [ ] **Step 2: Reescribir `CaseStudyView.tsx`** (layout de dos columnas, anclas con id, ítems por vista)

```tsx
"use client";

import { useState } from "react";
import type { CaseStudy } from "@/data/casos";
import CaseViewToggle, { type CaseView } from "./CaseViewToggle";
import CaseSideNav, { type NavItem } from "./CaseSideNav";
import CaseHero from "./CaseHero";
import CaseGlance from "./CaseGlance";
import CaseImpact from "./CaseImpact";
import CaseDecisionsBrief from "./CaseDecisionsBrief";
import CaseSection from "./CaseSection";
import CaseDecision from "./CaseDecision";
import CaseRest from "./CaseRest";
import CaseReflection from "./CaseReflection";
import CaseNav from "./CaseNav";

export default function CaseStudyView({ caso }: { caso: CaseStudy }) {
  const [view, setView] = useState<CaseView>("corta");

  const navItems: NavItem[] =
    view === "corta"
      ? [
          { id: "en-breve", label: "En breve" },
          { id: "impacto", label: "Impacto" },
          { id: "decisiones", label: "Decisiones clave" },
        ]
      : [
          { id: "en-breve", label: "En breve" },
          { id: "problema", label: "El problema" },
          { id: "como-trabajamos", label: "Cómo trabajamos" },
          {
            id: "decisiones",
            label: "Decisiones clave",
            children: caso.decisions.map((d) => ({
              id: `decision-${d.number}`,
              label: d.title,
            })),
          },
          { id: "resto", label: "El resto del trabajo" },
          { id: "reflexion", label: "Qué haría diferente" },
        ];

  return (
    <div className="case-shell">
      <CaseSideNav items={navItems} />
      <div className="case-content">
        <CaseHero caso={caso} />
        <CaseViewToggle view={view} onChange={setView} />

        {view === "corta" ? (
          <div className="case-view case-view--corta">
            <div id="en-breve" className="case-anchor">
              <CaseGlance glance={caso.glance} />
            </div>
            <div id="impacto" className="case-anchor">
              <CaseImpact items={caso.impact} />
            </div>
            <div id="decisiones" className="case-anchor">
              <CaseDecisionsBrief decisions={caso.decisions} />
            </div>
          </div>
        ) : (
          <div className="case-view case-view--extensa">
            <div id="en-breve" className="case-anchor">
              <CaseGlance glance={caso.glance} />
            </div>
            <div id="problema" className="case-anchor">
              <CaseSection prose={caso.problem} />
            </div>
            <div id="como-trabajamos" className="case-anchor">
              <CaseSection prose={caso.howWeWorked} />
            </div>
            <div id="decisiones" className="case-anchor case-decisions">
              {caso.decisions.map((decision) => (
                <div
                  id={`decision-${decision.number}`}
                  className="case-anchor"
                  key={decision.number}
                >
                  <CaseDecision decision={decision} />
                </div>
              ))}
            </div>
            <div id="resto" className="case-anchor">
              <CaseRest items={caso.rest} />
            </div>
            <div id="reflexion" className="case-anchor">
              <CaseReflection items={caso.reflection} />
            </div>
          </div>
        )}

        <CaseNav nextCase={caso.nextCase} />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Estilos de layout + barra lateral en `app/globals.css`**

Antes de escribir, leer el valor real de `--page` y del breakpoint en `app/globals.css`. Requisitos:

- `.case-shell`: en desktop, `display: grid; grid-template-columns: minmax(180px, 220px) minmax(0, 1fr); gap: clamp(2rem, 5vw, 5rem);` centrado con `width: min(100%, var(--page)); margin-inline: auto; padding-inline: var(--gutter);`. Las secciones dentro de `.case-content` ya usan `.paper-shell` (que se centrará dentro de la columna de contenido); para evitar doble gutter, dentro de `.case-content` neutralizar el `padding-inline`/`width` de `.paper-shell` (p.ej. `.case-content .paper-shell { width: 100%; padding-inline: 0; }`) para que ocupen la columna. Verificar visualmente que el ancho de lectura queda cómodo.
- `.case-sidenav`: `position: sticky; top: 2rem; align-self: start;` (columna izquierda). `.case-sidenav__back` en `--mono`, pequeño, con hover `--red`. `.case-sidenav__list` sin bullets, `font-family: var(--mono)`, `font-size: 0.85rem`, separación vertical entre ítems.
- `.case-sidenav__link`: fila con el marcador a la izquierda; color `--ink-soft` por defecto. `.case-sidenav__marker`: cuadrado pequeño (~10px) `background: transparent`. Estado activo `.case-sidenav__link.is-active`: color `--ink` (fuerte) y `.is-active .case-sidenav__marker { background: var(--red); }` (el cuadradito rojo de la referencia).
- `.case-sidenav__sublist`: indentado, `font-size: 0.78rem`; `.case-sidenav__sublink.is-active` en `--ink` (o `--red`), inactivo `--ink-soft`; truncar títulos largos con `text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 100%` para no romper la columna.
- `.case-anchor`: `scroll-margin-top: 2rem` (para que al saltar por ancla no quede pegado arriba).
- **Responsive (`@media (max-width: 980px)`):** `.case-shell { display: block; }` y `.case-sidenav { display: none; }`. `.case-content .paper-shell` recupera su comportamiento normal (o simplemente el bloqueo previo deja de aplicar porque el shell ya no es grid; asegurarse de que en móvil el contenido se ve igual que antes, a una columna centrada).
- El body nunca hace scroll horizontal.

- [ ] **Step 4: Build + render de ambas vistas**

Run: `npm run lint && npm run build`; dev 3001.
- `curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3001/casos/asesorias-v2-app` → 200.
- `curl -sS http://localhost:3001/casos/asesorias-v2-app | grep -c "case-sidenav"` → ≥ 1.
- Abrir en navegador: en desktop, la barra lateral muestra en vista reclutador **En breve · Impacto · Decisiones clave**; al pulsar el toggle a design lead, el índice cambia a las 6 secciones con las 4 decisiones anidadas. Al hacer scroll, el ítem visible se resalta con el cuadradito rojo; al clicar un ítem, salta a su sección. En ~390px la barra lateral desaparece y el contenido queda a una columna sin desbordar.

- [ ] **Step 5: Commit**
```bash
git add components/casos/CaseSideNav.tsx components/casos/CaseStudyView.tsx app/globals.css
git commit -m "feat(casos): sticky scrollspy side nav with per-view sections and two-column layout

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Después del plan (fuera de las tareas)

- Guardar la imagen abstracta en `public/casos/asesorias-v2-app/hero-abstracto.png` y **descomentar** en `data/casos.ts` la línea `heroMedia: { src: "/casos/asesorias-v2-app/hero-abstracto.png", alt: "..." }` (cambiar el `src` al nombre real). El hero ya la soporta.

## Self-Review (hecho por quien escribe el plan)

- **Cobertura:** título cursiva 1-2 palabras (Task 1 `heroTitle` + Task 2 `.case-hero__title` italic); subtítulo (Task 1 `heroSubtitle` + Task 2); deck v1→v2 con los dos párrafos huérfanos (Task 2, `thesis`+`subthesis`); imagen abstracta full-width (Task 2 `.case-hero__media`, opcional); chips pill rojo estilo Strique (Task 3); navegación lateral con scrollspy y secciones por vista, con 4 decisiones anidadas en design lead y ocultándose en móvil (Task 4). Sin huecos.
- **Placeholders:** contenido real (títulos, textos de chips) escrito, refinable por Kata; ningún "TODO" de código.
- **Consistencia de tipos:** `heroTitle`/`heroSubtitle` (Task 1) usados en `CaseHero` (Task 2); `NavItem`/`CaseSideNav` (Task 4) consumidos en `CaseStudyView` (Task 4); ids de ancla (`en-breve`, `impacto`, `decisiones`, `problema`, `como-trabajamos`, `resto`, `reflexion`, `decision-NN`) coinciden entre los `navItems` y los `<div id=...>`. Clases CSS de Task 2/3/4 coinciden con las reglas de sus pasos de estilo.
