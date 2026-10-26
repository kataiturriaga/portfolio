import WeatherIcon, { WeatherIconName } from "./WeatherIcon";

/**
 * Widget de la home. El tono decide el fondo:
 * - "a" y "b": dos tonos derivados del cielo activo (claro y oscuro).
 * - "positive": verde fijo para disponibilidad y contacto.
 */
export type WidgetTone = "a" | "b" | "positive";

export default function Widget({
  tone,
  icon,
  title,
  action,
  id,
  className = "",
  children,
}: {
  tone: WidgetTone;
  icon?: WeatherIconName;
  title: string;
  action?: React.ReactNode;
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`widget widget--${tone} ${className}`.trim()}>
      <header className="widget__head">
        {icon ? <WeatherIcon name={icon} size={13} /> : null}
        <h2>{title}</h2>
        {action ? <span className="widget__action">{action}</span> : null}
      </header>
      {children}
    </section>
  );
}
