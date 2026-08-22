'use client';

import React, { useState, useEffect } from 'react';
import { DailyRates } from '@/lib/types';
import { DEFAULT_RATES } from '@/lib/constants';
import { TrendingUp, Check, RefreshCw, Clock } from 'lucide-react';

export default function AdminRatesPage() {
  const [rates, setRates] = useState<DailyRates>(DEFAULT_RATES);
  const [gold24kPerTola, setGold24kPerTola] = useState<string>('172000');
  const [gold22kPerTola, setGold22kPerTola] = useState<string>('171200');
  const [gold18kPerGram, setGold18kPerGram] = useState<string>('11050');
  const [silverPerTola, setSilverPerTola] = useState<string>('2050');
  const [silverPerGram, setSilverPerGram] = useState<string>('175.75');
  const [source, setSource] = useState<string>('Federation of Nepal Gold & Silver Dealers (FENEGOSIDA) Official Daily Rates');
  const [notes, setNotes] = useState<string>('Live market rates for Devdaha-5, Khaireni, Rupandehi.');

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchRates = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/rates');
      const data = await res.json();
      if (data.success && data.rates) {
        const r = data.rates;
        setRates(r);
        setGold24kPerTola(r.gold24kPerTola.toString());
        setGold22kPerTola(r.gold22kPerTola.toString());
        setGold18kPerGram(r.gold18kPerGram.toString());
        setSilverPerTola(r.silverPerTola.toString());
        setSilverPerGram(r.silverPerGram.toString());
        if (r.source) setSource(r.source);
        if (r.notes) setNotes(r.notes);
      }
    } catch (e) {
      console.error('Failed to load rates', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handle24kChange = (val: string) => {
    setGold24kPerTola(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      // 22K is standardly calculated with 91.6% ratio
      setGold22kPerTola(Math.round(num * 0.995).toString());
      setGold18kPerGram(Math.round((num / 11.6638) * 0.75).toString());
    }
  };

  const handleSilverTolaChange = (val: string) => {
    setSilverPerTola(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setSilverPerGram((num / 11.6638).toFixed(2));
    }
  };

  const handleSaveRates = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gold24kPerTola: parseFloat(gold24kPerTola),
          gold22kPerTola: parseFloat(gold22kPerTola),
          gold18kPerGram: parseFloat(gold18kPerGram),
          silverPerTola: parseFloat(silverPerTola),
          silverPerGram: parseFloat(silverPerGram),
          source,
          notes,
        }),
      });

      const data = await res.json();
      if (data.success && data.rates) {
        setRates(data.rates);
        setSuccessMsg('Daily bullion rates updated and applied across all public calculators!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(data.error || 'Failed to update rates.');
      }
    } catch (err) {
      setErrorMsg('Failed to update rates.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Daily Live Metal Rates Manager
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Updating rates updates all live prices on the public catalog and calculator.
          </p>
        </div>

        <button
          onClick={fetchRates}
          className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300 font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSaveRates} className="space-y-6">
        <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
              Gold Daily Market Rates (NPR)
            </h2>
            <span className="text-[11px] text-neutral-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Last updated: {new Date(rates.updatedAt).toLocaleTimeString()}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* 24K Gold */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
                24K Fine Gold (छापावाल) / Tola *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-xs text-neutral-500 font-mono">NPR</span>
                <input
                  type="number"
                  required
                  step="100"
                  value={gold24kPerTola}
                  onChange={(e) => handle24kChange(e.target.value)}
                  className="w-full text-sm pl-12 pr-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-white font-bold focus:outline-none focus:border-neutral-500"
                />
              </div>
              <span className="text-[10px] text-neutral-500 mt-1 block">
                ≈ NPR {Math.round(parseFloat(gold24kPerTola || '0') / 11.6638)} / gram
              </span>
            </div>

            {/* 22K Gold */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
                22K Tejabi Gold (तेजाबी) / Tola *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-xs text-neutral-500 font-mono">NPR</span>
                <input
                  type="number"
                  required
                  step="100"
                  value={gold22kPerTola}
                  onChange={(e) => setGold22kPerTola(e.target.value)}
                  className="w-full text-sm pl-12 pr-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-white font-bold focus:outline-none focus:border-neutral-500"
                />
              </div>
              <span className="text-[10px] text-neutral-500 mt-1 block">
                ≈ NPR {Math.round(parseFloat(gold22kPerTola || '0') / 11.6638)} / gram
              </span>
            </div>

            {/* 18K Gold */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
                18K Gold / Gram (Diamond mount) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-xs text-neutral-500 font-mono">NPR</span>
                <input
                  type="number"
                  required
                  step="10"
                  value={gold18kPerGram}
                  onChange={(e) => setGold18kPerGram(e.target.value)}
                  className="w-full text-sm pl-12 pr-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-white font-bold focus:outline-none focus:border-neutral-500"
                />
              </div>
              <span className="text-[10px] text-neutral-500 mt-1 block">
                ≈ NPR {Math.round(parseFloat(gold18kPerGram || '0') * 11.6638)} / tola
              </span>
            </div>
          </div>
        </div>

        {/* Silver Rates */}
        <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300 pb-3 border-b border-neutral-800">
            Silver Daily Market Rates (NPR)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Silver per Tola */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
                Fine Silver (चाँदी) / Tola *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-xs text-neutral-500 font-mono">NPR</span>
                <input
                  type="number"
                  required
                  step="5"
                  value={silverPerTola}
                  onChange={(e) => handleSilverTolaChange(e.target.value)}
                  className="w-full text-sm pl-12 pr-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-white font-bold focus:outline-none focus:border-neutral-500"
                />
              </div>
            </div>

            {/* Silver per Gram */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
                Fine Silver / Gram *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-xs text-neutral-500 font-mono">NPR</span>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={silverPerGram}
                  onChange={(e) => setSilverPerGram(e.target.value)}
                  className="w-full text-sm pl-12 pr-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-white font-bold focus:outline-none focus:border-neutral-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Reference Attribution */}
        <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
              Official Source Attribution
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full text-xs px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-white focus:outline-none focus:border-neutral-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
              Public Note
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-white focus:outline-none focus:border-neutral-500"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="py-3 px-8 rounded-xl bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                <span>Save &amp; Update Live Rates</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
