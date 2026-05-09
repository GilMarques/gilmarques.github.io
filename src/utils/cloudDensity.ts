import { WeatherType } from "../hooks/useWeather";

export enum CloudDensityLevel {
  Clear = "clear",
  LightRain = "lightRain",
  HeavyRain = "heavyRain",
}

export function skyGreyStrength(level: CloudDensityLevel): number {
  switch (level) {
    case CloudDensityLevel.Clear:
      return 0;
    case CloudDensityLevel.LightRain:
      return 0.42;
    case CloudDensityLevel.HeavyRain:
      return 0.78;
    default:
      return 0;
  }
}

export function cloudDensityLevelFromWeather(
  weather: WeatherType,
  cloudsAll?: number
): CloudDensityLevel {
  if (weather === WeatherType.Rain || weather === WeatherType.Snow) {
    return CloudDensityLevel.HeavyRain;
  }
  if (weather === WeatherType.Drizzle || weather === WeatherType.Clouds) {
    return CloudDensityLevel.LightRain;
  }
  if (typeof cloudsAll === "number" && cloudsAll >= 65) {
    return CloudDensityLevel.LightRain;
  }
  return CloudDensityLevel.Clear;
}

export function cloudDensityLevelFromOpenWeather(args: {
  weatherId: number;
  weatherType: WeatherType;
  cloudsAll?: number;
}): CloudDensityLevel {
  const { weatherId, weatherType, cloudsAll } = args;

  if (weatherType === WeatherType.Snow || weatherType === WeatherType.Rain) {
    return CloudDensityLevel.HeavyRain;
  }
  if (weatherType === WeatherType.Drizzle) {
    return CloudDensityLevel.LightRain;
  }

  if (weatherId === 804) return CloudDensityLevel.HeavyRain;
  if (weatherId === 803) return CloudDensityLevel.LightRain;
  if (weatherId === 801 || weatherId === 802) return CloudDensityLevel.Clear;

  if (typeof cloudsAll === "number") {
    if (cloudsAll >= 85) return CloudDensityLevel.HeavyRain;
    if (cloudsAll >= 50) return CloudDensityLevel.LightRain;
  }

  return cloudDensityLevelFromWeather(weatherType, cloudsAll);
}

export type CloudLayerConfig = {
  opacityPct: number;
  scale: number;
  animationDuration: number;
  delay: number;
};

export function cloudLayersForLevel(
  level: CloudDensityLevel
): CloudLayerConfig[] {
  switch (level) {
    case CloudDensityLevel.Clear:
      return [
        { opacityPct: 30, scale: 0.1, animationDuration: 15, delay: 10 },
        { opacityPct: 100, scale: 0.5, animationDuration: 10, delay: 4 },
        { opacityPct: 100, scale: 0.6, animationDuration: 8, delay: 0 },
      ];
    case CloudDensityLevel.LightRain:
      return [
        { opacityPct: 45, scale: 0.12, animationDuration: 14, delay: 11 },
        { opacityPct: 100, scale: 0.52, animationDuration: 9.5, delay: 5 },
        { opacityPct: 100, scale: 0.62, animationDuration: 7.5, delay: 1 },
        { opacityPct: 85, scale: 0.38, animationDuration: 11, delay: 7 },
      ];
    case CloudDensityLevel.HeavyRain:
      return [
        { opacityPct: 55, scale: 0.14, animationDuration: 13, delay: 12 },
        { opacityPct: 100, scale: 0.55, animationDuration: 9, delay: 5 },
        { opacityPct: 100, scale: 0.68, animationDuration: 7, delay: 0 },
        { opacityPct: 90, scale: 0.42, animationDuration: 10, delay: 8 },
        { opacityPct: 75, scale: 0.32, animationDuration: 16, delay: 3 },
      ];
    default:
      return cloudLayersForLevel(CloudDensityLevel.Clear);
  }
}
