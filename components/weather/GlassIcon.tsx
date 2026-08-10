/* Iconos 3D de cristal (Nucleo Glass), el registro "grande" del sistema.
 *
 * Convive con WeatherIcon, no lo sustituye, y el reparto es por tamaño:
 *   - WeatherIcon: monocromo, trazo, hereda currentColor. Para lo funcional
 *     y lo pequeño (cabeceras de card, filas, controles). De 16 a 24 px.
 *   - GlassIcon: relleno, con capas y refracción. Para lo grande y lo que
 *     tiene que destacar (aperturas de sección, estados vacíos). De 40 px
 *     para arriba, que es donde el trazo plano se queda corto.
 *
 * Se sirven como ficheros estáticos desde /public/icons/glass en vez de ir
 * inline: son decorativos, no heredan color, y así no cargan el bundle de JS
 * (100 iconos inline serían ~350 KB). El navegador solo pide el que se usa.
 *
 * El cuerpo va con un degradado claro y frío (#f4f6fb → #5f6f8c) en vez del
 * gris oscuro original de Nucleo, que sobre --bg-base desaparecía. Ver
 * public/icons/glass/NOTICE.md para el porqué y para cómo cambiarlo.
 */

export type GlassIconName =
  | "app-stack"
  | "arrows-bold-opposite-direction"
  | "award"
  | "bell"
  | "bolt"
  | "book-open"
  | "box-archive"
  | "brightness-increase"
  | "bug"
  | "button"
  | "calendar"
  | "camera"
  | "cart"
  | "chair"
  | "circle-arrow-down"
  | "circle-arrow-left"
  | "circle-arrow-right"
  | "circle-arrow-up"
  | "circle-chart-line"
  | "circle-coin"
  | "circle-copy-plus"
  | "circle-question"
  | "clipboard"
  | "clipboard-check"
  | "cloud-bolt"
  | "cloud-download"
  | "cloud-upload"
  | "code-editor"
  | "color-palette"
  | "connect"
  | "copies"
  | "credit-cards"
  | "crosshairs"
  | "cube"
  | "dial"
  | "duplicate"
  | "duplicate-plus"
  | "eye"
  | "face-grin"
  | "feather"
  | "file"
  | "files"
  | "flame"
  | "folder"
  | "folders"
  | "gauge"
  | "gear"
  | "grid"
  | "grid-2"
  | "hammer"
  | "headphones"
  | "heart"
  | "hearts"
  | "house"
  | "image"
  | "image-depth"
  | "inbox"
  | "laptop-mobile"
  | "layers"
  | "link"
  | "location"
  | "lock"
  | "magic-wand-sparkle"
  | "magnifier"
  | "money-bill"
  | "msgs"
  | "nut"
  | "paper-plane"
  | "pen"
  | "pin"
  | "printer"
  | "progress-bar"
  | "rect-layout-grid"
  | "roadmap"
  | "rocket"
  | "ruler-pen"
  | "shopping"
  | "sitemap"
  | "slider"
  | "sparkle"
  | "square-chart-line"
  | "stack-perspective"
  | "star"
  | "star-sparkle"
  | "suitcase"
  | "swap"
  | "tab-close"
  | "tab-open"
  | "tabs"
  | "tasks"
  | "thumbs-up"
  | "toggle"
  | "tree"
  | "triangle-warning"
  | "ufo"
  | "user"
  | "users"
  | "video"
  | "wallet-content"
  | "window";

export default function GlassIcon({
  name,
  size = 64,
  className,
}: {
  name: GlassIconName;
  size?: number;
  className?: string;
}) {
  return (
    // SVG decorativo y estático: next/image no aporta nada aquí y añadiría
    // una petición de optimización por icono.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/icons/glass/${name}.svg`}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={className}
      draggable={false}
    />
  );
}
