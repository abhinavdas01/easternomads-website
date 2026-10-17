import { Reveal } from './Primitives';
import DisclosureCue from './DisclosureCue';
import { team } from '../content';
import './people.css';

function Portrait({ member, preview = false }: { member: (typeof team)[number]; preview?: boolean }) {
  const portrait = member.photo;
  return <span className={`team-portrait team-portrait--${portrait.key}${preview ? ' team-portrait--preview' : ''}`}>
    <img
      src={portrait.src}
      alt={preview ? '' : member.name}
      width={portrait.width}
      height={portrait.height}
      loading="lazy"
      decoding="async"
    />
  </span>;
}

export default function People() {
  return <section id="about" className="people-section people-section--portraits wrap" data-theme-section="about" aria-labelledby="about-title">
    <Reveal className="people-intro">
      <div><p className="eyebrow">06 / People, not just pixels</p><h2 id="about-title">Curious minds.<br />Shared direction.</h2></div>
      <div className="people-intro__copy"><span className="location-dot" /><p>Eastern Nomads is an enterprise software team based in India, working without borders.</p><p>We connect business thinking, thoughtful design, and hands-on engineering. Close to your team. Invested in what comes next.</p></div>
    </Reveal>
    <details className="team-fold" id="team" data-theme-section="team" open>
      <summary>
        <span className="team-portrait-peek" aria-hidden="true">{team.map((member) => <Portrait key={member.name} member={member} preview />)}</span>
        <span className="team-fold__label">Meet the people behind the progress</span>
        <DisclosureCue label="Meet the team" direction="down" />
      </summary>
      <div className="team-portrait-grid">
        {team.map((member) => <article className="team-person" key={member.name}>
          <Portrait member={member} />
          <div className="team-person__copy">
            <p className="team-person__role">{member.role}</p>
            <h3>{member.name}</h3>
            <p className="team-person__focus">{member.focus}</p>
            <p className="team-person__bio">{member.bio}</p>
          </div>
        </article>)}
      </div>
    </details>
  </section>;
}
