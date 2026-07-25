# Case study "Asesorías V2" — Diseño

**Fecha:** 2026-07-25
**Autor:** Kata (con Claude)
**Estado:** Aprobado, pendiente de plan de implementación

---

## Objetivo

Construir la primera página de case study del portfolio, inspirada en la
estructura editorial y narrativa de `manushridave.com/work/strique`. El caso
elegido es **Asesorías V2** (rediseño de la app del cliente del tier coached de
El Método, v1 → v2), por ser el proyecto más terminado y con más material.

Es el primero de una serie prevista de ~3 case studies sobre El Método
(app coached v1→v2, dashboard v1→v2, y la fase fundacional v1). Esta página debe
establecer el patrón reutilizable para los siguientes.

## Qué hace bien la referencia (Strique) — principios a copiar

Copiamos el **sistema**, no el estilo visual:

1. **Tesis con opinión en el hero**, no el nombre del proyecto.
2. **Tensión antes de la solución** — el problema concreto en una frase.
3. **Decisiones > pantallas** — la parte fuerte es *por qué elegí X sobre Y*.
4. **Métricas / datos atribuidos** cuando existan.
5. **Voz de autor y honestidad** ("qué haría diferente / pendiente").
6. **Interrumpir el texto con imágenes/mocks** de forma rítmica.

Cada decisión sigue el mismo esqueleto repetible:
**de dónde veníamos → qué decidimos y por qué → alternativas descartadas →
estructura final.**

## Encuadre y decisiones de alcance (ya tomadas)

- **Alcance:** solo la **app del cliente** (tier coached). Las decisiones de
  dashboard del coach (card % graso, top bar) se reservan para el case study 3.
- **Curación:** **4 decisiones destacadas** con profundidad + un bloque ligero
  para el resto del trabajo.
- **Las 4 decisiones destacadas** (elegidas por Kata):
  1. **Ranking de pasos** — el contador pasivo de la v1 se vuelve juego social;
     el objetivo de pasos diarios es una pata de la filosofía de marca
     (entrenar de fuerza + moverse). *Contenido poco documentado → redactar al
     construir.*
  2. **Dieta con capas** — de lista plana a equivalencias, recetas asociadas,
     toggle raciones/unidades, cards con foto. *Documentado en
     `asesorias-v2.md` §3 y §8.*
  3. **Nuevas experiencias de entreno + evolución de marcas** — de solo fuerza a
     híbrido/running/hyrox; y de "¿qué hice ayer?" a "¿estoy mejorando?" (curva
     por ejercicio). *Documentado en `asesorias-v2.md` §2.*
  4. **Flujo de entrada + social logins** — reducir fricción de entrada,
     sincronizar usuarios antiguos con social login y permitir el flujo normal a
     los nuevos. *Contenido poco documentado → redactar al construir.*
- **Tesis (hero):** "plano → con capas". La v1 era plana (un estilo de entreno,
  una lista de dieta, un contador que nadie miraba); la v2 dio profundidad a
  cada flujo.
- **App de suscripción (Automática):** se menciona **una sola vez** en "El
  problema" como el *benchmark interno de calidad* que había que igualar. NO va
  en el titular. (Corrección de dato: Automática es el tier de **suscripción**,
  más barato, **no** es gratis.)

## Estructura de la página

| # | Sección | Contenido |
|---|---------|-----------|
| 1 | Hero | Tesis "plano → con capas" + sub-tesis + mock de la app |
| 2 | At a Glance | Rol (Product Designer + PM), periodo (abr–jun 2026), equipo (2 personas), producto (El Método, tier coached), tesis del problema, resumen de la solución |
| 3 | El problema | "Pagaban más, recibían menos". App coached por debajo de la de suscripción (mención única a Automática como benchmark). Plana y superficial |
| 4 | Cómo trabajamos | Equipo de 2, benchmark = app Automática, decisiones basadas en dato de uso real (p.ej. 58% abre antes de comer). Breve |
| 5–8 | Las 4 decisiones | Una sección profunda por decisión, con el esqueleto de Strique + imagen/mock |
| 9 | El resto del trabajo | Bloque ligero: Revisiones, % graso IA+coach, teléfono en onboarding. Sin profundizar |
| 10 | Qué haría diferente / pendiente | Honestidad de seniority: hipótesis sin validar, deuda de tokens, etc. |
| 11 | Footer / siguiente | CTA + link al siguiente caso (dashboard v1→v2) |

## Arquitectura técnica

Sigue el patrón existente del proyecto (`data/processes.ts` +
`app/procesos/[slug]/page.tsx` + `components/processes/` + clases `paper-shell`
en `globals.css`). No se introduce ninguna dependencia nueva; framer-motion ya
está disponible.

### Ficheros

Slug de este caso: `asesorias-v2-app` → ruta `/casos/asesorias-v2-app`.
El case study de dashboard (proyecto 3) usará `asesorias-v2-dash`, en paralelo.

```
data/casos.ts                    → tipo CaseStudy + tipo Decision + array casos[]
app/casos/page.tsx               → índice de case studies (portada)
app/casos/[slug]/page.tsx        → página del case study (server component)
components/casos/
  ├── CaseHero.tsx               → tesis + sub-tesis + mock
  ├── CaseGlance.tsx             → metadata (rol, periodo, equipo, problema, solución)
  ├── CaseSection.tsx            → bloque de texto genérico (problema, cómo trabajamos)
  ├── CaseDecision.tsx           → esqueleto repetible de decisión
  ├── CaseRest.tsx               → bloque ligero "el resto del trabajo"
  ├── CaseReflection.tsx         → "qué haría diferente / pendiente"
  └── CaseNav.tsx                → footer + siguiente caso
public/casos/asesorias-v2/       → imágenes / mocks
```

Reutiliza `SiteHeader`, `SiteFooter`, `SectionHeading` y el estilo editorial.

### Modelo de datos (enfoque A — campos con nombre)

Se elige campos con nombre sobre bloques genéricos polimórficos: más fácil de
autorear, type-safe, y como todos los casos comparten la misma forma se reusan
los componentes directamente. (Enfoque B, bloques genéricos, se descarta por
YAGNI.)

Forma aproximada (a afinar en el plan):

```ts
export type Decision = {
  number: string;         // "01".."04"
  title: string;
  area: string;           // p.ej. "Retención / motivación"
  from: string;           // de dónde veníamos
  decided: string[];      // qué decidimos y por qué (párrafos/bullets)
  alternatives?: string[];// alternativas descartadas
  finalStructure?: string;// bloque de estructura final (texto/ascii)
  media?: { src: string; alt: string; caption?: string };
};

export type CaseStudy = {
  slug: string;
  title: string;
  thesis: string;         // tesis del hero
  subthesis: string;
  glance: {
    role: string;
    period: string;
    team: string;
    product: string;
    problem: string;
    solution: string;
  };
  problem: string;        // sección "El problema"
  howWeWorked: string;    // sección "Cómo trabajamos"
  decisions: Decision[];  // las 4 destacadas
  rest: string[];         // "el resto del trabajo" (ligero)
  reflection: string[];   // "qué haría diferente / pendiente"
  nextCaseSlug?: string;
  heroMedia?: { src: string; alt: string };
};
```

### Fuente de contenido

- Decisiones **2 (dieta)** y **3 (entreno + marcas)**: portar casi directo de
  `/Users/kataiturriaga/repos/elmetodo_asesorias/casos-de-estudio/asesorias-v2.md`
  (§2, §3, §8).
- Decisiones **1 (ranking)** y **4 (social logins)**: poco documentadas →
  mini-sesión de redacción durante la implementación, partiendo de las notas del
  chat.
- "El resto del trabajo": resumen de §1 (Revisiones), §4 (% graso IA+coach) y §7
  (teléfono en onboarding).

## Fuera de alcance (YAGNI)

- Decisiones del dashboard del coach (§5, §6) → case study 3.
- Sistema de bloques genéricos polimórficos.
- CMS / contenido editable en runtime — el contenido vive en `data/casos.ts`.
- Los otros 2 case studies (se harán después, reusando este patrón).

## Criterios de éxito

- Una página `/casos/asesorias-v2-app` que se lee como un ensayo con tesis, tensión
  y 4 decisiones razonadas, en la estética editorial existente.
- Un patrón (`data/casos.ts` + `components/casos/`) reutilizable para los
  siguientes case studies sin reescribir componentes.
- Responsive y coherente con el resto del sitio.
