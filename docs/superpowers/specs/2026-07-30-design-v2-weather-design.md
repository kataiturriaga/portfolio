# Design V2 — Portfolio como app del Tiempo de iOS

**Fecha:** 2026-07-30 · **Rama:** `design-v2` · **Estado:** aprobado en conversación, pendiente de plan de implementación

## Resumen

Rediseño completo del portfolio inspirado en la app del Tiempo de Apple (iOS). Se conserva todo el contenido sustantivo de `main` (proyectos, casos, procesos, bio, timeline, testimonio, contacto) y se sustituye la metáfora actual de periódico ("El Diario de Kata") por una **metáfora completa de app meteorológica**: Kata es la "ubicación actual", cada caso destacado es una "ciudad", y las secciones se cuentan con el vocabulario visual del Tiempo (tarjetas de cristal esmerilado, previsiones, condiciones).

## Decisiones tomadas (con la usuaria)

1. **Metáfora completa** — el portfolio ES una app del tiempo, no solo estética.
2. **App de una pieza** — barra inferior fija con mapa/puntos/lista; paginación entre "ciudades"; las URLs actuales se conservan.
3. **Copy adaptado** — el contenido sustantivo se mantiene tal cual; las etiquetas de la metáfora periodística se reescriben en clave meteorológica. El Mad Libs se elimina (posible reinvención futura como "genera tu pronóstico").
4. **Cielo global con controles** — un solo cielo compartido por todo el sitio, con dos segmented controls arriba para que el visitante cambie **momento del día** (Amanecer · Día · Atardecer · Noche) y **condición** (Despejado · Nubes · Lluvia · Nieve).
5. **Desktop tipo iPad** — cielo a pantalla completa y tarjetas en cuadrícula de 2–3 columnas; en móvil, columna única tipo iPhone.

## Sistema visual

- **Cielo:** fondo fijo a viewport completo. 16 combinaciones (4 momentos × 4 condiciones) de degradados CSS con transición suave entre estados. Capa ambiental animada con Framer Motion: estrellas parpadeando (noche), nubes difuminadas en movimiento lento, partículas de lluvia/nieve. Se respeta `prefers-reduced-motion` (sin partículas ni animación ambiental). Por defecto, el momento del día se deriva de la hora real del visitante; la elección manual persiste en `localStorage`.
- **Tarjetas glass:** fondo blanco ~10% de opacidad + `backdrop-filter: blur`, radio ~20px, borde sutil (blanco a baja opacidad). Cabecera de tarjeta en mayúsculas de 11px con icono, color blanco semitransparente.
- **Tipografía:** stack del sistema (`-apple-system, BlinkMacSystemFont, "SF Pro", Inter, sans-serif`). Números gigantes en peso ultrafino (200). Texto sobre el cielo siempre blanco con jerarquía por opacidad.
- **Iconos:** set propio de SVGs inline estilo SF Symbols (sol, luna, nubes, lluvia, nieve, brújula, mapa, lista, ubicación…). Sin emoji en la UI final.
- **Contraste:** las 16 variantes de cielo deben mantener legibilidad del texto blanco; las variantes claras (día despejado/nieve) usan degradados suficientemente saturados u overlay oscuro sutil.

## Navegación

**Barra inferior fija translúcida** presente en todo el sitio:

- **Izquierda — icono mapa** → `/procesos`
- **Centro — puntos de paginación** → flecha de ubicación = home (`/`); un punto por cada caso con página completa (hoy: `asesorias-v2-app`). Cambio de ciudad con swipe (móvil), flechas laterales y teclado (desktop), transición horizontal animada.
- **Derecha — icono lista** → `/casos`

**Controles del cielo** arriba: dos segmented controls glass (momento del día, condición). Visibles en todas las páginas.

**Rutas conservadas:** `/`, `/casos`, `/casos/[slug]`, `/procesos`, `/procesos/[slug]`.

## Páginas

### Home — "Ubicación actual" (`/`)

De arriba a abajo:

1. **Cabecera de ciudad:** "Barcelona · ESP" pequeño; **"Kata Iturriaga"** como nombre de ciudad; dato gigante ultrafino **"4+"** con símbolo de grado (años diseñando); línea de condición **"Product Designer"**; línea Máx/Mín con stats ("Máx: 12 proyectos · 18 marcas"). Al hacer scroll se comprime a una cabecera pegada arriba (como la app).
2. **Tarjeta "Previsión por horas" → Trayectoria:** scroll horizontal; cada "hora" es una etapa del timeline (2017 → hoy) con icono meteo; bullets visibles al expandir. "Ahora" resaltado.
3. **Tarjeta "Previsión a 6 proyectos" → Trabajo destacado:** formato previsión de 10 días; una fila por proyecto de `projects` (cliente, icono de condición propio del proyecto, año, barra de rango con degradado). La fila de El Método navega a su ciudad; su vídeo se integra como mini-preview. Cierre: "Explorar el archivo" → `/casos`.
4. **Cuadrícula de tarjetas pequeñas** (2 col móvil / 3–4 desktop): Sectores (brújula, con `industries`), Alcance ("8M+ personas"), Marcas ("18"), Disponibilidad ("Abierto a nuevos proyectos", en verde), Ubicación ("Barcelona · Remoto · CET"), Procesos (mini-card → `/procesos`).
5. **Tarjeta ancha "Sobre quien diseña":** bio actual (lead + dos párrafos + firma) con hueco para retrato.
6. **Tarjeta "Se dice por ahí" → Testimonio:** cita de Marina López como aviso meteorológico en tono suave.
7. **Tarjeta "Hablemos" → Contacto:** email click-to-copy (conserva "Copiado ✓"), agenda 30 min, redes, "Abierto a nuevos proyectos". Pie: "Actualizado a las {hora del visitante}".

### Página de caso — "ciudad" (`/casos/[slug]`)

1. **Cabecera de ciudad:** kicker pequeño; "El Método" como nombre; dato gigante **"V2"**; heroTitle como línea de condición; línea Máx/Mín con periodo y rol.
2. **Tarjeta de alerta → tesis:** `thesis` + `subthesis` como banner destacado.
3. **Cuadrícula "De un vistazo":** las 6 claves del `glance` como tarjetas pequeñas.
4. **Tarjeta "Impacto":** métricas en grid; las `pending` atenuadas como dato no disponible ("—" + nota).
5. **Tarjetas de texto:** "El problema" y "Cómo trabajamos" (ancho de línea máx ~65ch).
6. **Decisiones (01–04):** una tarjeta grande por decisión: cabecera con número + área; "de dónde veníamos"; bullets de lo decidido; alternativas descartadas en disclosure plegable; media y comparación antes/después (imagen vs vídeo) integradas dentro del glass, conservando el contenido actual.
7. **"El resto" y "Reflexión"** como tarjetas; tarjeta final **"Siguiente ciudad →"**.

Los proyectos sin caso completo no tienen página propia; viven en la previsión de la home y en el índice sin enlace. Al añadir su contenido a `data/casos.ts` entran automáticamente en la paginación.

### Índice — "lista de ciudades" (`/casos`)

Réplica de la vista de lista del Tiempo: el cielo global se mantiene pero con un overlay oscuro sutil (como la vista de lista de la app), título "Casos" grande estilo iOS, una tarjeta apaisada por proyecto (cliente grande, título del caso como "condición", año a la derecha como temperatura, icono meteo). Con caso completo → navega; sin él → informativa.

### Procesos — "el mapa" (`/procesos`)

Título grande "Procesos"; las 4 categorías de `processCategories` como **4 frentes** (Discovery, Diseño, Build, Release), cada una con su descripción. Cada proceso: tarjeta glass con número, título, propósito y **status como condición** — Borrador = nublado, Probado = parcialmente despejado, Estable = despejado (iconos SVG propios). Los `featured` primero, con tarjeta mayor.

### Detalle de proceso — "el parte" (`/procesos/[slug]`)

Cabecera de ciudad (título + categoría + status como condición) y tarjetas: "Cuándo usarlo / cuándo no", "Entrada → Salida", pasos numerados, checklist, herramientas como chips glass, `schema` en tarjeta monoespaciada.

## Arquitectura técnica

- **Rama:** `design-v2` desde `main`; el diseño de periódico queda intacto en `main`.
- **Componentes nuevos** en `components/weather/`: `Sky`, `SkyControls`, `SkyProvider` (contexto + localStorage), `GlassCard`, `CityHeader`, `BottomBar`, `HourlyStrip`, `ForecastRow`, `SmallCard`, `AlertCard`, `WeatherIcon`, etc. Los componentes de periódico (`components/home`, `components/site`, `components/casos`, `components/processes` actuales) se eliminan de la rama cuando todo esté migrado.
- **Datos:** se reutilizan `data/casos.ts` y `data/processes.ts` sin cambios estructurales; `data/home.ts` conserva la parte sustantiva y adapta el copy metafórico. Nuevo `data/weather.ts`: condición meteo por proyecto, labels de los controles del cielo, textos de la metáfora.
- **Animación:** Framer Motion (ya instalado) para partículas, transiciones de ciudad y micro-interacciones.
- **Next 16:** leer las guías de `node_modules/next/dist/docs/` antes de escribir código (breaking changes respecto al conocimiento previo), según AGENTS.md.

## Verificación

- `next build` + `eslint` en verde en cada tramo de trabajo.
- QA visual navegando la app (móvil y desktop): las 16 variantes de cielo legibles, paginación entre ciudades, click-to-copy, disclosure de alternativas, comparación antes/después, `prefers-reduced-motion`.

## Fuera de alcance

- Reinventar el Mad Libs como "genera tu pronóstico" (iteración futura).
- Páginas propias para proyectos sin caso completo.
- Modo claro/oscuro del sistema: el cielo elegido manda.
