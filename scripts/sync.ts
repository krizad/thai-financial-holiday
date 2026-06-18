import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { BOTResponse, BOTHoliday } from '../src/types';

dotenv.config();

const API_URL = 'https://gateway.api.bot.or.th/financial-institutions-holidays/';
const AUTH_HEADER = process.env.BOT_API_AUTH;

if (!AUTH_HEADER) {
  console.error('Error: BOT_API_AUTH environment variable is not set.');
  process.exit(1);
}

async function fetchHolidaysForYear(year: number): Promise<BOTHoliday[]> {
  try {
    console.log(`Fetching holidays for year ${year}...`);
    const response = await axios.get<BOTResponse>(API_URL, {
      params: { year },
      headers: {
        'Accept': 'application/json',
        'Authorization': AUTH_HEADER,
      },
    });

    if (response.data?.result?.data) {
      return response.data.result.data;
    }
    console.warn(`No data returned for year ${year}`);
    return [];
  } catch (error: any) {
    console.error(`Failed to fetch holidays for year ${year}:`, error.message);
    return [];
  }
}

async function sync() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i); // e.g. 2022 to 2026

  let allHolidays: BOTHoliday[] = [];

  for (const year of years) {
    const holidays = await fetchHolidaysForYear(year);
    allHolidays = allHolidays.concat(holidays);
    // Add a small delay between requests to be polite to the API
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Deduplicate and sort by date ascending
  const uniqueHolidays = Array.from(
    new Map(allHolidays.map((item) => [item.Date, item])).values()
  ).sort((a, b) => a.Date.localeCompare(b.Date));

  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const filePath = path.join(dataDir, 'holidays.json');
  fs.writeFileSync(filePath, JSON.stringify(uniqueHolidays, null, 2), 'utf-8');
  console.log(`Successfully synced ${uniqueHolidays.length} holidays to ${filePath}`);
}

sync();
