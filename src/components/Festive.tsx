/** Pinheirinho decorado (canto inferior da tela inicial). */
export function XmasTree({ className = '' }: { className?: string }) {
  const balls: [number, number, string][] = [
    [50, 50, 'r'], [70, 56, 'g'], [42, 84, 'g'], [62, 92, 'r'], [80, 86, 'w'],
    [34, 120, 'r'], [54, 128, 'w'], [76, 124, 'g'], [92, 132, 'r'], [24, 132, 'g'],
  ];
  const lights: [number, number][] = [
    [58, 38], [46, 64], [74, 70], [34, 100], [52, 108], [86, 104], [44, 140], [66, 142], [100, 140], [16, 140],
  ];
  return (
    <svg className={`xmas-tree ${className}`} viewBox="0 0 120 170" aria-hidden>
      <rect x="52" y="140" width="16" height="16" rx="2" fill="#7a4a26" />
      <path className="tier-dark" d="M60 62 104 142Q93 136 82 142 71 136 60 142 49 136 38 142 27 136 16 142Z" />
      <path className="tier" d="M60 36 92 102Q84 97 76 102 68 97 60 102 52 97 44 102 36 97 28 102Z" />
      <path className="tier-dark" d="M60 16 80 64Q73 60 66 64 60 60 54 64 47 60 40 64Z" />
      <path className="tinsel" d="M42 56Q60 66 77 54M31 94Q60 108 89 92M20 132Q60 148 100 130" />
      {lights.map(([x, y], i) => (
        <circle key={i} className="light" cx={x} cy={y} r="2.2" style={{ animationDelay: `${(i % 4) * 0.45}s` }} />
      ))}
      {balls.map(([x, y, c], i) => (
        <g key={i} className={`ball ball-${c}`}>
          <circle cx={x} cy={y} r="4.6" />
          <path d={`M${x - 2} ${y - 1.6}a2.4 2.4 0 0 1 2.2-1.4`} className="ball-shine" />
        </g>
      ))}
      <path className="star" d="M60 2 63.2 9.6 71.4 10.3 65.2 15.6 67.1 23.6 60 19.3 52.9 23.6 54.8 15.6 48.6 10.3 56.8 9.6Z" />
      {/* presentes */}
      <rect x="18" y="146" width="24" height="20" rx="2" fill="#ad2f38" />
      <path d="M30 146v20M18 155h24" stroke="#f4d27a" strokeWidth="3" />
      <rect x="76" y="150" width="22" height="16" rx="2" fill="#2a567f" />
      <path d="M87 150v16M76 158h22" stroke="#fff" strokeWidth="3" />
      <path d="M30 146c-4-6-10-3-6 0M30 146c4-6 10-3 6 0" fill="none" stroke="#f4d27a" strokeWidth="2" />
    </svg>
  );
}

/** Papai Noel acenando, escondido atrás do selo da contagem. */
export function Santa({ className = '' }: { className?: string }) {
  return (
    <svg className={`santa ${className}`} viewBox="0 0 120 110" aria-hidden>
      <path d="M16 112Q18 70 50 66 82 70 84 112Z" fill="#c43a43" />
      <g className="santa-arm">
        <path d="M74 80 94 46" stroke="#c43a43" strokeWidth="11" strokeLinecap="round" />
        <circle cx="95" cy="44" r="6.4" fill="#fff" stroke="#d9d0c8" strokeWidth="1.2" />
        <path d="M92 38c-1.6-6 1-11 5.4-11.4 4.6-.4 7 4 5.6 9.2-.8 2.8-3 4.4-5.6 4.4-2.4 0-4.6-.6-5.4-2.2Z" fill="#2f7a52" />
        <path d="M102.4 34.6c2.6-1.4 4.4.2 3.6 2.4-.6 1.6-2.4 2-3.8 1.4" fill="#2f7a52" />
      </g>
      <path d="M29 50Q26 82 50 88 74 82 71 50Z" fill="#fff" stroke="#d9d0c8" strokeWidth="1.2" />
      <circle cx="50" cy="47" r="14" fill="#f6d0b1" />
      <ellipse cx="41.5" cy="51.5" rx="3" ry="2" fill="#f2a9a0" />
      <ellipse cx="58.5" cy="51.5" rx="3" ry="2" fill="#f2a9a0" />
      <circle cx="45" cy="45.5" r="1.7" fill="#2b211b" />
      <circle cx="55" cy="45.5" r="1.7" fill="#2b211b" />
      <path d="M38 57Q44 52 50 55.5 56 52 62 57 56 61 50 58 44 61 38 57Z" fill="#fff" stroke="#d9d0c8" strokeWidth="1.2" />
      <circle cx="50" cy="51.5" r="2.8" fill="#e9a48a" />
      <path d="M35 38Q38 13 62 13 81 15 88 32L81 35Q73 25 65 27 67 32 66 38Z" fill="#c43a43" />
      <rect x="32" y="33" width="37" height="9" rx="4.5" fill="#fff" stroke="#d9d0c8" strokeWidth="1.2" />
      <circle cx="86" cy="35" r="5.4" fill="#fff" stroke="#d9d0c8" strokeWidth="1.2" />
    </svg>
  );
}
