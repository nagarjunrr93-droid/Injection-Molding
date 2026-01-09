
export type Shape = 'ROUND' | 'TUBE' | 'SQUARE' | 'HEXAGONAL' | 'RECTANGLE';

export interface Material {
  name: string;
  tonnageRequiredSqInch: number;
  materialType: string;
  clampingPressureMpa: number;
  densityGcm3: number;
  ejectTempC: number;
  meltingTempC: number;
  moldTempC: number;
  thermalDiffusivityMm2s: number;
  co2FactorKgPerKg: number; // kg CO2e per kg of raw material produced
}

export interface Machine {
  tons: number;
  dryCycleSec: number;
  injRateMm3s: number;
}

export interface CalculationResults {
  areaPerCavityCm2: number;
  totalProjectedAreaCm2: number;
  requiredTonnage: number;
  selectedMachineTons: number | null;
  dryCycleSec: number | null;
  injRateCm3s: number | null;
  shotVolumeCm3: number;
  injTimeSec: number;
  coolTimeSec: number;
  ejectionBlockSec: number;
  insertLoadingSec: number;
  totalCycleTimeSec: number;
  // CO2 specific results
  materialCo2Kg: number;
  processingCo2Kg: number;
  totalCo2Kg: number;
  energyConsumptionKwh: number;
}
