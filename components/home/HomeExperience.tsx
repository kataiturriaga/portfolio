"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { homeContent } from "@/data/home";
import SectionHeading from "@/components/site/SectionHeading";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

const ease = [0.22, 1, 0.36, 1] as const;

function useHomeContent() {
  return homeContent;
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function Intro({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const reduce = useReducedMotion();
  const greetings = ["Hola", "¿cómo estás?", "Pasa, esta es tu edición."];

  useEffect(() => {
    if (reduce) {
      onDone();
      return;
    }

    // Per-step display durations (ms). Adjust to lengthen specific steps:
    // durations[i] is the time to display greetings[i] before moving to the next.
    const durations = [700, 1800, 1600];

    const timeouts: number[] = [];
    let elapsed = 0;
    // Schedule advancing to each subsequent step at the cumulative elapsed time.
    for (let i = 1; i < greetings.length; i++) {
      elapsed += durations[i - 1];
      const id = window.setTimeout(() => setStep(i), elapsed);
      timeouts.push(id as unknown as number);
    }

    // Finish after the last step's display duration.
    const finish = window.setTimeout(onDone, elapsed + durations[greetings.length - 1]);

    return () => {
      timeouts.forEach((id) => window.clearTimeout(id));
      window.clearTimeout(finish);
    };
  }, [onDone, reduce, greetings.length]);

  return (
    <motion.div
      className="intro"
      exit={{ opacity: 0, y: "-100%" }}
      transition={{ duration: 0.75, ease }}
    >
      <div className="intro__top">
        <span>VOL. I · EDICIÓN GENERAL</span>
        <button type="button" onClick={onDone}>
          Saltar intro ↗
        </button>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={greetings[step]}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.42, ease }}
        >
          {greetings[step]}
        </motion.p>
      </AnimatePresence>
      <span className="intro__mark">✶</span>
    </motion.div>
  );
}

function Hero() {
  const content = useHomeContent();
  const words = content.copy.hero.rotatingWords;
  const [activeWord, setActiveWord] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setActiveWord((value) => (value + 1) % words.length),
      2400,
    );
    return () => window.clearInterval(timer);
  }, [words.length]);

  return (
    <section className="paper-shell hero" aria-labelledby="hero-title">
      <div className="hero__stamp" aria-hidden="true">
        <span>{content.copy.hero.stampLabel}</span>
        <strong>{content.copy.hero.stampYear}</strong>
        <span>{content.copy.hero.stampLocation}</span>
      </div>
      <div className="hero__copy">
        <h1 id="hero-title">
          {content.copy.hero.title}
          <span className="hero__connector">
            {content.copy.hero.titleConnector}
          </span>
          <span className="hero__rotating">
            <AnimatePresence mode="wait">
              <motion.em
                key={words[activeWord]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease }}
              >
                {words[activeWord]}
              </motion.em>
            </AnimatePresence>
          </span>
        </h1>
      </div>
      <div className="hero__deck">
        <p>{content.copy.hero.deck}</p>
        <a href="#trabajo" className="text-link">
          {content.copy.hero.cta} <Arrow />
        </a>
      </div>
      <div className="hero__ticker" aria-label="Resumen de experiencia">
        {content.stats.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function QuickIndex() {
  const content = useHomeContent();
  return (
    <section className="paper-shell quick-index" aria-labelledby="quick-title">
      <Reveal>
        <h2 id="quick-title">{content.copy.quickIndex.title}</h2>
      </Reveal>
      <div className="quick-index__grid">
        {content.quickLinks.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.08}>
            <a href={item.href} className="index-card">
              <div className="index-card__meta">
                <span>✶ {item.kicker}</span>
                <span>{item.page}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <span className="index-card__action">
                {content.copy.quickIndex.action}
              </span>
            </a>
          </Reveal>
        ))}
        <Reveal delay={0.24}>
          <Link href="/procesos" className="index-card index-card--dark">
            <div className="index-card__meta">
              <span>{content.copy.quickIndex.darkKicker}</span>
              <span>{content.copy.quickIndex.darkPage}</span>
            </div>
            <h3>{content.copy.quickIndex.darkTitle}</h3>
            <p>{content.copy.quickIndex.darkCopy}</p>
            <span className="index-card__action">
              {content.copy.quickIndex.darkAction}
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function FeaturedWork() {
  const content = useHomeContent();
  return (
    <section id="trabajo" className="work-section">
      <div className="paper-shell">
        <SectionHeading
          eyebrow={content.copy.work.eyebrow}
          title={content.copy.work.title}
        />
        <p className="section-intro">{content.copy.work.intro}</p>
        <div className="project-grid">
          {content.projects.map((project, index) => (
            <Reveal key={project.number} delay={(index % 2) * 0.08}>
              <article className="project-card">
                <div
                  className={`project-card__visual project-card__visual--${project.tone}`}
                  aria-hidden="true"
                >
                  <span>{project.client}</span>
                  <div className="project-card__window">
                    <i />
                    <i />
                    <i />
                  </div>
                  <strong>{project.number}</strong>
                </div>
                <div className="project-card__body">
                  <div className="project-card__meta">
                    <span>{project.client}</span>
                    <span>{project.year}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <a href="#contacto">
                    {content.copy.work.projectAction}
                  </a>
                  <div className="project-card__foot">
                    <span>{project.domain}</span>
                    <span>{project.role}</span>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="catalogue">
          <div>
            <span>{content.copy.work.catalogueKicker}</span>
            <h3>{content.copy.work.catalogueTitle}</h3>
          </div>
          <a href="#contacto" className="button-link">
            {content.copy.work.catalogueAction}
          </a>
        </div>
        <div className="next-issue">
          <p>{content.copy.work.nextIssue}</p>
          <ul>
            {content.copy.work.nextItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Industries() {
  const content = useHomeContent();
  return (
    <section id="industrias" className="paper-shell industries">
      <SectionHeading
        eyebrow={content.copy.industries.eyebrow}
        title={content.copy.industries.title}
      />
      <div className="industries__list">
        {content.industries.map((item) => (
          <a href="#trabajo" key={item.number} className="industry-row">
            <span>/ {item.number}</span>
            <h3>{item.title}</h3>
            <p>{item.clients}</p>
            <Arrow />
          </a>
        ))}
      </div>
    </section>
  );
}

function Timeline() {
  const content = useHomeContent();
  const [filter, setFilter] = useState<"all" | "current">("all");
  const visibleTimeline =
    filter === "current"
      ? content.timeline.filter(
          (item) => item.status === content.copy.timeline.current,
        )
      : content.timeline;

  return (
    <section id="trayectoria" className="timeline-section">
      <div className="paper-shell">
        <div className="timeline-section__top">
          <SectionHeading
            eyebrow={content.copy.timeline.eyebrow}
            title={content.copy.timeline.title}
          />
          <div className="segmented" aria-label="Filtrar trayectoria">
            <button
              className={filter === "all" ? "is-active" : ""}
              onClick={() => setFilter("all")}
              type="button"
            >
              {content.copy.timeline.all}
            </button>
            <button
              className={filter === "current" ? "is-active" : ""}
              onClick={() => setFilter("current")}
              type="button"
            >
              {content.copy.timeline.current}
            </button>
          </div>
        </div>
        <div className="timeline">
          <AnimatePresence mode="popLayout">
            {visibleTimeline.map((item) => (
              <motion.article
                layout
                key={item.company}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="timeline__item"
              >
                <div className="timeline__date">
                  <span>{item.period}</span>
                  <small>{item.status}</small>
                </div>
                <div className="timeline__main">
                  <h3>{item.company}</h3>
                  <p className="timeline__role">{item.role}</p>
                  <ul>
                    {item.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <div className="tags">
                    {item.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function About() {
  const content = useHomeContent();
  return (
    <section className="about-section">
      <div className="paper-shell about">
        <div className="about__portrait" aria-hidden="true">
          <div className="about__portrait-inner">
            <img
              src="/assets/portrait-bw.png"
              alt="Retrato"
              className="about__portrait-img"
            />
            <strong>✶</strong>
          </div>
          <p>{content.copy.about.portraitCaption}</p>
        </div>
        <Reveal className="about__copy">
          <SectionHeading
            eyebrow={content.copy.about.eyebrow}
            title={content.copy.about.title}
          />
          <p className="about__signature">
            {content.copy.about.signature}{" "}
            <span>{content.copy.about.signatureRole}</span>
          </p>
          <p className="about__lead">{content.copy.about.lead}</p>
          <p>{content.copy.about.firstParagraph}</p>
          <p>{content.copy.about.secondParagraph}</p>
          <a href="#contacto" className="text-link">
            {content.copy.about.action}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function Testimonial() {
  const content = useHomeContent();
  return (
    <section id="testimonios" className="testimonial-section">
      <div className="paper-shell testimonial">
        <SectionHeading
          light
          eyebrow={content.copy.testimonial.eyebrow}
          title={content.copy.testimonial.title}
        />
        <Reveal className="testimonial__quote">
          <span className="testimonial__number">
            {content.copy.testimonial.number}
          </span>
          <blockquote>“{content.copy.testimonial.quote}”</blockquote>
          <footer>
            <span className="testimonial__avatar">M</span>
            <div>
              <strong>{content.copy.testimonial.person}</strong>
              <small>{content.copy.testimonial.role}</small>
            </div>
          </footer>
        </Reveal>
      </div>
    </section>
  );
}

function Articles() {
  const content = useHomeContent();
  return (
    <section id="articulos" className="paper-shell articles">
      <SectionHeading
        eyebrow={content.copy.articles.eyebrow}
        title={content.copy.articles.title}
      />
      <div className="articles__list">
        {content.articles.map((article) => (
          <Link href={article.href} className="article-row" key={article.number}>
            <span>/ {article.number}</span>
            <div>
              <h3>{article.title}</h3>
              <span>{article.category}</span>
              <p>{article.copy}</p>
            </div>
            <time>{article.date}</time>
            <Arrow />
          </Link>
        ))}
      </div>
      <Link href="/procesos" className="articles__cta text-link">
        Explorar los 22 procesos <Arrow />
      </Link>
    </section>
  );
}

function MadLibs() {
  const content = useHomeContent();
  const [inputs, setInputs] = useState(["", "", "", "", "", ""]);
  const [headline, setHeadline] = useState("");
  const labels = content.copy.madlibs.labels;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (inputs.some((input) => !input.trim())) return;
    setHeadline(
      `${inputs[5]} presenta ${inputs[3]} formas ${inputs[0]} de diseñar ${inputs[1]}: el equipo lo ${inputs[2]} y el resultado fue ${inputs[4]}.`,
    );
  }

  function clear() {
    setInputs(["", "", "", "", "", ""]);
    setHeadline("");
  }

  return (
    <section id="mad-libs" className="madlibs-section">
      <div className="paper-shell">
        <SectionHeading
          eyebrow={content.copy.madlibs.eyebrow}
          title={content.copy.madlibs.title}
        />
        <p className="madlibs-section__intro">{content.copy.madlibs.intro}</p>
        <div className="madlibs">
          <form onSubmit={submit}>
            <p>{content.copy.madlibs.story}</p>
            <h3>{content.copy.madlibs.formTitle}</h3>
            <div className="madlibs__fields">
              {labels.map((label, index) => (
                <label key={label}>
                  <span>{(index + 1).toString().padStart(2, "0")}</span>
                  <input
                    value={inputs[index]}
                    onChange={(event) => {
                      const next = [...inputs];
                      next[index] = event.target.value;
                      setInputs(next);
                    }}
                    placeholder={label}
                    aria-label={label}
                  />
                </label>
              ))}
            </div>
            <div className="madlibs__actions">
              <button type="submit" disabled={inputs.some((input) => !input.trim())}>
                {content.copy.madlibs.print}
              </button>
              <button type="button" onClick={clear}>
                {content.copy.madlibs.clear}
              </button>
            </div>
          </form>
          <div className="headline-preview" aria-live="polite">
            <div>
              <span>{content.copy.madlibs.newspaper}</span>
              <span>{content.copy.madlibs.draft}</span>
            </div>
            {headline ? (
              <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {headline}
              </motion.h3>
            ) : (
              <>
                <strong>{content.copy.madlibs.waiting}</strong>
                <p>{content.copy.madlibs.empty}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomeExperience() {
  const [introVisible, setIntroVisible] = useState(true);

  return (
    <>
      <AnimatePresence>
        {introVisible && <Intro onDone={() => setIntroVisible(false)} />}
      </AnimatePresence>
      <div id="contenido">
        <SiteHeader />
        <main>
          <Hero />
          <QuickIndex />
          <FeaturedWork />
          <Industries />
          <Timeline />
          <About />
          <Testimonial />
          <Articles />
          <MadLibs />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
