"use client";
import React from "react";

const P: Record<string, React.ReactNode> = {
  breathe: (<><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3.6" /></>),
  scenarios: (<><rect x="4" y="4.5" width="16" height="6" rx="2" /><rect x="4" y="13.5" width="16" height="6" rx="2" /></>),
  sounds: (<path d="M3 12h2l2-6 3.2 12L13 7l2 5h6" />),
  focus: (<><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="2" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></>),
  meditate: (<><circle cx="12" cy="6.5" r="2.4" /><path d="M5 18.5c1.8-4 4.2-5.5 7-5.5s5.2 1.5 7 5.5" /><path d="M5 18.5h14" /></>),
  sleep: (<path d="M20 14.4A8 8 0 1 1 9.6 4 6.3 6.3 0 0 0 20 14.4z" />),
  mood: (<><path d="M3 16.5l5-5 4 3 6-7.5" /><path d="M3 20.5h18" /></>),
  garden: (<><path d="M12 20.5v-7.5" /><path d="M12 13c0-3.2-2.2-5.2-5.4-5.2C6.6 11 8.8 13 12 13z" /><path d="M12 11c0-2.6 2-4.2 4.8-4.2C16.8 9.4 14.8 11 12 11z" /></>),
  journal: (<><path d="M5.5 4h10a2 2 0 0 1 2 2v14H7.5a2 2 0 0 1-2-2z" /><path d="M9 8.5h6M9 12h6" /></>),
  zen: (<><ellipse cx="12" cy="17" rx="7" ry="2.3" /><ellipse cx="12" cy="12" rx="5" ry="2" /><ellipse cx="12" cy="7.5" rx="3.2" ry="1.7" /></>),
  asmr: (<><circle cx="12" cy="12" r="2.5" /><path d="M6.4 6.4a8 8 0 0 0 0 11.2M17.6 6.4a8 8 0 0 1 0 11.2" /></>),
  play: (<><circle cx="9.5" cy="13" r="4" /><circle cx="16" cy="8" r="2.4" /><circle cx="17.6" cy="15.4" r="1.5" /></>),
  affirmations: (<path d="M12 3.5l1.9 5.4 5.6.3-4.4 3.5 1.5 5.4L12 14.8 6.9 17.6l1.5-5.4L4 8.7l5.6-.3z" />),
  about: (<><circle cx="12" cy="12" r="8.5" /><path d="M12 11.5v5" /><circle cx="12" cy="8" r="0.7" fill="currentColor" stroke="none" /></>),
};

export default function Icon({ name, size = 22 }: { name: string; size?: number }) {
  return (
    <svg className="ico" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {P[name] ?? P.about}
    </svg>
  );
}
