import { useCallback, useEffect, useState } from 'react';
import { api, ApiError, type ParticipantId, type Session } from '../api';
import { UiIcon } from '../components/Icons';
import { TagFace } from '../components/Tag';
import { nameOf } from '../data';
import { DrawTab } from './DrawTab';
import { ListsTab } from './ListsTab';
import { MyListTab } from './MyListTab';

type Tab = 'draw' | 'mine' | 'lists';

interface Props {
  session: Session;
  onExit: () => void;
  onExpired: () => void;
}

export function Profile({ session, onExit, onExpired }: Props) {
  const [tab, setTab] = useState<Tab>('draw');
  const [target, setTarget] = useState<ParticipantId | null | undefined>(undefined);
  const [viewing, setViewing] = useState<ParticipantId | null>(null);
  const me = session.participantId;

  // Busca o sorteio ao abrir, ao voltar para a aba/app e ao tocar em "Sortear":
  // se o admin refez o sorteio, a tela não fica mostrando o par antigo.
  const refreshDraw = useCallback(() => {
    api.getMyDraw(session).then(
      (t) => {
        setTarget(t);
        if (!t) setTab('draw');
      },
      (e) => {
        if (e instanceof ApiError && /Sessão/.test(e.message)) onExpired();
      },
    );
  }, [session, onExpired]);

  useEffect(() => {
    refreshDraw();
    const onVisible = () => document.visibilityState === 'visible' && refreshDraw();
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', refreshDraw);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', refreshDraw);
    };
  }, [refreshDraw]);

  const tabs: { id: Tab; label: string; Icon: () => React.JSX.Element }[] = [
    { id: 'draw', label: 'Sortear', Icon: UiIcon.gift },
    { id: 'mine', label: 'Minha lista', Icon: UiIcon.list },
    { id: 'lists', label: 'Ver listas', Icon: UiIcon.eye },
  ];

  return (
    <div className="profile">
      <header className="profile-head">
        <TagFace id={me} name={nameOf(me)} />
        <button type="button" className="ghost" onClick={onExit}>
          Sair
        </button>
      </header>

      <main className="profile-body" id="painel">
        {tab === 'draw' && (
          <DrawTab
            session={session}
            target={target}
            onDrawn={setTarget}
            onSeeList={(id) => {
              setViewing(id);
              setTab('lists');
            }}
          />
        )}
        {tab === 'mine' && <MyListTab session={session} />}
        {tab === 'lists' && (
          <ListsTab session={session} me={me} target={target ?? null} selected={viewing} onSelect={setViewing} />
        )}
      </main>

      <nav className="tabbar" aria-label="Seções">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            aria-current={tab === id ? 'page' : undefined}
            disabled={id !== 'draw' && !target}
            title={id !== 'draw' && !target ? 'Liberado depois do sorteio' : undefined}
            onClick={() => {
              setTab(id);
              if (id === 'draw') refreshDraw();
            }}
          >
            <Icon />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
