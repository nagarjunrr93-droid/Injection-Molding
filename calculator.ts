
import { Material, Machine, Shape, CalculationResults } from './types';
// Fix: MACHINES is exported from './data', not './types'
import { MACHINES } from './data';

export function calculateAreaMm2(shape: Shape, dimensions: Record<string, number>): number {
  switch (shape) {
    case 'ROUND':
      const r = (dimensions.od || 0) / 2.0;
      return Math.PI * Math.pow(r, 2);
    case 'TUBE':
      const ro = (dimensions.od || 0) / 2.0;
      const ri = (dimensions.id || 0) / 2.0;
      return Math.PI * (Math.pow(ro, 2) - Math.pow(ri, 2));
    case 'RECTANGLE':
      return (dimensions.length || 0) * (dimensions.width || 0);
    case 'SQUARE':
      return Math.pow(dimensions.side || 0, 2);
    case 'HEXAGONAL':
      const af = dimensions.af || 0;
      const s = af / Math.sqrt(3);
      return (3 * Math.sqrt(3) / 2) * Math.pow(s, 2);
    default:
      return 0;
  }
}

export function getMachineParams(requiredTon: number) {
  if (requiredTon <= 0) return null;
  
  // Find all machines that can handle the tonnage (tons >= requiredTon)
  const suitableMachines = MACHINES.filter(m => m.tons >= requiredTon);
  
  let bestMatch: Machine;
  if (suitableMachines.length > 0) {
    // Pick the smallest machine that fits (one level up logic)
    bestMatch = suitableMachines.reduce((prev, curr) => curr.tons < prev.tons ? curr : prev);
  } else {
    // If no machine is big enough, pick the largest available
    bestMatch = MACHINES.reduce((prev, curr) => curr.tons > prev.tons ? curr : prev);
  }

  return {
    selectedTons: bestMatch.tons,
    dryCycleSec: bestMatch.dryCycleSec,
    injRateCm3s: bestMatch.injRateMm3s / 1000.0,
  };
}

export function computeAll(
  material: Material,
  shape: Shape,
  dimensions: Record<string, number>,
  wallThicknessMm: number,
  partWeightG: number,
  runnerPct: number,
  cavities: number,
  inserts: number,
  gridEmissionFactor: number = 0.475 // kg CO2 / kWh
): CalculationResults {
  const areaMm2 = calculateAreaMm2(shape, dimensions);
  const areaPerCavityCm2 = areaMm2 / 100.0;
  const totalProjectedAreaMm2 = areaMm2 * cavities;
  const totalProjectedAreaCm2 = totalProjectedAreaMm2 / 100.0;

  const safetyFactor = 1.2;
  const requiredTonnage = (totalProjectedAreaMm2 * material.clampingPressureMpa * safetyFactor) / 9806.65;

  const machine = getMachineParams(requiredTonnage);

  const runnerWeightG = (runnerPct / 100.0) * partWeightG;
  const shotWeightG = (partWeightG + runnerWeightG) * cavities;
  const shotVolumeCm3 = material.densityGcm3 > 0 ? shotWeightG / material.densityGcm3 : 0;

  const injTimeSec = (machine && machine.injRateCm3s > 0) ? shotVolumeCm3 / machine.injRateCm3s : 0;

  let coolTimeSec = 0;
  const alphaM2s = material.thermalDiffusivityMm2s * 1e-6;
  if (wallThicknessMm > 0 && alphaM2s > 0) {
    const tm = wallThicknessMm / 1000.0;
    const num = material.meltingTempC - material.moldTempC;
    const den = material.ejectTempC - material.moldTempC;
    if (num > 0 && den > 0) {
      const ratio = num / den;
      if (ratio > 1) {
        coolTimeSec = (Math.pow(tm, 2) / (Math.pow(Math.PI, 2) * alphaM2s)) * Math.log(ratio);
      }
    }
  }

  let ejectionBlockSec = 0;
  if (requiredTonnage > 0) {
    if (requiredTonnage <= 300) ejectionBlockSec = 15;
    else if (requiredTonnage <= 900) ejectionBlockSec = 30;
    else ejectionBlockSec = 45;
  }

  let insertLoadingSec = 0;
  if (requiredTonnage > 0) {
    let secPerInsert = 3;
    if (requiredTonnage > 600) secPerInsert = 7;
    else if (requiredTonnage > 250) secPerInsert = 5;
    insertLoadingSec = inserts * secPerInsert;
  }

  const totalCycleTimeSec = (machine ? machine.dryCycleSec : 0) + injTimeSec + coolTimeSec + ejectionBlockSec + insertLoadingSec;

  // CO2 Calculations
  const materialCo2Kg = (shotWeightG / 1000.0) * material.co2FactorKgPerKg;

  // Processing CO2
  const secEfficiency = 0.6; 
  const energyConsumptionKwh = (shotWeightG / 1000.0) * secEfficiency;
  const processingCo2Kg = energyConsumptionKwh * gridEmissionFactor;

  const totalCo2Kg = materialCo2Kg + processingCo2Kg;

  return {
    areaPerCavityCm2,
    totalProjectedAreaCm2,
    requiredTonnage,
    selectedMachineTons: machine?.selectedTons || null,
    dryCycleSec: machine?.dryCycleSec || null,
    injRateCm3s: machine?.injRateCm3s || null,
    shotVolumeCm3,
    injTimeSec,
    coolTimeSec,
    ejectionBlockSec,
    insertLoadingSec,
    totalCycleTimeSec,
    materialCo2Kg,
    processingCo2Kg,
    totalCo2Kg,
    energyConsumptionKwh
  };
}
