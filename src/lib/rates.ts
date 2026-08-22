import { DailyRates, MetalType, Product } from './types';
import { GRAMS_PER_TOLA, LAL_PER_TOLA, AANA_PER_TOLA } from './constants';

export function getPricePerGram(metalType: MetalType, rates: DailyRates): number {
  switch (metalType) {
    case 'gold_24k':
      return rates.gold24kPerTola / GRAMS_PER_TOLA;
    case 'gold_22k':
      return rates.gold22kPerTola / GRAMS_PER_TOLA;
    case 'gold_18k':
      return rates.gold18kPerGram;
    case 'silver_999':
      return rates.silverPerGram || rates.silverPerTola / GRAMS_PER_TOLA;
    case 'silver_925':
      return (rates.silverPerGram || rates.silverPerTola / GRAMS_PER_TOLA) * 0.925;
    case 'diamond':
      return rates.gold18kPerGram; // Base gold 18k
    default:
      return rates.gold24kPerTola / GRAMS_PER_TOLA;
  }
}

export function getPricePerTola(metalType: MetalType, rates: DailyRates): number {
  switch (metalType) {
    case 'gold_24k':
      return rates.gold24kPerTola;
    case 'gold_22k':
      return rates.gold22kPerTola;
    case 'gold_18k':
      return rates.gold18kPerGram * GRAMS_PER_TOLA;
    case 'silver_999':
      return rates.silverPerTola;
    case 'silver_925':
      return rates.silverPerTola * 0.925;
    case 'diamond':
      return rates.gold18kPerGram * GRAMS_PER_TOLA;
    default:
      return rates.gold24kPerTola;
  }
}

export interface CalculationResult {
  weightGrams: number;
  weightTola: number;
  pricePerGram: number;
  pricePerTola: number;
  metalCost: number;
  makingCharge: number;
  wastageCost: number;
  estimatedTotal: number;
  metalLabel: string;
}

export function calculateJewelryPrice({
  metalType,
  weight,
  unit,
  makingChargePercentage = 10,
  makingChargeFlat = 0,
  wastagePercentage = 0,
  rates,
}: {
  metalType: MetalType;
  weight: number;
  unit: 'grams' | 'tola' | 'lal' | 'aana';
  makingChargePercentage?: number;
  makingChargeFlat?: number;
  wastagePercentage?: number;
  rates: DailyRates;
}): CalculationResult {
  let weightGrams = weight;
  if (unit === 'tola') {
    weightGrams = weight * GRAMS_PER_TOLA;
  } else if (unit === 'lal') {
    weightGrams = (weight / LAL_PER_TOLA) * GRAMS_PER_TOLA;
  } else if (unit === 'aana') {
    weightGrams = (weight / AANA_PER_TOLA) * GRAMS_PER_TOLA;
  }

  const weightTola = weightGrams / GRAMS_PER_TOLA;
  const pricePerGram = getPricePerGram(metalType, rates);
  const pricePerTola = getPricePerTola(metalType, rates);

  const metalCost = weightGrams * pricePerGram;
  
  let makingCharge = 0;
  if (makingChargeFlat > 0) {
    makingCharge = makingChargeFlat;
  } else {
    makingCharge = metalCost * (makingChargePercentage / 100);
  }

  const wastageCost = metalCost * (wastagePercentage / 100);
  const estimatedTotal = metalCost + makingCharge + wastageCost;

  const labels: Record<MetalType, string> = {
    gold_24k: '24K Fine Gold (छापावाल सुन)',
    gold_22k: '22K Tejabi Gold (तेजाबी सुन)',
    gold_18k: '18K Hallmarked Gold (१८ क्यारेट)',
    silver_999: '999 Fine Silver (शुद्ध चाँदी)',
    silver_925: '925 Sterling Silver (स्टर्लिंग चाँदी)',
    diamond: '18K Gold + Solitaire Diamond',
  };

  return {
    weightGrams,
    weightTola,
    pricePerGram,
    pricePerTola,
    metalCost,
    makingCharge,
    wastageCost,
    estimatedTotal,
    metalLabel: labels[metalType] || 'Gold',
  };
}

export function calculateProductPrice(product: Product, rates: DailyRates): {
  metalCost: number;
  makingCharge: number;
  totalPrice: number;
} {
  const pricePerGram = getPricePerGram(product.metalType, rates);
  const metalCost = product.weightGrams * pricePerGram;
  const makingCharge = product.makingChargeFlatNpr
    ? product.makingChargeFlatNpr
    : metalCost * (product.makingChargePercentage / 100);

  return {
    metalCost,
    makingCharge,
    totalPrice: Math.round(metalCost + makingCharge),
  };
}

export function formatNPR(amount: number): string {
  if (isNaN(amount) || amount === undefined || amount === null) return 'NPR 0';
  const rounded = Math.round(amount);
  return 'NPR ' + rounded.toLocaleString('en-IN');
}

export function formatWeight(grams: number): string {
  const tola = (grams / GRAMS_PER_TOLA).toFixed(2);
  return `${grams.toFixed(2)}g (${tola} Tola)`;
}
