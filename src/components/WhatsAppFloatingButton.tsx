'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { STORE_INFO } from '@/lib/constants';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppFloatingButton() {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Friendly White Glassmorphism Tooltip */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 p-3.5 bg-white/95 backdrop-blur-md text-slate-900 rounded-2xl shadow-xl border-2 border-amber-300 animate-bounce text-xs max-w-xs relative">
          <div className="flex-1">
            <span className="font-extrabold text-amber-900">Need Instant Help?</span>
            <p className="text-[11px] text-slate-600 font-medium mt-0.5">
              Chat with RAMBADEVI Jewellers on WhatsApp for live rates and orders!
            </p>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-slate-900 p-1"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <Link
        href={`https://wa.me/977${STORE_INFO.whatsapp}?text=${encodeURIComponent('Namaste RAMBADEVI Jewellers! I am browsing your website and would like to ask a question.')}`}
        target="_blank"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl hover:scale-105 transition-all focus:outline-hidden ring-4 ring-emerald-400/30"
        aria-label="Chat with RAMBADEVI Jewellers on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border-2 border-white"></span>
        </span>
      </Link>
    </div>
  );
}
