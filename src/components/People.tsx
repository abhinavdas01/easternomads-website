import { Reveal } from './Primitives';
import DisclosureCue from './DisclosureCue';
import { team } from '../content';
import './people.css';

const portraits = [
  { key: 'anurag', src: '/team/anurag.jpg', width: 779, height: 908 },
  { key: 'abhinav', src: '/team/abhinav.jpg', width: 275, height: 354 },
  { key: 'himanshu', src: '/team/himanshu.png', width: 629, height: 696 },
];

function Portrait({ index, preview = false }: { index: number; preview?: boolean }) {
  const portrait = portraits[index];
  return <span className={`team-portrait team-portrait--${portrait.key}${preview ? ' team-portrait--preview' : ''}`}>
    <img
      src={portrait.src}
      alt={preview ? '' : team[index].name}
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
      <div><p className="eyebrow">04 / People, not just pixels</p><h2 id="about-title">Curious minds.<br />Shared direction.</h2></div>
      <div className="people-intro__copy"><span className="location-dot" /><p>Eastern Nomads is an enterprise software team based in India, working without borders.</p><p>We connect business thinking, thoughtful design, and hands-on engineering. Close to your team. Invested in what comes next.</p></div>
    </Reveal>
    <details className="team-fold" id="team" data-theme-section="team">
      <summary>
        <span className="team-portrait-peek" aria-hidden="true">{team.map((member, index) => <Portrait key={member.name} index={index} preview />)}</span>
        <span className="team-fold__label">Meet the people behind the progress</span>
        <DisclosureCue label="Meet the team" direction="down" />
      </summary>
      <div className="team-portrait-grid">
        {team.map((member, index) => <article className="team-person" key={member.name}>
          <Portrait index={index} />
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
