import { useEffect, useState } from 'react';
import { api, type Gift, type ParticipantId, type Session } from '../api';
import { GiftItem } from '../components/GiftItem';
import { InterestIcon } from '../components/Icons';
import { nameOf, PEOPLE } from '../data';

interface Props {
  session: Session;
  me: ParticipantId;
  target: ParticipantId | null;
  selected: ParticipantId | null;
  onSelect: (id: ParticipantId) => void;
}

export function ListsTab({ session, me, target, selected, onSelect }: Props) {
  const others = PEOPLE.filter((p) => p.id !== me).sort((a, b) =>
    a.id === target ? -1 : b.id === target ? 1 : 0,
  );
  const current = selected ?? target ?? others[0].id;
  const [gifts, setGifts] = useState<{ id: ParticipantId; list: Gift[] } | null>(null);

  useEffect(() => {
    let alive = true;
    api.listGifts(session, current).then(
      (list) => alive && setGifts({ id: current, list }),
      () => alive && setGifts({ id: current, list: [] }),
    );
    return () => {
      alive = false;
    };
  }, [session, current]);

  const loading = gifts?.id !== current;

  return (
    <section aria-labelledby="lists-title">
      <h1 id="lists-title" className="section-title">
        Ver sugestões de presentes
      </h1>
      <div className="chips" role="tablist" aria-label="Participantes">
        {others.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={p.id === current}
            className={`chip${p.id === target ? ' chip-target' : ''}`}
            data-person={p.id}
            onClick={() => onSelect(p.id)}
          >
            <span className="chip-icon">
              <InterestIcon id={p.id} />
            </span>
            {p.name}
            {p.id === target && (
              <svg className="chip-star" viewBox="0 0 24 24" role="img" aria-label="seu amigo oculto">
                <path d="m12 2.8 2.7 5.9 6.4.7-4.8 4.3 1.3 6.3L12 16.8 6.4 20l1.3-6.3-4.8-4.3 6.4-.7Z" />
              </svg>
            )}
          </button>
        ))}
      </div>

      <div role="tabpanel" aria-label={`Lista de ${nameOf(current)}`}>
        {loading && <p className="muted pad">Carregando…</p>}
        {!loading && gifts.list.length > 1 && (
          <p className="muted small list-hint">Em ordem de preferência: o 1º é o que a pessoa mais quer.</p>
        )}
        {!loading && gifts.list.length === 0 && (
          <p className="empty">{nameOf(current)} ainda não adicionou sugestões.</p>
        )}
        {!loading && (
          <ul className="gifts">
            {gifts.list.map((g, i) => (
              <GiftItem key={g.id} gift={g} rank={gifts.list.length > 1 ? i + 1 : undefined} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
