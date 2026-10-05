import { ArrowDownRight, ArrowUpRight, Cpu, Network, ScanSearch } from "lucide-react";

const workflow = [
  { icon: <ScanSearch size={17} strokeWidth={1.7} />, label: "RETRIEVE", detail: "grounded context" },
  { icon: <Network size={17} strokeWidth={1.7} />, label: "REASON", detail: "multi-agent plans" },
  { icon: <Cpu size={17} strokeWidth={1.7} />, label: "DELIVER", detail: "production systems" },
];

export const HeroSection = () => (
  <section id="home" className="hero-section relative overflow-hidden px-5 pb-16 pt-32 sm:px-8 sm:pt-40">
    <div className="hero-grid mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
      <div className="relative z-10">
        <p className="eyebrow mb-6 flex items-center gap-3">
          <span className="status-dot" />
          GENERATIVE AI &amp; MACHINE LEARNING ENGINEER
          <span className="hidden text-ink-muted sm:inline">/ INDIA</span>
        </p>
        <h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
          I build AI systems that <span className="headline-accent">move work forward.</span>
        </h1>
        <p className="mt-7 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
          I&apos;m Aditya Gawande, a GenAI and ML engineer turning complex workflows into useful, measurable products, from agent architectures and multimodal RAG to reliable cloud deployments.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <a className="action-primary" href="/Resume/Aditya_Gawande_Resume.pdf" download>
            Download resume <ArrowUpRight size={17} />
          </a>
          <a className="action-secondary" href="#experience">
            Explore experience <ArrowDownRight size={17} />
          </a>
        </div>
        <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
          <a className="text-link" href="mailto:gawandeadi2@gmail.com">gawandeadi2@gmail.com</a>
          <a className="text-link" href="tel:+919011410132">+91 90114 10132</a>
          <a className="text-link" href="https://www.linkedin.com/in/aditya-gawande-ai" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={13} /></a>
          <a className="text-link" href="https://github.com/adityag14" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} /></a>
        </div>
      </div>

      <div className="system-panel relative z-10" aria-label="A production AI workflow: retrieve, reason, deliver">
        <div className="flex items-center justify-between border-b border-white/15 px-5 py-4 sm:px-7">
          <div>
            <p className="mono-label text-white/55">FIELD NOTE 001</p>
            <p className="mt-1 text-sm font-medium text-white">From context to action</p>
          </div>
          <span className="live-badge"><span /> IN PRODUCTION</span>
        </div>
        <div className="workflow-list px-5 py-5 sm:px-7 sm:py-7">
          {workflow.map(({ icon, label, detail }, index) => (
            <div className="workflow-step" key={label}>
              <div className="workflow-node">{icon}</div>
              <div className="workflow-copy">
                <span className="mono-label text-lime">0{index + 1} / {label}</span>
                <span className="mt-1 block text-sm text-white/65">{detail}</span>
              </div>
              {index < workflow.length - 1 && <span className="workflow-connector" />}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 border-t border-white/15 px-5 py-4 sm:px-7">
          {["LANGGRAPH", "MCP", "RAG", "CLOUD"].map((label) => <span className="system-tag" key={label}>{label}</span>)}
        </div>
        <span className="panel-index" aria-hidden="true">AG / 26</span>
      </div>
    </div>
    <a href="#impact" aria-label="Scroll to engineering impact" className="hero-scroll">
      <span>SCROLL TO EXPLORE</span><ArrowDownRight size={15} />
    </a>
  </section>
);