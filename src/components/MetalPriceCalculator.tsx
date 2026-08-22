'use client';

import React, { useState, useEffect } from 'react';
import { DailyRates, MetalType } from '@/lib/types';
import { DEFAULT_RATES, GRAMS_PER_TOLA } from '@/lib/constants';
import { calculateJewelryPrice, formatNPR, formatWeight } from '@/lib/rates';
import { generateCalculatorQuoteInquiry } from '@/lib/whatsapp';
import {
  Calculator,
  Sparkles,
  TrendingUp,
  MessageCircle,
  RotateCcw,
  Info,
  CheckCircle2,
  Scale,
} from 'lucide-react';

interface Props {
  initialRates?: DailyRates;
  compact?: boolean;
}

export default function MetalPriceCalculator({ initialRates, compact = false }: Props) {
  const [rates, setRates] = useState<DailyRates>(initialRates || DEFAULT_RATES);
  const [metalType, setMetalType] = useState<MetalType>('gold_24k');
  const [unit, setUnit] = useState<'tola' | 'grams' | 'lal' | 'aana'>('tola');
  const [weight, setWeight] = useState<number>(1);
  const [makingChargeType, setMakingChargeType] = useState<'percent' | 'flat'>('percent');
  const [makingChargePercent, setMakingChargePercent] = useState<number>(10);
  const [makingChargeFlat, setMakingChargeFlat] = useState<number>(0);
  const [wastagePercent, setWastagePercent] = useState<number>(0);

  useEffect(() => {
    if (!initialRates) {
      fetch('/api/rates')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.rates) {
            setRates(data.rates);
          }
        })
        .catch(() => {});
    }
  }, [initialRates]);

  const calculation = calculateJewelryPrice({
    metalType,
    weight: Number(weight) || 0,
    unit,
    makingChargePercentage: makingChargeType === 'percent' ? makingChargePercent : 0,
    makingChargeFlat: makingChargeType === 'flat' ? makingChargeFlat : 0,
    wastagePercentage: wastagePercent,
    rates,
  });

  const handleWhatsAppShare = () => {
    const unitText = `${weight} ${unit}`;
    const weightInfo = `${unitText} (~${calculation.weightGrams.toFixed(2)}g / ${(calculation.weightGrams / GRAMS_PER_TOLA).toFixed(2)} Tola)`;
    const makingText =
      makingChargeType === 'percent'
        ? `${makingChargePercent}% (${formatNPR(calculation.makingCharge)})`
        : formatNPR(makingChargeFlat);

    const url = generateCalculatorQuoteInquiry({
      metalLabel: calculation.metalLabel,
      weightText: weightInfo,
      makingChargeText: makingText,
      estimatedTotalText: formatNPR(calculation.estimatedTotal),
    });

    window.open(url, '_blank');
  };

  const handleReset = () => {
    setMetalType('gold_24k');
    setUnit('tola');
    setWeight(1);
    setMakingChargePercent(10);
    setMakingChargeFlat(0);
    setWastagePercent(0);
  };

  return (
    <div className={`bg-white rounded-3xl border-2 border-amber-300 shadow-lg overflow-hidden ${compact ? 'p-4 sm:p-6' : 'p-4 sm:p-8'}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-amber-200">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gold-gradient text-slate-950 shadow-md">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif-luxury">
              Live Metal Price Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Calculate exact jewellery estimates with today&apos;s live market rates in Nepal
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-amber-50 transition-colors border border-slate-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Live Reference Rate Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-6">
        <div className="p-3.5 rounded-2xl bg-white border border-amber-300 shadow-3xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">24K Fine Gold</span>
          <div className="text-sm sm:text-base font-extrabold text-amber-900 mt-0.5 font-serif-luxury">
            NPR {rates.gold24kPerTola.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-500">/tola</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-amber-300 shadow-3xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">22K Tejabi Gold</span>
          <div className="text-sm sm:text-base font-extrabold text-amber-900 mt-0.5 font-serif-luxury">
            NPR {rates.gold22kPerTola.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-500">/tola</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-amber-300 shadow-3xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">18K Hallmarked</span>
          <div className="text-sm sm:text-base font-extrabold text-amber-900 mt-0.5 font-serif-luxury">
            NPR {rates.gold18kPerGram.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-500">/g</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-3xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Fine Silver (999)</span>
          <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5 font-serif-luxury">
            NPR {rates.silverPerTola.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-500">/tola</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Inputs Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Metal Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
              1. Select Metal &amp; Purity
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'gold_24k', label: '24K Fine Gold', sub: 'छापावाल सुन (99.5%)' },
                { id: 'gold_22k', label: '22K Tejabi Gold', sub: 'तेजाबी सुन (91.6%)' },
                { id: 'gold_18k', label: '18K Gold', sub: '१८ क्यारेट (75%)' },
                { id: 'silver_999', label: '999 Fine Silver', sub: 'शुद्ध चाँदी' },
                { id: 'silver_925', label: '925 Sterling Silver', sub: 'चाँदीको गहना' },
                { id: 'diamond', label: 'Diamond Setting', sub: '18K + Natural Stone' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMetalType(m.id as MetalType)}
                  className={`p-3 rounded-2xl text-left border-2 transition-all ${
                    metalType === m.id
                      ? 'border-amber-400 bg-amber-50/50 shadow-xs animate-in fade-in-50'
                      : 'border-slate-200 bg-white hover:border-amber-300'
                  }`}
                >
                  <div className="text-xs font-extrabold text-slate-900">{m.label}</div>
                  <div className="text-[10px] text-slate-500 font-semibold mt-0.5">{m.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Unit & Weight Input - Mobile Optimized Layout */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800 shrink-0">
                2. Weight &amp; Unit
              </label>
              {/* Responsive Unit Switcher */}
              <div className="flex rounded-xl bg-slate-100 p-1 text-xs w-full sm:w-auto overflow-x-auto scrollbar-none">
                {(['tola', 'grams', 'lal', 'aana'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    className={`flex-1 sm:flex-none text-center px-2.5 sm:px-3.5 py-1.5 rounded-lg capitalize font-bold transition-all whitespace-nowrap ${
                      unit === u
                        ? 'bg-gold-gradient text-slate-950 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {u === 'tola' ? 'Tola' : u === 'grams' ? 'Grams' : u === 'lal' ? 'Lal' : 'Aana'}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={weight || ''}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                placeholder="Enter weight..."
                className="w-full text-base sm:text-lg font-extrabold text-slate-900 px-4 py-3.5 rounded-2xl border-2 border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white shadow-2xs"
              />
              <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400 uppercase">
                {unit}
              </span>
            </div>

            {/* Quick Weight Presets */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              <span className="text-[11px] text-slate-500 font-bold mr-1">Presets:</span>
              {unit === 'tola' ? (
                <>
                  {[0.5, 1, 1.5, 2, 3, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setWeight(val)}
                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-amber-50 hover:border-amber-300 text-amber-900 text-[11px] font-bold border border-slate-200 transition-colors shadow-3xs"
                    >
                      {val} Tola
                    </button>
                  ))}
                </>
              ) : (
                <>
                  {[5, 10, 11.66, 20, 50, 100].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setWeight(val)}
                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-amber-50 hover:border-amber-300 text-amber-900 text-[11px] font-bold border border-slate-200 transition-colors shadow-3xs"
                    >
                      {val}g
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Making Charges & Wastage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Making Charge */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-3xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Making Charge</span>
                <div className="flex text-[11px] bg-slate-100 rounded-lg p-0.5 font-bold">
                  <button
                    type="button"
                    onClick={() => setMakingChargeType('percent')}
                    className={`px-2.5 py-1 rounded-md transition-all ${makingChargeType === 'percent' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500'}`}
                  >
                    %
                  </button>
                  <button
                    type="button"
                    onClick={() => setMakingChargeType('flat')}
                    className={`px-2.5 py-1 rounded-md transition-all ${makingChargeType === 'flat' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500'}`}
                  >
                    NPR
                  </button>
                </div>
              </div>

              {makingChargeType === 'percent' ? (
                <div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="25"
                      step="0.5"
                      value={makingChargePercent}
                      onChange={(e) => setMakingChargePercent(parseFloat(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                    <span className="text-sm font-extrabold text-slate-900 w-12 text-right">
                      {makingChargePercent}%
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold mt-1">
                    Standard bridal / filigree making: 8% - 14%
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={makingChargeFlat || ''}
                    onChange={(e) => setMakingChargeFlat(parseFloat(e.target.value) || 0)}
                    placeholder="Fixed NPR..."
                    className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              )}
            </div>

            {/* Wastage */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-3xs">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                Wastage / Jhad (Optional)
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={wastagePercent}
                  onChange={(e) => setWastagePercent(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <span className="text-sm font-extrabold text-slate-900 w-12 text-right">
                  {wastagePercent}%
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-semibold mt-1">
                Melting/crafting buffer (0% - 2%)
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Summary Card - Pure White with Gold Accents */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 sm:p-7 rounded-3xl bg-white border-2 border-amber-300 shadow-md">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-amber-200">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-700" />
                Live Price Estimate
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-gold-gradient text-slate-950 font-bold shadow-2xs">
                Devdaha Rate
              </span>
            </div>

            {/* Total Estimated Price Display */}
            <div className="my-6">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Estimated Net Price</div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 font-serif-luxury tracking-tight mt-1">
                {formatNPR(calculation.estimatedTotal)}
              </div>
              <div className="text-xs text-slate-600 mt-1 flex items-center gap-1.5 font-medium">
                <Scale className="w-3.5 h-3.5 text-amber-700" />
                <span>Equivalent Weight:</span>
                <span className="font-bold text-amber-900">
                  {calculation.weightGrams.toFixed(2)}g ({calculation.weightTola.toFixed(2)} Tola)
                </span>
              </div>
            </div>

            {/* Calculation Breakdown Table */}
            <div className="space-y-2.5 pt-4 border-t border-amber-200 text-xs">
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-medium">Raw Metal Cost ({calculation.metalLabel}):</span>
                <span className="font-bold text-slate-900">{formatNPR(calculation.metalCost)}</span>
              </div>

              <div className="flex justify-between items-center text-slate-700">
                <span className="font-medium">
                  Making Charges ({makingChargeType === 'percent' ? `${makingChargePercent}%` : 'Flat'}):
                </span>
                <span className="font-bold text-amber-800">+{formatNPR(calculation.makingCharge)}</span>
              </div>

              {wastagePercent > 0 && (
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-medium">Wastage / Jhad ({wastagePercent}%):</span>
                  <span className="font-bold text-amber-800">+{formatNPR(calculation.wastageCost)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-slate-500 pt-2 border-t border-amber-200/80 text-[11px]">
                <span>Rate applied:</span>
                <span className="font-bold text-slate-800">NPR {Math.round(calculation.pricePerTola).toLocaleString('en-IN')} / tola</span>
              </div>
            </div>
          </div>

          {/* Action Button: Share via WhatsApp */}
          <div className="mt-8 pt-4 border-t border-amber-200 space-y-3">
            <button
              onClick={handleWhatsAppShare}
              className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-2xl bg-gold-gradient text-slate-950 font-extrabold text-sm hover:brightness-105 transition-all shadow-md active:scale-98"
            >
              <MessageCircle className="w-5 h-5 text-slate-950 fill-slate-950" />
              <span>Inquire &amp; Order via WhatsApp</span>
            </button>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 justify-center font-medium">
              <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Final making charges may vary based on design complexity.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
