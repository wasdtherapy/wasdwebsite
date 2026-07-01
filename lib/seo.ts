import type { Metadata } from "next";

// Per-section SEO. Client pages can't export `metadata`, so each route folder
// gets a tiny server `layout.tsx` that re-exports sectionMeta(key). Titles and
// descriptions are RU-first (primary audience) with canonical + OG/Twitter.

// Until the custom domain is connected, previews must resolve against the live
// Vercel URL. Once wasdtherapy.art is live, set NEXT_PUBLIC_SITE_URL to it
// (Vercel env) or change the fallback below.
export const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://wasdwebsite.vercel.app";
const BRAND = "wasd/therapy";

type Sec = { path: string; title: string; desc: string };

export const SECTIONS: Record<string, Sec> = {
  breathe: { path: "/breathe", title: "Дыхательные практики", desc: "Техники 4-7-8, бокс-дыхание, когерентное 5-5 и своя методика. Дыши под живое кольцо и мягкий эмбиент — бесплатно, без рекламы и регистрации." },
  guide: { path: "/guide", title: "Личный гид по спокойствию", desc: "Ответь, что чувствуешь сейчас — тревога, усталость, бессонница — и получи практику дыхания и звука. Всё считается прямо в браузере." },
  sense: { path: "/sense", title: "Сенсор дыхания", desc: "Экспериментальный сенсор дыхания через камеру: кольцо реагирует на движение груди. Приватно — видео не покидает твой браузер." },
  scenarios: { path: "/scenarios", title: "Сценарии спокойствия", desc: "Готовые связки дыхание + звук + таймер под конкретную задачу: заснуть, сфокусироваться или успокоиться за пять минут." },
  sounds: { path: "/sounds", title: "Генеративные звуки природы", desc: "Генеративный микшер из 12 слоёв природы: дождь, океан, лес, костёр, поющие чаши. Звук создаётся в реальном времени и не повторяется." },
  focus: { path: "/focus", title: "Фокус и Помодоро", desc: "Помодоро-таймер с живым эмбиентом и паузами на дыхание. Спокойный фокус без кофеина и уведомлений." },
  meditate: { path: "/meditate", title: "Медитации", desc: "Гайдовые медитации на 3, 5, 10, 15 и 20 минут с мягким голосом и звуковым фоном. Начни с одной минуты тишины." },
  sleep: { path: "/sleep", title: "Засыпание и сон", desc: "Таймер сна, который сам плавно затихает, и успокаивающие звуковые ландшафты. Отпусти день и засыпай мягче." },
  asmr: { path: "/asmr", title: "АСМР", desc: "Тихие интерактивные звуки-отклики: тыкай по мягким триггерам и расслабляйся. АСМР прямо в браузере, без видео и рекламы." },
  play: { path: "/play", title: "Спокойные игры", desc: "Медитативные мини-игры: лопай пузырьки под пентатонику и рисуй звук. Спокойная игра, чтобы разгрузить голову." },
  journal: { path: "/journal", title: "Дневник благодарности", desc: "Дневник благодарности и состояний — приватно, только в твоём браузере. Записывай хорошее и замечай динамику." },
  mood: { path: "/mood", title: "Трекер настроения", desc: "Отмечай настроение и смотри график динамики за дни и недели. Мягкий трекер состояния без осуждения." },
  garden: { path: "/garden", title: "Сад спокойствия", desc: "Твой спокойный сад растёт за каждую минуту тишины и практик. Визуальная награда за заботу о себе." },
  zen: { path: "/zen", title: "Дзен-сад", desc: "Дзен-сад: рисуй узоры на песке и расставляй камни. Медитативное пространство, чтобы замедлиться." },
  affirmations: { path: "/affirmations", title: "Аффирмации", desc: "Тёплые аффирмации, которые хочется сохранить. Мягкие слова поддержки на русском и английском." },
  about: { path: "/about", title: "О проекте", desc: "Философия wasd/therapy: спокойные технологии без рекламы, слежки и аккаунтов. Как устроен проект и как им пользоваться." },
};

export function sectionMeta(key: string): Metadata {
  const s = SECTIONS[key];
  if (!s) return {};
  const url = BASE + s.path;
  const fullTitle = s.title + " · " + BRAND;
  const img = "/og/" + key + ".png";
  return {
    title: fullTitle,
    description: s.desc,
    alternates: { canonical: s.path },
    openGraph: { title: fullTitle, description: s.desc, url, type: "website", siteName: BRAND, images: [{ url: img, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: fullTitle, description: s.desc, images: [img] },
  };
}
