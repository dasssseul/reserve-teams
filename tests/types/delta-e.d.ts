declare module 'delta-e' {
  export interface LabColor {
    L: number;
    A: number;
    B: number;
  }

  export interface Weights {
    lightness?: number;
    chroma?: number;
    hue?: number;
  }

  interface DeltaE {
    getDeltaE76(lab1: LabColor, lab2: LabColor): number;
    getDeltaE94(lab1: LabColor, lab2: LabColor, weights?: Weights): number;
    getDeltaE00(lab1: LabColor, lab2: LabColor, weights?: Weights): number;
  }

  const instance: DeltaE;
  export default instance;
}
