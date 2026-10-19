import { SitePlan } from './supabase';
import { Language } from '../i18n/translations';

export interface PlanEstimate {
  monthly: number;
  setup: number;
  currency: 'UZS' | 'USD';
  extraMasters: number;
  extraBranches: number;
  /** Тариф рассчитан на столько мастеров (или доп. мастера можно докупить). */
  fitsMasters: boolean;
  /** Тариф рассчитан на столько филиалов (или доп. филиалы можно докупить). */
  fitsBranches: boolean;
}

/**
 * Та же формула, что в базе (billing.plan_estimate).
 * Доп. мастера/филиалы продаются, только если у тарифа задана их цена (> 0);
 * при цене 0 тариф просто не подходит — лимит в приложении салона не пустит.
 */
export function estimatePlan(plan: SitePlan, masters: number, branches: number): PlanEstimate {
  const extraMasterPrice = Number(plan.extra_master_price) || 0;
  const extraBranchPrice = Number(plan.extra_branch_price) || 0;
  const overMasters = plan.max_masters === null ? 0 : Math.max(0, masters - plan.max_masters);
  const overBranches = plan.max_branches === null ? 0 : Math.max(0, branches - plan.max_branches);

  const fitsMasters = overMasters === 0 || extraMasterPrice > 0;
  const fitsBranches = overBranches === 0 || extraBranchPrice > 0;
  const extraMasters = extraMasterPrice > 0 ? overMasters : 0;
  const extraBranches = extraBranchPrice > 0 ? overBranches : 0;

  return {
    monthly:
      (Number(plan.price_monthly) || 0) + extraMasters * extraMasterPrice + extraBranches * extraBranchPrice,
    setup: Number(plan.setup_fee) || 0,
    currency: plan.currency || 'UZS',
    extraMasters,
    extraBranches,
    fitsMasters,
    fitsBranches,
  };
}

/** Самый первый (по порядку) тариф, который подходит по мастерам и филиалам. */
export function recommendPlan(plans: SitePlan[], masters: number, branches: number): SitePlan | null {
  const sorted = [...plans].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  for (const plan of sorted) {
    const e = estimatePlan(plan, masters, branches);
    if (e.fitsMasters && e.fitsBranches) return plan;
  }
  return null;
}

export function planName(plan: SitePlan, lang: Language): string {
  return (lang === 'uz' && plan.name_uz?.trim()) || plan.name;
}

export function planDescription(plan: SitePlan, lang: Language): string | null {
  return (lang === 'uz' && plan.description_uz?.trim()) || plan.description || null;
}
