import React, { useState } from 'react';
import { Language, translations } from '../i18n/translations';
import { Calendar, Clock, Sparkles, Star, Check, CreditCard, BarChart3, Bell } from 'lucide-react';

interface MockupProps {
  lang: Language;
  onBookClick?: () => void;
}

export const HeroPhoneMockup: React.FC<MockupProps> = ({ lang, onBookClick }) => {
  const t = translations[lang].mockup;
  const [selectedSlot, setSelectedSlot] = useState<string>('14:30');

  const slots = ['11:00', '13:00', '14:30', '16:30', '18:00'];

  return (
    <div className="relative mx-auto w-full max-w-[340px] select-none">
      {/* Subtle geometric background shapes (no stock photos) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-6 -right-6 h-52 w-52 rounded-full bg-[#b76e79]/12 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 -left-6 h-44 w-44 rounded-full bg-[#3d3538]/8 blur-xl"
      />

      {/* Phone Outer Frame */}
      <div className="relative rounded-[36px] border-[6px] border-[#2b2427] bg-[#faf7f5] p-3.5 shadow-[0_24px_60px_-15px_rgba(31,26,28,0.18)]">
        {/* Top Speaker Notch */}
        <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-[#2b2427]/20" />

        {/* App Header inside Phone */}
        <div className="rounded-2xl bg-[#1f1a1c] p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* Geometric Salon Monogram */}
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#b76e79] text-sm font-bold text-white">
                LN
              </div>
              <div>
                <div className="text-xs font-bold tracking-wider text-white">
                  {t.salonTitle}
                </div>
                <div className="text-[11px] text-white/70">{t.salonLocation}</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-[#e6b8c0]">
              <Star className="h-3.5 w-3.5 fill-[#e6b8c0] text-[#e6b8c0]" />
              <span className="tabular-nums">4.9</span>
            </div>
          </div>

          {/* Loyalty Bonus Strip inside App Header */}
          <div className="mt-3.5 flex items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-xs">
            <span className="text-white/80">{t.bonusLabel}</span>
            <span className="font-semibold text-[#f3d1d7] tabular-nums">{t.bonusPoints}</span>
          </div>
        </div>

        {/* Booking Cards List */}
        <div className="mt-3 space-y-2.5">
          <div className="px-1 text-[11px] font-semibold text-[#5c5256]">
            {t.upcomingTitle}
          </div>

          {/* Card 1: Primary Service & Interactive Time Slots */}
          <div className="rounded-2xl border border-[#e8dfd9] bg-white p-3.5 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs font-bold text-[#1f1a1c]">{t.service1}</div>
                <div className="mt-0.5 text-[11px] text-[#6e6266]">{t.master1}</div>
              </div>
              <span className="shrink-0 text-xs font-bold text-[#b76e79] tabular-nums">
                {lang === 'uz' ? "180 000 so'm" : '180 000 сум'}
              </span>
            </div>

            {/* Interactive Time Slots */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {slots.map((slot) => {
                const active = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold tabular-nums transition-colors ${
                      active
                        ? 'bg-[#b76e79] text-white'
                        : 'bg-[#f4eeea] text-[#3d3538] hover:bg-[#eadfd9]'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 2: Secondary Service */}
          <div className="rounded-2xl border border-[#e8dfd9] bg-white p-3 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#b76e79]/12 text-[#b76e79]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1f1a1c]">{t.service2}</div>
                  <div className="text-[11px] text-[#6e6266]">{t.master2}</div>
                </div>
              </div>
              <span className="shrink-0 text-[11px] font-semibold text-[#3d3538] tabular-nums">
                15:00
              </span>
            </div>
          </div>

          {/* Push Reminder Notification Card */}
          <div className="flex items-center gap-2.5 rounded-xl bg-[#f3eae6] px-3 py-2.5 text-[11px] text-[#3d3538]">
            <Bell className="h-3.5 w-3.5 shrink-0 text-[#b76e79]" />
            <span className="font-medium">{t.reminderToast}</span>
          </div>
        </div>

        {/* Bottom CTA inside Phone */}
        <button
          type="button"
          onClick={onBookClick}
          className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#b76e79] py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#a35c67] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b76e79]"
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>
            {t.bookButton} ({selectedSlot})
          </span>
        </button>
      </div>
    </div>
  );
};

export const ClientRoleIllustration: React.FC<{ lang: Language }> = ({ lang }) => {
  return (
    <div className="rounded-xl border border-[#ece3de] bg-[#faf7f5] p-3.5">
      <div className="flex items-center justify-between border-b border-[#ece3de] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-[#b76e79] text-center text-[11px] leading-6 font-bold text-white">
            S
          </div>
          <span className="text-xs font-bold text-[#1f1a1c]">
            {lang === 'uz' ? 'Mijoz ilovasi' : 'Приложение клиента'}
          </span>
        </div>
        <span className="text-[11px] font-semibold text-[#b76e79] tabular-nums">24/7</span>
      </div>
      <div className="mt-2.5 space-y-2">
        <div className="flex items-center justify-between rounded-lg bg-white p-2.5 text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-[#b76e79]" />
            <span className="font-medium text-[#1f1a1c]">
              {lang === 'uz' ? 'Manikyur • 14:30' : 'Маникюр • 14:30'}
            </span>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-[#2e6f4e]">
            <Check className="h-3 w-3" />
            {lang === 'uz' ? 'Tasdiqlandi' : 'Записан'}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-white px-2.5 py-2 text-[11px] text-[#5c5256]">
          <span>{lang === 'uz' ? 'Keshbek va bonuslar' : 'Бонусы с визита'}</span>
          <span className="font-bold text-[#b76e79] tabular-nums">
            {lang === 'uz' ? "+15 000 so'm" : '+15 000 сум'}
          </span>
        </div>
      </div>
    </div>
  );
};

export const AdminRoleIllustration: React.FC<{ lang: Language }> = ({ lang }) => {
  return (
    <div className="rounded-xl border border-[#ece3de] bg-[#faf7f5] p-3.5">
      <div className="flex items-center justify-between border-b border-[#ece3de] pb-2.5">
        <span className="text-xs font-bold text-[#1f1a1c]">
          {lang === 'uz' ? 'Ustalar jadvali' : 'Сетка расписания'}
        </span>
        <span className="text-[11px] text-[#6e6266] tabular-nums">10:00 — 20:00</span>
      </div>
      <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px]">
        <div className="rounded-lg bg-white p-2 shadow-2xs">
          <div className="font-bold text-[#1f1a1c]">
            {lang === 'uz' ? 'Madina (Top)' : 'Мадина (Топ)'}
          </div>
          <div className="mt-1.5 rounded bg-[#b76e79]/15 px-2 py-1 font-medium text-[#8f4c57] tabular-nums">
            11:00 Азиза (Гель)
          </div>
          <div className="mt-1 rounded bg-[#3d3538]/10 px-2 py-1 font-medium text-[#3d3538] tabular-nums">
            13:30 Дильноза
          </div>
        </div>
        <div className="rounded-lg bg-white p-2 shadow-2xs">
          <div className="font-bold text-[#1f1a1c]">
            {lang === 'uz' ? 'Nigora (Nail)' : 'Нигора (Nail)'}
          </div>
          <div className="mt-1.5 rounded bg-[#b76e79]/15 px-2 py-1 font-medium text-[#8f4c57] tabular-nums">
            12:00 Камила (Спа)
          </div>
          <div className="mt-1 rounded border border-dashed border-[#d5c8c2] px-2 py-1 text-[#7a6d71] tabular-nums">
            15:00 {lang === 'uz' ? "Bo'sh" : 'Свободно'}
          </div>
        </div>
      </div>
    </div>
  );
};

export const OwnerRoleIllustration: React.FC<{ lang: Language }> = ({ lang }) => {
  return (
    <div className="rounded-xl border border-[#ece3de] bg-[#faf7f5] p-3.5">
      <div className="flex items-center justify-between border-b border-[#ece3de] pb-2.5">
        <div className="flex items-center gap-1.5">
          <BarChart3 className="h-3.5 w-3.5 text-[#b76e79]" />
          <span className="text-xs font-bold text-[#1f1a1c]">Telegram Bot</span>
        </div>
        <span className="text-[11px] font-medium text-[#6e6266] tabular-nums">21:00</span>
      </div>
      <div className="mt-2.5 rounded-lg bg-white p-2.5 text-xs shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-[#5c5256]">
            {lang === 'uz' ? 'Bugungi tushum:' : 'Выручка за день:'}
          </span>
          <span className="font-bold text-[#1f1a1c] tabular-nums">
            {lang === 'uz' ? "4 250 000 so'm" : '4 250 000 сум'}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2 border-t border-[#f2ebe7] pt-2">
          <CreditCard className="h-3.5 w-3.5 text-[#b76e79]" />
          <span className="text-[11px] font-semibold text-[#3d3538]">Payme • Click</span>
        </div>
      </div>
    </div>
  );
};
