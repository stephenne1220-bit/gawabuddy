import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Currency } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const currencySymbols: Record<Currency, string> = {
  KES: 'KSh',
  USD: '$',
  EUR: '€',
  GBP: '£',
  UGX: 'USh',
  TZS: 'TSh',
};

export function formatMoney(
  amount: number,
  currency: Currency = 'KES',
  options?: { compact?: boolean; showSign?: boolean }
): string {
  const symbol = currencySymbols[currency] || currency;
  const abs = Math.abs(amount);
  let formatted: string;

  if (options?.compact && abs >= 1_000_000) {
    formatted = (abs / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (options?.compact && abs >= 1_000) {
    formatted = (abs / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  } else {
    formatted = abs.toLocaleString('en-KE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  const sign = options?.showSign
    ? amount > 0
      ? '+'
      : amount < 0
        ? '-'
        : ''
    : amount < 0
      ? '-'
      : '';

  return `${sign}${symbol} ${formatted}`;
}

export function getMonthKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function getMonthLabel(monthKey: string): string {
  const [y, m] = monthKey.split('-').map(Number);
  return new Date(y, m - 1).toLocaleDateString('en-KE', {
    month: 'long',
    year: 'numeric',
  });
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function uid(): string {
  return crypto.randomUUID();
}

export function percent(used: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}

export function healthColor(pct: number): string {
  if (pct >= 100) return 'bg-red-danger';
  if (pct >= 80) return 'bg-amber-500';
  return 'bg-green-success';
}

export function monthsBetween(start: Date, end: Date): number {
  return (
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth())
  );
}
