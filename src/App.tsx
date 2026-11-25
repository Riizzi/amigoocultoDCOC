import { useCallback, useEffect, useState } from 'react';
import { api, type Participant, type Session } from './api';
import { Snowfall } from './components/Snowfall';
import { Admin } from './screens/Admin';
import { Home } from './screens/Home';
import { PinScreen } from './screens/PinScreen';
import { Profile } from './screens/Profile';

const SESSION_KEY = 'amigo-oculto-dcoc:session';

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

function writeSession(s: Session | null) {
  try {
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* sem storage: sessão dura só nesta aba */
  }
}

export default function App() {
  return (
    <>
      <Snowfall />
      <div className="app">
        <Screens />
      </div>
    </>
  );
}

function Screens() {
  const [session, setSession] = useState<Session | null>(readSession);
  const [picked, setPicked] = useState<Participant | null>(null);
  const [people, setPeople] = useState<Participant[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [admin, setAdmin] = useState(() => location.hash === '#admin');

  const loadPeople = useCallback(() => {
    setError(null);
    api.listParticipants().then(setPeople, () =>
      setError('Não foi possível carregar os nomes. Verifique a conexão e recarregue a página.'),
    );
  }, []);

  useEffect(loadPeople, [loadPeople]);
  useEffect(() => {
    const onHash = () => setAdmin(location.hash === '#admin');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [session, picked, admin]);

  const enter = useCallback((s: Session) => {
    writeSession(s);
    setSession(s);
    setPicked(null);
  }, []);

  const exit = useCallback(() => {
    writeSession(null);
    setSession(null);
    loadPeople();
  }, [loadPeople]);

  if (admin)
    return (
      <Admin
        onBack={() => {
          history.replaceState(null, '', location.pathname);
          setAdmin(false);
          loadPeople();
        }}
      />
    );
  if (session) return <Profile session={session} onExit={exit} onExpired={exit} />;
  if (picked) return <PinScreen person={picked} onBack={() => setPicked(null)} onEnter={enter} />;
  return <Home participants={people} error={error} onPick={setPicked} />;
}
