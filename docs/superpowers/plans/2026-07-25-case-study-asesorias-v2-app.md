# Case study "Asesorías V2 (app)" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar una página de case study editorial en `/casos/asesorias-v2-app` que cuente el rediseño v1→v2 de la app del cliente (tier coached de El Método), con tesis, tensión y 4 decisiones razonadas, reutilizando el patrón data-driven del proyecto.

**Architecture:** Datos tipados en `data/casos.ts` → componentes presentacionales en `components/casos/` → páginas server-component en `app/casos/` → estilo editorial en `app/globals.css`. Calcado del patrón existente `data/processes.ts` + `app/procesos/[slug]/page.tsx`. Sin dependencias nuevas.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4 + CSS propio en `globals.css`, framer-motion (ya instalado, opcional).

## Global Constraints

- **Sin framework de tests** en el repo (no jest/vitest/playwright). El ciclo de verificación de cada tarea es: `npm run lint` (ESLint) + `npm run build` (type-check + static generation de la ruta) y, donde sea visual, render manual con `npm run dev`. No añadir framework de tests (YAGNI).
- **No comitear en `main`.** Trabajar en una rama (`git switch -c feat/caso-asesorias-v2-app` antes de la Tarea 1). Comitear tras cada tarea.
- **Estética editorial:** reutilizar clases y tokens existentes (`paper-shell`, `eyebrow`, `--paper`, `--ink`, `--red`, `--serif`, `--mono`, `--gutter`). Prefijar las clases nuevas con `case-`.
- **Idioma:** todo el contenido en español (es-ES), coherente con "El Diario de Kata".
- **Slug de este caso:** `asesorias-v2-app`. El futuro caso de dashboard será `asesorias-v2-dash`.
- **Alcance:** solo app del cliente. NADA de decisiones de dashboard del coach.
- **Fuente de contenido:** `/Users/kataiturriaga/repos/elmetodo_asesorias/casos-de-estudio/asesorias-v2.md` (§2 marcas, §3 dieta, §8 recetas, y §1/§4/§7 para el bloque "resto").
- **Automática** es el tier de **suscripción** (más barato), NO gratis. Se menciona **una sola vez** como benchmark en "El problema".

---

## File Structure

- `data/casos.ts` — tipos `Decision` y `CaseStudy`, array `casos`, helpers `getCaso`/`getCasoNeighbors`. Una responsabilidad: contenido + acceso a datos.
- `components/casos/CaseHero.tsx` — hero: tesis + sub-tesis + metadatos + mock opcional.
- `components/casos/CaseGlance.tsx` — bloque "At a Glance" (rol, periodo, equipo, producto, problema, solución).
- `components/casos/CaseSection.tsx` — bloque de prosa reutilizable (título eyebrow + párrafos), usado por "El problema" y "Cómo trabajamos".
- `components/casos/CaseDecision.tsx` — esqueleto repetible de una decisión.
- `components/casos/CaseRest.tsx` — bloque ligero "el resto del trabajo".
- `components/casos/CaseReflection.tsx` — "qué haría diferente / pendiente".
- `components/casos/CaseNav.tsx` — CTA footer + link al siguiente caso.
- `app/casos/[slug]/page.tsx` — página de detalle (ensambla componentes desde datos).
- `app/casos/page.tsx` — índice de casos.
- `app/globals.css` — añadir bloque de estilos `.case-*` al final.
- `components/site/SiteHeader.tsx` — modificar el item "Trabajo" para enlazar al índice de casos.

---

## Task 1: Modelo de datos y contenido (`data/casos.ts`)

**Files:**
- Create: `data/casos.ts`
- Test: verificación por compilación (`npm run build`), sin fichero de test.

**Interfaces:**
- Produces:
  - `export type Decision = { number: string; title: string; area: string; from: string; decided: string[]; alternatives?: string[]; finalStructure?: string; media?: CaseMedia }`
  - `export type CaseMedia = { src: string; alt: string; caption?: string }`
  - `export type CaseStudy = { slug: string; title: string; kicker: string; thesis: string; subthesis: string; glance: CaseGlanceData; problem: CaseProse; howWeWorked: CaseProse; decisions: Decision[]; rest: RestItem[]; reflection: string[]; nextCase?: { slug: string; title: string }; heroMedia?: CaseMedia }`
  - `export type CaseGlanceData = { role: string; period: string; team: string; product: string; problem: string; solution: string }`
  - `export type CaseProse = { eyebrow: string; title: string; paragraphs: string[] }`
  - `export type RestItem = { title: string; summary: string }`
  - `export const casos: CaseStudy[]`
  - `export function getCaso(slug: string): CaseStudy | undefined`
  - `export function getCasoNeighbors(slug: string): { previous?: CaseStudy; next?: CaseStudy }`

- [ ] **Step 1: Crear la rama de trabajo**

Run:
```bash
git switch -c feat/caso-asesorias-v2-app
```
Expected: "Switched to a new branch 'feat/caso-asesorias-v2-app'".

- [ ] **Step 2: Escribir tipos y helpers en `data/casos.ts`**

Crear `data/casos.ts` con exactamente estos tipos y helpers (el array `casos` se rellena en el Step 3):

```ts
export type CaseMedia = { src: string; alt: string; caption?: string };

export type CaseProse = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
};

export type CaseGlanceData = {
  role: string;
  period: string;
  team: string;
  product: string;
  problem: string;
  solution: string;
};

export type Decision = {
  number: string; // "01".."04"
  title: string;
  area: string;
  from: string; // "de dónde veníamos"
  decided: string[]; // "qué decidimos y por qué"
  alternatives?: string[]; // alternativas descartadas
  finalStructure?: string; // estructura final (texto/ascii)
  media?: CaseMedia;
};

export type RestItem = { title: string; summary: string };

export type CaseStudy = {
  slug: string;
  title: string;
  kicker: string; // eyebrow del hero
  thesis: string;
  subthesis: string;
  glance: CaseGlanceData;
  problem: CaseProse;
  howWeWorked: CaseProse;
  decisions: Decision[];
  rest: RestItem[];
  reflection: string[];
  nextCase?: { slug: string; title: string };
  heroMedia?: CaseMedia;
};

export const casos: CaseStudy[] = [
  // rellenado en Step 3
];

export function getCaso(slug: string): CaseStudy | undefined {
  return casos.find((caso) => caso.slug === slug);
}

export function getCasoNeighbors(slug: string): {
  previous?: CaseStudy;
  next?: CaseStudy;
} {
  const index = casos.findIndex((caso) => caso.slug === slug);
  if (index === -1) return {};
  return {
    previous: index > 0 ? casos[index - 1] : undefined,
    next: index < casos.length - 1 ? casos[index + 1] : undefined,
  };
}
```

- [ ] **Step 3: Rellenar el objeto `CaseStudy` de `asesorias-v2-app`**

Dentro del array `casos`, añadir un objeto con `slug: "asesorias-v2-app"`. Rellenar los campos así:

- `title`: `"Asesorías V2 — la app del cliente"`
- `kicker`: `"Caso de estudio · App coached · 2026"`
- `thesis`: `"La v1 era plana. Un estilo de entreno, una lista de dieta, un contador de pasos que nadie miraba."`
- `subthesis`: `"La v2 le dio profundidad a cada flujo: más experiencias de entreno, una dieta con capas, los pasos convertidos en juego y una puerta de entrada sin fricción."`
- `glance`: `{ role: "Product Designer + PM", period: "Abril–Junio 2026", team: "2 personas (diseño/PM + desarrollo)", product: "El Método — tier coached (asesorías personalizadas)", problem: "El tier coached costaba más que la suscripción pero heredó una app peor, plana y superficial.", solution: "Rediseño v1→v2 que añade capas de información y experiencias a cada flujo clave del cliente." }`
- `problem` (`CaseProse`): eyebrow `"El problema"`, title `"Pagaban más, recibían menos"`, `paragraphs`: 2–3 párrafos que digan: (a) la app coached estaba muy por debajo del nivel de la app de suscripción (Automática) — **única mención a Automática, como benchmark interno de calidad**; (b) cada flujo era plano y de máximo 3 capas: un solo tipo de entreno, una lista de dieta sin variedad, un contador de pasos pasivo; (c) el objetivo de la v2 fue cerrar esa brecha dando profundidad. Portar el tono del §"El problema" de `asesorias-v2.md`.
- `howWeWorked` (`CaseProse`): eyebrow `"Cómo trabajamos"`, title `"Un equipo de dos, decisiones sobre datos de uso"`, `paragraphs`: equipo de 2, benchmark = app Automática, y decisiones ancladas en dato real de uso (ej.: el 58% abre la app justo antes de cada comida → menos pantallas en ese momento). 1–2 párrafos.
- `decisions`: array con las 4 decisiones descritas abajo (Steps 3a–3d).
- `rest` (`RestItem[]`): 3 items ligeros portados de `asesorias-v2.md`:
  1. `{ title: "Rediseño de Revisiones", summary: "De 'Progreso' a 'Revisiones': comparador foto como hero, score por ciclo con racha, y fuera los memes de los estados vacíos." }` (§1)
  2. `{ title: "% graso: IA + validación del coach", summary: "Decisión de producto con research de precisión real (sesgo de género, MAE); la IA propone y el coach firma para proteger el valor del tier coached." }` (§4)
  3. `{ title: "Teléfono en el onboarding", summary: "Capturar la llave de emparejamiento con el coach sin romper la ilusión de seguimiento personal, apoyando el copy en el WhatsApp previo a la compra." }` (§7)
- `reflection` (`string[]`): 3–4 aprendizajes honestos, p.ej.: hipótesis de perfil de usuario sin validar (solo hay frecuencia de apertura, no contexto); deuda de tokens (colores hardcodeados en los gráficos); empty states incompletos en 6 de 7 tipos de entreno; validar si el comparador de revisiones debería ser interactivo. Portar de las secciones "Lo que quedó pendiente" de `asesorias-v2.md`.
- `nextCase`: `{ slug: "asesorias-v2-dash", title: "Asesorías V2 — el dashboard del coach" }`
- `heroMedia`: `{ src: "/casos/asesorias-v2-app/hero.png", alt: "App El Método — pantallas de la v2" }` (la imagen se añade en la Tarea 4; de momento la ruta puede no existir, el componente la trata como opcional).

- [ ] **Step 3a: Decisión 01 — Ranking de pasos** (contenido REDACTADO desde notas de chat; refinar con Kata)

```ts
{
  number: "01",
  title: "El contador de pasos se convierte en juego",
  area: "Retención / gamificación / filosofía de marca",
  from:
    "En la v1 la app tenía un contador de pasos: un número pasivo que registraba el día y no llevaba a ninguna parte. El objetivo de pasos diarios es una de las patas de la filosofía del método — combinar entrenamiento de fuerza (u otras modalidades) con movimiento moderado, andar — pero el producto no lo trataba como algo que importara. Un dato que nadie miraba.",
  decided: [
    "En la v2 el contador se mantiene, pero encima se construye un ranking basado en los pasos: los clientes compiten entre ellos por cumplir el objetivo diario. El número deja de ser un registro privado y pasa a ser una posición social.",
    "El motivo es alinear el producto con la filosofía de marca: si andar es media ecuación del método, tiene que sentirse tan protagonista como levantar peso. Un ranking convierte un hábito silencioso en algo con fricción emocional — quieres subir, quieres no bajar.",
    "El % de días con objetivo de pasos cumplido alimenta además el score del ciclo, así que el mismo dato tiene una lectura social (ranking) y una lectura personal (progreso en tus revisiones).",
  ],
  alternatives: [
    "Dejar solo el contador con un objetivo personal (statu quo mejorado): más simple, pero no explota la palanca social ni refuerza la filosofía.",
    "Insignias/medallas individuales sin comparación entre usuarios: gamificación sin el gancho competitivo; menos motivador para una comunidad que ya se conoce.",
  ],
  finalStructure:
    "Pasos\n  ├── Contador diario (objetivo personal)\n  └── Ranking entre clientes (posición por objetivo cumplido)\n        └── alimenta el score del ciclo (% días con objetivo)",
}
```

- [ ] **Step 3b: Decisión 02 — Dieta con capas** (portar de `asesorias-v2.md` §3 y §8)

```ts
{
  number: "02",
  title: "De una lista plana a una dieta con capas",
  area: "Consulta de dieta / experiencia diaria del cliente",
  from:
    "La pantalla de dieta de la v1 separaba las dos decisiones del usuario en dos pantallas (elegir comida, luego ver opciones): dos taps, dos momentos de orientación. Y era una lista sin variedad: sin recetas, sin equivalencias, sin forma de ver cantidades en el formato que cada cliente prefiere. Pura consulta rápida antes de comer, tratada como un documento.",
  decided: [
    "Chips para navegar entre comidas del día y cards con la foto del plato a ancho completo como protagonista, con un badge de 'Opción 1/2/3'. La comida es visual: ver el plato reduce la carga de la decisión más que cualquier texto. Basado en el dato de que el 58% abre la app justo antes de comer — cada pantalla extra es fricción real.",
    "Acordeón de ingredientes dentro de la card (uno abierto a la vez): verificar cantidades sin cambiar de pantalla ni perder de vista las otras opciones.",
    "Pantalla de detalle con tabs por opción, toggle Raciones/Unidades, equivalencias de ingredientes para sustituciones y recetas asociadas. Las recetas se construyen sobre los mismos ingredient_id de la opción del cliente, así el match es por construcción y las cantidades se personalizan con un join directo.",
  ],
  alternatives: [
    "Tabs fijos con las comidas: más limpio, pero las abreviaturas (C.2, C.3) perdían contexto.",
    "Lista + bottom sheet: comunica el día entero pero obligaba a definir el comportamiento del sheet.",
    "Timeline vertical con la comida actual expandida: legible ('estás aquí') pero más pesado para el caso principal de consulta rápida. Se combinó lo mejor: navegación por chips + cards ricas.",
  ],
  finalStructure:
    "Pantalla dieta\n  ├── Chips → navegar comidas del día\n  └── Cards por opción (foto full-width + badge + nombre)\n        └── [Ingredientes] accordion con cantidades\n              └── Ver recetas y detalle → Detalle\n\nDetalle\n  ├── Tabs 1/2/3 · Imagen grande\n  ├── Toggle Raciones/Unidades\n  ├── Equivalencias de ingredientes\n  └── Recetas asociadas",
}
```

- [ ] **Step 3c: Decisión 03 — Nuevas experiencias de entreno + evolución de marcas** (portar de §2)

```ts
{
  number: "03",
  title: "De solo fuerza a varias experiencias, y de 'ayer' a 'estoy mejorando'",
  area: "Retención / motivación / progreso de entrenamiento",
  from:
    "La v1 ofrecía una sola experiencia de entrenamiento: fuerza. Y el histórico de marcas mostraba la última marca de la última sesión — un snapshot de 'qué hice ayer', útil como referencia de carga pero sin ninguna señal de tendencia. No respondía a la pregunta que retiene: '¿estoy mejorando?'.",
  decided: [
    "Se amplió la oferta a varias modalidades: además de fuerza, híbrido, running y Hyrox — cada una con su propia métrica (kg, tiempo mm:ss, rondas, AMRAP). El producto deja de asumir un único tipo de cliente.",
    "Se cambió la granularidad: de 'última marca por sesión' a 'evolución por ejercicio'. Cada ejercicio es una tarjeta con una línea de progreso a lo largo de las sesiones. El cambio no es de datos (ambos tienen el historial) sino de qué pregunta se considera más relevante.",
    "El header de cada tarjeta muestra el valor actual y el delta respecto a la sesión anterior en color de marca: la mejora es el dato protagonista, no el valor absoluto. Una curva ascendente en 8 semanas es un argumento que ninguna fila de tabla da.",
  ],
  alternatives: [
    "Mantener la última marca por sesión (statu quo): operativamente útil para preparar la sesión, pero sin valor narrativo ni motivacional.",
    "Un único gráfico agregado de 'volumen total': esconde el progreso por ejercicio, que es lo que el usuario reconoce como suyo.",
  ],
  finalStructure:
    "Marcas por ejercicio (7 tipos)\n  └── Tarjeta por ejercicio\n        ├── Valor actual + delta vs sesión anterior (color marca)\n        └── Línea de progreso sobre sesiones completadas\n              └── empty state si 0 sesiones",
}
```

- [ ] **Step 3d: Decisión 04 — Flujo de entrada + social logins** (contenido REDACTADO desde notas de chat; refinar con Kata)

```ts
{
  number: "04",
  title: "Una puerta de entrada sin fricción, para nuevos y antiguos",
  area: "Onboarding / activación / autenticación",
  from:
    "La entrada de la v1 dependía de email y contraseña, con un flujo largo. Al añadir social logins (Google/Apple) aparece un problema que no es trivial: los usuarios antiguos ya tienen cuenta con email; si entran ahora con un social, no se debe crear una cuenta duplicada ni dejar huérfano su historial. Y los usuarios nuevos deben poder hacer el alta con un social de forma directa, sin pasar por un formulario.",
  decided: [
    "Dos caminos, un solo resultado. Usuario nuevo: alta directa con el social — cero fricción, sin formulario. Usuario antiguo: al entrar con un social cuyo email coincide con una cuenta existente, se sincroniza (vincula) el social a esa cuenta en lugar de crear una nueva, conservando todo su historial.",
    "La clave del diseño es que el email es el identificador de reconciliación: el mismo email de la cuenta vieja y del social hacen match, así que 'entrar con Google' sobre una cuenta preexistente se resuelve como vinculación silenciosa, no como registro.",
    "Se simplificó y explicó el flujo de entrada para que el usuario nunca tenga que entender esta complejidad: entra como quiere entrar y acaba en su cuenta de siempre.",
  ],
  alternatives: [
    "Tratar cada social como cuenta nueva siempre: rompe el historial de los usuarios antiguos y genera duplicados.",
    "Obligar a los antiguos a migrar manualmente vinculando desde ajustes: más control pero fricción y abandono; la mayoría no lo haría.",
  ],
  finalStructure:
    "Entrada\n  ├── Nuevo → social login → alta directa (sin formulario)\n  └── Antiguo → social login\n        └── email coincide con cuenta existente\n              → vincular social a esa cuenta (conserva historial)",
}
```

- [ ] **Step 4: Verificar que compila y pasa el lint**

Run:
```bash
npm run lint && npm run build
```
Expected: lint sin errores; build completa (la ruta `/casos/asesorias-v2-app` aún NO existe, así que el build solo type-checkea `data/casos.ts`; debe pasar sin errores de tipos).

- [ ] **Step 5: Commit**

```bash
git add data/casos.ts
git commit -m "feat(casos): add case study data model and asesorias-v2-app content"
```

---

## Task 2: Componentes de sección (`components/casos/`)

**Files:**
- Create: `components/casos/CaseHero.tsx`, `CaseGlance.tsx`, `CaseSection.tsx`, `CaseDecision.tsx`, `CaseRest.tsx`, `CaseReflection.tsx`, `CaseNav.tsx`
- Test: verificación por compilación (`npm run build`).

**Interfaces:**
- Consumes (de Task 1): tipos `CaseStudy`, `Decision`, `CaseProse`, `CaseGlanceData`, `RestItem`, `CaseMedia`.
- Produces (default exports, todos server components salvo indicación):
  - `CaseHero({ caso }: { caso: CaseStudy })`
  - `CaseGlance({ glance }: { glance: CaseGlanceData })`
  - `CaseSection({ prose }: { prose: CaseProse })`
  - `CaseDecision({ decision }: { decision: Decision })`
  - `CaseRest({ items }: { items: RestItem[] })`
  - `CaseReflection({ items }: { items: string[] })`
  - `CaseNav({ nextCase }: { nextCase?: { slug: string; title: string } })`

- [ ] **Step 1: `CaseSection.tsx` (bloque de prosa reutilizable)**

```tsx
import type { CaseProse } from "@/data/casos";

export default function CaseSection({ prose }: { prose: CaseProse }) {
  return (
    <section className="paper-shell case-section">
      <p className="eyebrow">✶ {prose.eyebrow}</p>
      <h2>{prose.title}</h2>
      <div className="case-section__body">
        {prose.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: `CaseHero.tsx`**

```tsx
import Link from "next/link";
import Image from "next/image";
import type { CaseStudy } from "@/data/casos";

export default function CaseHero({ caso }: { caso: CaseStudy }) {
  return (
    <header className="paper-shell case-hero">
      <Link href="/casos" className="case-hero__back">
        ← Volver a los casos
      </Link>
      <p className="eyebrow">✶ {caso.kicker}</p>
      <h1 className="case-hero__thesis">{caso.thesis}</h1>
      <p className="case-hero__subthesis">{caso.subthesis}</p>
      {caso.heroMedia ? (
        <div className="case-hero__media">
          <Image
            src={caso.heroMedia.src}
            alt={caso.heroMedia.alt}
            width={1600}
            height={900}
            priority
          />
        </div>
      ) : null}
    </header>
  );
}
```

Nota: si `heroMedia.src` apunta a un fichero que aún no existe, `next/image` fallará en runtime. La imagen se añade en la Tarea 4; hasta entonces, `heroMedia` puede dejarse `undefined` en los datos para no romper el render. (En Task 1 Step 3 se define `heroMedia`; si al probar la Tarea 3 no hay imagen todavía, comentar `heroMedia` temporalmente.)

- [ ] **Step 3: `CaseGlance.tsx`**

```tsx
import type { CaseGlanceData } from "@/data/casos";

const ROWS: { label: string; key: keyof CaseGlanceData }[] = [
  { label: "Rol", key: "role" },
  { label: "Periodo", key: "period" },
  { label: "Equipo", key: "team" },
  { label: "Producto", key: "product" },
  { label: "Problema", key: "problem" },
  { label: "Solución", key: "solution" },
];

export default function CaseGlance({ glance }: { glance: CaseGlanceData }) {
  return (
    <section className="paper-shell case-glance" aria-label="Resumen del proyecto">
      <p className="eyebrow">✶ En breve</p>
      <dl className="case-glance__grid">
        {ROWS.map((row) => (
          <div key={row.key} className="case-glance__row">
            <dt>{row.label}</dt>
            <dd>{glance[row.key]}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

- [ ] **Step 4: `CaseDecision.tsx`**

```tsx
import Image from "next/image";
import type { Decision } from "@/data/casos";

export default function CaseDecision({ decision }: { decision: Decision }) {
  return (
    <section className="paper-shell case-decision">
      <div className="case-decision__head">
        <span className="case-decision__number">/ {decision.number}</span>
        <p className="eyebrow">{decision.area}</p>
      </div>
      <h2 className="case-decision__title">{decision.title}</h2>

      <div className="case-decision__block">
        <h3>De dónde veníamos</h3>
        <p>{decision.from}</p>
      </div>

      <div className="case-decision__block">
        <h3>Qué decidimos y por qué</h3>
        {decision.decided.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      {decision.alternatives?.length ? (
        <div className="case-decision__block">
          <h3>Alternativas descartadas</h3>
          <ul className="case-decision__alts">
            {decision.alternatives.map((alt) => (
              <li key={alt}>{alt}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {decision.finalStructure ? (
        <pre className="case-decision__structure">{decision.finalStructure}</pre>
      ) : null}

      {decision.media ? (
        <figure className="case-decision__media">
          <Image
            src={decision.media.src}
            alt={decision.media.alt}
            width={1600}
            height={1000}
          />
          {decision.media.caption ? (
            <figcaption>{decision.media.caption}</figcaption>
          ) : null}
        </figure>
      ) : null}
    </section>
  );
}
```

- [ ] **Step 5: `CaseRest.tsx`**

```tsx
import type { RestItem } from "@/data/casos";

export default function CaseRest({ items }: { items: RestItem[] }) {
  return (
    <section className="paper-shell case-rest">
      <p className="eyebrow">✶ El resto del trabajo</p>
      <h2>Otras piezas de la v2</h2>
      <div className="case-rest__grid">
        {items.map((item) => (
          <article key={item.title} className="case-rest__item">
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: `CaseReflection.tsx`**

```tsx
export default function CaseReflection({ items }: { items: string[] }) {
  return (
    <section className="paper-shell case-reflection">
      <p className="eyebrow">✶ Con perspectiva</p>
      <h2>Qué haría diferente / qué quedó pendiente</h2>
      <ul className="case-reflection__list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 7: `CaseNav.tsx`**

```tsx
import Link from "next/link";

export default function CaseNav({
  nextCase,
}: {
  nextCase?: { slug: string; title: string };
}) {
  return (
    <nav className="paper-shell case-nav" aria-label="Navegación de casos">
      <div className="case-nav__cta">
        <p className="eyebrow">✶ ¿Hablamos?</p>
        <Link href="/#contacto">Escríbeme sobre este proyecto →</Link>
      </div>
      {nextCase ? (
        <Link href={`/casos/${nextCase.slug}`} className="case-nav__next">
          <span>Siguiente caso →</span>
          <strong>{nextCase.title}</strong>
        </Link>
      ) : null}
    </nav>
  );
}
```

- [ ] **Step 8: Verificar compilación**

Run:
```bash
npm run lint && npm run build
```
Expected: lint sin errores; build pasa (los componentes aún no se importan en ninguna ruta, pero deben type-checkear).

- [ ] **Step 9: Commit**

```bash
git add components/casos
git commit -m "feat(casos): add case study section components"
```

---

## Task 3: Rutas `/casos` y `/casos/[slug]`

**Files:**
- Create: `app/casos/[slug]/page.tsx`, `app/casos/page.tsx`
- Modify: `components/site/SiteHeader.tsx` (item "Trabajo" → índice de casos)
- Test: `npm run build` (genera estáticamente la ruta) + render con `npm run dev`.

**Interfaces:**
- Consumes: `casos`, `getCaso`, `getCasoNeighbors` (Task 1); todos los componentes de Task 2; `SiteHeader`, `SiteFooter` existentes.

- [ ] **Step 1: `app/casos/[slug]/page.tsx` (detalle)**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import CaseHero from "@/components/casos/CaseHero";
import CaseGlance from "@/components/casos/CaseGlance";
import CaseSection from "@/components/casos/CaseSection";
import CaseDecision from "@/components/casos/CaseDecision";
import CaseRest from "@/components/casos/CaseRest";
import CaseReflection from "@/components/casos/CaseReflection";
import CaseNav from "@/components/casos/CaseNav";
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
        <article>
          <CaseHero caso={caso} />
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
        </article>
        <CaseNav nextCase={caso.nextCase} />
      </main>
      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 2: `app/casos/page.tsx` (índice)**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { casos } from "@/data/casos";

export const metadata: Metadata = {
  title: "Casos — El Diario de Kata",
  description:
    "Case studies de producto: decisiones de diseño con contexto, tensión y criterio.",
};

export default function CasosPage() {
  return (
    <>
      <SiteHeader />
      <main id="contenido" className="casos-index">
        <section className="paper-shell casos-index__hero">
          <p className="eyebrow">✶ Portada de casos</p>
          <h1>Casos</h1>
          <p className="casos-index__deck">
            Historias de producto contadas por sus decisiones: de dónde veníamos,
            qué elegimos y por qué.
          </p>
        </section>
        <section className="paper-shell casos-index__grid">
          {casos.map((caso) => (
            <Link
              key={caso.slug}
              href={`/casos/${caso.slug}`}
              className="casos-index__card"
            >
              <p className="eyebrow">{caso.kicker}</p>
              <h2>{caso.title}</h2>
              <p>{caso.thesis}</p>
              <span aria-hidden="true">Leer el caso ↗</span>
            </Link>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 3: Enlazar "Trabajo" en el header al índice de casos**

En `components/site/SiteHeader.tsx`, cambiar el primer item de `navItems`:

```tsx
const navItems = [
  { label: "Trabajo", homeHref: "/casos", innerHref: "/casos" },
  { label: "Procesos", homeHref: "/procesos", innerHref: "/procesos" },
  { label: "Trayectoria", homeHref: "#trayectoria", innerHref: "/#trayectoria" },
  { label: "Contacto", homeHref: "#contacto", innerHref: "/#contacto" },
];
```

Y ampliar la marca de `aria-current` para casos, cambiando la línea `const isCurrent =` por:

```tsx
            const isCurrent =
              (item.label === "Procesos" && pathname.startsWith("/procesos")) ||
              (item.label === "Trabajo" && pathname.startsWith("/casos"));
```

- [ ] **Step 4: Comprobar que `heroMedia` no rompe el render**

Si en Task 1 se definió `heroMedia` con una ruta de imagen que aún no existe en `public/`, comentarla temporalmente en `data/casos.ts` para que `next/image` no falle. Se restaura en la Tarea 4 al añadir la imagen.

- [ ] **Step 5: Build + render**

Run:
```bash
npm run lint && npm run build
```
Expected: build genera `/casos` y `/casos/asesorias-v2-app` sin errores.

Luego:
```bash
npm run dev
```
Abrir `http://localhost:3000/casos/asesorias-v2-app` y `http://localhost:3000/casos`. Verificar que ambas páginas renderizan todas las secciones (hero, en breve, problema, cómo trabajamos, 4 decisiones, resto, reflexión, nav) sin errores en consola. (Usar la skill `run` para lanzar y capturar si está disponible.)

- [ ] **Step 6: Commit**

```bash
git add app/casos components/site/SiteHeader.tsx data/casos.ts
git commit -m "feat(casos): add /casos index and detail routes, link from header"
```

---

## Task 4: Estilo editorial (`.case-*`) e imagen del hero

**Files:**
- Modify: `app/globals.css` (añadir bloque al final)
- Create: `public/casos/asesorias-v2-app/hero.png` (imagen o mock; si no hay imagen real todavía, dejar `heroMedia` sin definir y omitir este fichero)
- Test: render visual con `npm run dev`.

**Interfaces:**
- Consumes: las clases usadas por los componentes de Task 2/3: `case-hero`, `case-hero__back/thesis/subthesis/media`, `case-glance`, `case-glance__grid/row`, `case-section`, `case-section__body`, `case-decision`, `case-decision__head/number/title/block/alts/structure/media`, `case-rest`, `case-rest__grid/item`, `case-reflection`, `case-reflection__list`, `case-nav`, `case-nav__cta/next`, `case-detail`, `case-decisions`, `casos-index`, `casos-index__hero/deck/grid/card`.

- [ ] **Step 1: Añadir estilos al final de `app/globals.css`**

Añadir un bloque `/* ── Casos ── */` reutilizando las variables existentes (`--paper`, `--ink`, `--ink-soft`, `--red`, `--rule`, `--serif`, `--mono`, `--gutter`, `--page`, `--body-size`). Requisitos mínimos de estilo (seguir el lenguaje visual de `.process-detail`):

- `.case-detail` apila secciones con separación vertical generosa; cada `.paper-shell` mantiene el ancho `min(100%, var(--page))` centrado.
- `.case-hero__thesis` en `--serif`, tamaño display grande (`clamp(2.6rem, 6vw, 4.6rem)`), interlineado ceñido; `.case-hero__subthesis` en `--serif` o `--sans` a ~`1.25rem`, `--ink-soft`. `.case-hero__back` en `--mono`, pequeño, color `--red` en hover.
- `.case-glance__grid` en dos columnas en desktop (label `--mono` en mayúsculas + valor), una columna en móvil; `dt` en `--mono` pequeño y `--ink-soft`, `dd` en `--serif`.
- `.case-section__body p` con medida de lectura cómoda (`max-width: 68ch`) y espaciado entre párrafos.
- `.case-decision` con una regla superior (`border-top: 3px double var(--ink)`) para separarlas como piezas de periódico; `.case-decision__number` en `--mono`; `.case-decision__title` en `--serif` grande; `.case-decision__block h3` en `--mono` mayúsculas como sub-eyebrow; `.case-decision__structure` en `--mono`, fondo sutil, `white-space: pre`, con `overflow-x: auto`.
- `.case-rest__grid` en 3 columnas desktop / 1 móvil; `.case-reflection__list` como lista con marcador editorial.
- `.case-nav` en fila (CTA a la izquierda, siguiente caso a la derecha), apilado en móvil.
- `.casos-index__grid` en cards a 2 columnas desktop / 1 móvil, con la misma estética que `.process-card`.

Todos los bloques deben ser responsive (breakpoint coherente con el resto del fichero — buscar el `@media` existente para alinear el valor).

- [ ] **Step 2: (Opcional) Añadir imagen del hero**

Si hay un mock/captura disponible, guardarlo en `public/casos/asesorias-v2-app/hero.png` y restaurar `heroMedia` en `data/casos.ts`. Si no, dejar `heroMedia` sin definir (el hero funciona sin imagen).

- [ ] **Step 3: Render visual**

Run:
```bash
npm run dev
```
Abrir `http://localhost:3000/casos/asesorias-v2-app`. Verificar: jerarquía tipográfica correcta, medida de lectura cómoda, decisiones separadas con la regla doble, estructura ASCII con scroll horizontal en móvil, y que nada desborda horizontalmente. Comprobar en viewport móvil (DevTools) que las rejillas colapsan a una columna.

- [ ] **Step 4: Build final**

Run:
```bash
npm run lint && npm run build
```
Expected: sin errores.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css public/casos data/casos.ts
git commit -m "feat(casos): add editorial styles for case study pages"
```

---

## Self-Review (hecho por quien escribe el plan)

- **Cobertura del spec:** Hero (Task 2/4), At a Glance (Task 2), El problema + mención única a Automática (Task 1 Step 3 + Task 2 CaseSection), Cómo trabajamos (Task 1/2), 4 decisiones con esqueleto Strique (Task 1 Steps 3a–3d + Task 2 CaseDecision), El resto del trabajo (Task 1 `rest` + Task 2 CaseRest), Qué haría diferente (Task 1 `reflection` + Task 2 CaseReflection), Footer/siguiente caso (Task 2 CaseNav), ruta `/casos/asesorias-v2-app` + índice (Task 3), modelo reutilizable (`data/casos.ts` + `components/casos/`), responsive (Task 4). Sin huecos.
- **Placeholders:** el contenido de las decisiones 01 (ranking) y 04 (social logins) va REDACTADO en prosa real (no "TODO"), marcado como "refinar con Kata" porque está poco documentado en origen — es contenido, no un placeholder de código.
- **Consistencia de tipos:** los nombres de campos (`from`, `decided`, `alternatives`, `finalStructure`, `media`, `glance`, `rest`, `reflection`, `nextCase`, `heroMedia`, `kicker`) coinciden entre Task 1 (definición), Task 2 (consumo en componentes) y Task 3 (paso de props). Los nombres de clase CSS de Task 2/3 coinciden con los enumerados en Task 4.
```
