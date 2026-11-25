import type { ParticipantId } from '../api/types';
import { InterestIcon } from './Icons';

interface Props {
  id: ParticipantId;
  name: string;
  note?: string;
  size?: 'sm' | 'lg';
}

/** Etiqueta de presente com o ícone do interesse da pessoa. */
export function TagFace({ id, name, note, size = 'sm' }: Props) {
  return (
    <span className={`tag tag-${size}`} data-person={id}>
      <span className="tag-hole" aria-hidden />
      <span className="tag-icon">
        <InterestIcon id={id} />
      </span>
      <span className="tag-name">{name}</span>
      {note && <span className="tag-note">{note}</span>}
    </span>
  );
}
