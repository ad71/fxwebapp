import type { CalendarDay } from "./types";

const HOLIDAYS: Record<string, string> = {
  "2026-01-01": "New Year's Day",
  "2026-01-26": "Republic Day",
  "2026-03-30": "Holi",
  "2026-04-03": "Good Friday",
  "2026-04-14": "Ambedkar Jayanti",
  "2026-05-01": "May Day",
  "2026-08-15": "Independence Day",
  "2026-10-02": "Gandhi Jayanti",
  "2026-10-20": "Diwali",
  "2026-11-04": "Guru Nanak Jayanti",
  "2026-12-25": "Christmas",
};

function lastDayOfMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function generateCalendarData(
  spotRate: number,
  baseDifferential: number = 1.5,
  monthsAhead: number = 6,
): Record<string, CalendarDay[]> {
  const today = new Date();
  const calendar: Record<string, CalendarDay[]> = {};

  for (let m = 0; m < monthsAhead; m++) {
    const year = today.getFullYear() + Math.floor((today.getMonth() + m) / 12);
    const month = (today.getMonth() + m) % 12;
    const key = `${year}-${String(month + 1).padStart(2, "0")}`;
    const daysInMonth = lastDayOfMonth(year, month);
    const days: CalendarDay[] = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dateStr = date.toISOString().slice(0, 10);
      const dow = date.getDay();
      const isWeekend = dow === 0 || dow === 6;
      const isHoliday = dateStr in HOLIDAYS;
      const isMonthEnd = d === daysInMonth;

      // Forward rate = spot + premium based on days-to-date
      const daysFromToday = Math.round((date.getTime() - today.getTime()) / 86400000);
      let forwardRate: number | null = null;
      let forwardPremium: number | null = null;

      if (!isWeekend && !isHoliday && daysFromToday > 0) {
        const annualFactor = daysFromToday / 365;
        const premium = baseDifferential * annualFactor;
        const fwdPoints = spotRate * (premium / 100);
        forwardRate = Number((spotRate + fwdPoints).toFixed(4));
        forwardPremium = Number(fwdPoints.toFixed(4));
      }

      days.push({
        date: dateStr,
        dayOfWeek: dow,
        forwardRate,
        forwardPremium,
        isHoliday,
        holidayName: HOLIDAYS[dateStr],
        isWeekend,
        isMonthEnd,
      });
    }

    calendar[key] = days;
  }

  return calendar;
}
