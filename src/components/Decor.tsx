type Kind = 'ball' | 'star' | 'bell';

const HANGS: { x: number; y: number; len: number; kind: Kind; tone: 'red' | 'green' | 'gold' }[] = [
  { x: 50, y: 30, len: 16, kind: 'ball', tone: 'red' },
  { x: 130, y: 42, len: 10, kind: 'star', tone: 'gold' },
  { x: 210, y: 34, len: 20, kind: 'ball', tone: 'green' },
  { x: 290, y: 44, len: 9, kind: 'bell', tone: 'red' },
  { x: 360, y: 30, len: 18, kind: 'ball', tone: 'gold' },
];

function Ornament({ kind }: { kind: Kind }) {
  if (kind === 'star')
    return <path d="M0-9 2.6-2.8 9.3-2.5 4-1.6 5.7 8 0 4.4-5.7 8-4-1.6-9.3-2.5-2.6-2.8Z" />;
  if (kind === 'bell')
    return (
      <>
        <path d="M-8 9c1.5-2 2-4 2-8a6 6 0 0 1 12 0c0 4 .5 6 2 8Z" />
        <path d="M-2 12a2 2 0 0 0 4 0" />
      </>
    );
  return (
    <>
      <rect x="-3" y="-2" width="6" height="4" rx="1" />
      <circle cx="0" cy="9" r="8" />
      <path d="M-5 7c2-3 5-3.5 7-3.5" className="shine" />
    </>
  );
}

export function Garland() {
  return (
    <svg className="garland" viewBox="0 0 400 100" preserveAspectRatio="xMidYMin meet" aria-hidden>
      <path
        className="garland-string"
        d="M0 18C25 26 35 30 50 30s50 12 80 12 55-8 80-8 55 10 80 10 50-14 70-14 30-8 40-10"
      />
      {HANGS.map((h) => (
        <g key={h.x} className={`orn orn-${h.tone}`}>
          <path className="garland-thread" d={`M${h.x} ${h.y}v${h.len}`} />
          <g transform={`translate(${h.x} ${h.y + h.len + 2})`}>
            <Ornament kind={h.kind} />
          </g>
        </g>
      ))}
    </svg>
  );
}

export function Sprig({ className = '' }: { className?: string }) {
  return (
    <svg className={`sprig ${className}`} viewBox="0 0 120 80" aria-hidden>
      <path className="sprig-stem" d="M8 72C40 58 70 40 112 10" />
      {[
        [24, 64],
        [38, 57],
        [52, 48],
        [66, 39],
        [80, 30],
        [94, 21],
      ].map(([x, y], i) => (
        <g key={i} className="sprig-needles">
          <path d={`M${x} ${y}l-6-12M${x} ${y}l12 4M${x + 5} ${y - 3}l-3-12M${x + 5} ${y - 3}l12 3`} />
        </g>
      ))}
      <circle className="berry" cx="18" cy="62" r="4" />
      <circle className="berry" cx="26" cy="70" r="3.4" />
    </svg>
  );
}

export function Flake({ className = '' }: { className?: string }) {
  return (
    <svg className={`flake ${className}`} viewBox="-10 -10 20 20" aria-hidden>
      <path d="M0-8V8M-7-4 7 4M-7 4 7-4M-2-6.5 0-4.5 2-6.5M-2 6.5 0 4.5 2 6.5" />
    </svg>
  );
}
