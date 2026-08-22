'use client';

import React from 'react';
import Link from 'next/link';
import { STORE_INFO } from '@/lib/constants';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloatingButton() {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Link
        href={`https://wa.me/977${STORE_INFO.whatsapp}?text=${encodeURIComponent('Namaste RAMBADEVI Jewellers! I am browsing your website and would like to ask a question.')}`}
        target="_blank"
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl hover:scale-105 transition-all focus:outline-hidden ring-4 ring-emerald-400/20 font-bold text-xs"
        aria-label="Chat with RAMBADEVI Jewellers on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-white shrink-0" />
        <span className="hidden sm:inline">WhatsApp Chat</span>
      </Link>
    </div>
  );
}
