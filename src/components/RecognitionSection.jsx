import { ArrowUpRight, Award, BadgeCheck } from "lucide-react";

const recognitions = [
  {
    icon: <Award size={19} />,
    label: "ORGANIZATION AWARD · JUNE 2026",
    title: "Best AI Initiative",
    subtitle: "EzCredit · Outcreator",
    detail: "Recognized for EzCredit, developed by the EUROPE SAP team as L’Oréal’s first SAP GenAI solution in production, automating credit decisions through real-time AI analysis.",
    image: "/Certificates/Aditya_Gawande_Outcreator_Award.pdf",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7501301730387820545/",
    linkLabel: "View award post on LinkedIn",
  },
  {
    icon: <BadgeCheck size={19} />,
    label: "PROFESSIONAL CERTIFICATION",
    title: "SAP Certified GenAI Developer",
    subtitle: "Credential verified on Credly",
    detail: "Certification in generative AI development within the SAP ecosystem.",
    href: "https://www.credly.com/badges/8cabb610-df74-4dab-b978-a71b5491b619",
  },
];

export const RecognitionSection = () => (
  <section id="recognition" className="recognition-section section-pad">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <div className="mb-10 border-b border-line pb-7">
        <p className="eyebrow">03 / RECOGNITION</p>
        <h2 className="section-title mt-4">Work recognized. Skills verified.</h2>
      </div>
      <div className="recognition-grid">
        {recognitions.map(({ icon, label, title, subtitle, detail, image, href, linkLabel }) => (
          <article className="recognition-item" key={title}>
            <div className="recognition-icon">{icon}</div>
            <p className="eyebrow mt-6">{label}</p>
            <h3 className="mt-3 text-xl font-semibold">{title}</h3>
            <p className="mt-1 text-sm font-medium text-accent">{subtitle}</p>
            <p className="mt-4 text-sm leading-6 text-ink-muted">{detail}</p>
            {image && (
              <div className="certificate-preview">
                <iframe
                  title={`${title} certificate`}
                  src={`${image}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                  loading="lazy"
                />
              </div>
            )}
            {href && <a className="project-link mt-5" href={href} target="_blank" rel="noreferrer">{linkLabel ?? "View verified credential"} <ArrowUpRight size={15} /></a>}
          </article>
        ))}
      </div>
    </div>
  </section>
);