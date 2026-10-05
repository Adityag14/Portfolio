import { ArrowUpRight, Check } from "lucide-react";

const impact = [
  { title: "Enterprise workflow automation", detail: "Built AI-enabled workflows across emails, documents, SharePoint, and connected business systems using Copilot Studio, Power Automate, and Azure Functions to reduce manual effort and operational overhead." },
  { title: "Real-time retrieval applications", detail: "Developed a LangChain, GPT-4, and ChromaDB retrieval system over WebSockets, bringing grounded answers into live enterprise workflows." },
  { title: "SAP operations with human oversight", detail: "Created SAP IDOC diagnosis and resolution workflows with human approval gates, dynamic retries, and automated Azure Communication Services alerts." },
  { title: "Efficient model operations", detail: "Applied semantic caching and prompt optimization to limit redundant model calls and make production inference more cost-conscious." },
];

export const ExperienceSection = () => (
  <section id="experience" className="experience-section section-pad">
    <div id="impact" className="mx-auto max-w-7xl px-5 sm:px-8">
      <div className="mb-12 grid gap-8 border-b border-white/20 pb-8 md:grid-cols-[0.75fr_1.25fr] md:items-end">
        <div>
          <p className="eyebrow eyebrow-light">02 / EXPERIENCE</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">Workflow automation that saves effort and cost.</h2>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <h3 className="text-xl font-semibold text-white">LTIMindtree</h3>
            <p className="mt-1 text-sm text-white/65">Technical Consultant · AI &amp; GenAI Solutions</p>
          </div>
          <p className="mono-label text-lime">DEC 2024 — PRESENT · INDIA</p>
        </div>
      </div>
      <div className="impact-grid">
        {impact.map((item, index) => (
          <article className="impact-item" key={item.title}>
            <div className="mb-4 flex items-center justify-between">
              <span className="mono-label text-lime">AI WORKFLOW / 0{index + 1}</span>
              <Check aria-hidden="true" size={15} className="text-lime" />
            </div>
            <h3 className="text-base font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/65">{item.detail}</p>
          </article>
        ))}
      </div>
      <a className="mt-9 inline-flex items-center gap-2 text-sm font-medium text-lime transition-colors hover:text-white" href="https://www.linkedin.com/in/aditya-gawande-ai" target="_blank" rel="noreferrer">
        Connect on LinkedIn <ArrowUpRight size={15} />
      </a>
    </div>
  </section>
);