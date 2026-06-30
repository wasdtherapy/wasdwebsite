"use client";

type Variant = "night" | "waves" | "sunrise" | "rain" | "sparkles";

const STARS = [
  [40, 38, 1.8], [78, 70, 1.2], [120, 30, 2.2], [150, 92, 1.4], [186, 52, 1.6],
  [70, 120, 1.5], [210, 34, 1.2], [30, 88, 1.3], [250, 76, 1.7], [108, 110, 1.4],
  [292, 44, 2], [330, 96, 1.3], [170, 128, 1.5], [276, 118, 1.6], [56, 56, 1.2],
  [228, 110, 1.3], [136, 64, 1.5], [200, 90, 1.4],
] as const;

const RAYS = [
  [171, 138], [179, 115], [195, 96], [216, 84], [240, 80],
  [264, 84], [285, 96], [301, 115], [309, 138],
] as const;

const DROPS = [150, 172, 196, 214, 236, 258, 278, 300, 322, 188, 246, 312] as const;

const SPARKS = [
  [90, 60], [180, 40], [260, 82], [350, 50], [420, 112],
  [140, 122], [300, 142], [220, 108], [392, 162],
] as const;
const SPARK = "M0 -9 C1.6 -3 3 -1.6 9 0 C3 1.6 1.6 3 0 9 C-1.6 3 -3 1.6 -9 0 C-3 -1.6 -1.6 -3 0 -9 Z";

export default function Illustration({ variant }: { variant: Variant }) {
  return (
    <div className={`illus illus-${variant}`} aria-hidden="true">
      {variant === "night" && (
        <svg viewBox="0 0 480 180" className="ill-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="il-moon" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.45" />
              <stop offset="70%" stopColor="var(--accent)" stopOpacity="0" />
            </radialGradient>
            <mask id="il-cres">
              <circle cx="372" cy="60" r="28" fill="#fff" />
              <circle cx="360" cy="52" r="24" fill="#000" />
            </mask>
          </defs>
          <g className="stars">
            {STARS.map((s, i) => (
              <circle key={i} cx={s[0]} cy={s[1]} r={s[2]} />
            ))}
          </g>
          <circle cx="372" cy="60" r="60" fill="url(#il-moon)" />
          <circle cx="372" cy="60" r="28" fill="var(--accent)" mask="url(#il-cres)" />
        </svg>
      )}

      {variant === "waves" && (
        <svg viewBox="0 0 480 150" className="ill-svg" preserveAspectRatio="xMidYMid meet">
          <path d="M-60 70 Q -30 52 0 70 T 60 70 T 120 70 T 180 70 T 240 70 T 300 70 T 360 70 T 420 70 T 480 70 T 540 70" />
          <path d="M-60 92 Q -30 74 0 92 T 60 92 T 120 92 T 180 92 T 240 92 T 300 92 T 360 92 T 420 92 T 480 92 T 540 92" />
          <path d="M-60 114 Q -30 96 0 114 T 60 114 T 120 114 T 180 114 T 240 114 T 300 114 T 360 114 T 420 114 T 480 114 T 540 114" />
        </svg>
      )}

      {variant === "sunrise" && (
        <svg viewBox="0 0 480 180" className="ill-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="il-sun" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.55" />
              <stop offset="70%" stopColor="var(--accent)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g className="sun-rise">
            <circle cx="240" cy="150" r="82" fill="url(#il-sun)" />
            <g className="rays">
              {RAYS.map((r, i) => (
                <line key={i} className="ray" x1="240" y1="150" x2={r[0]} y2={r[1]} />
              ))}
            </g>
            <circle className="sun-disc" cx="240" cy="150" r="24" />
          </g>
          <line className="horizon" x1="40" y1="150" x2="440" y2="150" />
        </svg>
      )}

      {variant === "rain" && (
        <svg viewBox="0 0 480 180" className="ill-svg" preserveAspectRatio="xMidYMid meet">
          <g>
            <ellipse className="cloud" cx="210" cy="54" rx="58" ry="26" />
            <ellipse className="cloud" cx="260" cy="48" rx="46" ry="30" />
            <ellipse className="cloud" cx="300" cy="58" rx="40" ry="22" />
          </g>
          <g className="drops">
            {DROPS.map((x, i) => (
              <line key={i} className="drop" x1={x} y1="84" x2={x} y2="96" />
            ))}
          </g>
        </svg>
      )}

      {variant === "sparkles" && (
        <svg viewBox="0 0 480 180" className="ill-svg" preserveAspectRatio="xMidYMid meet">
          <g className="sparks">
            {SPARKS.map((p, i) => (
              <g key={i} transform={`translate(${p[0]} ${p[1]})`}>
                <path className="spark" d={SPARK} />
              </g>
            ))}
          </g>
        </svg>
      )}
    </div>
  );
}
