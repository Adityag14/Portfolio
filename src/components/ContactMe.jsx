import { ArrowUpRight, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";

const contacts = [
  { icon: <Mail size={15} />, label: "EMAIL", value: "gawandeadi2@gmail.com", href: "mailto:gawandeadi2@gmail.com" },
  { icon: <Phone size={15} />, label: "PHONE", value: "+91 90114 10132", href: "tel:+919011410132" },
  { icon: <Linkedin size={15} />, label: "LINKEDIN", value: "linkedin.com/in/aditya-gawande-ai", href: "https://www.linkedin.com/in/aditya-gawande-ai" },
  { icon: <Github size={15} />, label: "GITHUB", value: "github.com/adityag14", href: "https://github.com/adityag14" },
  { icon: <MapPin size={15} />, label: "LOCATION", value: "India" },
];

export const ContactMe = () => (
  <section id="contact" className="contact-section section-pad">
    <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 md:grid-cols-[1fr_auto] md:items-end">
      <div>
        <p className="eyebrow eyebrow-light">06 / CONTACT</p>
        <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">Let&apos;s make useful AI happen.</h2>
        <p className="mt-4 max-w-xl text-base leading-7 text-white/65">Open to thoughtful conversations about GenAI, ML engineering, and building reliable systems for real-world teams.</p>
        <a className="contact-email mt-7" href="mailto:gawandeadi2@gmail.com">gawandeadi2@gmail.com <ArrowUpRight size={17} /></a>
      </div>
      <div className="flex flex-col gap-6 md:min-w-56">
        {contacts.map(({ icon, label, value, href }) => (
          <div className="contact-detail" key={label}>
            <span className="text-lime">{icon}</span>
            <div>
              <p className="mono-label text-white/45">{label}</p>
              {href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="mt-1 block break-all text-sm text-white/85 hover:text-lime">{value}</a> : <p className="mt-1 text-sm text-white/85">{value}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);