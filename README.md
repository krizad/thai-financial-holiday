# @krizad/thai-financial-holiday-helper

[![npm version](https://img.shields.io/npm/v/@krizad/thai-financial-holiday-helper.svg)](https://www.npmjs.com/package/@krizad/thai-financial-holiday-helper)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Interactive Demo](https://img.shields.io/badge/demo-interactive-brightgreen.svg)](https://krizad.github.io/thai-financial-holiday-helper-demo/)

ข้อมูลวันหยุดทางการเงินของสถาบันการเงินไทย (Bank of Thailand / ธนาคารแห่งประเทศไทย) อัปเดตข้อมูลอัตโนมัติทุกวันที่ 1 ของเดือน มีฟังก์ชันใช้งานง่ายและรองรับข้อมูลย้อนหลัง 5 ปี (รวมปีปัจจุบัน) ในรูปแบบ ESM, CommonJS และ TypeScript แบบแกะกล่อง

---

## 🌟 ฟีเจอร์หลัก (Key Features)

- **ข้อมูลอัปเดตตรงเวลา:** ดึงข้อมูลตรงจาก API Gateway ของธนาคารแห่งประเทศไทย (`gateway.api.bot.or.th`) อัปเดตทุกวันที่ 1 ของเดือนผ่าน GitHub Actions
- **รองรับ 5 ปีย้อนหลัง:** ข้อมูลครอบคลุม 5 ปีย้อนหลังตามเวลาปัจจุบัน (รวมปีปัจจุบัน)
- **ฟังก์ชันใช้งานสะดวก:** ค้นหา ตรวจสอบ และคำนวณวันหยุดถัดไปได้ง่ายดาย
- **รองรับ TypeScript:** ส่งมอบ Type Definitions แบบครบถ้วนและแม่นยำ
- **ขนาดเล็กและไม่มี Dependencies นอก:** ไฟล์บันเดิลผ่าน `tsup` ขนาดเล็กมากและรวดเร็วสำหรับการรันบน Node.js หรือ Browser

---

## 📦 การติดตั้ง (Installation)

ติดตั้งแพ็กเกจผ่าน Node Package Manager ที่คุณเลือกใช้งาน:

```bash
# npm
npm install @krizad/thai-financial-holiday-helper

# pnpm
pnpm add @krizad/thai-financial-holiday-helper

# yarn
yarn add @krizad/thai-financial-holiday-helper
```

---

## 🚀 ตัวอย่างการใช้งาน (Usage Examples)

ตัวอย่างการเรียกใช้งานฟังก์ชันพื้นฐานในโปรเจกต์ของคุณ:

### 1. ตรวจสอบว่าเป็นวันหยุดหรือไม่ (`isHoliday`)

ใช้เพื่อตรวจสอบวันหยุดโดยการรับข้อมูลประเภท `Date`, `string` (รูปแบบ YYYY-MM-DD หรือ ISO string ก็ได้) หรือ `number` (Timestamp)

```typescript
import { isHoliday } from '@krizad/thai-financial-holiday-helper';

// ตรวจสอบจาก String YYYY-MM-DD
console.log(isHoliday('2026-01-01')); // true (วันขึ้นปีใหม่)
console.log(isHoliday('2026-01-05')); // false (วันทำงานปกติ)

// ตรวจสอบจาก Date Object
const today = new Date();
if (isHoliday(today)) {
  console.log('วันนี้เป็นวันหยุดของสถาบันการเงินไทย 🏖️');
}
```

### 2. ดึงรายการวันหยุดทั้งหมด (`getHolidays`)

ดึงข้อมูลวันหยุดทั้งหมด หรือระบุปีที่ต้องการเจาะจง (`number`) และสามารถเลือกกรองเฉพาะบางเดือนได้ (`number` ตั้งแต่ 1-12)

```typescript
import { getHolidays } from '@krizad/thai-financial-holiday-helper';

// ดึงวันหยุดทั้งหมดในฐานข้อมูล (ย้อนหลัง 5 ปี)
const allHolidays = getHolidays();
console.log(`จำนวนวันหยุดทั้งหมด: ${allHolidays.length} วัน`);

// ดึงวันหยุดเฉพาะปี 2026
const holidays2026 = getHolidays(2026);

// ดึงวันหยุดเฉพาะปี 2026 เดือนมกราคม (1)
const holidaysJan2026 = getHolidays(2026, 1);
console.log(holidaysJan2026);
/*
Output:
[
  {
    HolidayWeekDay: 'Thursday',
    HolidayWeekDayThai: 'วันพฤหัสบดี',
    Date: '2026-01-01',
    DateThai: '01/01/2569',
    HolidayDescription: 'New Year’s Day',
    HolidayDescriptionThai: 'วันขึ้นปีใหม่'
  },
  ...
]
*/
```

### 3. ค้นหาวันหยุดครั้งถัดไป (`getNextHoliday`)

หาวันหยุดถัดไปนับตั้งแต่วันที่กำหนด (หากไม่กำหนด จะนับจากเวลาปัจจุบัน)

```typescript
import { getNextHoliday } from '@krizad/thai-financial-holiday-helper';

// ค้นหาวันหยุดถัดไปนับจากวันที่ 31 ธันวาคม 2025
const next = getNextHoliday('2025-12-31');
if (next) {
  console.log(`วันหยุดถัดไปคือ: ${next.HolidayDescriptionThai} (${next.Date})`);
  // Output: วันหยุดถัดไปคือ: วันขึ้นปีใหม่ (2026-01-01)
}
```

### 4. ค้นหาวันหยุดในช่วงเวลาที่กำหนด (`getHolidaysInRange`)

ดึงรายการวันหยุดระหว่างช่วงวันที่เริ่มต้นและสิ้นสุด (แบบครอบคลุม/Inclusive)

```typescript
import { getHolidaysInRange } from '@krizad/thai-financial-holiday-helper';

// ดึงวันหยุดในช่วงเทศกาลปีใหม่ 2026
const holidays = getHolidaysInRange('2026-01-01', '2026-01-05');
console.log(holidays.map(h => `${h.Date}: ${h.HolidayDescriptionThai}`));
/*
Output:
[
  '2026-01-01: วันขึ้นปีใหม่',
  '2026-01-02: วันหยุดทำการเพิ่มเป็นกรณีพิเศษ'
]
*/
```

### 5. ดึงข้อมูลรายละเอียดของวันหยุด (`getHoliday`)

ค้นหารายละเอียดวันหยุดของวันที่กำหนด (ส่งกลับเป็น Object ข้อมูลวันหยุด หรือ `null` หากไม่ใช่วันหยุด)

```typescript
import { getHoliday } from '@krizad/thai-financial-holiday-helper';

const holiday = getHoliday('2026-01-01');
if (holiday) {
  console.log(holiday.HolidayDescriptionThai); // "วันขึ้นปีใหม่"
  console.log(holiday.HolidayDescription); // "New Year’s Day"
}
```

### 6. ตรวจสอบและคำนวณวันทำการ (`Business Days`)

ฟังก์ชันช่วยคำนวณและตรวจสอบวันทำการสถาบันการเงิน (ข้ามเสาร์-อาทิตย์ และวันหยุด ธปท.)

```typescript
import { isBusinessDay, addBusinessDays, getBusinessDaysInRange } from '@krizad/thai-financial-holiday-helper';

// 6.1 ตรวจสอบวันทำการปกติ (isBusinessDay)
console.log(isBusinessDay('2026-01-01')); // false (วันหยุดขึ้นปีใหม่)
console.log(isBusinessDay('2026-01-03')); // false (วันเสาร์ - วันหยุดสุดสัปดาห์)
console.log(isBusinessDay('2026-01-05')); // true (วันจันทร์ - วันทำงานปกติ)

// 6.2 บวก/ลบวันทำการข้ามวันหยุดและเสาร์-อาทิตย์ (addBusinessDays)
// เช่น วันพุธที่ 2025-12-31 + 1 วันทำการ
// จะข้ามวันที่ 1-2 ม.ค. (วันหยุดปีใหม่) และ 3-4 ม.ค. (เสาร์-อาทิตย์) ไปสิ้นสุดที่วันจันทร์ที่ 5 ม.ค. 2026
const nextBusinessDay = addBusinessDays('2025-12-31', 1);
console.log(nextBusinessDay); // Date Object (2026-01-05)

// 6.3 ดึงรายการวันทำการทั้งหมดในช่วงเวลา (getBusinessDaysInRange)
// ดึงรายการวันทำการระหว่าง 1 ม.ค. ถึง 6 ม.ค. 2026 (จะได้แค่วันจันทร์ที่ 5 และอังคารที่ 6)
const businessDays = getBusinessDaysInRange('2026-01-01', '2026-01-06');
console.log(businessDays.map(d => d.toISOString().split('T')[0])); 
// Output: [ '2026-01-05', '2026-01-06' ]
```

---

## 🛠️ TypeScript Support

ตัวอย่าง interface ที่แถมมากับตัวแพ็กเกจ:

```typescript
export interface BOTHoliday {
  HolidayWeekDay: string;
  HolidayWeekDayThai: string;
  Date: string; // Format: "YYYY-MM-DD"
  DateThai: string; // Format: "DD/MM/YYYY" (ปี พ.ศ.)
  HolidayDescription: string;
  HolidayDescriptionThai: string;
}

export type DateInput = string | Date | number;
```

---

## ⚙️ ระบบอัปเดตข้อมูลอัตโนมัติ (Automated Data Sync)

แพ็กเกจนี้ถูกตั้งค่า GitHub Actions ไว้อัปเดตข้อมูลอัตโนมัติในวันที่ 1 ของทุกเดือน 

---

## 📄 ใบอนุญาต (License)

โปรเจกต์นี้เผยแพร่ภายใต้ใบอนุญาต [MIT License](LICENSE)
