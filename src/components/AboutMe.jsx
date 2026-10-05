import { GraduationCap, MapPin } from "lucide-react";

export const AboutMe = () => (
    <section id="about" className="about-section section-pad">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
                <p className="eyebrow">01 / PROFILE</p>
                <h2 className="section-title mt-5">Engineering with an eye on the outcome.</h2>
            </div>
            <div className="pt-1">
                <p className="text-lg leading-8 text-ink-muted">
                    I work where applied AI meets real operations. At LTIMindtree, I design GenAI solutions that connect language models, enterprise data, and dependable workflows, with human approval where it matters.
                </p>
                <p className="mt-5 leading-7 text-ink-muted">
                    My approach spans the full path from retrieval and evaluation to APIs, deployment, and cost controls. I care about systems that are useful in production, not just convincing in a demo.
                </p>
                <div className="mt-10 grid gap-5 border-t border-line pt-6 sm:grid-cols-2">
                    <div className="flex gap-3">
                        <GraduationCap className="mt-0.5 shrink-0 text-accent" size={20} />
                        <div>
                            <p className="eyebrow">EDUCATION</p>
                            <p className="mt-2 font-medium">B.E. Artificial Intelligence &amp; Data Science</p>
                            <p className="mt-1 text-sm text-ink-muted">DY Patil College of Engineering, Akurdi · 2024</p>
                            <p className="mt-1 text-sm text-ink-muted">CGPA 8.45 / 10</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <MapPin className="mt-0.5 shrink-0 text-accent" size={19} />
                        <div>
                            <p className="eyebrow">BASED IN</p>
                              <p className="mt-2 font-medium">India</p>
                              <p className="mt-1 text-sm text-ink-muted">Building for teams and users everywhere.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);