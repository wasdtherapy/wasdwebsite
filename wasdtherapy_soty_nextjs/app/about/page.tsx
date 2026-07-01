"use client";
import Reveal from "@/components/Reveal";
import { useStore } from "@/lib/store";

export default function About() {
  const lang = useStore((s) => s.lang);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  return (
    <section className="section longread">
      <div className="eyebrow">{t("манифест", "manifesto")}</div>
      <h1>{t("О проекте", "About")}</h1>
      <p className="lr-lead">
        {t(
          "wasd/therapy — это тихая комната в шумном интернете. Место, куда можно зайти на три минуты и выйти чуть спокойнее.",
          "wasd/therapy is a quiet room in a noisy internet. A place you can step into for three minutes and leave a little calmer."
        )}
      </p>

      <Reveal>
        <div className="lr-block">
          <h3>{t("Почему это существует", "Why this exists")}</h3>
          <p>
            {t(
              "Большая часть интернета спроектирована так, чтобы удерживать внимание как можно дольше. Бесконечные ленты, уведомления, яркие кнопки — всё борется за твои секунды.",
              "Most of the internet is engineered to hold your attention as long as possible. Endless feeds, notifications, loud buttons — all fighting for your seconds."
            )}
          </p>
          <p>
            {t(
              "Этот сайт — попытка сделать наоборот. Он не хочет, чтобы ты оставался как можно дольше. Он хочет, чтобы ты подышал, успокоился и вернулся к жизни.",
              "This site tries to do the opposite. It does not want you to stay as long as possible. It wants you to breathe, settle, and return to your life."
            )}
          </p>
        </div>
      </Reveal>

      <Reveal>
        <blockquote className="lr-quote">
          {t(
            "Спокойствие — это не отсутствие шторма, а умение дышать внутри него.",
            "Calm is not the absence of the storm — it is learning to breathe inside it."
          )}
        </blockquote>
      </Reveal>

      <Reveal>
        <div className="lr-block">
          <h3>{t("Во что мы верим", "What we believe")}</h3>
          <p>
            {t(
              "Технологии могут быть добрыми. Инструмент может уважать твоё время. Красота не должна стоить подписки, а покой не должен быть платным.",
              "Technology can be kind. A tool can respect your time. Beauty should not cost a subscription, and calm should never be paywalled."
            )}
          </p>
          <p>
            {t(
              "Поэтому здесь нет рекламы, нет трекеров и нет регистрации. Всё, что ты вводишь — дневник, настроение, настройки — остаётся только в твоём браузере и никуда не уходит.",
              "That is why there are no ads, no trackers and no signup. Everything you enter — journal, mood, settings — stays only in your browser and goes nowhere else."
            )}
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div className="lr-block">
          <h3>{t("Живой звук, а не файлы", "Living sound, not files")}</h3>
          <p>
            {t(
              "Весь звук здесь рождается прямо в браузере в реальном времени — никаких зацикленных треков. Поэтому дождь никогда не повторяется, а волны никогда не звучат одинаково.",
              "All sound here is generated live in your browser — no looping tracks. The rain never repeats, and the waves never sound the same twice."
            )}
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div className="section-head">
          <div className="eyebrow">{t("принципы", "principles")}</div>
          <h2>{t("Три обещания", "Three promises")}</h2>
        </div>
      </Reveal>
      <div className="steps">
        <Reveal>
          <div className="step">
            <div className="step-n">01</div>
            <h4>{t("Без шума", "No noise")}</h4>
            <p>{t("Никакой рекламы, трекеров и бесконечных лент. Только то, что помогает.", "No ads, trackers or endless feeds. Only what helps.")}</p>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="step">
            <div className="step-n">02</div>
            <h4>{t("Живой звук", "Living sound")}</h4>
            <p>{t("Всё аудио синтезируется в браузере в реальном времени — никаких файлов и повторов.", "All audio is synthesized live in your browser — no files, no loops.")}</p>
          </div>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="step">
            <div className="step-n">03</div>
            <h4>{t("Твоё и только твоё", "Yours only")}</h4>
            <p>{t("Настройки хранятся в твоём браузере. Мы не собираем данные.", "Settings live in your browser. We collect no data.")}</p>
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div className="lr-block">
          <h3>{t("Как пользоваться", "How to use")}</h3>
          <p>
            {t(
              "Начни с раздела «Дыхание» на три минуты, потом добавь фоновые звуки. Для работы — «Фокус», перед сном — «Медитация» или «Сон». Лучше всего в наушниках.",
              "Start with Breathe for three minutes, then add background sounds. Use Focus for work, and Meditate or Sleep before bed. Best with headphones."
            )}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
