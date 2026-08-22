'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DailyRates } from '@/lib/types';
import { DEFAULT_RATES, STORE_INFO } from '@/lib/constants';
import { TrendingUp, Sparkles } from 'lucide-react';

export default function LiveRatesTicker() {
  const [rates, setRates] = useState<DailyRates>(DEFAULT_RATES);

  useEffect(() => {
    fetch('/api/rates')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.rates) {
          setRates(data.rates);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-white text-slate-800 text-xs py-2 px-4 border-b border-amber-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Market Rates */}
        <div className="flex items-center gap-2 overflow-x-auto py-0.5 scrollbar-none">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-gradient text-slate-950 font-bold uppercase tracking-wider text-[10px] shadow-2xs whitespace-nowrap">
            <TrendingUp className="w-3 h-3 text-slate-950" />
            <span>Today&apos;s Live Rates</span>
          </div>

          <div className="flex items-center gap-4 text-xs whitespace-nowrap pl-2">
            <span className="flex items-center gap-1">
              <span className="text-slate-500 font-medium">24K Fine Gold:</span>
              <span className="font-extrabold text-amber-800">
                NPR {rates.gold24kPerTola.toLocaleString('en-IN')}/tola
              </span>
              <span className="text-[11px] text-slate-400">
                (NPR {Math.round(rates.gold24kPerTola / 11.6638).toLocaleString('en-IN')}/g)
              </span>
            </span>

            <span className="text-slate-300">|</span>

            <span className="flex items-center gap-1">
              <span className="text-slate-500 font-medium">22K Tejabi:</span>
              <span className="font-extrabold text-amber-800">
                NPR {rates.gold22kPerTola.toLocaleString('en-IN')}/tola
              </span>
            </span>

            <span className="text-slate-300">|</span>

            <span className="flex items-center gap-1">
              <span className="text-slate-500 font-medium">Silver:</span>
              <span className="font-extrabold text-slate-800">
                NPR {rates.silverPerTola.toLocaleString('en-IN')}/tola
              </span>
            </span>
          </div>
        </div>

        {/* Store Quick Contact Info */}
        <div className="hidden lg:flex items-center gap-4 text-slate-600 text-xs">
          <span>
            📍 <span className="text-slate-800 font-medium">Devdaha-5, Khaireni, Rupandehi</span>
          </span>
          <span className="text-slate-300">•</span>
          <Link
            href={`https://wa.me/977${STORE_INFO.whatsapp}`}
            target="_blank"
            className="hover:text-amber-800 transition-colors flex items-center gap-1 font-semibold"
          >
            <span>WhatsApp:</span>
            <span className="font-extrabold text-amber-800">{STORE_INFO.whatsapp}</span>
          </Link>
          <Link
            href="/live-rates"
            className="text-[11px] font-bold text-amber-800 hover:underline ml-1"
          >
            Calculate Price →
          </Link>
        </div>
      </div>
    </div>
  );
}
