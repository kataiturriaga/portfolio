import WeatherIcon, { WeatherIconName } from "./WeatherIcon";

export default function GlassCard({
  icon,
  title,
  className = "",
  children,
}: {
  icon?: WeatherIconName;
  title?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`glass-card ${className}`.trim()}>
      {title ? (
        <header className="glass-card__head">
          {icon ? <WeatherIcon name={icon} size={13} /> : null}
          <span>{title}</span>
        </header>
      ) : null}
      <div className="glass-card__body">{children}</div>
    </section>
  );
}
