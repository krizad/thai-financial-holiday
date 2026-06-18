import { describe, it, expect } from 'vitest';
import { isHoliday, getHolidays, getNextHoliday, getHolidaysInRange, rawHolidays, getHoliday, isBusinessDay, addBusinessDays, getBusinessDaysInRange } from '../index';

describe('Thai Financial Holiday API', () => {
  it('should verify rawHolidays has data', () => {
    expect(rawHolidays.length).toBeGreaterThan(0);
  });

  describe('isHoliday', () => {
    it('should identify a known holiday (New Year\'s Day 2026-01-01)', () => {
      expect(isHoliday('2026-01-01')).toBe(true);
      expect(isHoliday(new Date('2026-01-01T12:00:00'))).toBe(true);
    });

    it('should identify a non-holiday (e.g., typical working days)', () => {
      // 2026-01-05 is a Monday and not in the holiday list
      expect(isHoliday('2026-01-05')).toBe(false);
    });

    it('should throw an error for invalid dates', () => {
      expect(() => isHoliday('invalid-date')).toThrow(TypeError);
    });
  });

  describe('getHolidays', () => {
    it('should return all holidays when no year is specified', () => {
      const all = getHolidays();
      expect(all.length).toBe(rawHolidays.length);
    });

    it('should filter holidays by year', () => {
      const holidays2026 = getHolidays(2026);
      expect(holidays2026.length).toBeGreaterThan(0);
      holidays2026.forEach((h) => {
        expect(h.Date.startsWith('2026-')).toBe(true);
      });
    });

    it('should filter holidays by year and month', () => {
      const holidaysJan2026 = getHolidays(2026, 1);
      expect(holidaysJan2026.length).toBeGreaterThan(0);
      holidaysJan2026.forEach((h) => {
        expect(h.Date.startsWith('2026-01-')).toBe(true);
      });
    });

    it('should throw an error for invalid month values', () => {
      expect(() => getHolidays(2026, 13)).toThrow(RangeError);
      expect(() => getHolidays(2026, -1)).toThrow(RangeError);
    });
  });

  describe('getNextHoliday', () => {
    it('should return the next holiday relative to a given date', () => {
      // The day before New Year 2026
      const next = getNextHoliday('2025-12-31');
      expect(next).not.toBeNull();
      if (next) {
        expect(next.Date).toBe('2026-01-01');
        expect(next.HolidayDescription).toBe('New Year’s Day');
      }
    });

    it('should return null if there are no holidays after the date', () => {
      const next = getNextHoliday('2030-01-01');
      expect(next).toBeNull();
    });

    it('should throw an error for invalid dates', () => {
      expect(() => getNextHoliday('invalid-date')).toThrow(TypeError);
    });
  });

  describe('getHolidaysInRange', () => {
    it('should return all holidays within a given range', () => {
      // 2026-01-01 and 2026-01-02 are holidays
      const results = getHolidaysInRange('2026-01-01', '2026-01-03');
      expect(results.length).toBe(2);
      expect(results[0].Date).toBe('2026-01-01');
      expect(results[1].Date).toBe('2026-01-02');
    });

    it('should return empty array if range is invalid', () => {
      const results = getHolidaysInRange('2026-01-03', '2026-01-01');
      expect(results.length).toBe(0);
    });

    it('should throw an error for invalid dates', () => {
      expect(() => getHolidaysInRange('invalid-date', '2026-01-01')).toThrow(TypeError);
    });
  });

  describe('getHoliday', () => {
    it('should return details for a known holiday', () => {
      const holiday = getHoliday('2026-01-01');
      expect(holiday).not.toBeNull();
      if (holiday) {
        expect(holiday.HolidayDescriptionThai).toBe('วันขึ้นปีใหม่');
      }
    });

    it('should return null for a non-holiday', () => {
      expect(getHoliday('2026-01-05')).toBeNull();
    });

    it('should throw TypeError for invalid dates', () => {
      expect(() => getHoliday('invalid-date')).toThrow(TypeError);
    });
  });

  describe('isBusinessDay', () => {
    it('should return true for a regular working day (Monday 2026-01-05)', () => {
      expect(isBusinessDay('2026-01-05')).toBe(true);
    });

    it('should return false for a weekend (Saturday 2026-01-03)', () => {
      expect(isBusinessDay('2026-01-03')).toBe(false);
    });

    it('should return false for a holiday (Thursday 2026-01-01)', () => {
      expect(isBusinessDay('2026-01-01')).toBe(false);
    });

    it('should throw TypeError for invalid dates', () => {
      expect(() => isBusinessDay('invalid-date')).toThrow(TypeError);
    });
  });

  describe('addBusinessDays', () => {
    it('should add business days skipping weekends and holidays', () => {
      // Wednesday 2025-12-31 + 1 business day -> skips Jan 1 (Holiday), Jan 2 (Holiday), Jan 3 (Saturday), Jan 4 (Sunday) -> returns Jan 5 (Monday)
      const result = addBusinessDays('2025-12-31', 1);
      const year = result.getFullYear();
      const month = String(result.getMonth() + 1).padStart(2, '0');
      const date = String(result.getDate()).padStart(2, '0');
      expect(`${year}-${month}-${date}`).toBe('2026-01-05');
    });

    it('should subtract business days skipping weekends and holidays', () => {
      // Monday 2026-01-05 - 1 business day -> returns Tuesday 2025-12-30 (skips weekends and Jan 1/2/31 holidays)
      const result = addBusinessDays('2026-01-05', -1);
      const year = result.getFullYear();
      const month = String(result.getMonth() + 1).padStart(2, '0');
      const date = String(result.getDate()).padStart(2, '0');
      expect(`${year}-${month}-${date}`).toBe('2025-12-30');
    });

    it('should throw TypeError if days is not an integer', () => {
      expect(() => addBusinessDays('2026-01-05', 1.5)).toThrow(TypeError);
    });
  });

  describe('getBusinessDaysInRange', () => {
    it('should return all business days in range', () => {
      // Range: 2026-01-01 (Holiday) to 2026-01-06 (Tuesday)
      // Jan 1: Holiday
      // Jan 2: Holiday
      // Jan 3: Saturday
      // Jan 4: Sunday
      // Jan 5: Business Day (Monday)
      // Jan 6: Business Day (Tuesday)
      const results = getBusinessDaysInRange('2026-01-01', '2026-01-06');
      expect(results.length).toBe(2);
      
      const dates = results.map((d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const date = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${date}`;
      });
      expect(dates).toContain('2026-01-05');
      expect(dates).toContain('2026-01-06');
    });

    it('should return empty list if range is backwards', () => {
      expect(getBusinessDaysInRange('2026-01-06', '2026-01-01').length).toBe(0);
    });
  });
});
