const skillGroups = [
    { index: "01", name: "Generative AI & LLMs", skills: ["LangChain", "LangGraph", "CrewAI", "MCP", "RAG", "Prompt engineering", "Function calling", "PEFT / LoRA", "Ragas", "NeMo Guardrails"] },
    { index: "02", name: "Machine learning", skills: ["PyTorch", "TensorFlow", "Hugging Face", "Transformers", "scikit-learn", "CNNs", "RNNs", "Statistical modeling", "spaCy", "NLTK"] },
    { index: "03", name: "Retrieval & data", skills: ["ChromaDB", "FAISS", "Pinecone", "PostgreSQL / pgvector", "Hybrid search", "Semantic reranking"] },
    { index: "04", name: "Backend & cloud", skills: ["Python", "FastAPI", "Flask", "Node.js", "WebSockets", "REST APIs", "GCP Cloud Run", "Azure AI Foundry", "Docker", "Kubernetes", "CI/CD"] },
];

export const SkillsSection = () => (
    <section id="skills" className="skills-section section-pad">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-12 flex flex-col justify-between gap-5 border-b border-line pb-7 md:flex-row md:items-end">
                <div>
                      <p className="eyebrow">04 / TOOLKIT</p>
                    <h2 className="section-title mt-4">Tools for the whole lifecycle.</h2>
                </div>
                <p className="max-w-sm text-sm leading-6 text-ink-muted">A practical stack across model development, retrieval, application engineering, and production infrastructure.</p>
            </div>
            <div>
                {skillGroups.map((group) => (
                    <div className="skill-row" key={group.index}>
                        <div className="skill-heading">
                            <span className="mono-label text-accent">{group.index}</span>
                            <h3>{group.name}</h3>
                        </div>
                        <ul className="skill-list">
                            {group.skills.map((skill) => <li key={skill}>{skill}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    </section>
);