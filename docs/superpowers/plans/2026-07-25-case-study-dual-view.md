# Dual-view de case study (reclutador / design lead) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir a cada case study dos vistas conmutables como en manushridave.com/work/strique: una vista corta para reclutadores (tesis + metadatos + impacto + decisiones en una línea) y una vista extensa para design leads (la página completa actual), con un toggle arriba y la vista corta por defecto.

**Architecture:** Se extiende el modelo `CaseStudy` con un resumen de una línea por decisión (`summary`) y un bloque de impacto (`impact`). La página de detalle (server component) delega el render a un nuevo componente cliente `CaseStudyView` que mantiene el estado de la vista (`corta` | `extensa`) y compone los componentes presentacionales existentes más tres nuevos (toggle, impacto, decisiones breves). Sin cambios en rutas ni dependencias.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, CSS propio en `app/globals.css`.

## Global Constraints

- **Sin framework de tests.** Verificación de cada tarea = `npm run lint && npm run build` + render en dev server. No añadir framework de tests (YAGNI).
- **No comitear en `main`.** Ya estamos en la rama `feat/caso-asesorias-v2-app`. Comitear tras cada tarea.
- **Puerto de dev:** usar `npm run dev -- -p 3001` para las comprobaciones de render (el 3000 puede estar ocupado por otra sesión).
- **Estética editorial:** reutilizar tokens y clases existentes (`paper-shell`, `eyebrow`, `--paper`, `--ink`, `--ink-soft`, `--red`, `--rule`, `--serif`, `--mono`, `--gutter`, `--page`). Prefijar clases nuevas con `case-`.
- **Idioma:** español (es-ES).
- **Vista por defecto:** `corta` (reclutador). El toggle permite pasar a `extensa` (design lead).
- **Impacto:** métricas de negocio como placeholders marcados "por medir" (retención, % cancelaciones, adherencia, uso del ranking). El modelo debe soportar tanto placeholder (`pending: true`) como valor real, para poder rellenarlas después sin tocar componentes.
- **Compatibilidad:** los componentes presentacionales existentes (`CaseHero`, `CaseGlance`, `CaseSection`, `CaseDecision`, `CaseRest`, `CaseReflection`, `CaseNav`) no se modifican; se reutilizan tal cual desde el nuevo orquestador cliente.

---

## File Structure

- `data/casos.ts` — MODIFICAR: añadir tipo `ImpactMetric`, campo `Decision.summary` (one-liner), campo `CaseStudy.impact: ImpactMetric[]`; poblar ambos para `asesorias-v2-app`.
- `components/casos/CaseViewToggle.tsx` — CREAR: el conmutador de vista (segmented control accesible).
- `components/casos/CaseImpact.tsx` — CREAR: bloque de impacto (grid de métricas, soporta estado `pending`).
- `components/casos/CaseDecisionsBrief.tsx` — CREAR: las 4 decisiones en una línea (número + título + summary).
- `components/casos/CaseStudyView.tsx` — CREAR (client component): mantiene el estado de vista, pinta el toggle y compone la vista corta o la extensa.
- `app/casos/[slug]/page.tsx` — MODIFICAR: sustituir la composición inline por `<CaseStudyView caso={caso} />`.
- `app/globals.css` — MODIFICAR: añadir estilos `.case-toggle*`, `.case-impact*`, `.case-brief*`.

---

## Task 1: Extender el modelo de datos y poblar `asesorias-v2-app`

**Files:**
- Modify: `data/casos.ts`
- Test: `npm run lint && npm run build`.

**Interfaces:**
- Produces:
  - `export type ImpactMetric = { value: string; label: string; note?: string; pending?: boolean }`
  - `Decision` gana `summary: string` (one-liner para la vista corta).
  - `CaseStudy` gana `impact: ImpactMetric[]`.

- [ ] **Step 1: Añadir los tipos**

En `data/casos.ts`, añadir el tipo `ImpactMetric` junto a los demás tipos, y ampliar `Decision` y `CaseStudy`:

```ts
export type ImpactMetric = {
  value: string; // p.ej. "Por medir" o "-12%"
  label: string; // p.ej. "% de cancelaciones"
  note?: string; // aclaración corta opcional
  pending?: boolean; // true = placeholder aún sin dato real
};
```

En `Decision`, añadir tras `title`:
```ts
  summary: string; // resumen de una línea para la vista corta
```

En `CaseStudy`, añadir tras `glance`:
```ts
  impact: ImpactMetric[];
```

- [ ] **Step 2: Añadir `summary` a las 4 decisiones**

Dentro del objeto `asesorias-v2-app`, añadir el campo `summary` a cada decisión (justo tras su `title`), con estos textos exactos:

- Decisión 01: `summary: "El contador de pasos pasa de dato pasivo a un ranking social que refuerza la filosofía de la marca.",`
- Decisión 02: `summary: "La dieta pasa de una lista plana a una experiencia visual con recetas, equivalencias y raciones.",`
- Decisión 03: `summary: "De solo fuerza a cuatro modalidades, y de 'qué hice ayer' a 'estoy mejorando' por ejercicio.",`
- Decisión 04: `summary: "Una sola pantalla de acceso decide por identidad y optimiza para el 98% que son usuarios que ya existen.",`

- [ ] **Step 3: Añadir el bloque `impact`**

Dentro del objeto `asesorias-v2-app`, añadir el campo `impact` justo después de `glance` (antes de `problem`):

```ts
    impact: [
      {
        value: "Por medir",
        label: "Retención del cliente coached",
        note: "v2 en producción desde julio de 2026",
        pending: true,
      },
      {
        value: "Por medir",
        label: "% de cancelaciones",
        pending: true,
      },
      {
        value: "Por medir",
        label: "Adherencia (entrenos completados)",
        pending: true,
      },
      {
        value: "Por medir",
        label: "Uso del ranking de pasos",
        pending: true,
      },
    ],
```

- [ ] **Step 4: Verificar compilación**

Run:
```bash
npm run lint && npm run build
```
Expected: lint sin errores (solo el warning preexistente de `HomeExperience.tsx`); build pasa. TypeScript obligará a que `impact` y `summary` existan porque son campos requeridos.

- [ ] **Step 5: Commit**

```bash
git add data/casos.ts
git commit -m "feat(casos): add impact metrics and per-decision summaries to data model

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Componentes presentacionales nuevos (toggle, impacto, decisiones breves)

**Files:**
- Create: `components/casos/CaseViewToggle.tsx`, `components/casos/CaseImpact.tsx`, `components/casos/CaseDecisionsBrief.tsx`
- Test: `npm run lint && npm run build`.

**Interfaces:**
- Consumes (de Task 1): tipos `ImpactMetric`, `Decision`.
- Produces (default exports):
  - `CaseViewToggle({ view, onChange }: { view: CaseView; onChange: (v: CaseView) => void })` donde `export type CaseView = "corta" | "extensa"` se define y exporta en este fichero.
  - `CaseImpact({ items }: { items: ImpactMetric[] })`
  - `CaseDecisionsBrief({ decisions }: { decisions: Decision[] })`

- [ ] **Step 1: `CaseViewToggle.tsx`**

```tsx
"use client";

export type CaseView = "corta" | "extensa";

const OPTIONS: { value: CaseView; label: string; hint: string }[] = [
  { value: "corta", label: "Para reclutadores", hint: "Rápido y al grano" },
  { value: "extensa", label: "Para design leads", hint: "El caso a fondo" },
];

export default function CaseViewToggle({
  view,
  onChange,
}: {
  view: CaseView;
  onChange: (v: CaseView) => void;
}) {
  return (
    <div className="paper-shell case-toggle" role="tablist" aria-label="Modo de lectura">
      {OPTIONS.map((opt) => {
        const selected = view === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={selected}
            className={`case-toggle__option ${selected ? "is-active" : ""}`}
            onClick={() => onChange(opt.value)}
          >
            <span className="case-toggle__label">{opt.label}</span>
            <span className="case-toggle__hint">{opt.hint}</span>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: `CaseImpact.tsx`**

```tsx
import type { ImpactMetric } from "@/data/casos";

export default function CaseImpact({ items }: { items: ImpactMetric[] }) {
  return (
    <section className="paper-shell case-impact" aria-label="Impacto">
      <p className="eyebrow">✶ Impacto</p>
      <div className="case-impact__grid">
        {items.map((item) => (
          <div
            key={item.label}
            className={`case-impact__item ${item.pending ? "is-pending" : ""}`}
          >
            <strong className="case-impact__value">{item.value}</strong>
            <span className="case-impact__label">{item.label}</span>
            {item.note ? (
              <span className="case-impact__note">{item.note}</span>
            ) : null}
            {item.pending ? (
              <span className="case-impact__tag">Por medir</span>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: `CaseDecisionsBrief.tsx`**

```tsx
import type { Decision } from "@/data/casos";

export default function CaseDecisionsBrief({
  decisions,
}: {
  decisions: Decision[];
}) {
  return (
    <section className="paper-shell case-brief" aria-label="Decisiones clave">
      <p className="eyebrow">✶ Decisiones clave</p>
      <ol className="case-brief__list">
        {decisions.map((decision) => (
          <li key={decision.number} className="case-brief__item">
            <span className="case-brief__number">/ {decision.number}</span>
            <div className="case-brief__text">
              <h3>{decision.title}</h3>
              <p>{decision.summary}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 4: Verificar compilación**

Run:
```bash
npm run lint && npm run build
```
Expected: pasa (los componentes aún no se importan en ninguna ruta).

- [ ] **Step 5: Commit**

```bash
git add components/casos/CaseViewToggle.tsx components/casos/CaseImpact.tsx components/casos/CaseDecisionsBrief.tsx
git commit -m "feat(casos): add view toggle, impact, and brief-decisions components

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Orquestador cliente `CaseStudyView` y cableado en la página

**Files:**
- Create: `components/casos/CaseStudyView.tsx`
- Modify: `app/casos/[slug]/page.tsx`
- Test: `npm run lint && npm run build` + render en dev de ambas vistas.

**Interfaces:**
- Consumes: `CaseStudy` (Task 1); `CaseView`, `CaseViewToggle` (Task 2); `CaseImpact`, `CaseDecisionsBrief` (Task 2); y los existentes `CaseHero`, `CaseGlance`, `CaseSection`, `CaseDecision`, `CaseRest`, `CaseReflection`, `CaseNav`.
- Produces: `CaseStudyView({ caso }: { caso: CaseStudy })` (default export, client component).

- [ ] **Step 1: `CaseStudyView.tsx`**

```tsx
"use client";

import { useState } from "react";
import type { CaseStudy } from "@/data/casos";
import CaseViewToggle, { type CaseView } from "./CaseViewToggle";
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

  return (
    <>
      <CaseHero caso={caso} />
      <CaseViewToggle view={view} onChange={setView} />

      {view === "corta" ? (
        <div className="case-view case-view--corta">
          <CaseGlance glance={caso.glance} />
          <CaseImpact items={caso.impact} />
          <CaseDecisionsBrief decisions={caso.decisions} />
        </div>
      ) : (
        <div className="case-view case-view--extensa">
          <CaseGlance glance={caso.glance} />
          <CaseSection prose={caso.problem} />
          <CaseSection prose={caso.howWeWorked} />
          <div className="case-decisions">
            {caso.decisions.map((decision) => (
              <CaseDecision key={decision.number} decision={decision} />
            ))}
          </div>
          <CaseRest items={caso.rest} />
          <CaseReflection items={caso.reflection} />
        </div>
      )}

      <CaseNav nextCase={caso.nextCase} />
    </>
  );
}
```

Nota de diseño: `CaseHero`, `CaseViewToggle` y `CaseNav` son comunes a las dos vistas; solo cambia el bloque central. `CaseGlance` aparece en ambas (es el "En breve", relevante para las dos audiencias).

- [ ] **Step 2: Simplificar `app/casos/[slug]/page.tsx`**

Sustituir el bloque `<article>...</article>` y el `<CaseNav .../>` que hoy componen las secciones por una única llamada al orquestador. El fichero debe quedar así (imports de sección eliminados salvo los necesarios):

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import CaseStudyView from "@/components/casos/CaseStudyView";
import { casos, getCaso } from "@/data/casos";

type CasoPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return casos.map((caso) => ({ slug: caso.slug }));
}

export async function generateMetadata({
  params,
}: CasoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caso = getCaso(slug);
  if (!caso) return {};
  return { title: `${caso.title} — El Diario de Kata`, description: caso.thesis };
}

export default async function CasoDetailPage({ params }: CasoPageProps) {
  const { slug } = await params;
  const caso = getCaso(slug);
  if (!caso) notFound();

  return (
    <>
      <SiteHeader />
      <main id="contenido" className="case-detail">
        <CaseStudyView caso={caso} />
      </main>
      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 3: Build + render de ambas vistas**

Run:
```bash
npm run lint && npm run build
```
Expected: build pasa; `/casos/asesorias-v2-app` sigue prerenderizándose (el estado de vista es cliente; el server pinta el HTML con la vista por defecto `corta`).

Luego:
```bash
npm run dev -- -p 3001
```
- `curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3001/casos/asesorias-v2-app` → 200.
- Confirmar en el HTML servido que por defecto se ve la vista corta: `curl -sS http://localhost:3001/casos/asesorias-v2-app | grep -c "case-impact"` → ≥ 1 (el bloque de impacto está en el DOM inicial) y `grep -c "case-decision__title"` → 0 (las decisiones extensas NO están en el DOM inicial, solo aparecen al conmutar).
- Abrir en el navegador y comprobar que el toggle cambia entre corta y extensa sin recargar. Matar el dev server al terminar.

- [ ] **Step 4: Commit**

```bash
git add components/casos/CaseStudyView.tsx app/casos/[slug]/page.tsx
git commit -m "feat(casos): dual-view orchestrator with recruiter/design-lead toggle

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Estilos del toggle, impacto y decisiones breves

**Files:**
- Modify: `app/globals.css` (añadir al final del bloque `/* ── Casos ── */` existente)
- Test: render en dev (desktop + móvil).

**Interfaces:**
- Consumes: clases emitidas por Task 2/3: `case-toggle`, `case-toggle__option`, `case-toggle__label`, `case-toggle__hint`, `is-active`; `case-impact`, `case-impact__grid`, `case-impact__item`, `is-pending`, `case-impact__value`, `case-impact__label`, `case-impact__note`, `case-impact__tag`; `case-brief`, `case-brief__list`, `case-brief__item`, `case-brief__number`, `case-brief__text`; `case-view`, `case-view--corta`, `case-view--extensa`.

- [ ] **Step 1: Añadir estilos**

Añadir al bloque de casos en `app/globals.css`, reutilizando los tokens existentes y los breakpoints `@media (max-width: 980px)` y `@media (max-width: 720px)`. Requisitos:

- `.case-toggle`: segmented control centrado en la columna de contenido, dos opciones lado a lado, con borde (`--rule`) y la opción activa invertida (fondo `--ink`, texto `--paper`) al estilo de `.process-card` en hover. `.case-toggle__label` en `--mono` mayúsculas; `.case-toggle__hint` más pequeño y `--ink-soft`. En móvil (720px) las dos opciones se apilan a ancho completo. Cursor pointer; foco visible (`outline` con `--red`).
- `.case-impact__grid`: 4 columnas en desktop, 2 en 980px, 1 en 720px. `.case-impact__value` en `--serif` grande (`clamp(1.8rem, 4vw, 2.8rem)`); `.case-impact__label` en `--sans`/`--mono` pequeño; `.case-impact__note` en `--ink-soft` pequeño; `.case-impact__item.is-pending .case-impact__value` atenuado (`--ink-soft`) para que el placeholder no compita con un dato real; `.case-impact__tag` como badge pequeño en `--mono` con borde, estilo etiqueta "por medir".
- `.case-brief__list`: lista numerada sin bullets; cada `.case-brief__item` en fila (número a la izquierda en `--mono`, texto a la derecha), separadas por `1px solid var(--rule)`. `.case-brief__text h3` en `--serif`; `.case-brief__text p` en `--ink-soft`, medida `max-width: 68ch`. En móvil el número puede ir encima del texto.
- `.case-view` no necesita más que el flujo vertical ya existente entre `paper-shell`; asegurar la misma separación vertical que la vista extensa.
- El page body nunca debe hacer scroll horizontal.

- [ ] **Step 2: Render desktop + móvil**

Run:
```bash
npm run dev -- -p 3001
```
Abrir `http://localhost:3001/casos/asesorias-v2-app`. Verificar: el toggle arranca en "Para reclutadores"; la vista corta muestra hero + toggle + En breve + Impacto (4 métricas con su badge "por medir") + 4 decisiones en una línea + nav. Al pulsar "Para design leads" aparece la versión extensa completa. Comprobar en viewport ~390px que el toggle se apila, el grid de impacto es de 1 columna y no hay overflow horizontal. Matar el dev server.

- [ ] **Step 3: Build final**

Run:
```bash
npm run lint && npm run build
```
Expected: sin errores.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "feat(casos): styles for dual-view toggle, impact, and brief decisions

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review (hecho por quien escribe el plan)

- **Cobertura del diseño:** toggle arriba con default corta (Task 2 `CaseViewToggle` + Task 3 estado `useState<CaseView>("corta")`); vista corta = tesis (CaseHero) + En breve (CaseGlance) + Impacto (CaseImpact) + 4 decisiones en 1 línea (CaseDecisionsBrief), Task 3; vista extensa = composición actual completa, Task 3; impacto con placeholders de negocio marcados "por medir", Task 1 `impact` + Task 2 `is-pending`/`case-impact__tag`. Sin huecos.
- **Placeholders:** los textos de `summary` e `impact` van escritos en el plan (contenido real, refinable por Kata), no como "TODO".
- **Consistencia de tipos:** `CaseView` se define en `CaseViewToggle.tsx` y se importa en `CaseStudyView.tsx`; `ImpactMetric`/`Decision.summary`/`CaseStudy.impact` definidos en Task 1 y consumidos en Task 2/3 con los mismos nombres; las clases CSS de Task 2/3 coinciden con las enumeradas en Task 4.
- **Compatibilidad:** no se modifican los 7 componentes de sección existentes ni las rutas; `page.tsx` solo cambia su composición interna.
