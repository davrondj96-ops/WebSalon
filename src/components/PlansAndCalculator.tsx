import React, { useMemo, useState, useEffect } from 'react';
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
import { Check, ArrowRight, Calculator, AlertTriangle } from 'lucide-react';

interface PlansAndCalculatorProps {
  lang: Language;
  plans: SitePlan[];
  loading: boolean;
  onSelectPlanForLead: (planCode: string, mastersCount?: number, branchesCount?: number) => void;
  onScrollToLead: () => void;
}

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

  const sortedPlans = useMemo(() => {
    return [...plans].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }, [plans]);

  // Union of all valid feature codes across all loaded plans (preserving canonical order)
  const unionFeatures = useMemo<KnownFeatureCode[]>(() => {
    const presentSet = new Set<KnownFeatureCode>();
    for (const plan of sortedPlans) {
      if (Array.isArray(plan.features)) {
        for (const f of plan.features) {
          if (isKnownFeature(f)) {
            presentSet.add(f);
          }
        }
      }
    }
    return KNOWN_FEATURE_CODES.filter((code) => presentSet.has(code));
  }, [sortedPlans]);

  // Calculator state
  const [calcPlanCode, setCalcPlanCode] = useState<string>('');
  const [masters, setMasters] = useState<number>(5);
  const [branches, setBranches] = useState<number>(1);

  useEffect(() => {
    if (sortedPlans.length > 0) {
      const exists = sortedPlans.some((p) => p.code === calcPlanCode);
      if (!exists) {
        const middleIdx = Math.floor(sortedPlans.length / 2);
        setCalcPlanCode(sortedPlans[middleIdx].code);
      }
    }
  }, [sortedPlans, calcPlanCode]);

  const activeCalcPlan = useMemo(() => {
    return (
      sortedPlans.find((p) => p.code === calcPlanCode) ||
      sortedPlans[Math.floor(sortedPlans.length / 2)] ||
      sortedPlans[0]
    );
  }, [sortedPlans, calcPlanCode]);

  const calculation = useMemo(() => {
    if (!activeCalcPlan) return null;
    return estimatePlan(activeCalcPlan, masters, branches);
  }, [activeCalcPlan, masters, branches]);

  // Если выбранный тариф не рассчитан на столько мастеров/филиалов —
  // предлагаем первый подходящий, а не считаем «доплату 0».
  const fits = calculation ? calculation.fitsMasters && calculation.fitsBranches : true;
  const recommended = useMemo(
    () => (fits ? null : recommendPlan(sortedPlans, masters, branches)),
    [fits, sortedPlans, masters, branches]
  );

  const popularIndex =
    sortedPlans.length > 1 ? Math.floor(sortedPlans.length / 2) : -1;

  return (
    <section
      id="plans"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-[#b76e79]">{t.eyebrow}</p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#1f1a1c] [text-wrap:balance] sm:text-4xl">
          {t.title}
        </h2>
        <p className="mt-3 text-base text-[#5c5256]">{t.subtitle}</p>
      </div>

      {/* Skeleton state while loading */}
      {loading ? (
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-[#ece3de] bg-white p-6 shadow-xs"
            >
              <div className="h-6 w-32 animate-pulse rounded bg-[#efe8e4]" />
              <div className="mt-2 h-4 w-48 animate-pulse rounded bg-[#efe8e4]" />
              <div className="mt-6 h-10 w-44 animate-pulse rounded bg-[#efe8e4]" />
              <div className="mt-6 space-y-3 border-t border-[#f2ebe7] pt-5">
                {[0, 1, 2, 3, 4, 5].map((line) => (
                  <div
                    key={line}
                    className="h-4 w-full animate-pulse rounded bg-[#efe8e4]"
                  />
                ))}
              </div>
              <div className="mt-8 h-12 w-full animate-pulse rounded-xl bg-[#b76e79]/25" />
            </div>
          ))}
        </div>
      ) : sortedPlans.length === 0 ? (
        /* Fallback when site_plans failed to load or returned empty */
        <div className="mt-10 rounded-2xl border border-[#ece3de] bg-white p-8 shadow-xs sm:p-10">
          <div className="max-w-xl">
            <h3 className="text-xl font-bold text-[#1f1a1c] sm:text-2xl">
              {t.fallbackTitle}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-[#5c5256]">
              {t.fallbackDescription}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={onScrollToLead}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[#b76e79] px-7 py-3.5 text-base font-bold text-white shadow-sm transition-colors hover:bg-[#a35c67] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b76e79] whitespace-nowrap shrink-0"
              >
                <span>{t.fallbackButton}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Tariff Cards: Horizontal snap scroll on mobile, 3-column grid on desktop */}
          <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
            {sortedPlans.map((plan, idx) => {
              const isPopular = idx === popularIndex;
              const planFeaturesSet = new Set(
                Array.isArray(plan.features) ? plan.features : []
              );

              return (
                <div
                  key={plan.code}
                  className={`flex min-w-[85vw] shrink-0 snap-center flex-col justify-between rounded-2xl border p-6 transition-shadow sm:min-w-[340px] md:min-w-0 ${
                    isPopular
                      ? 'border-[#b76e79] bg-white shadow-[0_16px_40px_-14px_rgba(183,110,121,0.22)]'
                      : 'border-[#ece3de] bg-white shadow-[0_8px_28px_-12px_rgba(31,26,28,0.06)]'
                  }`}
                >
                  <div>
                    {/* Card Header & Popular Label */}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-extrabold text-[#1f1a1c]">
                        {planName(plan, lang)}
                      </h3>
                      {isPopular && (
                        <span className="text-xs font-bold tracking-wide text-[#b76e79] whitespace-nowrap shrink-0">
                          ★ {t.popularBadge}
                        </span>
                      )}
                    </div>

                    {planDescription(plan, lang) && (
                      <p className="mt-2 text-sm leading-relaxed text-[#5c5256]">
                        {planDescription(plan, lang)}
                      </p>
                    )}

                    {/* Monthly Price & Setup Fee */}
                    <div className="mt-5 border-b border-[#f2ebe7] pb-5">
                      <div className="flex flex-wrap items-baseline gap-x-1.5">
                        <span className="text-3xl font-extrabold tracking-tight text-[#1f1a1c] tabular-nums">
                          {formatMoney(plan.price_monthly, plan.currency, lang)}
                        </span>
                        <span className="text-sm font-medium text-[#6e6266]">
                          / {t.perMonth}
                        </span>
                      </div>
                      {Number(plan.setup_fee) > 0 && (
                        <p className="mt-1.5 text-xs font-medium text-[#6e6266] tabular-nums">
                          {t.setupFeePrefix}{' '}
                          {formatMoney(plan.setup_fee, plan.currency, lang)}
                        </p>
                      )}
                    </div>

                    {/* Limits: Masters & Branches */}
                    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-[#3d3538] tabular-nums">
                      <span>
                        {t.mastersLimit}{' '}
                        <strong className="text-[#1f1a1c]">
                          {plan.max_masters === null
                            ? t.unlimited
                            : plan.max_masters}
                        </strong>
                      </span>
                      <span aria-hidden="true" className="text-[#cfc2bc]">
                        ·
                      </span>
                      <span>
                        {t.branchesLimit}{' '}
                        <strong className="text-[#1f1a1c]">
                          {plan.max_branches === null
                            ? t.unlimited
                            : plan.max_branches}
                        </strong>
                      </span>
                    </div>

                    {/* Extra master / branch prices if > 0 */}
                    {(Number(plan.extra_master_price) > 0 ||
                      Number(plan.extra_branch_price) > 0) && (
                      <div className="mt-2 space-y-1 text-xs text-[#6e6266] tabular-nums">
                        {Number(plan.extra_master_price) > 0 &&
                          plan.max_masters !== null && (
                            <div>
                              {t.extraMasterPrefix}{' '}
                              {formatMoney(
                                plan.extra_master_price,
                                plan.currency,
                                lang
                              )}{' '}
                              {t.perMonth}
                            </div>
                          )}
                        {Number(plan.extra_branch_price) > 0 && (
                          <div>
                            {t.extraBranchPrefix}{' '}
                            {formatMoney(
                              plan.extra_branch_price,
                              plan.currency,
                              lang
                            )}{' '}
                            {t.perMonth}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Features Comparison List (union of all plans) */}
                    {unionFeatures.length > 0 && (
                      <ul className="mt-5 space-y-2.5 border-t border-[#f2ebe7] pt-5 text-sm">
                        {unionFeatures.map((featureCode) => {
                          const hasFeature = planFeaturesSet.has(featureCode);
                          return (
                            <li
                              key={featureCode}
                              className={`flex items-start gap-2.5 ${
                                hasFeature
                                  ? 'text-[#1f1a1c]'
                                  : 'text-[#a69a9e]'
                              }`}
                            >
                              {hasFeature ? (
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#b76e79]" />
                              ) : (
                                <span
                                  aria-hidden="true"
                                  className="inline-block w-4 shrink-0 text-center font-medium text-[#b8aca7]"
                                >
                                  —
                                </span>
                              )}
                              <span className="leading-snug">
                                {featureNames[featureCode]}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  {/* Select Plan CTA */}
                  <button
                    type="button"
                    onClick={() => onSelectPlanForLead(plan.code)}
                    className={`mt-7 flex min-h-[46px] w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b76e79] whitespace-nowrap shrink-0 ${
                      isPopular
                        ? 'bg-[#b76e79] text-white hover:bg-[#a35c67]'
                        : 'border border-[#dfd4ce] bg-[#faf7f5] text-[#1f1a1c] hover:border-[#b76e79] hover:text-[#b76e79]'
                    }`}
                  >
                    {t.selectPlanButton}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Interactive Calculator under Tariffs */}
          {activeCalcPlan && calculation && (
            <div className="mt-12 rounded-2xl border border-[#ece3de] bg-white p-6 shadow-[0_12px_36px_-14px_rgba(31,26,28,0.06)] sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
                {/* Left Column: Sliders & Plan Selector */}
                <div className="space-y-6 lg:col-span-7">
                  <div>
                    <div className="flex items-center gap-2 text-[#b76e79]">
                      <Calculator className="h-4 w-4" />
                      <span className="text-sm font-bold">{tc.title}</span>
                    </div>
                    <p className="mt-1 text-sm text-[#5c5256]">{tc.subtitle}</p>
                  </div>

                  {/* Tariff Segmented Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-[#5c5256]">
                      {tc.selectPlanLabel}
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {sortedPlans.map((plan) => {
                        const isSelected = plan.code === activeCalcPlan.code;
                        return (
                          <button
                            key={plan.code}
                            type="button"
                            onClick={() => setCalcPlanCode(plan.code)}
                            className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-[#b76e79] whitespace-nowrap shrink-0 ${
                              isSelected
                                ? 'bg-[#1f1a1c] text-white'
                                : 'border border-[#e4d9d3] bg-[#faf7f5] text-[#3d3538] hover:border-[#b76e79]'
                            }`}
                          >
                            {planName(plan, lang)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Masters Slider (1–30) */}
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <label
                        htmlFor="calc-masters-range"
                        className="font-semibold text-[#1f1a1c]"
                      >
                        {tc.mastersLabel}
                      </label>
                      <span className="text-base font-extrabold text-[#b76e79] tabular-nums">
                        {masters}
                      </span>
                    </div>
                    <input
                      id="calc-masters-range"
                      type="range"
                      min={1}
                      max={30}
                      value={masters}
                      onChange={(e) => setMasters(Number(e.target.value))}
                      className="rose-slider mt-2.5 w-full rounded-lg bg-[#ece3de]"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-[#7a6d71] tabular-nums">
                      <span>1</span>
                      <span>10</span>
                      <span>20</span>
                      <span>30</span>
                    </div>
                  </div>

                  {/* Branches Slider (1–5) */}
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <label
                        htmlFor="calc-branches-range"
                        className="font-semibold text-[#1f1a1c]"
                      >
                        {tc.branchesLabel}
                      </label>
                      <span className="text-base font-extrabold text-[#b76e79] tabular-nums">
                        {branches}
                      </span>
                    </div>
                    <input
                      id="calc-branches-range"
                      type="range"
                      min={1}
                      max={5}
                      value={branches}
                      onChange={(e) => setBranches(Number(e.target.value))}
                      className="rose-slider mt-2.5 w-full rounded-lg bg-[#ece3de]"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-[#7a6d71] tabular-nums">
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Calculated Summary Box */}
                <div className="rounded-2xl bg-[#faf7f5] p-6 lg:col-span-5 sm:p-7">
                  {fits ? (
                    <>
                      <div className="text-xs font-semibold text-[#5c5256]">
                        {tc.monthlyTotalLabel} ({planName(activeCalcPlan, lang)})
                      </div>
                      <div className="mt-2 text-3xl font-extrabold tracking-tight text-[#1f1a1c] tabular-nums sm:text-4xl">
                        {formatMoney(calculation.monthly, calculation.currency, lang)}
                      </div>
                      <div className="mt-2 text-xs font-semibold text-[#b76e79] tabular-nums">
                        {calculation.setup > 0
                          ? `${tc.setupOncePrefix} ${formatMoney(
                              calculation.setup,
                              calculation.currency,
                              lang
                            )} ${tc.setupOnceSuffix}`
                          : tc.freeSetup}
                      </div>
                    </>
                  ) : (
                    <div role="status" className="rounded-xl border border-[#e8c7cc] bg-white p-4 text-sm text-[#5c5256]">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#b76e79]" aria-hidden="true" />
                        <div className="space-y-1">
                          {!calculation.fitsMasters && (
                            <p className="font-semibold text-[#1f1a1c]">
                              {fill(tc.notFitMasters, {
                                plan: planName(activeCalcPlan, lang),
                                max: activeCalcPlan.max_masters ?? '',
                              })}
                            </p>
                          )}
                          {!calculation.fitsBranches && (
                            <p className="font-semibold text-[#1f1a1c]">
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

                  <div className="mt-4 border-t border-[#e8dfd9] pt-4 text-xs leading-relaxed text-[#5c5256] tabular-nums">
                    <div>
                      {t.mastersLimit}{' '}
                      <strong>
                        {activeCalcPlan.max_masters === null
                          ? t.unlimited
                          : activeCalcPlan.max_masters}
                      </strong>{' '}
                      · {t.branchesLimit}{' '}
                      <strong>
                        {activeCalcPlan.max_branches === null
                          ? t.unlimited
                          : activeCalcPlan.max_branches}
                      </strong>
                    </div>
                    <p className="mt-2 text-[#7a6d71]">{tc.managerHint}</p>
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
                    className="mt-5 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#b76e79] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#a35c67] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b76e79] text-center"
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
          )}
        </>
      )}
    </section>
  );
};
