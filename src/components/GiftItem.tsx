import type { Gift } from '../api';
import { brl, EVENT } from '../data';

export function GiftItem({ gift, children }: { gift: Gift; children?: React.ReactNode }) {
  const over = gift.price !== null && gift.price > EVENT.priceCap;
  return (
    <li className="gift">
      <div className="gift-top">
        <h3>{gift.name}</h3>
        {gift.price !== null && (
          <span className={`price${over ? ' over' : ''}`}>{brl(gift.price)}</span>
        )}
      </div>
      {gift.description && <p>{gift.description}</p>}
      {over && <p className="warn">Acima do teto de {brl(EVENT.priceCap)}.</p>}
      {/^https?:\/\//i.test(gift.link) && (
        <a href={gift.link} target="_blank" rel="noopener noreferrer" className="link">
          Abrir link
        </a>
      )}
      {children}
    </li>
  );
}
