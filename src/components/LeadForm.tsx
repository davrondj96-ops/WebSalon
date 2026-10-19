import React, { useState, useEffect, useMemo } from 'react';
import { SitePlan, supabase } from '../lib/supabase';
import { Language, fill, formatMoney, translations } from '../i18n/translations';
import { estimatePlan, planName } from '../lib/pricing';
import { CONTACTS, LEGAL } from '../config';
import { CheckCircle2, AlertCircle, Send, MessageCircle, Calculator } from 'lucide-react';

interface LeadFormProps {
  lang: Language;
  plans: SitePlan[];
  selectedPlanCode: string;
  prefilledMasters?: number | null;
  prefilledBranches?: number | null;
  onChangeSelectedPlan: (code: string) => void;
}

// Formats Uzbek phone input with mask: +998 __ ___-__-__
export function formatUzPhoneMask(rawInput: string): string {
  let digits = rawInput.replace(/\D/g, '');

  if (digits.startsWith('998')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('8') && digits.length > 9) {
    digits = digits.slice(1);
  }

  digits = digits.slice(0, 9);

  if (digits.length === 0) {
    return '+998 ';
  }

  let formatted = '+998 ';
  if (digits.length > 0) {
    formatted += digits.slice(0, 2);
  }
  if (digits.length > 2) {
    formatted += ' ' + digits.slice(2, 5);
  }
  if (digits.length > 5) {
    formatted += '-' + digits.slice(5, 7);
  }
  if (digits.length > 7) {
    formatted += '-' + digits.slice(7, 9);
  }

  return formatted;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  lang,
  plans,
  selectedPlanCode,
  prefilledMasters,
  prefilledBranches,
  onChangeSelectedPlan,
}) => {
  const t = translations[lang].lead;

  const [salonName, setSalonName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [ownerName, setOwnerName] = useState('');
  const [city, setCity] = useState('');
  const [mastersInput, setMastersInput] = useState<string>('');
  const [branchesInput, setBranchesInput] = useState<string>('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (prefilledMasters && prefilledMasters > 0) {
      setMastersInput(String(prefilledMasters));
    }
  }, [prefilledMasters]);

  useEffect(() => {
    if (prefilledBranches && prefilledBranches > 0) {
      setBranchesInput(String(prefilledBranches));
    }
  }, [prefilledBranches]);

  // Предварительный расчёт по выбранному тарифу — та же формула, что в калькуляторе
  // и в базе; в заявку уходят тариф, мастера и филиалы, база пересчитывает сама.
  const estimate = useMemo(() => {
    const plan = plans.find((p) => p.code === selectedPlanCode);
    if (!plan) return null;
    const m = Number(mastersInput);
    const b = Number(branchesInput);
    return estimatePlan(
      plan,
      Number.isInteger(m) && m >= 1 ? m : 1,
      Number.isInteger(b) && b >= 1 ? b : 1
    );
  }, [plans, selectedPlanCode, mastersInput, branchesInput]);

  const mapErrorText = (rawMessage?: string): string => {
    if (!rawMessage) return t.errors.DEFAULT;
    if (rawMessage.includes('INVALID_NAME')) return t.errors.INVALID_NAME;
    if (rawMessage.includes('INVALID_PHONE')) return t.errors.INVALID_PHONE;
    if (rawMessage.includes('INVALID_MASTERS')) return t.errors.INVALID_MASTERS;
    if (rawMessage.includes('INVALID_BRANCHES')) return t.errors.INVALID_BRANCHES;
    if (rawMessage.includes('TOO_MANY_REQUESTS')) return t.errors.TOO_MANY_REQUESTS;
    return t.errors.DEFAULT;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length < 5) {
      setPhone('+998 ');
      return;
    }
    setPhone(formatUzPhoneMask(val));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedSalon = salonName.trim();
    if (!trimmedSalon) {
      setErrorMessage(t.errors.INVALID_NAME);
      return;
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 12 || !phoneDigits.startsWith('998')) {
      setErrorMessage(t.errors.INVALID_PHONE);
      return;
    }

    let parsedMasters: number | null = null;
    if (mastersInput.trim().length > 0) {
      const num = Number(mastersInput.trim());
      if (!Number.isInteger(num) || num < 1 || num > 500) {
        setErrorMessage(t.errors.INVALID_MASTERS);
        return;
      }
      parsedMasters = num;
    }

    let parsedBranches: number | null = null;
    if (branchesInput.trim().length > 0) {
      const num = Number(branchesInput.trim());
      if (!Number.isInteger(num) || num < 1 || num > 100) {
        setErrorMessage(t.errors.INVALID_BRANCHES);
        return;
      }
      parsedBranches = num;
    }

    const searchParams = new URLSearchParams(window.location.search);
    const p_utm = {
      utm_source: searchParams.get('utm_source'),
      utm_medium: searchParams.get('utm_medium'),
      utm_campaign: searchParams.get('utm_campaign'),
    };

    setSubmitting(true);
    try {
      const { data, error } = await supabase.rpc('site_submit_lead', {
        p_salon_name: trimmedSalon,
        p_phone: `+${phoneDigits}`,
        p_owner_name: ownerName.trim() || null,
        p_city: city.trim() || null,
        p_masters: parsedMasters,
        p_branches: parsedBranches,
        p_plan_code: selectedPlanCode || null,
        p_message: message.trim() || null,
        p_lang: lang,
        p_source: 'site',
        p_utm,
      });

      if (error) {
        setErrorMessage(mapErrorText(error.message));
        return;
      }

      if (data && typeof data === 'object' && 'ok' in data && !data.ok) {
        setErrorMessage(mapErrorText((data as { error?: string }).error));
        return;
      }

      setSubmittedSuccess(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      setErrorMessage(mapErrorText(msg));
    } finally {
      setSubmitting(false);
    }
  };

  const sortedPlans = [...plans].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );

  return (
    <div id="lead" className="glass rounded-[28px] p-6 sm:p-8 lg:p-10">
        {submittedSuccess ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8a6fd1]/15 text-[#8a6fd1]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-[#241b3a] [text-wrap:balance] sm:text-4xl">
              {t.successTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-base text-[#625679]">
              {t.successSubtitle}
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {CONTACTS.telegramUrl && (
              <a
                href={CONTACTS.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary min-h-[48px] px-7 py-3.5 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a6fd1] whitespace-nowrap shrink-0"
              >
                <MessageCircle className="h-5 w-5" />
                <span>{t.telegramCta}</span>
              </a>
              )}
              <button
                type="button"
                onClick={() => {
                  setSubmittedSuccess(false);
                  setSalonName('');
                  setPhone('+998 ');
                  setMessage('');
                  setBranchesInput('');
                }}
                className="btn-ghost min-h-[48px] px-6 py-3.5 text-sm whitespace-nowrap shrink-0"
              >
                {t.sendAnother}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="max-w-xl">
              <p className="eyebrow">{t.eyebrow}</p>
              <h2 className="mt-3 font-display text-3xl font-semibold uppercase leading-[1.05] tracking-tight text-[#241b3a] [text-wrap:balance] sm:text-4xl">
                {t.title}
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-[#625679] sm:text-base">
                {t.subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
              {errorMessage && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-xl border border-[#d97782] bg-[#fdf2f4] p-4 text-sm font-medium text-[#8c2d38]"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#8a6fd1]" />
                  <div className="flex-1">
                    <span>{errorMessage}</span>
                    {errorMessage === t.errors.DEFAULT && CONTACTS.telegramUrl && (
                      <div className="mt-2">
                        <a
                          href={CONTACTS.telegramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-bold text-[#8a6fd1] underline hover:text-[#5b3fa8]"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>{t.telegramCta}</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Salon Name * */}
                <div>
                  <label
                    htmlFor="lead-salon-name"
                    className="block text-xs font-bold text-[#241b3a]"
                  >
                    {t.salonNameLabel} <span className="text-[#8a6fd1]">*</span>
                  </label>
                  <input
                    id="lead-salon-name"
                    type="text"
                    required
                    value={salonName}
                    onChange={(e) => {
                      setSalonName(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder={t.salonNamePlaceholder}
                    className="field mt-1.5"
                  />
                </div>

                {/* Phone * with +998 __ ___-__-__ mask */}
                <div>
                  <label
                    htmlFor="lead-phone"
                    className="block text-xs font-bold text-[#241b3a]"
                  >
                    {t.phoneLabel} <span className="text-[#8a6fd1]">*</span>
                  </label>
                  <input
                    id="lead-phone"
                    type="tel"
                    inputMode="tel"
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder={t.phonePlaceholder}
                    className="field mt-1.5 font-medium tabular-nums"
                  />
                </div>

                {/* Owner Name */}
                <div>
                  <label
                    htmlFor="lead-owner-name"
                    className="block text-xs font-bold text-[#241b3a]"
                  >
                    {t.ownerNameLabel}
                  </label>
                  <input
                    id="lead-owner-name"
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder={t.ownerNamePlaceholder}
                    className="field mt-1.5"
                  />
                </div>

                {/* City */}
                <div>
                  <label
                    htmlFor="lead-city"
                    className="block text-xs font-bold text-[#241b3a]"
                  >
                    {t.cityLabel}
                  </label>
                  <input
                    id="lead-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={t.cityPlaceholder}
                    className="field mt-1.5"
                  />
                </div>

                {/* How many masters */}
                <div>
                  <label
                    htmlFor="lead-masters"
                    className="block text-xs font-bold text-[#241b3a]"
                  >
                    {t.mastersLabel}
                  </label>
                  <input
                    id="lead-masters"
                    type="number"
                    min={1}
                    max={500}
                    value={mastersInput}
                    onChange={(e) => {
                      setMastersInput(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder={t.mastersPlaceholder}
                    className="field mt-1.5 tabular-nums"
                  />
                </div>

                {/* How many branches */}
                <div>
                  <label
                    htmlFor="lead-branches"
                    className="block text-xs font-bold text-[#241b3a]"
                  >
                    {t.branchesLabel}
                  </label>
                  <input
                    id="lead-branches"
                    type="number"
                    min={1}
                    max={100}
                    value={branchesInput}
                    onChange={(e) => {
                      setBranchesInput(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder={t.branchesPlaceholder}
                    className="field mt-1.5 tabular-nums"
                  />
                </div>

                {/* Tariff Dropdown */}
                <div>
                  <label
                    htmlFor="lead-plan"
                    className="block text-xs font-bold text-[#241b3a]"
                  >
                    {t.planLabel}
                  </label>
                  <select
                    id="lead-plan"
                    value={selectedPlanCode}
                    onChange={(e) => onChangeSelectedPlan(e.target.value)}
                    className="field mt-1.5"
                  >
                    <option value="">{t.planUnknownOption}</option>
                    {sortedPlans.map((plan) => (
                      <option key={plan.code} value={plan.code}>
                        {planName(plan, lang)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {estimate && (
                <div
                  aria-live="polite"
                  className="flex items-start gap-3 glass-tile rounded-xl p-4 text-sm text-[#625679]"
                >
                  <Calculator className="mt-0.5 h-4 w-4 shrink-0 text-[#8a6fd1]" aria-hidden="true" />
                  {estimate.fitsMasters && estimate.fitsBranches ? (
                    <div className="tabular-nums">
                      <span className="font-semibold text-[#241b3a]">{t.estimateLabel}: </span>
                      <span className="font-bold text-[#241b3a]">
                        {formatMoney(estimate.monthly, estimate.currency, lang)}
                      </span>{' '}
                      {t.estimatePerMonth}
                      {estimate.setup > 0 && (
                        <span>
                          {' '}
                          {fill(t.estimateSetup, {
                            sum: formatMoney(estimate.setup, estimate.currency, lang),
                          })}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div>{t.estimateNotFit}</div>
                  )}
                </div>
              )}

              {/* Comment */}
              <div>
                <label
                  htmlFor="lead-message"
                  className="block text-xs font-bold text-[#241b3a]"
                >
                  {t.messageLabel}
                </label>
                <textarea
                  id="lead-message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.messagePlaceholder}
                  className="field mt-1.5"
                />
              </div>

              {/* Submit Button & Privacy Note */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex min-h-[50px] w-full px-7 py-3.5 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a6fd1] disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap shrink-0"
                >
                  <Send className="h-4 w-4" />
                  <span>{submitting ? t.submittingButton : t.submitButton}</span>
                </button>
                <p className="mt-3 text-center text-xs text-[#7d7394]">
                  {t.privacyNotePrefix}
                  <a
                    href={LEGAL.privacyUrl(lang)}
                    target="_blank"
                    rel="noopener"
                    className="underline hover:text-[#8a6fd1]"
                  >
                    {t.privacyNoteLink}
                  </a>
                  {t.privacyNoteSuffix}
                </p>
              </div>
            </form>
          </>
        )}
    </div>
  );
};
