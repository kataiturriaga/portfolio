"use client";

import { useState } from "react";
import type { CaseStudy } from "@/data/casos";
import CaseViewToggle, { type CaseView } from "./CaseViewToggle";
import CaseSideNav, { type NavItem } from "./CaseSideNav";
import CaseHero from "./CaseHero";
import CaseGlance from "./CaseGlance";
import CaseImpact from "./CaseImpact";
import CaseDecisionsBrief from "./CaseDecisionsBrief";
import CaseSection from "./CaseSection";
import CaseDecision from "./CaseDecision";
import CaseRest from "./CaseRest";
import CaseReflection from "./CaseReflection";
import CaseNav from "./CaseNav";

export default function CaseStudyView({ caso }: { caso: CaseStudy }) {
  const [view, setView] = useState<CaseView>("corta");

  const navItems: NavItem[] =
    view === "corta"
      ? [
          { id: "en-breve", label: "En breve" },
          { id: "impacto", label: "Impacto" },
          { id: "decisiones", label: "Decisiones clave" },
        ]
      : [
          { id: "en-breve", label: "En breve" },
          { id: "problema", label: "El problema" },
          { id: "como-trabajamos", label: "Cómo trabajamos" },
          {
            id: "decisiones",
            label: "Decisiones clave",
            children: caso.decisions.map((d) => ({
              id: `decision-${d.number}`,
              label: d.title,
            })),
          },
          { id: "resto", label: "El resto del trabajo" },
          { id: "reflexion", label: "Qué haría diferente" },
        ];

  return (
    <div className="case-shell">
      <CaseSideNav items={navItems} />
      <div className="case-content">
        <CaseHero caso={caso} />
        <CaseViewToggle view={view} onChange={setView} />

        {view === "corta" ? (
          <div className="case-view case-view--corta">
            <div id="en-breve" className="case-anchor">
              <CaseGlance glance={caso.glance} />
            </div>
            <div id="impacto" className="case-anchor">
              <CaseImpact items={caso.impact} />
            </div>
            <div id="decisiones" className="case-anchor">
              <CaseDecisionsBrief decisions={caso.decisions} />
            </div>
          </div>
        ) : (
          <div className="case-view case-view--extensa">
            <div id="en-breve" className="case-anchor">
              <CaseGlance glance={caso.glance} />
            </div>
            <div id="problema" className="case-anchor">
              <CaseSection prose={caso.problem} />
            </div>
            <div id="como-trabajamos" className="case-anchor">
              <CaseSection prose={caso.howWeWorked} />
            </div>
            <div id="decisiones" className="case-anchor case-decisions">
              {caso.decisions.map((decision) => (
                <div
                  id={`decision-${decision.number}`}
                  className="case-anchor"
                  key={decision.number}
                >
                  <CaseDecision decision={decision} />
                </div>
              ))}
            </div>
            <div id="resto" className="case-anchor">
              <CaseRest items={caso.rest} />
            </div>
            <div id="reflexion" className="case-anchor">
              <CaseReflection items={caso.reflection} />
            </div>
          </div>
        )}

        <CaseNav nextCase={caso.nextCase} />
      </div>
    </div>
  );
}
