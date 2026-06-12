import type { Lang } from "./types";

export function formatShortDate(date: string, lang: Lang): string {
  const [, month, day] = date.split("-").map(Number);
  if (lang === "zh") {
    return `${month}/${day}`;
  }
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[month - 1]} ${day}`;
}

export function formatDisplayDate(date: string, lang: Lang): string {
  const [y, m, d] = date.split("-").map(Number);
  if (lang === "zh") {
    return `${y} 年 ${m} 月 ${d} 日`;
  }
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[m - 1]} ${d}, ${y}`;
}

export function formatSyncedAt(iso: string, lang: Lang): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = d.getUTCFullYear();
  const mo = pad(d.getUTCMonth() + 1);
  const day = pad(d.getUTCDate());
  const h = pad(d.getUTCHours());
  const min = pad(d.getUTCMinutes());

  if (lang === "zh") {
    return `${y}年${mo}月${day}日 ${h}:${min} UTC`;
  }
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[d.getUTCMonth()]} ${day}, ${y} ${h}:${min} UTC`;
}