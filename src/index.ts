import holidaysData from '../data/holidays.json';
import { BOTHoliday } from './types';

export type DateInput = string | Date | number;

const holidays: BOTHoliday[] = holidaysData;

// Create a Set of all holiday date strings for O(1) lookups
const holidaySet = new Set(holidays.map((h) => h.Date));

/**
 * Parses and returns a cloned Date object in local time for consistent calculations.
 */
function getLocalDateObject(date: DateInput): Date {
  let d: Date;
  if (date instanceof Date) {
    d = new Date(date);
  } else if (typeof date === 'number') {
    d = new Date(date);
  } else if (typeof date === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const parts = date.split('-').map(Number);
      // Parse in local time at noon to prevent day-shifting timezone issues
      d = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
    } else {
      d = new Date(date);
    }
  } else {
    throw new TypeError('Invalid date input type. Expected Date, number, or string.');
  }

  if (Number.isNaN(d.getTime())) {
    throw new TypeError(`Invalid date value: ${date}`);
  }
  return d;
}

/**
 * Normalizes an input date (Date object, timestamp, or string) to a "YYYY-MM-DD" local date string.
 */
function normalizeDate(date: DateInput): string {
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  const d = getLocalDateObject(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Checks if a given date is a Thai financial institution holiday.
 * @param date - Date object, timestamp, or date string
 */
export function isHoliday(date: DateInput): boolean {
  const formatted = normalizeDate(date);
  return holidaySet.has(formatted);
}

/**
 * Retrieves the holiday details for a given date.
 * @param date - Date object, timestamp, or date string
 * @returns BOTHoliday details or null if the date is not a holiday
 */
export function getHoliday(date: DateInput): BOTHoliday | null {
  const formatted = normalizeDate(date);
  return holidays.find((h) => h.Date === formatted) || null;
}

/**
 * Checks if a given date is a Thai financial business day (not a weekend and not a holiday).
 * @param date - Date object, timestamp, or date string
 */
export function isBusinessDay(date: DateInput): boolean {
  const d = getLocalDateObject(date);
  const dayOfWeek = d.getDay(); // 0 is Sunday, 6 is Saturday
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }
  return !isHoliday(date);
}

/**
 * Adds (or subtracts) a number of business days to a given date.
 * Weekend days and holidays are skipped.
 * @param date - Start date
 * @param days - Number of business days to add (can be negative to subtract)
 */
export function addBusinessDays(date: DateInput, days: number): Date {
  if (!Number.isInteger(days)) {
    throw new TypeError('Days must be an integer.');
  }

  const d = getLocalDateObject(date);
  let remaining = Math.abs(days);
  const step = days >= 0 ? 1 : -1;

  while (remaining > 0) {
    d.setDate(d.getDate() + step);
    if (isBusinessDay(d)) {
      remaining--;
    }
  }

  return d;
}

/**
 * Retrieves a list of Thai financial institution holidays.
 * @param year - Optional year to filter the holidays (e.g. 2026)
 * @param month - Optional month to filter the holidays (1-12)
 */
export function getHolidays(year?: number, month?: number): BOTHoliday[] {
  if (year === undefined) {
    return [...holidays];
  }
  if (month !== undefined) {
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      throw new RangeError('Invalid month. Month must be an integer between 1 and 12.');
    }
  }
  if (month === undefined) {
    return holidays.filter((h) => h.Date.startsWith(`${year}-`));
  }
  const formattedMonth = String(month).padStart(2, '0');
  return holidays.filter((h) => h.Date.startsWith(`${year}-${formattedMonth}-`));
}

/**
 * Retrieves the next upcoming financial holiday after a specific date.
 * @param date - Date object, timestamp, or date string (defaults to now)
 */
export function getNextHoliday(date: DateInput = new Date()): BOTHoliday | null {
  const formatted = normalizeDate(date);
  // Find the first holiday that is strictly after the given date string (lexicographically)
  const next = holidays.find((h) => h.Date > formatted);
  return next || null;
}

/**
 * Retrieves all holidays within a specific date range (inclusive).
 * @param start - Start date of the range
 * @param end - End date of the range
 */
export function getHolidaysInRange(
  start: DateInput,
  end: DateInput
): BOTHoliday[] {
  const formattedStart = normalizeDate(start);
  const formattedEnd = normalizeDate(end);

  if (formattedStart > formattedEnd) {
    return [];
  }

  return holidays.filter((h) => h.Date >= formattedStart && h.Date <= formattedEnd);
}

/**
 * Retrieves all business days within a specific date range (inclusive).
 * @param start - Start date of the range
 * @param end - End date of the range
 */
export function getBusinessDaysInRange(
  start: DateInput,
  end: DateInput
): Date[] {
  const dStart = getLocalDateObject(start);
  const dEnd = getLocalDateObject(end);

  // Normalize hours to avoid missing days due to sub-day differences
  dStart.setHours(12, 0, 0, 0);
  dEnd.setHours(12, 0, 0, 0);

  if (dStart > dEnd) {
    return [];
  }

  const businessDays: Date[] = [];
  const current = new Date(dStart);

  while (current <= dEnd) {
    if (isBusinessDay(current)) {
      businessDays.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }

  return businessDays;
}

export * from './types';
export { holidays as rawHolidays };
