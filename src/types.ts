export interface BOTHoliday {
  HolidayWeekDay: string;
  HolidayWeekDayThai: string;
  Date: string; // Format: "YYYY-MM-DD"
  DateThai: string; // Format: "DD/MM/YYYY" (Buddhist Era)
  HolidayDescription: string;
  HolidayDescriptionThai: string;
}

export interface BOTResponse {
  result: {
    api: string;
    timestamp: string;
    data: BOTHoliday[];
  };
}
