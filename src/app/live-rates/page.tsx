import React from 'react';
import { getDailyRates } from '@/lib/db';
import MetalPriceCalculator from '@/components/MetalPriceCalculator';
import { TrendingUp, ShieldCheck, Scale, Info } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LiveRatesPage() {
  const rates = getDailyRates();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 bg-transparent">
      {/* Page Header - Pure White & Gold Theme */}
      <div className="rounded-xl bg-white text-slate-900 p-8 sm:p-10 relative overflow-hidden border border-slate-200 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800">
            FENEGOSIDA Synced Daily Rates
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif-luxury tracking-tight text-slate-950">
            Live Daily Metal Price Calculator
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Calculate accurate gold and silver ornaments pricing in Nepalese Rupees (NPR). Use our interactive calculator for 24K Fine Gold, 22K Tejabi Gold, 18K Hallmarked Gold, and Silver by Tola, Grams, Lal, or Aana.
          </p>
        </div>
      </div>

      {/* Main Interactive Calculator */}
      <div>
        <MetalPriceCalculator initialRates={rates} />
      </div>

      {/* Today's Official Bullion Market Reference Rates */}
      <div className="bg-white rounded-3xl border-2 border-amber-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif-luxury">
              Today&apos;s Official Market Reference Rates
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Source: {rates.source} • Updated: {new Date(rates.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Live Market Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-amber-50 text-slate-800 font-bold uppercase text-[11px] tracking-wider border-b border-amber-200">
                <th className="py-3.5 px-4 rounded-l-2xl">Precious Metal / Purity</th>
                <th className="py-3.5 px-4">Standard Purity</th>
                <th className="py-3.5 px-4">Rate per 1 Tola (11.66g)</th>
                <th className="py-3.5 px-4">Rate per 10 Grams</th>
                <th className="py-3.5 px-4 rounded-r-2xl">Rate per 1 Gram</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-amber-50/50 transition-colors">
                <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
                  <span>24K Fine Gold (छापावाल सुन)</span>
                </td>
                <td className="py-4 px-4 text-slate-600 font-medium">99.5% - 99.9%</td>
                <td className="py-4 px-4 font-extrabold text-amber-900 font-serif-luxury">
                  NPR {rates.gold24kPerTola.toLocaleString('en-IN')}
                </td>
                <td className="py-4 px-4 font-bold text-slate-800">
                  NPR {Math.round((rates.gold24kPerTola / 11.6638) * 10).toLocaleString('en-IN')}
                </td>
                <td className="py-4 px-4 font-bold text-slate-800">
                  NPR {Math.round(rates.gold24kPerTola / 11.6638).toLocaleString('en-IN')}
                </td>
              </tr>

              <tr className="hover:bg-amber-50/50 transition-colors">
                <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                  <span>22K Tejabi Gold (तेजाबी सुन)</span>
                </td>
                <td className="py-4 px-4 text-slate-600 font-medium">91.6% (Hallmark 916)</td>
                <td className="py-4 px-4 font-extrabold text-amber-900 font-serif-luxury">
                  NPR {rates.gold22kPerTola.toLocaleString('en-IN')}
                </td>
                <td className="py-4 px-4 font-bold text-slate-800">
                  NPR {Math.round((rates.gold22kPerTola / 11.6638) * 10).toLocaleString('en-IN')}
                </td>
                <td className="py-4 px-4 font-bold text-slate-800">
                  NPR {Math.round(rates.gold22kPerTola / 11.6638).toLocaleString('en-IN')}
                </td>
              </tr>

              <tr className="hover:bg-amber-50/50 transition-colors">
                <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-300 shrink-0" />
                  <span>18K Hallmarked Gold (१८ क्यारेट)</span>
                </td>
                <td className="py-4 px-4 text-slate-600 font-medium">75.0% (Hallmark 750)</td>
                <td className="py-4 px-4 font-extrabold text-amber-900 font-serif-luxury">
                  NPR {Math.round(rates.gold18kPerGram * 11.6638).toLocaleString('en-IN')}
                </td>
                <td className="py-4 px-4 font-bold text-slate-800">
                  NPR {Math.round(rates.gold18kPerGram * 10).toLocaleString('en-IN')}
                </td>
                <td className="py-4 px-4 font-bold text-slate-800">
                  NPR {Math.round(rates.gold18kPerGram).toLocaleString('en-IN')}
                </td>
              </tr>

              <tr className="hover:bg-amber-50/50 transition-colors">
                <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-400 shrink-0" />
                  <span>Fine Silver 999 (चाँदी)</span>
                </td>
                <td className="py-4 px-4 text-slate-600 font-medium">99.9% Purity</td>
                <td className="py-4 px-4 font-extrabold text-slate-900 font-serif-luxury">
                  NPR {rates.silverPerTola.toLocaleString('en-IN')}
                </td>
                <td className="py-4 px-4 font-bold text-slate-800">
                  NPR {Math.round(rates.silverPerGram * 10).toLocaleString('en-IN')}
                </td>
                <td className="py-4 px-4 font-bold text-slate-800">
                  NPR {rates.silverPerGram.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Guide & Education Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border-2 border-amber-200 space-y-3 shadow-2xs">
          <Scale className="w-6 h-6 text-amber-700" />
          <h4 className="text-base font-bold text-slate-900 font-serif-luxury">
            Understanding Nepali Units
          </h4>
          <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed font-medium">
            <li>• <strong>1 Tola (तोला)</strong> = 11.6638 Grams</li>
            <li>• <strong>1 Tola</strong> = 100 Lal (लाल)</li>
            <li>• <strong>1 Tola</strong> = 16 Aana (आना)</li>
            <li>• <strong>10 Grams</strong> ≈ 0.857 Tola</li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-white border-2 border-amber-200 space-y-3 shadow-2xs">
          <ShieldCheck className="w-6 h-6 text-amber-700" />
          <h4 className="text-base font-bold text-slate-900 font-serif-luxury">
            Hallmark Purity Guide
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            <strong>24K Chhapawal</strong> is highest purity 99.5%+ gold used for traditional heavy jewellery. <strong>22K Tejabi (916)</strong> offers supreme durability for everyday bridal bangles and stone-studded ornaments.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border-2 border-amber-200 space-y-3 shadow-2xs">
          <Info className="w-6 h-6 text-amber-700" />
          <h4 className="text-base font-bold text-slate-900 font-serif-luxury">
            Making Charges (ज्याला)
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Making charge varies according to artisanal intricacy (filigree, die-casting, jaali, meenakari enamel). At RAMBADEVI Jewellers, our making charges are among the most transparent in Devdaha.
          </p>
        </div>
      </div>
    </div>
  );
}
