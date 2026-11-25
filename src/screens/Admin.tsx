import { useEffect, useState } from 'react';
import { api, ApiError, type Participant } from '../api';
import { UiIcon } from '../components/Icons';

export function Admin({ onBack }: { onBack: () => void }) {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [people, setPeople] = useState<Participant[]>([]);
  const [confirmRedo, setConfirmRedo] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const refresh = () => api.listParticipants().then(setPeople);
  useEffect(() => {
    if (token) refresh();
  }, [token]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    try {
      setToken(await api.adminLogin(password));
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível conectar.');
    }
  }

  async function resetPin(p: Participant) {
    await api.adminResetPin(token!, p.id);
    setMsg(`PIN de ${p.name} zerado. No próximo acesso, a pessoa cria um novo.`);
    refresh();
  }

  async function redo() {
    await api.adminResetDraw(token!);
    setConfirmRedo(false);
    setMsg('Sorteio refeito. Todos precisam sortear de novo.');
    refresh();
  }

  return (
    <main className="admin">
      <button type="button" className="back" onClick={onBack}>
        <UiIcon.back />
        Voltar
      </button>
      <h1 className="section-title">Administração</h1>

      {!token ? (
        <form onSubmit={login} className="gift-form">
          <label htmlFor="adm-pw">Senha</label>
          <input
            id="adm-pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          {error && <p className="alert">{error}</p>}
          <button type="submit" className="primary">
            Entrar
          </button>
        </form>
      ) : (
        <>
          {msg && (
            <p className="note" role="status">
              {msg}
            </p>
          )}
          <table className="adm-table">
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">PIN</th>
                <th scope="col">Sorteio</th>
                <th scope="col">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {people.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.hasPin ? 'Criado' : 'Sem PIN'}</td>
                  <td>{p.hasDrawn ? 'Já sorteou' : 'Pendente'}</td>
                  <td>
                    <button
                      type="button"
                      className="ghost small"
                      disabled={!p.hasPin}
                      onClick={() => resetPin(p)}
                    >
                      Zerar PIN
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="muted small">Os pares do sorteio não aparecem aqui.</p>

          <div className="danger-zone">
            {confirmRedo ? (
              <>
                <p>
                  Refazer gera um sorteio novo e apaga o resultado de quem já sorteou. As listas de
                  presentes continuam.
                </p>
                <div className="row">
                  <button type="button" className="ghost" onClick={() => setConfirmRedo(false)}>
                    Cancelar
                  </button>
                  <button type="button" className="danger" onClick={redo}>
                    Refazer sorteio
                  </button>
                </div>
              </>
            ) : (
              <button type="button" className="ghost" onClick={() => setConfirmRedo(true)}>
                Refazer sorteio
              </button>
            )}
          </div>
        </>
      )}
    </main>
  );
}
