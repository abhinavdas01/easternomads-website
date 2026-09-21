import './faq-section.css';
import DisclosureCue from './DisclosureCue';

const topics = [
  {
    title: 'Project scope',
    answer: 'Business applications, portals, automation, integrations, and modernization. We define the right scope around your business problem.',
  },
  {
    title: 'Existing systems',
    answer: 'Discovery maps integration options, access, data ownership, and migration constraints so the new work fits your existing environment.',
  },
  {
    title: 'Cost & timeline',
    answer: 'Your goals, workflows, and constraints shape the scope, milestones, and estimate. Complexity and integrations affect delivery; assumptions are agreed before work begins.',
  },
  {
    title: 'Code ownership',
    answer: 'Ownership, repository access, documentation, and handover are agreed in the project contract, with a clear plan for your team to operate the software.',
  },
  {
    title: 'After launch',
    answer: 'Deployment, documentation, and handover are part of delivery. Ongoing maintenance, monitoring, and improvements can be agreed through a separate support arrangement.',
  },
  {
    title: 'Working together',
    answer: 'Remote collaboration, agreed review points, and a shared delivery plan. Your team stays involved in priorities, feedback, and acceptance.',
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className="faq-directory wrap" data-theme-section="faq" aria-label="Frequently asked questions">
      <details className="faq-directory__fold">
        <summary className="faq-directory__summary">
          <span className="faq-directory__aside faq-directory__aside--left">A little more clarity</span>
          <h2 className="faq-directory__title">FAQs</h2>
          <span className="faq-directory__aside faq-directory__aside--right">The details, simply.</span>
          <DisclosureCue label="Explore answers" closeLabel="Close answers" direction="down" stacked className="faq-directory__cue" />
        </summary>
        <div className="faq-directory__content">
          {topics.map(topic => (
            <article className="faq-directory__entry" key={topic.title}>
              <h3>{topic.title}</h3>
              <p>{topic.answer}</p>
            </article>
          ))}
        </div>
      </details>
    </section>
  );
}
