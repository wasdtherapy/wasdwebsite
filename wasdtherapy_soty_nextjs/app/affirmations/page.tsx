"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import Illustration from "@/components/Illustration";

type Aff = { ru: string; en: string; cat_ru: string; cat_en: string };
const AFF: Aff[] = [
  { ru: "Я делаю достаточно, и я достаточен.", en: "I am doing enough, and I am enough.", cat_ru: "принятие", cat_en: "acceptance" },
  { ru: "Этот вдох — моё начало заново.", en: "This breath is my fresh start.", cat_ru: "спокойствие", cat_en: "calm" },
  { ru: "Я могу отпустить то, что не могу контролировать.", en: "I can release what I cannot control.", cat_ru: "принятие", cat_en: "acceptance" },
  { ru: "Моё спокойствие — это сила, а не слабость.", en: "My calm is strength, not weakness.", cat_ru: "уверенность", cat_en: "confidence" },
  { ru: "Я благодарен за этот тихий момент.", en: "I am grateful for this quiet moment.", cat_ru: "благодарность", cat_en: "gratitude" },
  { ru: "Шаг за шагом — этого достаточно.", en: "Step by step is enough.", cat_ru: "спокойствие", cat_en: "calm" },
  { ru: "Я заслуживаю отдых без чувства вины.", en: "I deserve rest without guilt.", cat_ru: "принятие", cat_en: "acceptance" },
  { ru: "Я справлялся раньше — справлюсь и сейчас.", en: "I have coped before, and I will now.", cat_ru: "уверенность", cat_en: "confidence" },
  { ru: "Моё тело знает, как дышать и успокаиваться.", en: "My body knows how to breathe and calm down.", cat_ru: "спокойствие", cat_en: "calm" },
  { ru: "Сегодня я выбираю мягкость к себе.", en: "Today I choose to be gentle with myself.", cat_ru: "принятие", cat_en: "acceptance" },
  { ru: "Я есть здесь и сейчас, и этого достаточно.", en: "I am here now, and that is enough.", cat_ru: "осознанность", cat_en: "presence" },
  { ru: "С каждым выдохом я отпускаю напряжение.", en: "With each exhale I let tension go.", cat_ru: "спокойствие", cat_en: "calm" },
];

export default function Affirmations() {
  const lang = useStore((s) => s.lang);
  const favorites = useStore((s) => s.favorites);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setI((x) => (x + 1) % AFF.length), 8000);
    return () => clearInterval(id);
  }, [auto]);
  const a = AFF[i];
  const favId = `aff-${i}`;
  const isFav = favorites.includes(favId);
  return (
    <section className="tool">
      <h1>{t("Аффирмации", "Affirmations")}</h1>
      <p className="sub">{t("Тёплые фразы, чтобы вернуть себе опору. Читай медленно, про себя или вслух.", "Warm phrases to steady yourself. Read slowly, silently or aloud.")}</p>
      <Illustration variant="sparkles" />
      <div className="aff-wrap">
        <div className="aff-card" key={i}>
          <div className="aff-text">{t(a.ru, a.en)}</div>
          <div className="aff-cat">{t(a.cat_ru, a.cat_en)}</div>
        </div>
      </div>
      <div className="controls">
        <button className="btn-ghost" onClick={() => { setAuto(false); setI((x) => (x - 1 + AFF.length) % AFF.length); }}>{t("← Назад", "← Prev")}</button>
        <button className="btn" onClick={() => { setAuto(false); setI((x) => (x + 1) % AFF.length); }}>{t("Дальше →", "Next →")}</button>
        <button className={isFav ? "fav on" : "fav"} onClick={() => toggleFavorite(favId)} aria-label="favorite">{isFav ? "♥" : "♡"}</button>
      </div>
      <p className="sub">{auto ? t("Автосмена включена", "Autoplay on") : t("Автосмена выключена", "Autoplay off")} · {t("Сохранено", "Saved")}: <b>{favorites.length}</b></p>
      <div className="note">{t("Как пользоваться: выбери фразу, которая откликается, и повтори её несколько раз на медленном выдохе. Нажми сердце, чтобы сохранить любимые.", "How to use: pick a line that resonates and repeat it a few times on a slow exhale. Tap the heart to save favorites.")}</div>
    </section>
  );
}
