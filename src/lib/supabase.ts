import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://ueilwjmurinwivsoorju.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key-not-configured';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    !import.meta.env.VITE_SUPABASE_ANON_KEY.includes('[ANON KEY')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SitePlan {
  code: string;
  name: string;
  description?: string | null;
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

export const DEMO_PLANS: SitePlan[] = [
  {
    code: 'start',
    name: 'Start',
    description: 'Для частных мастеров и небольших студий маникюра',
    price_monthly: 290000,
    currency: 'UZS',
    setup_fee: 0,
    max_masters: 3,
    max_branches: 1,
    extra_master_price: 50000,
    extra_branch_price: 150000,
    features: [
      'online_booking',
      'reviews',
      'rebook_reminders',
      'telegram',
      'analytics',
    ],
    sort_order: 1,
  },
  {
    code: 'salon_pro',
    name: 'Salon Pro',
    description: 'Своё приложение и программа лояльности для растущего салона',
    price_monthly: 490000,
    currency: 'UZS',
    setup_fee: 300000,
    max_masters: 8,
    max_branches: 1,
    extra_master_price: 45000,
    extra_branch_price: 150000,
    features: [
      'online_booking',
      'client_app',
      'branding',
      'play_publish',
      'reviews',
      'chat',
      'loyalty',
      'waitlist',
      'content',
      'telegram',
      'rebook_reminders',
      'analytics',
    ],
    sort_order: 2,
  },
  {
    code: 'network',
    name: 'Prime Network',
    description: 'Полный комплект для крупных салонов и сетей без лимита мастеров',
    price_monthly: 890000,
    currency: 'UZS',
    setup_fee: 500000,
    max_masters: null,
    max_branches: 3,
    extra_master_price: 0,
    extra_branch_price: 120000,
    features: [
      'online_booking',
      'client_app',
      'branding',
      'play_publish',
      'reviews',
      'chat',
      'loyalty',
      'gift_certificates',
      'packages',
      'waitlist',
      'content',
      'telegram',
      'rebook_reminders',
      'analytics',
    ],
    sort_order: 3,
  },
];
