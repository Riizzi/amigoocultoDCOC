import type { Participant } from '../api/types';
import { Flake, Garland, Sprig } from '../components/Decor';
import { TagFace } from '../components/Tag';
import { EVENT } from '../data';

function countdown(now = new Date()) {
  const day = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diff = Math.round((day(EVENT.date) - day(now)) / 86_400_000);
  if (diff > 1) return { n: diff, label: 'dias para a troca' };
  if (diff === 1) return { n: 1, label: 'dia para a troca' };
  if (diff === 0) return { n: null, label: 'A troca é hoje' };
  return { n: null, label: 'A troca já aconteceu' };
}

interface Props {
  participants: Participant[] | null;
  error: string | null;
  onPick: (p: Participant) => void;
}

export function Home({ participants, error, onPick }: Props) {
  const c = countdown();
  return (
    <main className="home">
      <Garland />
      <header className="hero">
        <Flake className="f1" />
        <Flake className="f2" />
        <Flake className="f3" />
        <h1 className="hero-title">
          Amigo oculto
          <span className="hero-team">da {EVENT.team}</span>
        </h1>
        <div className="event">
          <p className="event-when">{EVENT.when}</p>
          <p className="event-where">{EVENT.where}</p>
        </div>
        <p className="countdown" aria-live="polite">
          {c.n !== null && <span className="countdown-n">{c.n}</span>}
          <span className="countdown-label">{c.label}</span>
        </p>
      </header>

      <section className="pick" aria-labelledby="pick-title">
        <h2 id="pick-title">Quem é você?</h2>
        <p className="muted">Toque no seu nome para entrar.</p>
        {error && <p className="alert">{error}</p>}
        <ul className="tags">
          {(participants ?? []).map((p, i) => (
            <li key={p.id} style={{ '--i': i } as React.CSSProperties}>
              <button
                type="button"
                className="tag-btn"
                onClick={() => onPick(p)}
              >
                <TagFace id={p.id} name={p.name} note={p.hasDrawn ? 'Já sorteou' : undefined} />
              </button>
            </li>
          ))}
          {!participants &&
            !error &&
            Array.from({ length: 7 }, (_, i) => <li key={i} className="tag-skeleton" />)}
        </ul>
      </section>
      <Sprig className="home-sprig" />
    </main>
  );
}
