// Контакты платформы. Задаются в .env (см. .env.example), чтобы на сайт
// не попали выдуманные номера. Пустое значение — строка на сайте не показывается.
const env = import.meta.env;

const telegramRaw = String(env.VITE_CONTACT_TELEGRAM || '').trim().replace(/^@/, '').replace(/^https?:\/\/t\.me\//, '');
const phoneRaw = String(env.VITE_CONTACT_PHONE || '').trim();
const phoneDigits = phoneRaw.replace(/\D/g, '');

function formatUzPhone(digits: string): string {
  // 998901234567 → +998 90 123-45-67
  const m = digits.match(/^998(\d{2})(\d{3})(\d{2})(\d{2})$/);
  return m ? `+998 ${m[1]} ${m[2]}-${m[3]}-${m[4]}` : `+${digits}`;
}

export const CONTACTS = {
  telegramHandle: telegramRaw ? `@${telegramRaw}` : '',
  telegramUrl: telegramRaw ? `https://t.me/${telegramRaw}` : '',
  phoneDisplay: phoneDigits ? formatUzPhone(phoneDigits) : '',
  phoneHref: phoneDigits ? `tel:+${phoneDigits}` : '',
};

export const LEGAL = {
  offerUrl: (lang: 'ru' | 'uz') => `${import.meta.env.BASE_URL}oferta.html?lang=${lang}`,
  privacyUrl: (lang: 'ru' | 'uz') => `${import.meta.env.BASE_URL}privacy.html?lang=${lang}`,
};
