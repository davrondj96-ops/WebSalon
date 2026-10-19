import React, { useCallback, useEffect, useState } from 'react';
import { SiteBanner, SitePlan, supabase } from './lib/supabase';
import { Language, translations } from './i18n/translations';
import { Hero } from './components/Hero';
import {
  AdminRoleIllustration,
  ClientRoleIllustration,
  OwnerRoleIllustration,
} from './components/PhoneMockups';
import { PlansAndCalculator } from './components/PlansAndCalculator';
import { LeadForm } from './components/LeadForm';
import { CONTACTS, LEGAL } from './config';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Gem,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Plus,
  Scissors,
  Shirt,
  Sparkles,
  Store,
  Brush,
  X,
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

// Разделы сайта живут в hash (#for, #faq, #connect), поэтому GitHub Pages
// не нужна настройка сервера. Остальные hash — якоря на главной (#plans и т.п.).
type Page = 'home' | 'for' | 'faq' | 'connect';

const PAGE_BY_HASH: Record<string, Page> = {
  for: 'for',
  faq: 'faq',
  connect: 'connect',
  lead: 'connect',
};

interface Route {
  page: Page;
  section: string | null;
  // Новый объект при каждом переходе, чтобы повторный клик снова прокручивал.
  key: number;
}

function parseHash(hash: string): Route {
  const id = hash.replace(/^#\/?/, '');
  const page = PAGE_BY_HASH[id];
  return page
    ? { page, section: null, key: Date.now() }
    : { page: 'home', section: id || null, key: Date.now() };
}

const PageHeader: React.FC<{ eyebrow: string; title: string; subtitle?: string }> = ({
  eyebrow,
  title,
  subtitle,
}) => (
  <div className="max-w-3xl">
    <p className="eyebrow">{eyebrow}</p>
    <h1 className="mt-4 font-display text-[2.4rem] font-semibold uppercase leading-[1] tracking-tight text-ink [text-wrap:balance] sm:text-6xl">
      {title}
    </h1>
    {subtitle && <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{subtitle}</p>}
  </div>
);

export default function App() {
  const [lang, setLang] = useState<Language>(getInitialLanguage);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  // Supabase RPC data states
  const [plans, setPlans] = useState<SitePlan[]>([]);
  const [banners, setBanners] = useState<SiteBanner[]>([]);
  const [loadingPlans, setLoadingPlans] = useState<boolean>(true);

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

      // allSettled не бросает исключений: при сбое сети покажем «цены уточняйте у менеджера»
      const [plansRes, bannersRes] = await Promise.allSettled([
        supabase.rpc('site_plans'),
        supabase.rpc('site_banners'),
      ]);

      if (!isMounted) return;

      setPlans(
        plansRes.status === 'fulfilled' && !plansRes.value.error && Array.isArray(plansRes.value.data)
          ? (plansRes.value.data as SitePlan[])
          : []
      );
      setLoadingPlans(false);

      setBanners(
        bannersRes.status === 'fulfilled' && !bannersRes.value.error && Array.isArray(bannersRes.value.data)
          ? (bannersRes.value.data as SiteBanner[])
          : []
      );
    }

    loadSiteData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Back/forward в браузере и ручная правка адреса
  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // После перехода: к якорю на главной или в начало раздела
  useEffect(() => {
    if (route.section) {
      const target = document.getElementById(route.section);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [route]);

  const navigate = useCallback((hash: string) => {
    setMobileMenuOpen(false);
    const target = hash.startsWith('#') ? hash : `#${hash}`;
    if (window.location.hash !== target) {
      window.history.pushState(null, '', target);
    }
    setRoute(parseHash(target));
  }, []);

  const handleSelectPlanForLead = (planCode: string, mastersCount?: number, branchesCount?: number) => {
    setSelectedPlanCode(planCode);
    if (typeof mastersCount === 'number') {
      setPrefilledMasters(mastersCount);
    }
    if (typeof branchesCount === 'number') {
      setPrefilledBranches(branchesCount);
    }
    navigate('#connect');
  };

  const navItems: { hash: string; label: string; page: Page; section?: string }[] = [
    { hash: '#', label: t.nav.home, page: 'home' },
    { hash: '#features', label: t.nav.features, page: 'home', section: 'features' },
    { hash: '#plans', label: t.nav.plans, page: 'home', section: 'plans' },
    { hash: '#calculator', label: t.nav.calculator, page: 'home', section: 'calculator' },
    { hash: '#for', label: t.nav.forWhom, page: 'for' },
    { hash: '#faq', label: t.nav.faq, page: 'faq' },
  ];

  const isActive = (item: (typeof navItems)[number]) =>
    item.page === route.page && (item.page !== 'home' || (item.section ?? null) === route.section);

  const langSwitcher = (
    <div
      role="group"
      aria-label="Language switcher"
      className="glass-tile flex items-center rounded-full p-0.5 text-[11px] font-bold"
    >
      {(['ru', 'uz'] as const).map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
          className={`rounded-full px-2.5 py-1 uppercase transition-colors ${
            lang === code ? 'bg-ink text-white' : 'text-muted hover:text-ink'
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );

  const roleCards = [
    { data: t.whatSalonGets.cards.client, Illustration: ClientRoleIllustration },
    { data: t.whatSalonGets.cards.admin, Illustration: AdminRoleIllustration },
    { data: t.whatSalonGets.cards.owner, Illustration: OwnerRoleIllustration },
  ];

  const contactRows = (
    <ul className="space-y-2.5 text-sm">
      {CONTACTS.telegramUrl && (
        <li>
          <a
            href={CONTACTS.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-tile flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold text-ink transition-colors hover:text-plum-deep"
          >
            <MessageCircle className="h-4 w-4 text-plum" aria-hidden="true" />
            <span>{CONTACTS.telegramHandle}</span>
          </a>
        </li>
      )}
      {CONTACTS.phoneHref && (
        <li>
          <a
            href={CONTACTS.phoneHref}
            className="glass-tile flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold text-ink tabular-nums transition-colors hover:text-plum-deep"
          >
            <Phone className="h-4 w-4 text-plum" aria-hidden="true" />
            <span>{CONTACTS.phoneDisplay}</span>
          </a>
        </li>
      )}
      <li className="glass-tile flex items-center gap-3 rounded-2xl px-4 py-3 text-muted">
        <MapPin className="h-4 w-4 text-plum" aria-hidden="true" />
        <span>{t.footer.cityDisplay}</span>
      </li>
    </ul>
  );

  return (
    <div className="min-h-screen text-ink">
      {/* Header */}
      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
        <div className="glass mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full py-2 pr-2 pl-5">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('#');
            }}
            className="flex shrink-0 items-center gap-3 focus-visible:outline-2 focus-visible:outline-plum"
          >
            <span className="font-display text-2xl font-semibold leading-none text-ink">
              I<span className="text-plum">·</span>F
            </span>
            <span className="hidden text-[11px] font-bold uppercase tracking-[0.16em] text-ink sm:inline">
              {t.brandName}
            </span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.hash}
                href={item.hash}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.hash);
                }}
                aria-current={isActive(item) ? 'page' : undefined}
                className={`rounded-full px-3 py-2 text-[11px] font-bold uppercase tracking-[0.1em] whitespace-nowrap transition-colors ${
                  isActive(item) ? 'bg-white/80 text-plum-deep' : 'text-muted hover:text-ink'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {langSwitcher}
            <button
              type="button"
              onClick={() => navigate('#connect')}
              className="btn-primary hidden min-h-[40px] px-4 text-[11px] uppercase tracking-[0.1em] whitespace-nowrap sm:inline-flex focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum"
            >
              <span>{t.nav.connectCta}</span>
              <Plus className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="glass-tile flex h-10 w-10 items-center justify-center rounded-full text-ink lg:hidden focus-visible:outline-2 focus-visible:outline-plum"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="glass mx-auto mt-2 max-w-6xl rounded-[24px] p-3 lg:hidden">
            <nav className="flex flex-col">
              {navItems.map((item) => (
                <a
                  key={item.hash}
                  href={item.hash}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.hash);
                  }}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                    isActive(item) ? 'bg-white/80 text-plum-deep' : 'text-ink'
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => navigate('#connect')}
                className="btn-primary mt-2 min-h-[46px] w-full px-5 text-sm"
              >
                {t.nav.connectCta}
              </button>
            </nav>
          </div>
        )}
      </header>

      <main className="pb-16">
        {route.page === 'home' && (
          <>
            <Hero lang={lang} banners={banners} onNavigate={navigate} />

            {/* Почему мы — плитки-метрики */}
            <section className="mx-auto max-w-6xl px-4 pt-5 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
                {t.trust.items.map((item, idx) => (
                  <div key={idx} className="glass rounded-[24px] p-4 sm:p-5">
                    <div className="font-display text-2xl font-semibold leading-tight text-plum-deep sm:text-[1.7rem]">
                      {item.title}
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted">{item.subtitle}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Возможности */}
            <section id="features" className="mx-auto mt-14 max-w-6xl scroll-mt-20 px-4 sm:px-6 lg:mt-20 lg:px-8">
              <div className="glass rounded-[32px] p-5 sm:p-8">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
                  <div>
                    <p className="eyebrow">{t.whatSalonGets.eyebrow}</p>
                    <h2 className="mt-3 font-display text-3xl font-semibold uppercase leading-[1.02] tracking-tight text-ink sm:text-[2.6rem]">
                      {t.whatSalonGets.title}
                    </h2>
                  </div>
                  <p className="max-w-sm text-sm leading-relaxed text-muted">{t.whatSalonGets.subtitle}</p>
                </div>

                <div className="mt-7 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
                  {roleCards.map(({ data, Illustration }, idx) => (
                    <article key={idx} className="velvet flex flex-col rounded-[24px] p-5 text-white">
                      <span className="self-start rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/85">
                        {data.role}
                      </span>
                      <h3 className="mt-4 font-display text-[1.7rem] font-semibold leading-tight">{data.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/70">{data.description}</p>
                      <ul className="mt-4 space-y-1.5 text-xs font-medium text-white/90">
                        {data.highlights.map((hl, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="h-3.5 w-3.5 shrink-0 text-[#c4b2fa]" aria-hidden="true" />
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto pt-5">
                        <Illustration lang={lang} />
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* Тарифы и калькулятор */}
            <PlansAndCalculator
              lang={lang}
              plans={plans}
              loading={loadingPlans}
              onSelectPlanForLead={handleSelectPlanForLead}
              onScrollToLead={() => navigate('#connect')}
            />
          </>
        )}

        {route.page === 'for' && (
          <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8 lg:pt-16">
            <PageHeader eyebrow={t.segments.eyebrow} title={t.segments.title} subtitle={t.segments.subtitle} />
            <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {t.segments.items.map((item, idx) => {
                const Icon = SEGMENT_ICONS[idx] ?? Store;
                return (
                  <li key={idx} className="glass flex flex-col rounded-[24px] p-6">
                    <span className="glass-tile flex h-12 w-12 items-center justify-center rounded-2xl text-plum-deep">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h2 className="mt-5 font-display text-2xl font-semibold leading-tight text-ink">{item.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
                  </li>
                );
              })}
            </ul>
            <div className="glass mt-6 flex flex-col items-start justify-between gap-4 rounded-[24px] p-6 sm:flex-row sm:items-center">
              <p className="font-display text-2xl font-semibold text-ink">{t.hero.title}</p>
              <button
                type="button"
                onClick={() => navigate('#plans')}
                className="btn-primary min-h-[46px] px-6 text-sm uppercase tracking-[0.08em]"
              >
                <span>{t.hero.secondaryCta}</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}

        {route.page === 'faq' && (
          <section className="mx-auto max-w-4xl px-4 pt-10 sm:px-6 lg:px-8 lg:pt-16">
            <PageHeader eyebrow={t.faq.eyebrow} title={t.faq.title} subtitle={t.faq.subtitle} />
            <div className="mt-10 space-y-3">
              {t.faq.items.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="glass overflow-hidden rounded-[22px]">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-bold text-ink transition-colors hover:text-plum-deep focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-plum"
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-plum transition-transform duration-150 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-white/70 px-6 pt-3 pb-5 text-sm leading-relaxed text-muted sm:text-base">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => navigate('#connect')}
                className="btn-primary min-h-[48px] px-7 text-sm uppercase tracking-[0.08em]"
              >
                <span>{t.hero.primaryCta}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}

        {route.page === 'connect' && (
          <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8 lg:pt-16">
            <PageHeader
              eyebrow={t.howToConnect.eyebrow}
              title={t.howToConnect.title}
              subtitle={t.howToConnect.subtitle}
            />

            {/* Шаги подключения */}
            <ol className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
              {t.howToConnect.steps.map((step, idx) => (
                <li key={idx} className="glass relative rounded-[24px] p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-plum/40 bg-white/70 font-display text-lg font-semibold text-plum-deep tabular-nums">
                    0{idx + 1}
                  </span>
                  {idx < t.howToConnect.steps.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute top-11 right-[-1.1rem] z-10 hidden w-8 border-t border-dashed border-plum/50 md:block"
                    />
                  )}
                  <h2 className="mt-5 text-sm font-extrabold uppercase tracking-[0.06em] text-ink">{step.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
                </li>
              ))}
            </ol>

            {/* Контакты + форма */}
            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-12">
              <aside className="glass flex flex-col self-start rounded-[28px] p-6 sm:p-8 lg:col-span-4">
                <h2 className="font-display text-3xl font-semibold uppercase leading-[1.02] text-ink">
                  {t.connect.contactsTitle}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">{t.connect.contactsText}</p>
                <div className="mt-6">{contactRows}</div>
                <div className="velvet mt-6 rounded-[22px] p-5 text-white">
                  <p className="font-display text-2xl font-semibold leading-tight">{t.trust.items[2].title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/70">{t.trust.items[2].subtitle}</p>
                </div>
              </aside>
              <div className="lg:col-span-8">
                <LeadForm
                  lang={lang}
                  plans={plans}
                  selectedPlanCode={selectedPlanCode}
                  prefilledMasters={prefilledMasters}
                  prefilledBranches={prefilledBranches}
                  onChangeSelectedPlan={setSelectedPlanCode}
                />
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="glass rounded-[28px] p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="font-display text-2xl font-semibold text-ink">{t.brandName}</div>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{t.footer.tagline}</p>
            </div>
            <div className="md:col-span-4">
              <div className="eyebrow">{t.footer.contactsTitle}</div>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                {CONTACTS.telegramUrl && (
                  <li className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-plum" />
                    <a
                      href={CONTACTS.telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-ink hover:text-plum-deep hover:underline"
                    >
                      {CONTACTS.telegramHandle}
                    </a>
                  </li>
                )}
                {CONTACTS.phoneHref && (
                  <li className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-plum" />
                    <a
                      href={CONTACTS.phoneHref}
                      className="font-semibold text-ink tabular-nums hover:text-plum-deep hover:underline"
                    >
                      {CONTACTS.phoneDisplay}
                    </a>
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-plum" />
                  <span>{t.footer.cityDisplay}</span>
                </li>
              </ul>
            </div>
            <div className="md:col-span-3">
              <div className="eyebrow">{t.footer.legalTitle}</div>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li>
                  <a href={LEGAL.offerUrl(lang)} className="hover:text-plum-deep hover:underline">
                    {t.footer.offerLink}
                  </a>
                </li>
                <li>
                  <a href={LEGAL.privacyUrl(lang)} className="hover:text-plum-deep hover:underline">
                    {t.footer.privacyLink}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6 border-t border-white/70 pt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-soft">
            © {new Date().getFullYear()} {t.brandName}. {t.footer.copyright}
          </div>
        </div>
      </footer>
    </div>
  );
}
