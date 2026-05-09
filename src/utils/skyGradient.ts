import { CloudDensityLevel } from "./cloudDensity";

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

const hexToRgb = (hex: string) => {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
};

const rgbToHex = (r: number, g: number, b: number) => {
  const b8 = (n: number) =>
    Math.round(clamp(n, 0, 255))
      .toString(16)
      .padStart(2, "0");
  return `#${b8(r)}${b8(g)}${b8(b)}`;
};

const lerpColor = (a: string, b: string, t: number) => {
  const u = clamp(t, 0, 1);
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex(
    A.r + (B.r - A.r) * u,
    A.g + (B.g - A.g) * u,
    A.b + (B.b - A.b) * u
  );
};

/** Colors at 0%, 50%, 80%, 100% — aligned to original `daytimes` gradients. */
type Palette = readonly [string, string, string, string];

const lerpPalette = (p0: Palette, p1: Palette, t: number): Palette => [
  lerpColor(p0[0], p1[0], t),
  lerpColor(p0[1], p1[1], t),
  lerpColor(p0[2], p1[2], t),
  lerpColor(p0[3], p1[3], t),
];

const paletteToGradient = (p: Palette) =>
  `linear-gradient(to bottom, ${p[0]} 0%, ${p[1]} 50%, ${p[2]} 80%, ${p[3]} 100%)`;

const SKY_GREY_TARGET = "#8a92a3";

const SKY_GREY_TARGET_CLOUDY_NIGHT = "#1a222e";

const greyOutPalette = (
  p: Palette,
  greyStrength: number,
  greyTarget = SKY_GREY_TARGET
): Palette => {
  const u = clamp(greyStrength, 0, 1);
  if (u <= 0) return p;
  return [
    lerpColor(p[0], greyTarget, u),
    lerpColor(p[1], greyTarget, u),
    lerpColor(p[2], greyTarget, u),
    lerpColor(p[3], greyTarget, u),
  ];
};

function greyTargetForAtmosphere(
  rawPercent: number,
  cloudLevel: CloudDensityLevel
): string {
  const u = clamp(rawPercent, 0, 100) / 100;
  const nightProgress = clamp((u - 2 / 3) / (1 / 3), 0, 1);
  const heavyBoost = cloudLevel === CloudDensityLevel.HeavyRain ? 0.15 : 0;
  const t = clamp(nightProgress + heavyBoost, 0, 1);
  return lerpColor(SKY_GREY_TARGET, SKY_GREY_TARGET_CLOUDY_NIGHT, t);
}

const dayMid50 = lerpColor("#94dfff", "#b7eaff", 50 / 80);
const nightMid50 = lerpColor("#000000", "#00001f", 50 / 80);

const sunrisePalette: Palette = ["#ffc19f", "#ffc19f", "#f0bbc9", "#ffffff"];
const dayPalette: Palette = ["#94dfff", dayMid50, "#b7eaff", "#ffffff"];
const sunsetPalette: Palette = ["#FD5E53", "#FD5E53", "#FFD580", "#ffffff"];
const nightPalette: Palette = ["#000000", nightMid50, "#00001f", "#000837"];

const moonlitNightHint: Palette = ["#141d30", "#1c273c", "#243048", "#2c3a54"];
const clearNightPalette = lerpPalette(nightPalette, moonlitNightHint, 0.52);

export function skyGradientFromSliderPercent(
  rawPercent: number,
  greyStrength = 0,
  cloudLevel?: CloudDensityLevel
): string {
  const u = clamp(rawPercent, 0, 100) / 100;
  let palette: Palette;
  if (u <= 1 / 3) {
    palette = lerpPalette(sunrisePalette, dayPalette, u * 3);
  } else if (u <= 2 / 3) {
    palette = lerpPalette(dayPalette, sunsetPalette, (u - 1 / 3) * 3);
  } else {
    const nightTarget =
      cloudLevel === CloudDensityLevel.Clear ? clearNightPalette : nightPalette;
    palette = lerpPalette(sunsetPalette, nightTarget, (u - 2 / 3) * 3);
  }

  const greyTarget =
    greyStrength > 0 &&
    cloudLevel !== undefined &&
    cloudLevel !== CloudDensityLevel.Clear
      ? greyTargetForAtmosphere(rawPercent, cloudLevel)
      : SKY_GREY_TARGET;

  palette = greyOutPalette(palette, greyStrength, greyTarget);
  return paletteToGradient(palette);
}
