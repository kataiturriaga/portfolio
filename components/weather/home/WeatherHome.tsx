import Link from "next/link";
import CityHeader from "../CityHeader";
import GlassCard from "../GlassCard";
import WeatherIcon from "../WeatherIcon";
import TrajectoryStrip from "./TrajectoryStrip";
import ForecastList from "./ForecastList";
import ContactCard from "./ContactCard";
import { copy, industries, projects, timeline, articles } from "@/data/home";

export default function WeatherHome() {
  return (
    <main className="weather-shell">
      <CityHeader
        name={copy.header.name}
        big={copy.header.big}
        condition={copy.header.condition}
        hiLo={copy.header.metrics.map((metric) => (
          <span key={metric.label}>
            {metric.label} {metric.value}
          </span>
        ))}
      />

      <div className="card-stack">
        <GlassCard icon="calendario" title={copy.trajectory.title} className="span-2">
          <TrajectoryStrip items={timeline} />
        </GlassCard>

        <GlassCard icon="calendario" title={copy.work.title} className="span-2">
          <ForecastList items={projects} />
          <p className="card-archive-link">
            <Link href="/casos">{copy.work.archive} →</Link>
          </p>
        </GlassCard>

        <GlassCard icon="brujula" title={copy.smallCards.sectors}>
          {industries.map((industry) => (
            <div key={industry.number} className="forecast-row forecast-row--compact">
              <span className="forecast-row__client">{industry.title}</span>
              <span className="forecast-row__year">{industry.clients}</span>
            </div>
          ))}
        </GlassCard>

        <div className="small-grid">
          <GlassCard icon="ojo" title={copy.smallCards.reach}>
            <p className="small-card__value">{copy.smallCards.reachValue}</p>
            <p className="small-card__note">{copy.smallCards.reachNote}</p>
          </GlassCard>
          <GlassCard icon="sol" title={copy.smallCards.brands}>
            <p className="small-card__value">{copy.smallCards.brandsValue}</p>
            <p className="small-card__note">{copy.smallCards.brandsNote}</p>
          </GlassCard>
          <GlassCard icon="campana" title={copy.smallCards.availability} className="small-card--ok">
            <p className="small-card__value">{copy.smallCards.availabilityValue}</p>
            <p className="small-card__note">{copy.smallCards.availabilityNote}</p>
          </GlassCard>
          <GlassCard icon="ubicacion" title={copy.smallCards.location}>
            <p className="small-card__value">{copy.smallCards.locationValue}</p>
            <p className="small-card__note">{copy.smallCards.locationNote}</p>
          </GlassCard>
        </div>

        <GlassCard icon="mapa" title={copy.smallCards.lab}>
          <p className="small-card__value">{copy.smallCards.labValue}</p>
          <p className="small-card__note">{copy.smallCards.labNote}</p>
          <p className="card-archive-link">
            <Link href="/procesos">Entrar →</Link>
          </p>
        </GlassCard>

        <GlassCard icon="sol" title={copy.about.title} className="span-2">
          <div className="card-prose">
            <p className="card-lead">{copy.about.lead}</p>
            <p>{copy.about.firstParagraph}</p>
            <p>{copy.about.secondParagraph}</p>
            <p>
              <strong>{copy.about.signature}</strong> · {copy.about.signatureRole}
            </p>
          </div>
        </GlassCard>

        <GlassCard
          icon="campana"
          title={copy.testimonial.title}
          className="glass-card--alert span-2"
        >
          <div className="card-prose">
            <p className="card-lead">“{copy.testimonial.quote}”</p>
            <p>
              <strong>{copy.testimonial.person}</strong> · {copy.testimonial.role}
            </p>
          </div>
        </GlassCard>

        <GlassCard icon="lista" title={copy.articles.title} className="span-2">
          {articles.map((article) => (
            <Link key={article.number} href={article.href} className="forecast-row">
              <span className="forecast-row__client">{article.category}</span>
              <WeatherIcon name="nube-sol" size={20} />
              <span className="forecast-row__title">{article.title}</span>
              <span className="forecast-row__year">{article.date}</span>
            </Link>
          ))}
        </GlassCard>

        <GlassCard icon="sobre" title={copy.contact.title} className="span-2">
          <ContactCard />
        </GlassCard>
      </div>
    </main>
  );
}
