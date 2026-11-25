import { useCallback, useEffect, useState } from 'react';
import { api, ApiError, type Participant, type Session } from '../api';
import { UiIcon } from '../components/Icons';
import { TagFace } from '../components/Tag';

interface Props {
  person: Participant;
  onBack: () => void;
  onEnter: (s: Session) => void;
}

type Step = 'enter' | 'create' | 'confirm';

export function PinScreen({ person, onBack, onEnter }: Props) {
  const [step, setStep] = useState<Step>(person.hasPin ? 'enter' : 'create');
  const [pin, setPin] = useState('');
  const [first, setFirst] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = useCallback(
    async (value: string) => {
      setError(null);
      if (step === 'create') {
        setFirst(value);
        setPin('');
        setStep('confirm');
        return;
      }
      if (step === 'confirm' && value !== first) {
        setError('Os PINs não batem. Crie de novo.');
        setPin('');
        setFirst('');
        setStep('create');
        return;
      }
      setBusy(true);
      try {
        const s =
          step === 'confirm' ? await api.createPin(person.id, value) : await api.login(person.id, value);
        onEnter(s);
      } catch (e) {
        setError(e instanceof ApiError ? e.message : 'Não foi possível conectar. Tente de novo.');
        setPin('');
        setBusy(false);
      }
    },
    [step, first, person.id, onEnter],
  );

  const press = useCallback(
    (d: string) => {
      if (busy) return;
      setPin((p) => (p.length >= 4 ? p : p + d));
    },
    [busy],
  );

  useEffect(() => {
    if (pin.length !== 4) return;
    const t = setTimeout(() => submit(pin), 140);
    return () => clearTimeout(t);
  }, [pin, submit]);

  const erase = useCallback(() => setPin((p) => p.slice(0, -1)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key)) press(e.key);
      else if (e.key === 'Backspace') erase();
      else if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [press, erase, onBack]);

  const title = {
    enter: 'Digite seu PIN',
    create: 'Crie um PIN de 4 números',
    confirm: 'Digite o PIN de novo',
  }[step];
  const hint = {
    enter: 'O mesmo que você criou no primeiro acesso.',
    create: 'Você vai usar este PIN sempre que entrar.',
    confirm: 'Só para confirmar.',
  }[step];

  return (
    <main className="pin">
      <button type="button" className="back" onClick={onBack}>
        <UiIcon.back />
        Voltar
      </button>
      <div className="pin-head">
        <TagFace id={person.id} name={person.name} size="lg" />
        <h1>{title}</h1>
        <p className="muted">{hint}</p>
      </div>

      <div className={`dots${error ? ' shake' : ''}`} aria-label={`${pin.length} de 4 números`} role="status">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={i < pin.length ? 'on' : ''} />
        ))}
      </div>
      <p className="alert" role="alert">
        {error ?? ' '}
      </p>

      <div className="keypad">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button key={d} type="button" onClick={() => press(d)} disabled={busy}>
            {d}
          </button>
        ))}
        <span />
        <button type="button" onClick={() => press('0')} disabled={busy}>
          0
        </button>
        <button type="button" className="key-del" onClick={erase} aria-label="Apagar" disabled={busy}>
          <UiIcon.del />
        </button>
      </div>
      {step === 'enter' && (
        <p className="muted small center">Esqueceu o PIN? Peça à organização para liberar um novo.</p>
      )}
    </main>
  );
}
