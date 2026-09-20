import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./index.css";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

function Reveal({
  children,
  className,
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
      variants={fadeUp}
      initial={reduce ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

const audiences = [
  {
    title: "Founders & product teams",
    body: "Ship an MVP or first production release with senior engineering judgment—without hiring a full in-house team or navigating a slow agency.",
  },
  {
    title: "Growing SMBs",
    body: "Replace spreadsheet chaos and brittle tools with custom platforms, portals, and automations that match how your team actually works.",
  },
  {
    title: "Enterprises & scale-ups",
    body: "Modernize legacy systems, tighten architecture, and accelerate delivery with advisory and embedded engineering that stays accountable.",
  },
];

const services = [
  {
    index: "01",
    title: "Custom software & product engineering",
    body: "Web apps, portals, APIs, and full digital products—from discovery through production—built for clarity, maintainability, and real users.",
    points: [
      "Product strategy & technical roadmaps",
      "Full-stack web & platform builds",
      "Internal tools, dashboards & admin systems",
    ],
  },
  {
    index: "02",
    title: "AI platforms, RAG & automation",
    body: "Production-grade generative AI—not demos. Multi-tenant assistants, RAG pipelines, voice agents, and workflow automation that cut real operating cost.",
    points: [
      "Conversational AI, copilots & embeddable widgets",
      "RAG, vector search & LLM cost optimization",
      "Ops automation across CRM, email & internal tools",
    ],
  },
  {
    index: "03",
    title: "Cybersecurity & VAPT",
    body: "Find what attackers find—before they do. Web, mobile, API, and infrastructure assessments with executive-ready reporting and remediation guidance.",
    points: [
      "Black-box & grey-box VAPT across apps and APIs",
      "Vulnerability management & risk prioritization",
      "Secure coding workshops mapped to OWASP Top 10",
    ],
  },
  {
    index: "04",
    title: "Cloud, modernization & advisory",
    body: "Move off fragile stacks onto cloud-native architectures—plus independent judgment on stack choices, vendors, and delivery oversight.",
    points: [
      "AWS / Azure architecture & migration plans",
      "DevOps, observability & delivery optimization",
      "Fractional CTO / architecture advisory",
    ],
  },
];

const team = [
  {
    name: "Anurag Mishra",
    role: "CEO",
    focus: "AI Engineer & Full-Stack Developer",
    photo: "/team/anurag.jpg",
    bio: "Leads Eastern Nomads’ product and AI agenda. Builds production systems with Next.js, Python, and LLM platforms—RAG pipelines, conversational agents, and multi-tenant SaaS that ship to real users.",
    highlights: ["Gen AI & RAG platforms", "Full-stack product delivery", "Cloud & LLM ops"],
  },
  {
    name: "Abhinav Das",
    role: "Managing Director",
    focus: "Cybersecurity Professional",
    photo: "/team/abhinav.jpg",
    bio: "Owns client relationships and the firm’s security practice. Delivers VAPT and vulnerability management across web, mobile, APIs, and infrastructure for BFSI, healthcare, and manufacturing teams.",
    highlights: ["VAPT & penetration testing", "Vulnerability management", "OWASP · CVSS · MITRE ATT&CK"],
  },
  {
    name: "Himanshu Pandey",
    role: "CTO",
    focus: "AI & Tech Lead · BITS Pilani",
    photo: "/team/himanshu.png",
    bio: "Sets technical direction and engineering standards. 7+ years across full-stack delivery—React, Java, Spring Boot, Python, AWS, Gen AI, and API platforms—bridging architecture decisions with hands-on build.",
    highlights: ["Platform architecture", "Full-stack & Gen AI", "AWS & API systems"],
  },
];

const process = [
  {
    name: "Wander",
    body: "We map your workflows, constraints, and goals—then isolate the highest-ROI problem worth solving first.",
  },
  {
    name: "Map",
    body: "We design the experience, architecture, and delivery plan so stakeholders share one clear picture before we build.",
  },
  {
    name: "Build",
    body: "Senior engineers ship in reviewable increments with weekly demos—visible progress, no black-box delivery.",
  },
  {
    name: "Scale",
    body: "We harden, document, and hand off cleanly so your team owns the system—and can grow it without lock-in.",
  },
];

const proof = [
  {
    meta: "SaaS · Conversational AI",
    title: "Multi-tenant voice & chat AI platform",
    body: "Built org-isolated assistants with RAG, real-time voice, admin analytics, and embeddable widgets for client deployments.",
    outcome: "Faster feature cycles · lower LLM cost",
  },
  {
    meta: "BFSI & healthcare · Security",
    title: "Enterprise VAPT & vulnerability lifecycle",
    body: "Black-box and grey-box assessments across web, mobile, and APIs—with PoCs, CVSS prioritization, and remediation tracking to closure.",
    outcome: "Risks validated · remediations closed",
  },
  {
    meta: "Product · Research & ops",
    title: "RAG research stack and AI email copilots",
    body: "LangChain + vector search with cited answers, plus AI email assistants wired into existing team workflows.",
    outcome: "Up to ~70% faster task execution",
  },
];

const stack = [
  "React / Next.js",
  "TypeScript",
  "Python",
  "Node.js",
  "Java / Spring Boot",
  "PostgreSQL / PgVector",
  "AWS",
  "LangChain · RAG",
  "OpenAI / Claude / Gemini",
  "Burp Suite · Nessus",
  "OWASP · MITRE ATT&CK",
  "CI/CD & observability",
];

const faqs = [
  {
    q: "How long does a typical engagement take?",
    a: "Focused automations often land in 2–4 weeks. Product builds and modernizations usually run 6–16 weeks depending on scope. Advisory retainers are monthly. After discovery we give you a clear timeline before commitment.",
  },
  {
    q: "Who owns the code and IP?",
    a: "You do—100%. We sign NDAs as standard, work inside your security requirements when needed, and hand off repositories, docs, and runbooks so you are never locked into us.",
  },
  {
    q: "Do you work fixed-price or time & materials?",
    a: "Both. Well-scoped projects are often fixed-price after a short discovery. Exploratory or evolving work fits retainers or T&M. We publish ranges after we understand the problem—not before.",
  },
  {
    q: "Which industries do you serve?",
    a: "We work across B2B SaaS, professional services, fintech, commerce, and operations-heavy SMBs. Depth beats breadth: we prioritize problems where senior engineering judgment creates measurable outcomes.",
  },
  {
    q: "Can you embed with our existing team?",
    a: "Yes. We often pair with in-house designers and engineers—leading architecture while your team ships, or filling a delivery gap without a large vendor footprint.",
  },
  {
    q: "Where is Eastern Nomads based?",
    a: "We are remote-first with roots in India and delivery across time zones. Collaboration is async-friendly with clear weekly rituals—designed for founders and teams that move fast.",
  },
];

export default function App() {
  const [submitted, setSubmitted] = useState(false);
  const reduce = useReducedMotion();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const company = String(data.get("company") || "").trim();
    const interest = String(data.get("interest") || "").trim();
    const message = String(data.get("message") || "").trim();

    const subject = encodeURIComponent(`Eastern Nomads inquiry — ${interest || "General"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nInterest: ${interest}\n\n${message}`,
    );
    window.location.href = `mailto:services@easternomads.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  return (
    <div className="site">
      <header className="nav">
        <div className="nav__inner">
          <a className="nav__brand" href="#top">
            <img src="/mark.png" alt="" />
            Eastern Nomads
          </a>
          <nav className="nav__links" aria-label="Primary">
            <a href="#services">Services</a>
            <a href="#process">Process</a>
            <a href="#work">Work</a>
            <a href="#team">Team</a>
            <a href="#about">About</a>
            <a href="#faq">FAQ</a>
          </nav>
          <a className="nav__cta" href="#contact">
            Book a call
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-label="Introduction">
          <div className="hero__media" aria-hidden="true" />
          <div className="hero__content">
            <motion.img
              className="hero__logo"
              src="/logo.png"
              alt="Eastern Nomads"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              Technology that ships what strategy decks only promise.
            </motion.h1>
            <motion.p
              className="hero__lead"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              A service-based tech consultancy for teams that need architecture,
              product, and engineering—without the agency bloat.
            </motion.p>
            <motion.div
              className="hero__actions"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <a className="btn btn--primary" href="#contact">
                Book a discovery call
              </a>
              <a className="btn btn--ghost" href="#services">
                Explore services
              </a>
            </motion.div>
          </div>
        </section>

        <section className="section" id="audiences" aria-labelledby="audiences-title">
          <div className="wrap">
            <Reveal className="section__head">
              <p className="eyebrow">Who we help</p>
              <h2 id="audiences-title">Built for teams that need senior judgment, not extra process.</h2>
              <p>
                Whether you are validating a product idea or modernizing a critical
                system, we meet you at the problem—and stay accountable to the outcome.
              </p>
            </Reveal>
            <div className="audience-grid">
              {audiences.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.08}>
                  <article className="audience-item">
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--alt" id="services" aria-labelledby="services-title">
          <div className="wrap">
            <Reveal className="section__head">
              <p className="eyebrow">Services</p>
              <h2 id="services-title">Four ways we partner with you.</h2>
              <p>
                Clear offers, precise language, and delivery led by people who have
                shipped production systems—not slide decks.
              </p>
            </Reveal>
            <div className="services">
              {services.map((service, i) => (
                <Reveal key={service.title} delay={i * 0.05}>
                  <article className="service">
                    <div className="service__title">
                      <span className="service__index">{service.index}</span>
                      <h3>{service.title}</h3>
                    </div>
                    <div className="service__body">
                      <p>{service.body}</p>
                      <ul>
                        {service.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="process" aria-labelledby="process-title">
          <div className="wrap">
            <Reveal className="section__head">
              <p className="eyebrow">How we work</p>
              <h2 id="process-title">Wander → Map → Build → Scale</h2>
              <p>
                A named delivery rhythm that keeps discovery honest, builds visible,
                and hands systems back ready to grow.
              </p>
            </Reveal>
            <div className="process">
              {process.map((step, i) => (
                <Reveal key={step.name} delay={i * 0.08}>
                  <article className="process__step">
                    <span className="service__index">0{i + 1}</span>
                    <h3 className="process__name">{step.name}</h3>
                    <p>{step.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--alt" id="work" aria-labelledby="work-title">
          <div className="wrap">
            <Reveal className="section__head">
              <p className="eyebrow">Outcomes</p>
              <h2 id="work-title">Proof over promises.</h2>
              <p>
                Case studies framed the way buyers evaluate partners: industry,
                challenge, what we built, and a measurable result.
              </p>
            </Reveal>
            <div className="proof-list">
              {proof.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.06}>
                  <article className="proof-item">
                    <div>
                      <p className="proof-item__meta">{item.meta}</p>
                      <h3>{item.title}</h3>
                    </div>
                    <p>{item.body}</p>
                    <p className="proof-item__outcome">{item.outcome}</p>
                  </article>
                </Reveal>
              ))}
            </div>
            <Reveal className="section__head" delay={0.1}>
              <p className="eyebrow" style={{ marginTop: "2.5rem" }}>
                Capabilities
              </p>
              <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 1.9rem)" }}>
                Stacks we use when they fit the problem.
              </h2>
            </Reveal>
            <Reveal>
              <div className="stack" aria-label="Technology stack">
                {stack.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section" id="team" aria-labelledby="team-title">
          <div className="wrap">
            <Reveal className="section__head">
              <p className="eyebrow">Our team</p>
              <h2 id="team-title">Leadership that still ships.</h2>
              <p>
                A compact founding team spanning AI product, cybersecurity, and full-stack
                architecture—so strategy and delivery stay in the same conversation.
              </p>
            </Reveal>
            <div className="team-grid">
              {team.map((member, i) => (
                <Reveal key={member.name} delay={i * 0.08}>
                  <article className="team-member">
                    <img
                      className="team-member__photo"
                      src={member.photo}
                      alt={`${member.name}, ${member.role} of Eastern Nomads`}
                    />
                    <div className="team-member__body">
                      <p className="team-member__role">{member.role}</p>
                      <h3>{member.name}</h3>
                      <p className="team-member__focus">{member.focus}</p>
                      <p>{member.bio}</p>
                      <ul className="team-member__tags">
                        {member.highlights.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--alt" id="about" aria-labelledby="about-title">
          <div className="wrap about">
            <Reveal>
              <div className="about__visual" role="img" aria-label="Open road at dusk" />
            </Reveal>
            <Reveal className="about__copy" delay={0.1}>
              <p className="eyebrow">About</p>
              <h2 id="about-title">Eastern roots. Nomad delivery.</h2>
              <p>
                Eastern Nomads is a tech consultancy built for a world where the best
                teams are not always in one office. We combine Eastern engineering
                craft with a nomadic operating model—remote-first, timezone-aware, and
                relentlessly focused on shipping.
              </p>
              <p>
                Led by practitioners in AI engineering, cybersecurity, and platform
                architecture. No bloated benches. No black-box handoffs—just people who
                diagnose the problem, design the path, and stay until it works in production.
              </p>
              <p>
                Domains:{" "}
                <a href="https://easternomads.com" style={{ color: "var(--brand)", fontWeight: 600 }}>
                  easternomads.com
                </a>{" "}
                ·{" "}
                <a href="https://easternomads.in" style={{ color: "var(--brand)", fontWeight: 600 }}>
                  easternomads.in
                </a>
              </p>
            </Reveal>
          </div>
        </section>

        <section className="section" id="faq" aria-labelledby="faq-title">
          <div className="wrap">
            <Reveal className="section__head">
              <p className="eyebrow">FAQ</p>
              <h2 id="faq-title">Straight answers before the first call.</h2>
              <p>
                Timeline, ownership, pricing model, industries, and how we collaborate—
                the questions buyers ask while shortlisting.
              </p>
            </Reveal>
            <div className="faq">
              {faqs.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--alt" id="contact" aria-labelledby="contact-title">
          <div className="wrap contact">
            <Reveal className="contact__copy">
              <p className="eyebrow">Contact</p>
              <h2 id="contact-title">Tell us what is slowing you down—or what you want to build next.</h2>
              <p>
                Share a short brief. We respond within one business day with whether we
                are a fit and what a practical next step looks like.
              </p>
              <div className="contact__meta">
                <a href="mailto:services@easternomads.com">services@easternomads.com</a>
                <a href="tel:+918018913298">+91 80189 13298</a>
                <span>India · Remote-first · Global delivery</span>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <form className="contact__form" onSubmit={onSubmit}>
                <label>
                  Name
                  <input name="name" type="text" required autoComplete="name" placeholder="Your name" />
                </label>
                <label>
                  Work email
                  <input name="email" type="email" required autoComplete="email" placeholder="you@company.com" />
                </label>
                <label>
                  Company
                  <input name="company" type="text" autoComplete="organization" placeholder="Company name" />
                </label>
                <label>
                  What do you need?
                  <select name="interest" defaultValue="Custom software & product engineering">
                    <option>Custom software & product engineering</option>
                    <option>AI platforms, RAG & automation</option>
                    <option>Cybersecurity & VAPT</option>
                    <option>Cloud, modernization & advisory</option>
                    <option>Not sure yet — need a discovery call</option>
                  </select>
                </label>
                <label>
                  Project brief
                  <textarea
                    name="message"
                    required
                    placeholder="Goals, timeline, constraints, and anything useful for a first conversation."
                  />
                </label>
                {submitted ? (
                  <p className="form-success">Opening your email client with the brief…</p>
                ) : null}
                <button className="btn btn--dark" type="submit">
                  Send inquiry
                </button>
                <p className="form-note">
                  Prefer email or WhatsApp? Write to services@easternomads.com or call +91 80189 13298.
                  NDA available on request.
                </p>
              </form>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer__inner">
          <div className="footer__brand">
            <img src="/mark.png" alt="" />
            Eastern Nomads
          </div>
          <p>© {new Date().getFullYear()} Eastern Nomads. Tech consultancy.</p>
        </div>
      </footer>
    </div>
  );
}
