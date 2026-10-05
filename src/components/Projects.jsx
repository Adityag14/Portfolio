import { ArrowUpRight, Github } from "lucide-react";
import { useEffect, useState } from "react";

function ProjectCard({ project, index }) {
  const images = Array.isArray(project.images) && project.images.length
    ? project.images
    : project.image ? [project.image] : [];
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
    if (images.length < 2) return undefined;
    const timer = setInterval(() => {
      setActiveImage((current) => (current + 1) % images.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <article className="project-item">
      <div className="project-image-wrap">
        {images.length > 0 && (
          <img
            key={images[activeImage]}
            src={images[activeImage]}
            alt={`${project.title} screenshot ${activeImage + 1}`}
            className="project-image"
            loading="lazy"
          />
        )}
        <span className="project-index">{String(index + 1).padStart(2, "0")}</span>
        {images.length > 1 && (
          <div className="project-image-indicators" aria-label={`${images.length} project images`}>
            {images.map((image, imageIndex) => (
              <button
                key={`${image}-${imageIndex}`}
                type="button"
                aria-label={`Show image ${imageIndex + 1}`}
                aria-current={activeImage === imageIndex ? "true" : undefined}
                onClick={() => setActiveImage(imageIndex)}
              />
            ))}
          </div>
        )}
      </div>
      <div className="pt-5">
        <div className="mb-3 flex flex-wrap gap-2">
          {project.tags.map((tag) => <span className="project-tag" key={tag}>{tag}</span>)}
        </div>
        <h3 className="text-xl font-semibold">{project.title}</h3>
        <p className="mt-2 text-sm leading-6 text-ink-muted">{project.description}</p>
        <div className="mt-5 flex items-center gap-5">
          {project.url && project.url !== "#" && <a className="project-link" href={project.url} target="_blank" rel="noreferrer">View live <ArrowUpRight size={15} /></a>}
          {project.git && project.git !== "#" && <a className="project-link" href={project.git} target="_blank" rel="noreferrer"><Github size={15} /> Source</a>}
        </div>
      </div>
    </article>
  );
}

export const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/projects")
      .then((response) => response.json())
      .then((data) => setProjects(data.projects ?? []))
      .catch(() => setProjects([]))
      .finally(() => setLoaded(true));
  }, []);

  return (
    <section id="projects" className="projects-section section-pad">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 flex flex-col justify-between gap-5 border-b border-line pb-7 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">05 / SELECTED WORK</p>
            <h2 className="section-title mt-4">Projects in the making.</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-ink-muted">A closer look at the systems, experiments, and products behind the work.</p>
        </div>

        {!loaded ? (
          <p className="py-8 text-sm text-ink-muted">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="projects-empty">
            <span className="mono-label text-accent">NEXT UP / CASE STUDIES</span>
            <p className="mt-3 max-w-xl text-lg leading-7 text-ink-muted">Project write-ups are on the way. In the meantime, explore my production experience or get in touch to discuss the work.</p>
            <a className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent" href="#contact">Start a conversation <ArrowUpRight size={15} /></a>
          </div>
        ) : (
        <div className="project-grid">
          {projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
        </div>
        )}
      </div>
    </section>
  );
};
