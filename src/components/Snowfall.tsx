import { Flake } from './Decor';

// Valores fixos (pseudoaleatórios) para a neve não "pular" a cada renderização.
const rand = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const FLAKES = Array.from({ length: 26 }, (_, i) => ({
  left: rand(i, 1) * 100,
  size: 6 + rand(i, 2) * 12,
  duration: 11 + rand(i, 3) * 12,
  delay: -rand(i, 4) * 23,
  sway: 12 + rand(i, 5) * 26,
  star: rand(i, 6) > 0.55,
  opacity: 0.45 + rand(i, 7) * 0.5,
}));

export function Snowfall() {
  return (
    <div className="snow" aria-hidden>
      {FLAKES.map((f, i) => (
        <span
          key={i}
          className="snow-fall"
          style={
            {
              left: `${f.left}%`,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              '--sway': `${f.sway}px`,
              opacity: f.opacity,
            } as React.CSSProperties
          }
        >
          <span className="snow-sway" style={{ animationDuration: `${f.duration / 3}s` }}>
            {f.star ? (
              <Flake className="snow-flake" />
            ) : (
              <span className="snow-dot" style={{ width: f.size / 2, height: f.size / 2 }} />
            )}
          </span>
        </span>
      ))}
    </div>
  );
}
