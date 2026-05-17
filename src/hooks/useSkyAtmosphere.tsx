import { createMemo } from "solid-js";
import {
  cloudDensityLevelFromOpenWeather,
  cloudDensityLevelFromWeather,
  cloudLayersForLevel,
  skyGreyStrength,
} from "../utils/cloudDensity";
import { skyGradientFromSliderPercent } from "../utils/skyGradient";
import type { WeatherType } from "./useWeather";

type UseSkyAtmosphereArgs = {
  daySliderPercent: () => number;
  weather: () => WeatherType;
  cloudsAll?: () => number | undefined;
  weatherConditionId?: () => number | undefined;
};

function useSkyAtmosphere({
  daySliderPercent,
  weather,
  cloudsAll,
  weatherConditionId,
}: UseSkyAtmosphereArgs) {
  const cloudLevel = createMemo(() => {
    const conditionId = weatherConditionId?.();
    if (typeof conditionId === "number") {
      return cloudDensityLevelFromOpenWeather({
        weatherId: conditionId,
        weatherType: weather(),
        cloudsAll: cloudsAll?.(),
      });
    }
    return cloudDensityLevelFromWeather(weather(), cloudsAll?.());
  });

  const skyGrey = createMemo(() => skyGreyStrength(cloudLevel()));

  const skyGradient = createMemo(() =>
    skyGradientFromSliderPercent(daySliderPercent(), skyGrey(), cloudLevel()),
  );

  const cloudLayers = createMemo(() => cloudLayersForLevel(cloudLevel()));

  return {
    cloudLevel,
    skyGradient,
    cloudLayers,
  };
}

export default useSkyAtmosphere;
export { CloudDensityLevel } from "../utils/cloudDensity";
