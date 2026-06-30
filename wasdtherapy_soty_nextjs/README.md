# wasdtherapy.art — SOTY edition

Продакшен-стартер для превращения калм-тех прототипа в работу уровня Awwwards. Стек: **Next.js 14 (App Router) + React Three Fiber + GLSL + Tone.js + GSAP + Zustand + Tailwind**.

## Запуск

```bash
npm install
npm run dev
# http://localhost:3000
```

Сборка и деплой:

```bash
npm run build && npm start
# или просто залей репо на Vercel — ноль конфига
```

> Архив содержит исходники без `node_modules` и `.next`. Зависимости ставятся `npm install` при первом запуске.

## Что уже работает

- **Живой GLSL-орб** на главной: икосаэдр с simplex-noise дисплейсментом, fresnel-ободом и additive-blending, реагирует на громкость звука.
- **Генеративный ambient** на Tone.js: FM-pad, смена аккордов, shimmer, reverb, Meter кормит audio-реактивность орба.
- **Кастомный курсор** (GSAP quickTo) с режимом hover, magnetic-чувствительные кнопки.
- **Scroll-reveal** через IntersectionObserver + GSAP, с уважением prefers-reduced-motion.
- **Переходы между страницами** (curtain fade на смене route).
- **Двуязычность RU/EN** через Zustand-стор.
- **Разделы**: `/breathe` (рабочий 4-7-8 ринг), `/focus` (таймер с пресетами), `/sounds` (запуск ambient).

## Структура

```
app/
  layout.tsx        # шрифты, мета, Cursor + Nav + PageTransition
  page.tsx          # главная: hero со \u0441ценой + hub
  globals.css       # токены и стили
  breathe|focus|sounds/page.tsx
components/
  Scene.tsx         # R3F Canvas
  OrbField.tsx      # меш + шейдерный материал, audio-reactive
  shaders/orb.ts    # GLSL: simplex noise + fresnel
  Cursor|Nav|PageTransition|Reveal.tsx
lib/
  store.ts          # zustand (lang, palette, audioLevel, muted)
  audio.ts          # Tone.js движок
```

## Roadmap до SOTY

- [ ] Полный порт 9-слойного микшера звуков в `/sounds`.
- [ ] Разделы `/meditate`, `/affirmations`, `/games`, `/zen`.
- [ ] Shared-element page transitions (сейчас — curtain fade).
- [ ] Палитро-переключатель в UI (стор уже готов).
- [ ] Проход по a11y (focus-states, ARIA, контраст) и perf (ленивая 3D, throttle).
- [ ] Submission-видео и описание для Awwwards.
- [ ] Реальный donate-URL (CloudTips / Boosty / Ko-fi).

## Лицензия

Свободно используй для wasdtherapy.art. Шейдер шума — Ashima webgl-noise (MIT).
