import React, { useEffect, useState, useRef } from 'react';
import { SiteBanner } from '../lib/supabase';
import { Language, translations } from '../i18n/translations';
import { HeroPhoneMockup } from './PhoneMockups';
import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface HeroBannerSliderProps {
  lang: Language;
  banners: SiteBanner[];
  loading: boolean;
  onScrollToSection: (sectionId: string) => void;
}

export const HeroBannerSlider: React.FC<HeroBannerSliderProps> = ({
  lang,
  banners,
  loading,
  onScrollToSection,
}) => {
  const t = translations[lang].hero;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string | number, boolean>>({});
  const touchStartX = useRef<number | null>(null);

  const count = banners.length;

  useEffect(() => {
    if (currentIndex >= count && count > 0) {
      setCurrentIndex(0);
    }
  }, [count, currentIndex]);

  useEffect(() => {
    if (count <= 1 || isPaused) return;
    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % count);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [count, isPaused]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || count <= 1) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 45) {
      if (deltaX < 0) {
        setCurrentIndex((prev) => (prev + 1) % count);
      } else {
        setCurrentIndex((prev) => (prev - 1 + count) % count);
      }
    }
    touchStartX.current = null;
  };

  const handleCtaAction = (ctaUrl?: string | null) => {
    if (!ctaUrl) {
      onScrollToSection('#lead');
      return;
    }
    if (ctaUrl.startsWith('#')) {
      onScrollToSection(ctaUrl);
    } else {
      window.open(ctaUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-14 sm:px-6 lg:px-8 lg:pt-14 lg:pb-20">
        <div className="grid grid-cols-1 items-center gap-10 rounded-2xl border border-[#ece3de] bg-white p-6 shadow-xs sm:p-10 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-7">
            <div className="h-4 w-48 animate-pulse rounded bg-[#efe8e4]" />
            <div className="h-11 w-full max-w-lg animate-pulse rounded-lg bg-[#efe8e4]" />
            <div className="h-11 w-4/5 animate-pulse rounded-lg bg-[#efe8e4]" />
            <div className="h-20 w-full max-w-xl animate-pulse rounded-lg bg-[#efe8e4]" />
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="h-12 w-44 animate-pulse rounded-xl bg-[#b76e79]/30" />
              <div className="h-12 w-44 animate-pulse rounded-xl bg-[#efe8e4]" />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="mx-auto h-[420px] w-full max-w-[320px] animate-pulse rounded-[32px] bg-[#efe8e4]" />
          </div>
        </div>
      </section>
    );
  }

  // Static First Screen if no banners or site_banners failed to load
  if (count === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-14 sm:px-6 lg:px-8 lg:pt-14 lg:pb-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="text-sm font-semibold tracking-normal text-[#b76e79]">
              {t.badge}
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1f1a1c] [text-wrap:balance] sm:text-5xl sm:leading-[1.12]">
              {t.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#5c5256] sm:text-lg">
              {t.subtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => onScrollToSection('#lead')}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[#b76e79] px-7 py-3.5 text-base font-bold text-white shadow-sm transition-colors hover:bg-[#a35c67] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b76e79] whitespace-nowrap shrink-0"
              >
                <span>{t.primaryCta}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onScrollToSection('#plans')}
                className="inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-[#dfd4ce] bg-white px-7 py-3.5 text-base font-semibold text-[#1f1a1c] transition-colors hover:border-[#b76e79] hover:text-[#b76e79] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b76e79] whitespace-nowrap shrink-0"
              >
                {t.secondaryCta}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <HeroPhoneMockup
              lang={lang}
              onBookClick={() => onScrollToSection('#lead')}
            />
          </div>
        </div>
      </section>
    );
  }

  const activeBanner = banners[currentIndex] || banners[0];
  const displayTitle =
    lang === 'uz' && activeBanner.title_uz && activeBanner.title_uz.trim().length > 0
      ? activeBanner.title_uz
      : activeBanner.title;
  const displaySubtitle =
    lang === 'uz' && activeBanner.subtitle_uz && activeBanner.subtitle_uz.trim().length > 0
      ? activeBanner.subtitle_uz
      : activeBanner.subtitle;

  const hasValidImage =
    Boolean(activeBanner.image_url) && !failedImages[activeBanner.id];
  const isExternalCta =
    Boolean(activeBanner.cta_url) && !activeBanner.cta_url!.startsWith('#');

  return (
    <section
      className="mx-auto max-w-6xl px-4 pt-8 pb-14 sm:px-6 lg:px-8 lg:pt-12 lg:pb-18"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative overflow-hidden rounded-2xl border border-[#ece3de] bg-white p-6 shadow-[0_12px_36px_-12px_rgba(31,26,28,0.07)] sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Media column: on mobile — on top if image_url exists */}
          <div
            className={`lg:col-span-5 lg:order-2 ${
              hasValidImage ? 'order-1' : 'order-2'
            }`}
          >
            {hasValidImage ? (
              <div className="overflow-hidden rounded-2xl border border-[#ece3de] bg-[#faf7f5]">
                <img
                  src={activeBanner.image_url!}
                  alt={displayTitle}
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setFailedImages((prev) => ({ ...prev, [activeBanner.id]: true }))
                  }
                  className="h-64 w-full object-cover sm:h-80 lg:h-[380px]"
                />
              </div>
            ) : (
              <HeroPhoneMockup
                lang={lang}
                onBookClick={() => onScrollToSection('#lead')}
              />
            )}
          </div>

          {/* Text column */}
          <div
            className={`lg:col-span-7 lg:order-1 ${
              hasValidImage ? 'order-2' : 'order-1'
            }`}
          >
            {activeBanner.badge && (
              <p className="text-sm font-semibold text-[#b76e79]">
                {activeBanner.badge}
              </p>
            )}
            <h1 className="mt-2.5 text-3xl font-extrabold tracking-tight text-[#1f1a1c] [text-wrap:balance] sm:text-5xl sm:leading-[1.12]">
              {displayTitle}
            </h1>
            {displaySubtitle && (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#5c5256] sm:text-lg">
                {displaySubtitle}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => handleCtaAction(activeBanner.cta_url)}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[#b76e79] px-7 py-3.5 text-base font-bold text-white shadow-sm transition-colors hover:bg-[#a35c67] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b76e79] whitespace-nowrap shrink-0"
              >
                <span>{activeBanner.cta_text || t.primaryCta}</span>
                {isExternalCta ? (
                  <ExternalLink className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>
              <button
                type="button"
                onClick={() => onScrollToSection('#plans')}
                className="inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-[#dfd4ce] bg-[#faf7f5] px-6 py-3.5 text-base font-semibold text-[#1f1a1c] transition-colors hover:border-[#b76e79] hover:text-[#b76e79] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b76e79] whitespace-nowrap shrink-0"
              >
                {t.secondaryCta}
              </button>
            </div>
          </div>
        </div>

        {/* Dots & Controls (Only shown when count > 1) */}
        {count > 1 && (
          <div className="mt-8 flex items-center justify-between border-t border-[#f2ebe7] pt-5">
            <div className="flex items-center gap-2">
              {banners.map((b, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={b.id || idx}
                    type="button"
                    aria-label={`${t.goToSlide} ${idx + 1}`}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      isActive
                        ? 'w-7 bg-[#b76e79]'
                        : 'w-2.5 bg-[#dfd4ce] hover:bg-[#c5b5ad]'
                    }`}
                  />
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={t.prevSlide}
                onClick={() => setCurrentIndex((prev) => (prev - 1 + count) % count)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ece3de] bg-[#faf7f5] text-[#3d3538] transition-colors hover:border-[#b76e79] hover:text-[#b76e79] focus-visible:outline-2 focus-visible:outline-[#b76e79]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label={t.nextSlide}
                onClick={() => setCurrentIndex((prev) => (prev + 1) % count)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ece3de] bg-[#faf7f5] text-[#3d3538] transition-colors hover:border-[#b76e79] hover:text-[#b76e79] focus-visible:outline-2 focus-visible:outline-[#b76e79]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
