"use client";

import { useState } from "react";
import type { CaseStudy } from "@/data/casos";
import CaseViewToggle, { type CaseView } from "./CaseViewToggle";
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

  return (
    <>
      <CaseHero caso={caso} />
      <CaseViewToggle view={view} onChange={setView} />

      {view === "corta" ? (
        <div className="case-view case-view--corta">
          <CaseGlance glance={caso.glance} />
          <CaseImpact items={caso.impact} />
          <CaseDecisionsBrief decisions={caso.decisions} />
        </div>
      ) : (
        <div className="case-view case-view--extensa">
          <CaseGlance glance={caso.glance} />
          <CaseSection prose={caso.problem} />
          <CaseSection prose={caso.howWeWorked} />
          <div className="case-decisions">
            {caso.decisions.map((decision) => (
              <CaseDecision key={decision.number} decision={decision} />
            ))}
          </div>
          <CaseRest items={caso.rest} />
          <CaseReflection items={caso.reflection} />
        </div>
      )}

      <CaseNav nextCase={caso.nextCase} />
    </>
  );
}
