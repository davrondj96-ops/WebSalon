import React from 'react';
import { Language } from '../i18n/translations';
import { Clock, Check, CreditCard, BarChart3 } from 'lucide-react';

export const ClientRoleIllustration: React.FC<{ lang: Language }> = ({ lang }) => {
  return (
    <div className="rounded-xl border border-[#e6ddf6] bg-[#f6f2fd] p-3.5">
      <div className="flex items-center justify-between border-b border-[#e6ddf6] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-[#8a6fd1] text-center text-[11px] leading-6 font-bold text-white">
            S
          </div>
          <span className="text-xs font-bold text-[#241b3a]">
            {lang === 'uz' ? 'Mijoz ilovasi' : 'Приложение клиента'}
          </span>
        </div>
        <span className="text-[11px] font-semibold text-[#8a6fd1] tabular-nums">24/7</span>
      </div>
      <div className="mt-2.5 space-y-2">
        <div className="flex items-center justify-between rounded-lg bg-white p-2.5 text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-[#8a6fd1]" />
            <span className="font-medium text-[#241b3a]">
              {lang === 'uz' ? 'Soch olish • 14:30' : 'Стрижка • 14:30'}
            </span>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-[#2e6f4e]">
            <Check className="h-3 w-3" />
            {lang === 'uz' ? 'Tasdiqlandi' : 'Записан'}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-white px-2.5 py-2 text-[11px] text-[#625679]">
          <span>{lang === 'uz' ? 'Keshbek va bonuslar' : 'Бонусы с визита'}</span>
          <span className="font-bold text-[#8a6fd1] tabular-nums">
            {lang === 'uz' ? "+15 000 so'm" : '+15 000 сум'}
          </span>
        </div>
      </div>
    </div>
  );
};

export const AdminRoleIllustration: React.FC<{ lang: Language }> = ({ lang }) => {
  return (
    <div className="rounded-xl border border-[#e6ddf6] bg-[#f6f2fd] p-3.5">
      <div className="flex items-center justify-between border-b border-[#e6ddf6] pb-2.5">
        <span className="text-xs font-bold text-[#241b3a]">
          {lang === 'uz' ? 'Ustalar jadvali' : 'Сетка расписания'}
        </span>
        <span className="text-[11px] text-[#74698b] tabular-nums">10:00 — 20:00</span>
      </div>
      <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px]">
        <div className="rounded-lg bg-white p-2 shadow-2xs">
          <div className="font-bold text-[#241b3a]">
            {lang === 'uz' ? 'Madina (Top)' : 'Мадина (Топ)'}
          </div>
          <div className="mt-1.5 rounded bg-[#8a6fd1]/15 px-2 py-1 font-medium text-[#5b3fa8] tabular-nums">
            11:00 Азиза (Окрашивание)
          </div>
          <div className="mt-1 rounded bg-[#4a3f63]/10 px-2 py-1 font-medium text-[#4a3f63] tabular-nums">
            13:30 Дильноза
          </div>
        </div>
        <div className="rounded-lg bg-white p-2 shadow-2xs">
          <div className="font-bold text-[#241b3a]">
            {lang === 'uz' ? 'Sardor (Barber)' : 'Сардор (Барбер)'}
          </div>
          <div className="mt-1.5 rounded bg-[#8a6fd1]/15 px-2 py-1 font-medium text-[#5b3fa8] tabular-nums">
            12:00 Бобур (Борода)
          </div>
          <div className="mt-1 rounded border border-dashed border-[#cfc2ea] px-2 py-1 text-[#7d7394] tabular-nums">
            15:00 {lang === 'uz' ? "Bo'sh" : 'Свободно'}
          </div>
        </div>
      </div>
    </div>
  );
};

export const OwnerRoleIllustration: React.FC<{ lang: Language }> = ({ lang }) => {
  return (
    <div className="rounded-xl border border-[#e6ddf6] bg-[#f6f2fd] p-3.5">
      <div className="flex items-center justify-between border-b border-[#e6ddf6] pb-2.5">
        <div className="flex items-center gap-1.5">
          <BarChart3 className="h-3.5 w-3.5 text-[#8a6fd1]" />
          <span className="text-xs font-bold text-[#241b3a]">Telegram Bot</span>
        </div>
        <span className="text-[11px] font-medium text-[#74698b] tabular-nums">21:00</span>
      </div>
      <div className="mt-2.5 rounded-lg bg-white p-2.5 text-xs shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-[#625679]">
            {lang === 'uz' ? 'Bugungi tushum:' : 'Выручка за день:'}
          </span>
          <span className="font-bold text-[#241b3a] tabular-nums">
            {lang === 'uz' ? "4 250 000 so'm" : '4 250 000 сум'}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2 border-t border-[#eee8fa] pt-2">
          <CreditCard className="h-3.5 w-3.5 text-[#8a6fd1]" />
          <span className="text-[11px] font-semibold text-[#4a3f63]">Payme • Click</span>
        </div>
      </div>
    </div>
  );
};
