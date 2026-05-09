import { useMemo } from "react";
import {
  cloudDensityLevelFromOpenWeather,
  cloudDensityLevelFromWeather,
  cloudLayersForLevel,
  skyGreyStrength,
} from "../utils/cloudDensity";
import { skyGradientFromSliderPercent } from "../utils/skyGradient";
import type { WeatherType } from "./useWeather";

type UseSkyAtmosphereArgs = {
  daySliderPercent: number;
  weather: WeatherType;
  /** OpenWeather `clouds.all` (0–100); improves sky when main condition is Clear. */
  cloudsAll?: number;
  /** OpenWeather condition `id`; when set, cloud tier uses finer rules than `weather` alone. */
  weatherConditionId?: number;
};

function useSkyAtmosphere({
  daySliderPercent,
  weather,
  cloudsAll,
  weatherConditionId,
}: UseSkyAtmosphereArgs) {
  const cloudLevel = useMemo(() => {
    if (typeof weatherConditionId === "number") {
      return cloudDensityLevelFromOpenWeather({
        weatherId: weatherConditionId,
        weatherType: weather,
        cloudsAll,
      });
    }
    return cloudDensityLevelFromWeather(weather, cloudsAll);
  }, [weather, cloudsAll, weatherConditionId]);

  const skyGrey = useMemo(() => skyGreyStrength(cloudLevel), [cloudLevel]);

  const skyGradient = useMemo(
    () =>
      skyGradientFromSliderPercent(daySliderPercent, skyGrey, cloudLevel),
    [daySliderPercent, skyGrey, cloudLevel]
  );

  const cloudLayers = useMemo(
    () => cloudLayersForLevel(cloudLevel),
    [cloudLevel]
  );

  return {
    cloudLevel,
    skyGradient,
    cloudLayers,
  };
}

export default useSkyAtmosphere;
export { CloudDensityLevel } from "../utils/cloudDensity";
