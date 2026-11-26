import { useEffect, useId, useState } from 'react';
import { api, ApiError, type Gift, type GiftInput, type Session } from '../api';
import { GiftItem } from '../components/GiftItem';
import { UiIcon } from '../components/Icons';
import { brl, EVENT } from '../data';

const empty: GiftInput = { name: '', description: '', price: null, link: '' };

function parsePrice(s: string): number | null {
  const clean = s.replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.');
  if (!clean) return null;
  const n = Number(clean);
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : NaN;
}

function normalizeLink(s: string) {
  const t = s.trim();
  if (!t) return '';
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

function GiftForm({
  initial,
  onCancel,
  onSave,
}: {
  initial: GiftInput;
  onCancel: () => void;
  onSave: (g: GiftInput) => Promise<void>;
}) {
  const uid = useId();
  const [name, setName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description);
  const [price, setPrice] = useState(
    initial.price === null ? '' : initial.price.toFixed(2).replace('.', ','),
  );
  const [link, setLink] = useState(initial.link);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const parsed = parsePrice(price);
  const over = parsed !== null && !Number.isNaN(parsed) && parsed > EVENT.priceCap;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError('Dê um nome para a sugestão.');
    if (Number.isNaN(parsed)) return setError('Valor inválido. Use só números, como 39,90.');
    setBusy(true);
    setError(null);
    try {
      await onSave({ id: initial.id, name, description, price: parsed, link: normalizeLink(link) });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível salvar. Tente de novo.');
      setBusy(false);
    }
  }

  return (
    <form className="gift-form" onSubmit={submit} noValidate>
      <label htmlFor={`${uid}-n`}>Nome</label>
      <input
        id={`${uid}-n`}
        name="gift-name"
        autoComplete="off"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={80}
        placeholder="Ex.: caneca térmica…"
        autoFocus
        required
      />
      <label htmlFor={`${uid}-d`}>
        Descrição <span className="opt">opcional</span>
      </label>
      <textarea
        id={`${uid}-d`}
        name="gift-description"
        autoComplete="off"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={280}
        rows={2}
        placeholder="Cor, tamanho, modelo…"
      />
      <label htmlFor={`${uid}-p`}>
        Valor aproximado <span className="opt">até {brl(EVENT.priceCap)}</span>
      </label>
      <div className="money">
        <span aria-hidden>R$</span>
        <input
          id={`${uid}-p`}
          name="gift-price"
          autoComplete="off"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          inputMode="decimal"
          placeholder="0,00"
          aria-describedby={over ? `${uid}-w` : undefined}
        />
      </div>
      {over && (
        <p className="warn" id={`${uid}-w`}>
          Acima do teto de {brl(EVENT.priceCap)}. Dá para salvar, mas vale pensar numa opção mais em conta.
        </p>
      )}
      <label htmlFor={`${uid}-l`}>
        Link <span className="opt">opcional</span>
      </label>
      <input
        id={`${uid}-l`}
        name="gift-link"
        type="url"
        autoComplete="off"
        spellCheck={false}
        value={link}
        onChange={(e) => setLink(e.target.value)}
        inputMode="url"
        autoCapitalize="none"
        placeholder="https://…"
      />
      {error && <p className="alert">{error}</p>}
      <div className="row">
        <button type="button" className="ghost" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="primary" disabled={busy}>
          {busy ? 'Salvando…' : initial.id ? 'Salvar alterações' : 'Adicionar'}
        </button>
      </div>
    </form>
  );
}

export function MyListTab({ session }: { session: Session }) {
  const [gifts, setGifts] = useState<Gift[] | null>(null);
  const [editing, setEditing] = useState<GiftInput | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  async function move(index: number, delta: -1 | 1) {
    if (!gifts) return;
    const to = index + delta;
    if (to < 0 || to >= gifts.length) return;
    const prev = gifts;
    const next = [...gifts];
    [next[index], next[to]] = [next[to], next[index]];
    setGifts(next);
    setOrderError(null);
    try {
      await api.reorderGifts(session, next.map((g) => g.id));
    } catch (e) {
      setGifts(prev);
      setOrderError(e instanceof ApiError ? e.message : 'Não foi possível salvar a ordem. Tente de novo.');
    }
  }

  useEffect(() => {
    api.listGifts(session, session.participantId).then(setGifts, () => setGifts([]));
  }, [session]);

  async function save(input: GiftInput) {
    const g = await api.saveGift(session, input);
    setGifts((list) => {
      const l = list ?? [];
      return l.some((x) => x.id === g.id) ? l.map((x) => (x.id === g.id ? g : x)) : [...l, g];
    });
    setEditing(null);
  }

  async function remove(id: string) {
    await api.deleteGift(session, id);
    setGifts((l) => (l ?? []).filter((g) => g.id !== id));
    setConfirmDel(null);
  }

  return (
    <section aria-labelledby="mine-title">
      <h1 id="mine-title" className="section-title">
        O que eu gostaria de ganhar
      </h1>
      <p className="muted">
        Sugestões de até {brl(EVENT.priceCap)}. Quem tirou você vê esta lista. Use as setas para pôr em
        ordem: a 1ª é a que você mais quer.
      </p>
      {orderError && <p className="alert">{orderError}</p>}

      {gifts === null && <p className="muted pad">Carregando…</p>}
      {gifts?.length === 0 && !editing && (
        <p className="empty">Sua lista está vazia. Adicione uma ideia para ajudar quem tirou você.</p>
      )}

      <ul className="gifts">
        {gifts?.map((g, i) =>
          editing?.id === g.id ? (
            <li key={g.id} className="gift editing">
              <GiftForm initial={editing} onCancel={() => setEditing(null)} onSave={save} />
            </li>
          ) : (
            <GiftItem key={g.id} gift={g} rank={gifts.length > 1 ? i + 1 : undefined}>
              <div className="gift-actions">
                {gifts.length > 1 && confirmDel !== g.id && (
                  <span className="order-btns">
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      aria-label={`Subir ${g.name} na preferência`}
                    >
                      <UiIcon.up />
                    </button>
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => move(i, 1)}
                      disabled={i === gifts.length - 1}
                      aria-label={`Descer ${g.name} na preferência`}
                    >
                      <UiIcon.down />
                    </button>
                  </span>
                )}
                {confirmDel === g.id ? (
                  <>
                    <span>Excluir esta sugestão?</span>
                    <button type="button" className="ghost" onClick={() => setConfirmDel(null)}>
                      Não
                    </button>
                    <button type="button" className="danger" onClick={() => remove(g.id)}>
                      Excluir
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className="ghost" onClick={() => setEditing(g)}>
                      Editar
                    </button>
                    <button type="button" className="ghost" onClick={() => setConfirmDel(g.id)}>
                      Excluir
                    </button>
                  </>
                )}
              </div>
            </GiftItem>
          ),
        )}
      </ul>

      {editing && !editing.id ? (
        <div className="gift editing">
          <GiftForm initial={editing} onCancel={() => setEditing(null)} onSave={save} />
        </div>
      ) : (
        gifts !== null && (
          <button type="button" className="primary wide" onClick={() => setEditing(empty)}>
            Adicionar sugestão
          </button>
        )
      )}
    </section>
  );
}
