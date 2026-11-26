import type { ParticipantId } from '../api/types';

const base = {
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

function Trilha() {
  return (
    <svg {...base}>
      <circle cx="37" cy="11" r="3.5" />
      <path d="M3 40 17 17l7 11 6-8 15 20Z" />
      <path d="M13 24.5 17 17l3.5 5.5" />
      <path d="M15 40c2-4 8-3 9-7s5-4 6-7" strokeDasharray="2 3.2" className="accent" />
    </svg>
  );
}

function Desenho() {
  return (
    <svg {...base}>
      <path d="M31 6.5 41.5 17 19 39.5l-11.5 2 2-11.5Z" />
      <path d="M27 10.5 37.5 21M9.5 30 18 38.5" />
      <path d="M6 45c4-3 7 1 11-1.5s7 1 11-1.5" className="accent" />
    </svg>
  );
}

function Cachorros() {
  return (
    <svg {...base}>
      {/* cachorro maior, orelhas caídas */}
      <circle cx="15" cy="17" r="7" />
      <path d="M9.2 13c-3.6 1-4.6 5.6-3.4 9.3 2.6.2 4-1.6 4.3-4.3M20.8 13c3.6 1 4.6 5.6 3.4 9.3-2.6.2-4-1.6-4.3-4.3" />
      <circle cx="12.6" cy="16.6" r="1" fill="currentColor" />
      <circle cx="17.4" cy="16.6" r="1" fill="currentColor" />
      <ellipse cx="15" cy="20.2" rx="1.6" ry="1.1" fill="currentColor" />
      <path d="M10.6 23.6C8 28 7.6 35 8.4 41h13.2c.8-6 .4-13-2.2-17.4M15 33v8" />
      <path d="M21.6 37c3.4-.4 4.6-3 4-6" />
      <path d="M10.4 24.6c3 1.6 6.2 1.6 9.2 0" className="accent" />
      {/* cachorro menor, orelhas dobradas */}
      <circle cx="34" cy="24.5" r="5.5" />
      <path d="M30.2 21c-2.6-.2-3.6-3.4-2.6-5.6 2.4-.4 4.2 1.4 4.8 3.4M37.8 21c2.6-.2 3.6-3.4 2.6-5.6-2.4-.4-4.2 1.4-4.8 3.4" />
      <circle cx="32.1" cy="24.2" r=".9" fill="currentColor" />
      <circle cx="35.9" cy="24.2" r=".9" fill="currentColor" />
      <ellipse cx="34" cy="27" rx="1.3" ry=".9" fill="currentColor" />
      <path d="M30.6 29.4c-2 3.4-2.4 7.6-1.8 11.6h10.4c.6-4 .2-8.2-1.8-11.6M34 35.5V41" />
      <path d="M39.2 37.5c3 .3 4.8-1.6 4.6-4.6" />
      <path d="M30.6 30.2c2.2 1.2 4.6 1.2 6.8 0" className="accent" />
      <path d="M4 41h40" />
    </svg>
  );
}

function Gatinha() {
  return (
    <svg {...base}>
      {/* gatinha sentada, centralizada */}
      <g transform="translate(9 0)">
      <path d="M9.4 14.2 8.8 7.4l5 3.9M20.6 14.2l.6-6.8-5 3.9" />
      <circle cx="15" cy="17.6" r="6.6" />
      <ellipse cx="12.7" cy="17.1" rx=".65" ry=".95" fill="currentColor" />
      <ellipse cx="17.3" cy="17.1" rx=".65" ry=".95" fill="currentColor" />
      <path d="M14.2 20h1.6l-.8.9Z" fill="currentColor" strokeWidth="1" />
      <path d="M8.4 19.4 4.6 18.8M8.4 21 4.8 21.8M21.6 19.4l3.8-.6M21.6 21l3.6.8" strokeWidth="1.3" />
      <path d="M10.6 23.4C7.8 27.8 7.4 35 8.6 41h12.8c1.2-6 .8-13.2-2-17.6M15 33v8" />
      <path d="M21.4 39c5 1.4 7.6-2.4 5.4-6" />
      </g>
      <path d="M10 41h28" />
    </svg>
  );
}

function Pato() {
  return (
    <svg {...base} className="duck">
      <circle cx="21" cy="16" r="7" />
      <path d="M14.5 14.5 7 16.5l7.5 2.5" className="accent" fill="currentColor" />
      <circle cx="22.5" cy="14.5" r="1" fill="currentColor" />
      <path d="M18 22.5c0 2.5-2.5 4.5-7 5 0 8 7 12.5 16 12.5 10 0 16-6 16-14-5 3.5-11 3-15 0-1.5-1-3-2-3.5-3.5" />
      <path d="M21 31c4 3.5 10 3.5 14 0" />
      <path d="M8 45h32" className="accent" />
    </svg>
  );
}

function Globo() {
  return (
    <svg {...base}>
      <circle cx="21" cy="27" r="15" />
      <ellipse cx="21" cy="27" rx="6.5" ry="15" />
      <path d="M6 27h30M8.5 19h25M8.5 35h25" />
      <path d="M4 15C12 5 30 3 39 9" strokeDasharray="2 3.2" className="accent" />
      <path d="m38 4.5 8 4.5-8 3.5 1.8-4Z" fill="currentColor" className="accent" />
    </svg>
  );
}

function Netas() {
  return (
    <svg {...base}>
      <circle cx="15" cy="21" r="5.5" />
      <circle cx="8" cy="19" r="2" />
      <circle cx="22" cy="19" r="2" />
      <path d="M15 27 8.5 41h13Z" />
      <circle cx="33" cy="24" r="4.5" />
      <circle cx="33" cy="17.5" r="1.8" className="accent" fill="currentColor" />
      <path d="M33 29l-5.5 12h11Z" />
      <path d="M24 12.5c-1.5-2.6-5.5-1.2-4 1.6l4 3.9 4-3.9c1.5-2.8-2.5-4.2-4-1.6Z" className="accent" fill="currentColor" />
    </svg>
  );
}

const MAP: Record<ParticipantId, () => React.JSX.Element> = {
  bruno: Trilha,
  daiane: Desenho,
  diego: Cachorros,
  isabela: Gatinha,
  joao: Pato,
  livia: Globo,
  marcia: Netas,
};

export function InterestIcon({ id }: { id: ParticipantId }) {
  const Icon = MAP[id];
  return <Icon />;
}

/* Ícones de interface */
export const UiIcon = {
  gift: () => (
    <svg {...base} viewBox="0 0 24 24">
      <rect x="3.5" y="9" width="17" height="11" rx="1.5" />
      <path d="M2.5 9h19v-3h-19ZM12 6v14M12 6c-1-3-5.5-3.5-5.5-1S10 6 12 6c1-3 5.5-3.5 5.5-1S14 6 12 6" />
    </svg>
  ),
  list: () => (
    <svg {...base} viewBox="0 0 24 24">
      <path d="M9 6h11M9 12h11M9 18h11" />
      <circle cx="4.5" cy="6" r="1" fill="currentColor" />
      <circle cx="4.5" cy="12" r="1" fill="currentColor" />
      <circle cx="4.5" cy="18" r="1" fill="currentColor" />
    </svg>
  ),
  eye: () => (
    <svg {...base} viewBox="0 0 24 24">
      <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  eyeOff: () => (
    <svg {...base} viewBox="0 0 24 24">
      <path d="M4 4l16 16M10.6 6.1A10 10 0 0 1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-3.2 3.9M6.6 7.6C3.8 9.4 2 12 2 12s3.5 6.5 10 6.5c1.9 0 3.5-.5 4.9-1.2M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  ),
  up: () => (
    <svg {...base} viewBox="0 0 24 24">
      <path d="M6 15l6-6 6 6" />
    </svg>
  ),
  down: () => (
    <svg {...base} viewBox="0 0 24 24">
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  back: () => (
    <svg {...base} viewBox="0 0 24 24">
      <path d="M15 5 8 12l7 7" />
    </svg>
  ),
  del: () => (
    <svg {...base} viewBox="0 0 24 24">
      <path d="M9 5h11v14H9l-6-7Z" />
      <path d="m12 9.5 5 5m0-5-5 5" />
    </svg>
  ),
  check: () => (
    <svg {...base} viewBox="0 0 24 24">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  ),
};
