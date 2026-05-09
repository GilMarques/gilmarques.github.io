export type OpenWeatherSys = {
  sunrise: number;
  sunset: number;
};

export type OpenWeatherDaySliderInput = {
  dt: number;
  sys: OpenWeatherSys;
};

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

export function daySliderPercentFromOpenWeather(
  data: OpenWeatherDaySliderInput
): number {
  const { dt, sys } = data;
  const sunrise = sys.sunrise;
  const sunset = sys.sunset;
  if (
    typeof dt !== "number" ||
    typeof sunrise !== "number" ||
    typeof sunset !== "number" ||
    sunset <= sunrise
  ) {
    return 50;
  }

  const dayLen = Math.max(1, sunset - sunrise);
  const nextSunrise = sunrise + 86_400;
  const prevSunset = sunset - 86_400;
  const nightAfterLen = Math.max(3_600, nextSunrise - sunset);
  const nightBeforeLen = Math.max(3_600, sunrise - prevSunset);

  if (dt >= sunrise && dt <= sunset) {
    const t = (dt - sunrise) / dayLen;
    return Math.round(clamp(t * 75, 0, 75));
  }

  if (dt > sunset) {
    const t = (dt - sunset) / nightAfterLen;
    return Math.round(clamp(75 + t * 25, 75, 100));
  }

  const t = (dt - prevSunset) / nightBeforeLen;
  return Math.round(clamp(100 * (1 - t), 0, 100));
}
