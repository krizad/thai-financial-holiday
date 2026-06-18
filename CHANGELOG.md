# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-01-01

### Added
- Initial release with Thai financial institution holiday data
- `isHoliday()` - Check if a date is a Thai financial holiday
- `getHoliday()` - Get holiday details for a specific date
- `getHolidays()` - Get holidays filtered by year and/or month
- `getNextHoliday()` - Get the next upcoming holiday after a given date
- `isBusinessDay()` - Check if a date is a business day (not weekend, not holiday)
- `addBusinessDays()` - Add/subtract business days from a date
- `getHolidaysInRange()` - Get holidays within a date range
- `getBusinessDaysInRange()` - Get business days within a date range
- TypeScript support with full type definitions
- ESM and CommonJS dual-package support
- Automated monthly data sync from Bank of Thailand API via GitHub Actions