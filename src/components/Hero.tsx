import React, { useEffect, useState } from 'react';
import { SiteBanner } from '../lib/supabase';
import { Language, translations } from '../i18n/translations';
import { HeroPhoneMockup } from './PhoneMockups';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

interface HeroProps {
  lang: Language;
  banners: SiteBanner[];
  onNavigate: (hash: string) => void;
}

/** Акции из site_banners показываются компактной карточкой под кнопками. */
const PromoCard: React.FC<HeroProps> = ({ lang, banners, onNavigate }) => {
  const t = translations[lang].hero;
  const [index, setIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string | number, boolean>>({});
  const count = banners.length;

  useEffect(() => {
    if (index >= count && count > 0) setIndex(0);
  }, [count, index]);

  useEffect(() => {
    if (count <= 1) return;
    const timer = window.setInterval(() => setIndex((prev) => (prev + 1) % count), 6000);
    return () => window.clearInterval(timer);
  }, [count]);

  if (count === 0) return null;

  const banner = banners[index] || banners[0];
  const title = (lang === 'uz' && banner.title_uz?.trim()) || banner.title;
  const subtitle = (lang === 'uz' && banner.subtitle_uz?.trim()) || banner.subtitle;
  // На узбекском русский бейдж не показываем, а кнопка берёт стандартную подпись.
  const badge = lang === 'uz' ? banner.badge_uz?.trim() || null : banner.badge;
  const cta = (lang === 'uz' ? banner.cta_text_uz?.trim() : banner.cta_text?.trim()) || t.primaryCta;
  const hasImage = Boolean(banner.image_url) && !failedImages[banner.id];

  const handleCta = () => {
    const url = banner.cta_url;
    if (!url || url.startsWith('#')) {
      onNavigate(url || '#connect');
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="glass-tile mt-8 flex max-w-xl items-center gap-4 rounded-2xl p-3 pr-4">
      {hasImage ? (
        <img
          src={banner.image_url!}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setFailedImages((prev) => ({ ...prev, [banner.id]: true }))}
          className="h-16 w-16 shrink-0 rounded-xl object-cover"
        />
      ) : (
        <div className="velvet flex h-16 w-16 shrink-0 items-center justify-center rounded-xl font-display text-2xl font-semibold text-white">
          ✦
        </div>
      )}
      <div className="min-w-0 flex-1">
        {badge && (
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-plum-deep">{badge}</div>
        )}
        <div className="font-display text-xl font-semibold leading-tight text-ink">{title}</div>
        {subtitle && <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted">{subtitle}</p>}
        {count > 1 && (
          <div className="mt-1.5 flex gap-1.5">
            {banners.map((b, i) => (
              <button
                key={b.id || i}
                type="button"
                aria-label={`${t.goToSlide} ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-plum' : 'w-1.5 bg-plum/30'}`}
              />
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={handleCta}
        aria-label={cta}
        title={cta}
        className="btn-primary h-10 w-10 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum"
      >
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export const Hero: React.FC<HeroProps> = ({ lang, banners, onNavigate }) => {
  const t = translations[lang].hero;

  return (
    <section className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 lg:px-8">
      <div className="glass relative overflow-hidden rounded-[32px]">
        {/* Светящийся «портал» за телефоном */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-1/2 hidden h-[560px] w-[560px] -translate-y-1/2 rounded-full border border-white/80 bg-[radial-gradient(circle_at_40%_35%,rgba(255,255,255,0.9),rgba(205,188,250,0.55)_45%,rgba(160,132,236,0.35)_75%)] shadow-[0_0_80px_10px_rgba(190,170,250,0.45)] lg:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-white/50 blur-3xl"
        />

        <div className="relative grid grid-cols-1 items-center gap-10 p-6 sm:p-10 lg:grid-cols-12 lg:gap-6 lg:px-14 lg:py-12">
          <div className="lg:col-span-7">
            <p className="eyebrow">{t.badge}</p>
            <h1 className="mt-5 font-display text-[2.4rem] font-semibold uppercase leading-[0.98] tracking-tight text-ink [text-wrap:balance] sm:text-[3.4rem] lg:text-[3.6rem]">
              {t.titleLead} <span className="accent-text">{t.titleAccent}</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-[17px]">{t.subtitle}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => onNavigate('#connect')}
                className="btn-primary min-h-[50px] px-7 text-sm uppercase tracking-[0.08em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum"
              >
                <span>{t.primaryCta}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('#plans')}
                className="btn-ghost min-h-[50px] px-7 text-sm uppercase tracking-[0.08em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum"
              >
                {t.secondaryCta}
              </button>
            </div>

            <PromoCard lang={lang} banners={banners} onNavigate={onNavigate} />
          </div>

          <div className="relative lg:col-span-5">
            <HeroPhoneMockup lang={lang} onBookClick={() => onNavigate('#connect')} />
          </div>
        </div>
      </div>
    </section>
  );
};
