import Link from "next/link";
import WeatherIcon from "../WeatherIcon";
import Widget from "../Widget";
import FeaturedCase from "./FeaturedCase";
import ProjectForecast from "./ProjectForecast";
import TrajectoryStrip from "./TrajectoryStrip";
import ContactCard from "./ContactCard";
import LocalTime from "./LocalTime";
import { copy, projects, timeline, articles } from "@/data/home";
import { casos } from "@/data/casos";
import { processes } from "@/data/processes";
import { processStatusWeather } from "@/data/weather";

export default function WeatherHome() {
  const p = copy.profile;
  const featured = casos[0];

  return (
    <main className="home">
      <aside className="home-profile">
        <p className="home-profile__over">{p.over}</p>
        <h1 className="home-profile__name">{p.name}</h1>
        <p className="home-profile__big">
          {p.big}
          <sup>{p.unit}</sup>
        </p>
        <p className="home-profile__role">{p.role}</p>
        <p className="home-profile__intro">{copy.intro}</p>
        <p className="home-profile__status">
          <i aria-hidden="true" />
          {p.availability}
        </p>
        <div className="home-profile__ctas">
          <a href="#contacto" className="pill pill--solid">
            {p.primaryCta}
          </a>
          <Link href="/casos" className="pill">
            {p.secondaryCta}
          </Link>
        </div>
        <dl className="home-profile__stats">
          <div>
            <dt>
              <LocalTime />
            </dt>
            <dd>{p.location}</dd>
          </div>
          <div>
            <dt>{p.reach.value}</dt>
            <dd>{p.reach.note}</dd>
          </div>
        </dl>
        <nav className="home-profile__nav" aria-label="Secciones">
          <Link href="/casos">
            Casos <span>{projects.length} ›</span>
          </Link>
          <Link href="/procesos">
            Procesos <span>{processes.length} ›</span>
          </Link>
          <a href="#contacto">
            Contacto <span>›</span>
          </a>
        </nav>
      </aside>

      <div className="home-board">
        {featured ? (
          <FeaturedCase caso={featured} label={copy.featured.label} cta={copy.featured.cta} />
        ) : null}

        <Widget
          tone="b"
          icon="nube-sol"
          title={copy.work.title}
          action={<Link href="/casos">{copy.work.archive} ›</Link>}
        >
          <ProjectForecast items={projects} readCase={copy.work.readCase} />
        </Widget>

        <div className="home-pair">
          <Widget tone="a" icon="amanecer" title={copy.trajectory.title}>
            <TrajectoryStrip items={timeline} />
          </Widget>
          <Widget tone="b" icon="campana" title={copy.testimonialTitle}>
            <blockquote className="quote">
              <p>“{copy.testimonial.quote}”</p>
              <footer>
                {copy.testimonial.person} · {copy.testimonial.role}
              </footer>
            </blockquote>
          </Widget>
        </div>

        <div className="home-pair">
          <Widget tone="b" icon="mapa" title={copy.processesTitle}>
            <ul className="widget-links">
              {articles.map((article) => (
                <li key={article.number}>
                  <Link href={article.href}>
                    <WeatherIcon
                      name={processStatusWeather[article.date]?.icon ?? "nube-sol"}
                      size={18}
                    />
                    <span>{article.title}</span>
                    <span aria-hidden="true">›</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Widget>
          <Widget tone="positive" icon="sobre" title={copy.contact.title} id="contacto">
            <ContactCard />
          </Widget>
        </div>
      </div>
    </main>
  );
}
