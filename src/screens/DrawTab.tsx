import { useRef, useState } from 'react';
import { api, ApiError, type ParticipantId, type Session } from '../api';
import { TagFace } from '../components/Tag';
import { nameOf, PEOPLE } from '../data';

interface Props {
  session: Session;
  target: ParticipantId | null | undefined;
  onDrawn: (id: ParticipantId) => void;
  onSeeList: (id: ParticipantId) => void;
}

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function DrawTab({ session, target, onDrawn, onSeeList }: Props) {
  const [rolling, setRolling] = useState<ParticipantId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [justDrawn, setJustDrawn] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  async function run() {
    setError(null);
    const others = PEOPLE.filter((p) => p.id !== session.participantId).map((p) => p.id);
    let i = 0;
    if (!reduced()) {
      setRolling(others[0]);
      timer.current = window.setInterval(() => {
        i = (i + 1) % others.length;
        setRolling(others[i]);
      }, 90);
    }
    try {
      const [result] = await Promise.all([
        api.draw(session),
        new Promise((r) => setTimeout(r, reduced() ? 0 : 1600)),
      ]);
      window.clearInterval(timer.current);
      setRolling(null);
      setJustDrawn(true);
      onDrawn(result);
    } catch (e) {
      window.clearInterval(timer.current);
      setRolling(null);
      setError(e instanceof ApiError ? e.message : 'Não foi possível sortear agora. Tente de novo.');
    }
  }

  if (target === undefined) return <p className="muted center pad">Carregando…</p>;

  if (target) {
    return (
      <section className="draw" aria-labelledby="draw-title">
        <h1 id="draw-title" className="section-title">
          Seu amigo oculto
        </h1>
        <div className={`reveal${justDrawn ? ' reveal-in' : ''}`}>
          <TagFace id={target} name={nameOf(target)} size="lg" />
        </div>
        <p className="muted center">Só você vê este nome.</p>
        <button type="button" className="primary" onClick={() => onSeeList(target)}>
          Ver a lista de {nameOf(target)}
        </button>
      </section>
    );
  }

  return (
    <section className="draw" aria-labelledby="draw-title">
      <h1 id="draw-title" className="section-title">
        Sortear amigo oculto
      </h1>
      <div className="reveal" aria-live="polite">
        {rolling ? (
          <TagFace id={rolling} name={nameOf(rolling)} size="lg" />
        ) : (
          <span className="tag tag-lg tag-blank">
            <span className="tag-hole" aria-hidden />
            <span className="tag-q" aria-hidden>
              ?
            </span>
            <span className="tag-name">Quem será?</span>
          </span>
        )}
      </div>
      <p className="muted center">
        O sorteio é feito uma vez só. Ninguém tira a si mesmo e cada pessoa é tirada por uma única outra.
        Depois dele, as listas de presentes são liberadas.
      </p>
      {error && <p className="alert">{error}</p>}
      <button type="button" className="primary" onClick={run} disabled={rolling !== null}>
        {rolling ? 'Sorteando…' : 'Sortear'}
      </button>
    </section>
  );
}
