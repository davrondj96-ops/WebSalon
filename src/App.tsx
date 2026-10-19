import React, { useEffect, useState } from 'react';
import { SiteBanner, SitePlan, supabase } from './lib/supabase';
import { Language, translations } from './i18n/translations';
import { HeroBannerSlider } from './components/HeroBannerSlider';
import {
  AdminRoleIllustration,
  ClientRoleIllustration,
  OwnerRoleIllustration,
} from './components/PhoneMockups';
import { PlansAndCalculator } from './components/PlansAndCalculator';
import { LeadForm } from './components/LeadForm';
import { CONTACTS, LEGAL } from './config';
import {
  Check,
  ChevronDown,
  Menu,
  X,
  MessageCircle,
  Phone,
  MapPin,
  Sparkles,
  Scissors,
  Brush,
  Shirt,
  Store,
  Gem,
} from 'lucide-react';

const SEGMENT_ICONS = [Sparkles, Scissors, Scissors, Gem, Shirt, Brush];

const LANG_STORAGE_KEY = 'insidefire_lang';

function getInitialLanguage(): Language {
  try {
    const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'ru' || saved === 'uz') {
      return saved;
    }
    const browserLang = (navigator.language || '').toLowerCase();
    return browserLang.startsWith('uz') ? 'uz' : 'ru';
  } catch {
    return 'ru';
  }
}

export default function App() {
  const [lang, setLang] = useState<Language>(getInitialLanguage);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Supabase RPC data states
  const [plans, setPlans] = useState<SitePlan[]>([]);
  const [banners, setBanners] = useState<SiteBanner[]>([]);
  const [loadingPlans, setLoadingPlans] = useState<boolean>(true);
  const [loadingBanners, setLoadingBanners] = useState<boolean>(true);

  // Lead form prefill states
  const [selectedPlanCode, setSelectedPlanCode] = useState<string>('');
  const [prefilledMasters, setPrefilledMasters] = useState<number | null>(null);
  const [prefilledBranches, setPrefilledBranches] = useState<number | null>(null);

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const t = translations[lang];

  // Update <html lang>, <title>, meta description & OpenGraph tags on language change
  useEffect(() => {
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // ignore storage errors
    }
    document.documentElement.lang = lang;
    document.title = t.seo.title;

    const updateMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector);
      if (el) {
        el.setAttribute('content', content);
      }
    };

    updateMeta('meta[name="description"]', t.seo.description);
    updateMeta('meta[property="og:title"]', t.seo.title);
    updateMeta('meta[property="og:description"]', t.seo.description);
    updateMeta('meta[name="twitter:title"]', t.seo.title);
    updateMeta('meta[name="twitter:description"]', t.seo.description);

    // аналитика
  }, [lang, t.seo.title, t.seo.description]);

  // Parallel load of site_plans and site_banners via Supabase RPC
  useEffect(() => {
    let isMounted = true;

    async function loadSiteData() {
      setLoadingPlans(true);
      setLoadingBanners(true);

      // allSettled не бросает исключений: при сбое сети покажем «цены уточняйте у менеджера»
      const [plansRes, bannersRes] = await Promise.allSettled([
        supabase.rpc('site_plans'),
        supabase.rpc('site_banners'),
      ]);

      if (!isMounted) return;

      if (
        plansRes.status === 'fulfilled' &&
        !plansRes.value.error &&
        Array.isArray(plansRes.value.data)
      ) {
        setPlans(plansRes.value.data as SitePlan[]);
      } else {
        setPlans([]);
      }
      setLoadingPlans(false);

      if (
        bannersRes.status === 'fulfilled' &&
        !bannersRes.value.error &&
        Array.isArray(bannersRes.value.data)
      ) {
        setBanners(bannersRes.value.data as SiteBanner[]);
      } else {
        setBanners([]);
      }
      setLoadingBanners(false);
    }

    loadSiteData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const cleanId = sectionId.replace(/^#/, '');
    const target = document.getElementById(cleanId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectPlanForLead = (
    planCode: string,
    mastersCount?: number,
    branchesCount?: number
  ) => {
    setSelectedPlanCode(planCode);
    if (typeof mastersCount === 'number') {
      setPrefilledMasters(mastersCount);
    }
    if (typeof branchesCount === 'number') {
      setPrefilledBranches(branchesCount);
    }
    handleScrollToSection('#lead');
  };

  const activePlans = plans;

  return (
    <div className="min-h-screen bg-[#faf7f5] text-[#1f1a1c]">
      {/* 1. Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-[#ece3de] bg-[#faf7f5]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Zone 1: Brand Title */}
          <a
            href="#"
            className="text-lg font-extrabold tracking-tight text-[#1f1a1c] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#b76e79]"
          >
            {t.brandName}
          </a>

          {/* Zone 2: Nav Links + Language Switcher */}
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#5c5256]"
          >
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection('#features');
              }}
              className="transition-colors hover:text-[#1f1a1c] hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              {t.nav.features}
            </a>
            <a
              href="#plans"
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection('#plans');
              }}
              className="transition-colors hover:text-[#1f1a1c] hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              {t.nav.plans}
            </a>
            <a
              href="#faq"
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection('#faq');
              }}
              className="transition-colors hover:text-[#1f1a1c] hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              {t.nav.faq}
            </a>

            {/* RU / UZ Switcher */}
            <div
              role="group"
              aria-label="Language switcher"
              className="flex items-center rounded-lg border border-[#e2d6d0] bg-white p-0.5 text-xs font-bold"
            >
              <button
                type="button"
                onClick={() => setLang('ru')}
                className={`rounded-md px-2.5 py-1 transition-colors whitespace-nowrap shrink-0 ${
                  lang === 'ru'
                    ? 'bg-[#1f1a1c] text-white'
                    : 'text-[#5c5256] hover:text-[#1f1a1c]'
                }`}
              >
                RU
              </button>
              <button
                type="button"
                onClick={() => setLang('uz')}
                className={`rounded-md px-2.5 py-1 transition-colors whitespace-nowrap shrink-0 ${
                  lang === 'uz'
                    ? 'bg-[#1f1a1c] text-white'
                    : 'text-[#5c5256] hover:text-[#1f1a1c]'
                }`}
              >
                UZ
              </button>
            </div>
          </nav>

          {/* Zone 3: Primary CTA (Desktop) + Mobile Burger */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => handleScrollToSection('#lead')}
              className="hidden md:inline-flex min-h-[42px] items-center justify-center rounded-xl bg-[#b76e79] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#a35c67] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b76e79] whitespace-nowrap shrink-0"
            >
              {t.nav.connectCta}
            </button>

            {/* Mobile RU/UZ + Burger */}
            <div className="flex items-center gap-2 md:hidden">
              <div className="flex items-center rounded-lg border border-[#e2d6d0] bg-white p-0.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setLang('ru')}
                  className={`rounded-md px-2 py-1 transition-colors ${
                    lang === 'ru'
                      ? 'bg-[#1f1a1c] text-white'
                      : 'text-[#5c5256]'
                  }`}
                >
                  RU
                </button>
                <button
                  type="button"
                  onClick={() => setLang('uz')}
                  className={`rounded-md px-2 py-1 transition-colors ${
                    lang === 'uz'
                      ? 'bg-[#1f1a1c] text-white'
                      : 'text-[#5c5256]'
                  }`}
                >
                  UZ
                </button>
              </div>

              <button
                type="button"
                aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e2d6d0] bg-white text-[#1f1a1c] focus-visible:outline-2 focus-visible:outline-[#b76e79]"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-[#ece3de] bg-white px-4 pt-3 pb-5 md:hidden">
            <nav className="flex flex-col space-y-2 text-base font-semibold text-[#1f1a1c]">
              <a
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection('#features');
                }}
                className="rounded-xl px-3 py-2.5 hover:bg-[#faf7f5]"
              >
                {t.nav.features}
              </a>
              <a
                href="#plans"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection('#plans');
                }}
                className="rounded-xl px-3 py-2.5 hover:bg-[#faf7f5]"
              >
                {t.nav.plans}
              </a>
              <a
                href="#faq"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection('#faq');
                }}
                className="rounded-xl px-3 py-2.5 hover:bg-[#faf7f5]"
              >
                {t.nav.faq}
              </a>
              <button
                type="button"
                onClick={() => handleScrollToSection('#lead')}
                className="mt-2 flex min-h-[46px] w-full items-center justify-center rounded-xl bg-[#b76e79] px-5 py-3 text-sm font-bold text-white"
              >
                {t.nav.connectCta}
              </button>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* 2. Banners Slider / Static First Screen */}
        <HeroBannerSlider
          lang={lang}
          banners={banners}
          loading={loadingBanners}
          onScrollToSection={handleScrollToSection}
        />

        {/* 3. Trust Numbers (Цифры доверия — 4 tiles) */}
        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.trust.items.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#ece3de] bg-white p-6 shadow-[0_6px_20px_-10px_rgba(31,26,28,0.05)]"
              >
                <div className="text-xl font-extrabold tracking-tight text-[#1f1a1c] tabular-nums">
                  {item.title}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#5c5256]">
                  {item.subtitle}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3b. Segments (Для кого) */}
        <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#b76e79]">{t.segments.eyebrow}</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#1f1a1c] [text-wrap:balance] sm:text-4xl">
              {t.segments.title}
            </h2>
            <p className="mt-3 text-base text-[#5c5256]">{t.segments.subtitle}</p>
          </div>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.segments.items.map((item, idx) => {
              const Icon = SEGMENT_ICONS[idx] ?? Store;
              return (
                <li
                  key={idx}
                  className="flex gap-4 rounded-2xl border border-[#ece3de] bg-white p-5 shadow-[0_6px_20px_-10px_rgba(31,26,28,0.05)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#b76e79]/10 text-[#b76e79]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-[#1f1a1c]">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#5c5256]">{item.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* 4. What the Salon Gets (Что получает салон — 3 карточки) */}
        <section
          id="features"
          className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#b76e79]">
              {t.whatSalonGets.eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#1f1a1c] [text-wrap:balance] sm:text-4xl">
              {t.whatSalonGets.title}
            </h2>
            <p className="mt-3 text-base text-[#5c5256]">
              {t.whatSalonGets.subtitle}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Card 1: Clients */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#ece3de] bg-white p-6 shadow-[0_8px_28px_-12px_rgba(31,26,28,0.06)] sm:p-7">
              <div>
                <p className="text-xs font-bold text-[#b76e79]">
                  {t.whatSalonGets.cards.client.role}
                </p>
                <h3 className="mt-2 text-xl font-extrabold text-[#1f1a1c]">
                  {t.whatSalonGets.cards.client.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#5c5256]">
                  {t.whatSalonGets.cards.client.description}
                </p>

                <ul className="mt-4 space-y-2 text-xs font-medium text-[#3d3538]">
                  {t.whatSalonGets.cards.client.highlights.map((hl, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 shrink-0 text-[#b76e79]" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <ClientRoleIllustration lang={lang} />
              </div>
            </div>

            {/* Card 2: Administrator */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#ece3de] bg-white p-6 shadow-[0_8px_28px_-12px_rgba(31,26,28,0.06)] sm:p-7">
              <div>
                <p className="text-xs font-bold text-[#b76e79]">
                  {t.whatSalonGets.cards.admin.role}
                </p>
                <h3 className="mt-2 text-xl font-extrabold text-[#1f1a1c]">
                  {t.whatSalonGets.cards.admin.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#5c5256]">
                  {t.whatSalonGets.cards.admin.description}
                </p>

                <ul className="mt-4 space-y-2 text-xs font-medium text-[#3d3538]">
                  {t.whatSalonGets.cards.admin.highlights.map((hl, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 shrink-0 text-[#b76e79]" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <AdminRoleIllustration lang={lang} />
              </div>
            </div>

            {/* Card 3: Owner */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#ece3de] bg-white p-6 shadow-[0_8px_28px_-12px_rgba(31,26,28,0.06)] sm:p-7">
              <div>
                <p className="text-xs font-bold text-[#b76e79]">
                  {t.whatSalonGets.cards.owner.role}
                </p>
                <h3 className="mt-2 text-xl font-extrabold text-[#1f1a1c]">
                  {t.whatSalonGets.cards.owner.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#5c5256]">
                  {t.whatSalonGets.cards.owner.description}
                </p>

                <ul className="mt-4 space-y-2 text-xs font-medium text-[#3d3538]">
                  {t.whatSalonGets.cards.owner.highlights.map((hl, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 shrink-0 text-[#b76e79]" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <OwnerRoleIllustration lang={lang} />
              </div>
            </div>
          </div>
        </section>

        {/* 5. How to Connect (Как подключиться — 3 шага) */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="rounded-2xl border border-[#ece3de] bg-white p-6 shadow-xs sm:p-10 lg:p-12">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-[#b76e79]">
                {t.howToConnect.eyebrow}
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#1f1a1c] [text-wrap:balance] sm:text-3xl">
                {t.howToConnect.title}
              </h2>
              <p className="mt-2.5 text-base text-[#5c5256]">
                {t.howToConnect.subtitle}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {t.howToConnect.steps.map((stepObj, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#faf7f5] p-6"
                >
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#b76e79] text-xs font-extrabold text-white tabular-nums">
                    0{idx + 1}
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-[#1f1a1c]">
                    {stepObj.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5c5256]">
                    {stepObj.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6 & 7. Tariffs (id="plans") + Interactive Calculator */}
        <PlansAndCalculator
          lang={lang}
          plans={activePlans}
          loading={loadingPlans}
          onSelectPlanForLead={handleSelectPlanForLead}
          onScrollToLead={() => handleScrollToSection('#lead')}
        />

        {/* 8. FAQ (id="faq", accordion, 7 questions) */}
        <section
          id="faq"
          className="mx-auto max-w-4xl scroll-mt-20 px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
        >
          <div className="text-center">
            <p className="text-sm font-semibold text-[#b76e79]">{t.faq.eyebrow}</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#1f1a1c] [text-wrap:balance] sm:text-4xl">
              {t.faq.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-[#5c5256]">
              {t.faq.subtitle}
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {t.faq.items.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="overflow-hidden rounded-2xl border border-[#ece3de] bg-white transition-colors"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setOpenFaqIndex(isOpen ? null : idx)
                    }
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-bold text-[#1f1a1c] transition-colors hover:text-[#b76e79] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#b76e79]"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#b76e79] transition-transform duration-150 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-[#f2ebe7] px-6 pt-3 pb-5 text-sm leading-relaxed text-[#5c5256] sm:text-base">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 9. Lead Form (id="lead") */}
        <LeadForm
          lang={lang}
          plans={activePlans}
          selectedPlanCode={selectedPlanCode}
          prefilledMasters={prefilledMasters}
          prefilledBranches={prefilledBranches}
          onChangeSelectedPlan={setSelectedPlanCode}
        />
      </main>

      {/* 10. Footer */}
      <footer className="border-t border-[#ece3de] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {/* Brand & Tagline */}
            <div className="md:col-span-5">
              <div className="text-lg font-extrabold tracking-tight text-[#1f1a1c]">
                {t.brandName}
              </div>
              <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-[#5c5256]">
                {t.footer.tagline}
              </p>
            </div>

            {/* Contacts */}
            <div className="md:col-span-4">
              <div className="text-xs font-bold tracking-wide text-[#1f1a1c]">
                {t.footer.contactsTitle}
              </div>
              <ul className="mt-3 space-y-2.5 text-sm text-[#5c5256]">
                {CONTACTS.telegramUrl && (
                  <li className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-[#b76e79]" />
                    <span>{t.footer.telegramLabel}</span>
                    <a
                      href={CONTACTS.telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#1f1a1c] hover:text-[#b76e79] hover:underline"
                    >
                      {CONTACTS.telegramHandle}
                    </a>
                  </li>
                )}
                {CONTACTS.phoneHref && (
                  <li className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#b76e79]" />
                    <span>{t.footer.phoneLabel}</span>
                    <a
                      href={CONTACTS.phoneHref}
                      className="font-semibold text-[#1f1a1c] tabular-nums hover:text-[#b76e79] hover:underline"
                    >
                      {CONTACTS.phoneDisplay}
                    </a>
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#b76e79]" />
                  <span>{t.footer.cityDisplay}</span>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div className="md:col-span-3">
              <div className="text-xs font-bold tracking-wide text-[#1f1a1c]">
                {t.footer.legalTitle}
              </div>
              <ul className="mt-3 space-y-2 text-sm text-[#5c5256]">
                <li>
                  <a
                    href={LEGAL.offerUrl(lang)}
                    className="hover:text-[#b76e79] hover:underline"
                  >
                    {t.footer.offerLink}
                  </a>
                </li>
                <li>
                  <a
                    href={LEGAL.privacyUrl(lang)}
                    className="hover:text-[#b76e79] hover:underline"
                  >
                    {t.footer.privacyLink}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-[#f2ebe7] pt-6 text-xs text-[#7a6d71]">
            © {new Date().getFullYear()} {t.brandName}. {t.footer.copyright}
          </div>
        </div>
      </footer>
    </div>
  );
}
