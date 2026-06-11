import deltaE from 'delta-e';

export interface Rgba {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
  a: number; // 0-1
}

export interface Lab {
  L: number;
  A: number;
  B: number;
}

const CSS_COLOR_RE = /^rgba?\(\s*(\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)(?:[\s,/]+([\d.]+))?\s*\)$/i;

export function parseCssColor(str: string): Rgba {
  const m = str.trim().match(CSS_COLOR_RE);
  if (!m) {
    if (str.trim() === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
    throw new Error(`parseCssColor: 지원하지 않는 형식 "${str}"`);
  }
  return {
    r: Number(m[1]),
    g: Number(m[2]),
    b: Number(m[3]),
    a: m[4] === undefined ? 1 : Number(m[4]),
  };
}

export function flattenOnWhite(c: Rgba): { r: number; g: number; b: number } {
  if (c.a >= 1) return { r: c.r, g: c.g, b: c.b };
  const a = c.a;
  return {
    r: Math.round(c.r * a + 255 * (1 - a)),
    g: Math.round(c.g * a + 255 * (1 - a)),
    b: Math.round(c.b * a + 255 * (1 - a)),
  };
}

// sRGB(0-255) → linear → XYZ → Lab(D65)
export function rgbToLab(rgb: { r: number; g: number; b: number }): Lab {
  const srgb = [rgb.r, rgb.g, rgb.b].map((v) => v / 255);
  const linear = srgb.map((v) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  const [R, G, B] = linear;

  // sRGB D65 → XYZ
  const X = R * 0.4124564 + G * 0.3575761 + B * 0.1804375;
  const Y = R * 0.2126729 + G * 0.7151522 + B * 0.072175;
  const Z = R * 0.0193339 + G * 0.119192 + B * 0.9503041;

  // D65 reference white
  const Xn = 0.95047;
  const Yn = 1.0;
  const Zn = 1.08883;

  const f = (t: number): number =>
    t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27) * t / 116 + 16 / 116;

  const fx = f(X / Xn);
  const fy = f(Y / Yn);
  const fz = f(Z / Zn);

  return {
    L: 116 * fy - 16,
    A: 500 * (fx - fy),
    B: 200 * (fy - fz),
  };
}

export function deltaE2000(lab1: Lab, lab2: Lab): number {
  return deltaE.getDeltaE00(lab1, lab2);
}

// 비교 편의 함수: Rgba(alpha 포함) → 흰 배경 합성 → Lab
export function rgbaToLab(c: Rgba): Lab {
  return rgbToLab(flattenOnWhite(c));
}

export function formatRgba(c: Rgba): string {
  if (c.a >= 1) return `rgb(${c.r},${c.g},${c.b})`;
  return `rgba(${c.r},${c.g},${c.b},${c.a.toFixed(2)})`;
}

export function isTransparent(c: Rgba): boolean {
  return c.a <= 0.001;
}
