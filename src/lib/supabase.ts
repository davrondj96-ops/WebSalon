import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://ueilwjmurinwivsoorju.supabase.co';
// Публичный (anon) ключ проекта: он предназначен для браузера и даёт доступ
// только к открытым функциям site_plans / site_banners / site_submit_lead.
const PUBLIC_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlaWx3am11cmlud2l2c29vcmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0NzcyMTQsImV4cCI6MjEwNjA1MzIxNH0.Mmcac_-l3kiyX5bcuZxtNIFuwjVW1ZfFgQHYSHsMi24';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || PUBLIC_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SitePlan {
  code: string;
  name: string;
  description?: string | null;
  name_uz?: string | null;
  description_uz?: string | null;
  price_monthly: number;
  currency: 'UZS' | 'USD';
  setup_fee: number;
  max_masters: number | null;
  max_branches: number | null;
  extra_master_price: number;
  extra_branch_price: number;
  features: string[];
  sort_order: number;
}

export interface SiteBanner {
  id: string | number;
  title: string;
  subtitle?: string | null;
  title_uz?: string | null;
  subtitle_uz?: string | null;
  badge_uz?: string | null;
  cta_text_uz?: string | null;
  image_url?: string | null;
  badge?: string | null;
  cta_text?: string | null;
  cta_url?: string | null;
}

export interface LeadSubmissionPayload {
  p_salon_name: string;
  p_phone: string;
  p_owner_name: string;
  p_city: string;
  p_masters: number | null;
  p_branches: number | null;
  p_plan_code: string | null;
  p_message: string;
  p_lang: 'ru' | 'uz';
  p_source: 'site';
  p_utm: {
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
  };
}
