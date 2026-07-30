Sección 1 — Concepto global, cielo y navegación
El concepto. El portfolio se convierte en una app del Tiempo donde tú eres la "ubicación actual" y cada caso destacado es una "ciudad" más. Todo el sitio comparte un mismo lenguaje: cielo a pantalla completa, tarjetas de cristal esmerilado (fondo blanco al ~10% + backdrop-blur, radio ~20px, borde sutil), cabeceras de tarjeta en mayúsculas de 11px con icono, y tipografía del sistema (-apple-system → SF real en dispositivos Apple, con pesos finos para los números grandes).

El cielo global con controles. Un fondo fijo a viewport completo que se pinta con un degradado según dos ejes que el visitante controla desde un par de segmented controls glass arriba del todo:

Momento del día: Amanecer · Día · Atardecer · Noche
Condición: Despejado · Nubes · Lluvia · Nieve
Eso da 16 cielos (degradado + capa ambiental animada: estrellas parpadeando de noche, nubes difuminadas moviéndose lento, partículas de lluvia/nieve). Por defecto, el momento del día se calcula con la hora real del visitante; su elección se guarda en localStorage. Todo respeta prefers-reduced-motion.

Navegación (app de una pieza). Barra inferior fija translúcida, presente en todo el sitio, calcada a la del Tiempo:

Izquierda, icono de mapa → /procesos (tu "mapa meteorológico": el laboratorio de procesos)
Centro, puntos de paginación → la flecha de ubicación es la home (/), y un punto por cada caso con página propia. Se cambia de "ciudad" con swipe en móvil, flechas laterales/teclado en desktop, con transición horizontal animada.
Derecha, icono de lista → /casos (la "lista de ciudades": índice de todos los proyectos)
Las URLs actuales se conservan (/, /casos, /casos/[slug], /procesos, /procesos/[slug]), así que todo sigue siendo enlazable y compartible.

En desktop el cielo llena la pantalla y las tarjetas se organizan en cuadrícula de 2–3 columnas tipo iPad; en móvil, columna única tipo iPhone.

¿Te encaja esta base antes de que baje al detalle de la home y las páginas de caso?

dale
Sección 2 — La home: "Ubicación actual"
De arriba a abajo, replicando la jerarquía exacta de la app del Tiempo pero con tu contenido de data/home.ts:

Cabecera de ciudad. Donde el Tiempo pone "Cupertino", aquí va "Kata Iturriaga" con "Barcelona · ESP" pequeño encima (como el subtítulo "Mi ubicación"). Debajo, el dato gigante en peso ultrafino: "4+" con un símbolo de grado — tus años diseñando como si fueran grados. Debajo, la línea de condición: "Product Designer", y la línea Máx/Mín reinterpretada: "Máx: 12 proyectos · Mín: 0 plantillas" (los stats actuales: 12 proyectos entregados, 18 marcas, 8M+ personas se reparten entre esta línea y la cuadrícula de abajo). Al hacer scroll, la cabecera se comprime a "Kata Iturriaga · 4+ · Product Designer" pegada arriba, igual que hace la app.

Tarjeta "Previsión por horas" → Trayectoria. La primera tarjeta ancha con scroll horizontal: cada "hora" es una etapa de tu timeline (2017 Grado → 2021 Taller Producto → 2023 Norte Digital → 2025 Estudio Independiente → Ahora), con su icono meteo y las bullets al tocar/expandir. El "Ahora" queda resaltado como la hora actual.

Tarjeta "Previsión a 6 proyectos" → Trabajo destacado. La tarjeta estrella, formato previsión de 10 días: una fila por proyecto de projects — cliente, icono de condición propio, año, y la barra de rango con degradado (la posición del punto puede codificar el año). La fila de El Método (que tiene caso completo) es tappable y lleva a su "ciudad"; el thumbnail de vídeo actual se integra como fondo sutil de esa fila o mini-preview al lado. Al final de la tarjeta, el enlace "Explorar el archivo" → /casos.

Cuadrícula de tarjetas pequeñas (2 col en móvil, 3–4 en desktop), como UV/viento/humedad:

Sectores (icono brújula): los 6 sectores de industries como direcciones del viento
Alcance: "8M+ personas alcanzadas" como visibilidad
Marcas: "18 acompañadas" como índice
Disponibilidad: "Condiciones actuales: Abierto a nuevos proyectos" en verde
Ubicación: "Barcelona · Remoto · CET" con amanecer/atardecer real
Procesos: mini-card "El laboratorio" → /procesos
Tarjeta ancha "Sobre quien diseña". Tu bio actual (lead + dos párrafos + firma) como la tarjeta de resumen del día, con hueco para retrato.

Tarjeta "Se dice por ahí" → Testimonio. La cita de Marina López como si fuera un aviso meteorológico destacado (el banner de alertas del Tiempo, en tono suave).

Tarjeta final "Hablemos" → Contacto. Email con click-to-copy ("Copiado ✓" se mantiene), agenda de 30 min, redes. Cierra con "Gracias por leer" adaptado: "Actualizado a las {hora del visitante}", como el pie de la app.

El Mad Libs desaparece en esta versión (no encaja en la metáfora; si lo quieres reinventar como "genera tu pronóstico" lo apuntamos para una iteración posterior).

¿Bien la home así? Después te presento las páginas de caso ("ciudades") y procesos ("el mapa").

dale
Sección 3 — Las "ciudades": páginas de caso y el índice
Página de caso (/casos/asesorias-v2-app). Misma anatomía que la home, para que pasar de ciudad a ciudad se sienta continuo:

Cabecera de ciudad: "El Método" como nombre de ubicación, con el kicker ("Caso de estudio · App coached · 2026") pequeño encima. El dato gigante ultrafino: "V2" (o el heroTitle "Añadiendo capas" como línea de condición debajo). La línea Máx/Mín: "Abril — Julio 2026 · Product Designer + PM".
Tarjeta de alerta → La tesis. El thesis + subthesis como el banner destacado que el Tiempo pone cuando hay algo importante: "La v1 era plana…".
Cuadrícula "De un vistazo": las 6 claves del glance (rol, periodo, equipo, producto, problema, solución) como tarjetas pequeñas tipo UV/humedad.
Tarjeta "Impacto": las métricas de impact en grid; las pendientes (pending) se muestran atenuadas como "—" con nota "por medir", igual que un dato no disponible en la app.
Tarjetas de texto: "El problema" y "Cómo trabajamos" como tarjetas anchas de lectura (párrafos con buen ancho de línea, máx ~65ch, dentro del glass).
Decisiones = la previsión extendida. Cada decisión (01–04) es una tarjeta grande apilada: cabecera con número + área, el "de dónde veníamos", las bullets de "qué decidimos", alternativas descartadas plegadas (disclosure), y la media/comparación antes-después integrada dentro de la tarjeta (la comparación imagen vs vídeo que ya tienes se conserva tal cual, enmarcada en el glass).
"El resto" y "Reflexión" como dos tarjetas más, y al final la tarjeta "Siguiente ciudad →" con el próximo caso.
Proyectos sin caso completo (Archivo Sur, Nexo, Cancha…): no tienen página propia todavía; viven en la tarjeta de previsión de la home y en el índice, sin enlace. Cuando escribas su caso, entran en la paginación automáticamente.

El índice (/casos) = la lista de ciudades. Réplica de la vista de lista del Tiempo: fondo más oscuro, una tarjeta apaisada por proyecto con el nombre del cliente grande, el título del caso como "condición", el año a la derecha como si fuera la temperatura, y su icono meteo. Las que tienen caso completo navegan a su ciudad; las demás quedan como tarjetas informativas. Arriba, el título "Casos" en grande estilo iOS.

¿Te encaja? Si sí, paso a la última parte: Procesos como "el mapa" y los detalles técnicos.

dale
Sección 4 — Procesos ("el mapa") y detalles técnicos
/procesos = el mapa meteorológico. Título grande "Procesos" y las 4 categorías de processCategories como 4 frentes: Discovery, Diseño, Build y Release, cada una una sección con su descripción. Dentro, cada proceso es una tarjeta glass con su número, título, propósito y el status traducido a condición meteorológica: Borrador = nublado ☁️, Probado = parcialmente despejado 🌤, Estable = despejado ☀️ (con iconos SVG propios estilo SF, no emoji). Los destacados (featured) van primero con tarjeta más grande.

/procesos/[slug] = el parte detallado. Misma cabecera de ciudad (título del proceso + categoría + status como condición), y tarjetas: "Cuándo usarlo / cuándo no", "Entrada → Salida", los pasos como lista numerada en tarjeta ancha, checklist con marcas, herramientas como chips glass, y el schema en una tarjeta monoespaciada.

Detalles técnicos:

Rama: design-v2 desde main. El diseño actual queda intacto en main.
Componentes nuevos en components/weather/ (Sky, SkyControls, GlassCard, CityHeader, BottomBar, ForecastRow, SmallCardGrid…). Los componentes de periódico actuales se eliminan de la rama al final, cuando todo esté migrado.
Datos: se reutilizan data/casos.ts, data/processes.ts y la parte sustantiva de data/home.ts; el copy metafórico se adapta en su sitio y las condiciones meteo por proyecto van en un nuevo data/weather.ts.
Cielo: degradados CSS por combinación (momento × condición) con transición suave; partículas con Framer Motion (ya instalado); estado en un contexto de React + localStorage; prefers-reduced-motion respetado.
Iconos: set propio de SVGs inline estilo SF Symbols (sol, luna, nubes, lluvia, nieve, brújula, mapa, lista…).
Antes de escribir código leeré las guías de node_modules/next/dist/docs/ como manda tu AGENTS.md (este Next 16 tiene breaking changes).
Verificación: next build + lint en cada tramo, y QA visual navegando la app al final.
¿Todo bien? Si me das el OK, escribo el spec completo en docs/superpowers/specs/, lo commiteo en la rama nueva y te lo paso a revisar antes de hacer el plan de implementación.