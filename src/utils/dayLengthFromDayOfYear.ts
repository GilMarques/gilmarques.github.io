const DAYS_IN_YEAR = 365;
const LONGEST_DAY_OF_YEAR = 172; // Around June 21

type DayLengthOptions = {
  minHours?: number;
  maxHours?: number;
  longestDayOfYear?: number;
};

export type SeasonalDayLength = {
  dayOfYear: number;
  hours: number;
  normalized: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function dayLengthFromDayOfYear(
  dayOfYear: number,
  {
    minHours = 9,
    maxHours = 15,
    longestDayOfYear = LONGEST_DAY_OF_YEAR,
  }: DayLengthOptions = {}
): SeasonalDayLength {
  const safeDay = clamp(dayOfYear, 1, DAYS_IN_YEAR);
  const safeMin = Math.min(minHours, maxHours);
  const safeMax = Math.max(minHours, maxHours);
  const range = Math.max(0.1, safeMax - safeMin);
  const mid = (safeMax + safeMin) / 2;
  const amplitude = range / 2;
  const radians =
    ((safeDay - longestDayOfYear) / DAYS_IN_YEAR) * (Math.PI * 2);
  const hours = clamp(mid + amplitude * Math.cos(radians), safeMin, safeMax);
  const normalized = clamp((hours - safeMin) / range, 0, 1);

  return {
    dayOfYear: safeDay,
    hours,
    normalized,
  };
}

export function dayLengthFromDate(
  date: Date,
  options?: DayLengthOptions
): SeasonalDayLength {
  return dayLengthFromDayOfYear(getDayOfYear(date), options);
}
