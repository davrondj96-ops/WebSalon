import React, { useEffect, useMemo, useState } from 'react';
import { SitePlan } from '../lib/supabase';
import {
  KNOWN_FEATURE_CODES,
  KnownFeatureCode,
  Language,
  fill,
  formatMoney,
  isKnownFeature,
  translations,
} from '../i18n/translations';
import { estimatePlan, planDescription, planName, recommendPlan } from '../lib/pricing';
import { AlertTriangle, ArrowRight, Check } from 'lucide-react';

interface PlansAndCalculatorProps {
  lang: Language;
  plans: SitePlan[];
  loading: boolean;
  onSelectPlanForLead: (planCode: string, mastersCount?: number, branchesCount?: number) => void;
  onScrollToLead: () => void;
}

function knownFeatures(plan: SitePlan): KnownFeatureCode[] {
  const set = new Set(Array.isArray(plan.features) ? plan.features : []);
  return KNOWN_FEATURE_CODES.filter((code) => set.has(code) && isKnownFeature(code));
}

const SectionHeader: React.FC<{ eyebrow: string; title: string; subtitle: string }> = ({
  eyebrow,
  title,
  subtitle,
}) => (
  <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl font-semibold uppercase leading-[1.02] tracking-tight text-ink [text-wrap:balance] sm:text-[2.3rem]">
        {title}
      </h2>
    </div>
    <p className="max-w-sm text-xs leading-relaxed text-muted sm:text-sm tiny:hidden">{subtitle}</p>
  </div>
);

export const PlansAndCalculator: React.FC<PlansAndCalculatorProps> = ({
  lang,
  plans,
  loading,
  onSelectPlanForLead,
  onScrollToLead,
}) => {
  const t = translations[lang].plans;
  const tc = translations[lang].calculator;
  const featureNames = translations[lang].featureNames;

  const sortedPlans = useMemo(
    () => [...plans].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [plans]
  );

  // Карточка показывает только то, что добавляется к предыдущему тарифу, —
  // так все тарифы помещаются в один экран без длинных списков с прочерками.
  const planFeatureRows = useMemo(
    () =>
      sortedPlans.map((plan, idx) => {
        const own = knownFeatures(plan);
        const prev = idx > 0 ? sortedPlans[idx - 1] : null;
        if (!prev) return { prev: null, features: own };
        const prevSet = new Set(knownFeatures(prev));
        const coversPrev = [...prevSet].every((code) => own.includes(code));
        return coversPrev
          ? { prev, features: own.filter((code) => !prevSet.has(code)) }
          : { prev: null, features: own };
      }),
    [sortedPlans]
  );

  // Calculator state
  const [calcPlanCode, setCalcPlanCode] = useState<string>('');
  const [masters, setMasters] = useState<number>(5);
  const [branches, setBranches] = useState<number>(1);

  useEffect(() => {
    if (sortedPlans.length > 0 && !sortedPlans.some((p) => p.code === calcPlanCode)) {
      setCalcPlanCode(sortedPlans[Math.floor(sortedPlans.length / 2)].code);
    }
  }, [sortedPlans, calcPlanCode]);

  const activeCalcPlan = useMemo(
    () =>
      sortedPlans.find((p) => p.code === calcPlanCode) ||
      sortedPlans[Math.floor(sortedPlans.length / 2)] ||
      sortedPlans[0],
    [sortedPlans, calcPlanCode]
  );

  const calculation = useMemo(
    () => (activeCalcPlan ? estimatePlan(activeCalcPlan, masters, branches) : null),
    [activeCalcPlan, masters, branches]
  );

  // Если выбранный тариф не рассчитан на столько мастеров/филиалов —
  // предлагаем первый подходящий, а не считаем «доплату 0».
  const fits = calculation ? calculation.fitsMasters && calculation.fitsBranches : true;
  const recommended = useMemo(
    () => (fits ? null : recommendPlan(sortedPlans, masters, branches)),
    [fits, sortedPlans, masters, branches]
  );

  const popularIndex = sortedPlans.length > 1 ? Math.floor(sortedPlans.length / 2) : -1;
  const limit = (value: number | null) => (value === null ? t.unlimited : value);

  const sliderFill = (value: number, min: number, max: number) => {
    const pct = ((value - min) / (max - min)) * 100;
    return {
      background: `linear-gradient(90deg, #8a6fd1 0%, #a68cf0 ${pct}%, rgba(255,255,255,0.75) ${pct}%)`,
    };
  };

  return (
    <>
      {/* Тарифы: заголовок и карточки помещаются в один экран */}
      <section id="plans" className="mx-auto mt-14 max-w-6xl scroll-mt-20 px-4 sm:px-6 lg:mt-20 lg:px-8">
        <SectionHeader eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

        {loading ? (
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="glass h-[460px] animate-pulse rounded-[28px]" />
            ))}
          </div>
        ) : sortedPlans.length === 0 ? (
          <div className="glass mt-8 rounded-[28px] p-8 sm:p-10">
            <h3 className="font-display text-3xl font-semibold text-ink">{t.fallbackTitle}</h3>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">{t.fallbackDescription}</p>
            <button
              type="button"
              onClick={onScrollToLead}
              className="btn-primary mt-6 min-h-[48px] px-7 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum"
            >
              <span>{t.fallbackButton}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="-mx-4 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0">
            {sortedPlans.map((plan, idx) => {
              const isPopular = idx === popularIndex;
              const { prev, features } = planFeatureRows[idx];
              const description = planDescription(plan, lang);

              return (
                <article
                  key={plan.code}
                  className={`relative flex w-[86%] shrink-0 snap-center flex-col rounded-[28px] p-5 sm:w-[340px] lg:w-auto lg:p-6 tiny:py-4 ${
                    isPopular ? 'glass bg-white/70 ring-2 ring-plum/50' : 'glass'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-[1.9rem] font-semibold leading-none text-ink">
                      {planName(plan, lang)}
                    </h3>
                    {isPopular && (
                      <span className="btn-primary px-3 py-1 text-[10px] uppercase tracking-[0.12em] whitespace-nowrap">
                        ★ {t.popularBadge}
                      </span>
                    )}
                  </div>
                  {description && (
                    <p className="mt-2 line-clamp-2 h-8 text-xs leading-4 text-muted tiny:hidden">{description}</p>
                  )}

                  <div className="mt-3 flex flex-wrap items-baseline gap-x-1.5">
                    <span className="font-display text-[2.2rem] font-semibold leading-none tracking-tight text-plum-deep tabular-nums">
                      {formatMoney(plan.price_monthly, plan.currency, lang)}
                    </span>
                    <span className="text-xs font-medium text-soft">/ {t.perMonth}</span>
                  </div>
                  {Number(plan.setup_fee) > 0 && (
                    <p className="mt-1 text-[11px] font-medium text-soft tabular-nums">
                      {t.setupFeePrefix} {formatMoney(plan.setup_fee, plan.currency, lang)}
                    </p>
                  )}

                  <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] font-semibold text-ink tabular-nums">
                    <span className="glass-tile rounded-full px-2.5 py-1">
                      {t.mastersLimit} {limit(plan.max_masters)}
                    </span>
                    <span className="glass-tile rounded-full px-2.5 py-1">
                      {t.branchesLimit} {limit(plan.max_branches)}
                    </span>
                  </div>
                  {(Number(plan.extra_master_price) > 0 || Number(plan.extra_branch_price) > 0) && (
                    <div className="mt-1.5 space-y-0.5 text-[11px] text-soft tabular-nums tiny:hidden">
                      {Number(plan.extra_master_price) > 0 && plan.max_masters !== null && (
                        <div>
                          {t.extraMasterPrefix} {formatMoney(plan.extra_master_price, plan.currency, lang)} {t.perMonth}
                        </div>
                      )}
                      {Number(plan.extra_branch_price) > 0 && (
                        <div>
                          {t.extraBranchPrefix} {formatMoney(plan.extra_branch_price, plan.currency, lang)} {t.perMonth}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-3 border-t border-white/80 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-plum-deep">
                      {prev ? fill(t.includesPrev, { plan: planName(prev, lang) }) : t.includedLabel}
                    </p>
                    <ul className="mt-2 gap-x-3 text-[13px] leading-snug text-ink short:columns-2 short:text-xs">
                      {features.map((code) => (
                        <li key={code} className="mb-1.5 flex break-inside-avoid items-start gap-2">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-plum" aria-hidden="true" />
                          <span>{featureNames[code]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="min-h-4 flex-1" />
                  <button
                    type="button"
                    onClick={() => onSelectPlanForLead(plan.code)}
                    className={`min-h-[44px] w-full px-5 text-sm uppercase tracking-[0.08em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum ${
                      isPopular ? 'btn-primary' : 'btn-ghost'
                    }`}
                  >
                    {t.selectPlanButton}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Калькулятор */}
      {!loading && activeCalcPlan && calculation && (
        <section id="calculator" className="mx-auto mt-14 max-w-6xl scroll-mt-20 px-4 sm:px-6 lg:mt-20 lg:px-8">
          <div className="glass rounded-[32px] p-5 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="space-y-6 lg:col-span-7">
                <div>
                  <p className="eyebrow">{tc.title}</p>
                  <h2 className="mt-3 font-display text-3xl font-semibold uppercase leading-[1.02] tracking-tight text-ink [text-wrap:balance] sm:text-[2.4rem]">
                    {tc.subtitle}
                  </h2>
                </div>

                <div>
                  <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                    {tc.selectPlanLabel}
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sortedPlans.map((plan) => {
                      const isSelected = plan.code === activeCalcPlan.code;
                      return (
                        <button
                          key={plan.code}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => setCalcPlanCode(plan.code)}
                          className={`min-h-[40px] px-5 text-sm focus-visible:outline-2 focus-visible:outline-plum ${
                            isSelected ? 'btn-primary' : 'btn-ghost'
                          }`}
                        >
                          {planName(plan, lang)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm">
                    <label htmlFor="calc-masters-range" className="font-semibold text-ink">
                      {tc.mastersLabel}
                    </label>
                    <span className="font-display text-2xl font-semibold text-plum-deep tabular-nums">{masters}</span>
                  </div>
                  <input
                    id="calc-masters-range"
                    type="range"
                    min={1}
                    max={30}
                    value={masters}
                    onChange={(e) => setMasters(Number(e.target.value))}
                    style={sliderFill(masters, 1, 30)}
                    className="lavender-slider mt-2 w-full"
                  />
                  <div className="mt-1 flex justify-between text-[11px] text-soft tabular-nums">
                    <span>1</span>
                    <span>10</span>
                    <span>20</span>
                    <span>30</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm">
                    <label htmlFor="calc-branches-range" className="font-semibold text-ink">
                      {tc.branchesLabel}
                    </label>
                    <span className="font-display text-2xl font-semibold text-plum-deep tabular-nums">{branches}</span>
                  </div>
                  <input
                    id="calc-branches-range"
                    type="range"
                    min={1}
                    max={5}
                    value={branches}
                    onChange={(e) => setBranches(Number(e.target.value))}
                    style={sliderFill(branches, 1, 5)}
                    className="lavender-slider mt-2 w-full"
                  />
                  <div className="mt-1 flex justify-between text-[11px] text-soft tabular-nums">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span key={n}>{n}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="velvet flex flex-col rounded-[24px] p-6 text-white sm:p-7 lg:col-span-5">
                {fits ? (
                  <>
                    <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">
                      {tc.monthlyTotalLabel} · {planName(activeCalcPlan, lang)}
                    </div>
                    <div className="mt-3 font-display text-5xl font-semibold leading-none tracking-tight tabular-nums">
                      {formatMoney(calculation.monthly, calculation.currency, lang)}
                    </div>
                    <div className="mt-3 text-xs font-semibold text-[#d9ccff] tabular-nums">
                      {calculation.setup > 0
                        ? `${tc.setupOncePrefix} ${formatMoney(calculation.setup, calculation.currency, lang)} ${tc.setupOnceSuffix}`
                        : tc.freeSetup}
                    </div>
                  </>
                ) : (
                  <div role="status" className="rounded-2xl bg-white/10 p-4 text-sm text-white/85">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#d9ccff]" aria-hidden="true" />
                      <div className="space-y-1">
                        {!calculation.fitsMasters && (
                          <p className="font-semibold text-white">
                            {fill(tc.notFitMasters, {
                              plan: planName(activeCalcPlan, lang),
                              max: activeCalcPlan.max_masters ?? '',
                            })}
                          </p>
                        )}
                        {!calculation.fitsBranches && (
                          <p className="font-semibold text-white">
                            {fill(tc.notFitBranches, {
                              plan: planName(activeCalcPlan, lang),
                              max: activeCalcPlan.max_branches ?? '',
                            })}
                          </p>
                        )}
                        <p>
                          {recommended
                            ? fill(tc.recommend, { plan: planName(recommended, lang) })
                            : tc.noPlanFits}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-5 border-t border-white/15 pt-4 text-xs leading-relaxed text-white/75 tabular-nums">
                  <div>
                    {t.mastersLimit} <strong className="text-white">{limit(activeCalcPlan.max_masters)}</strong> ·{' '}
                    {t.branchesLimit} <strong className="text-white">{limit(activeCalcPlan.max_branches)}</strong>
                  </div>
                  <p className="mt-1.5 text-white/60">{tc.managerHint}</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (fits) {
                      onSelectPlanForLead(activeCalcPlan.code, masters, branches);
                    } else if (recommended) {
                      setCalcPlanCode(recommended.code);
                    } else {
                      onSelectPlanForLead('', masters, branches);
                    }
                  }}
                  className="btn-primary mt-6 min-h-[48px] w-full px-5 text-center text-sm lg:mt-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span>
                    {fits
                      ? tc.applyCalculationCta
                      : recommended
                        ? fill(tc.switchCta, { plan: planName(recommended, lang) })
                        : tc.individualCta}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
