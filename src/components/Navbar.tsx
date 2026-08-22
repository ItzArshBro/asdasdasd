'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { STORE_INFO } from '@/lib/constants';
import {
  ShoppingBag,
  Menu,
  X,
  MessageCircle,
  Lock,
  MapPin,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Clean, concise single-line menu items
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Collections', href: '/collections' },
    { name: 'Live Rates', href: '/live-rates', badge: 'Live' },
    { name: 'Custom Design', href: '/custom-design' },
    { name: 'Repair & Polish', href: '/repair-polish' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="sticky top-3 sm:top-4 z-50 max-w-7xl mx-auto px-2 sm:px-6 w-full">
      {/* Floating Glassmorphism Navbar Bar */}
      <header className="glassmorphism-nav rounded-full px-3.5 sm:px-6 py-2 transition-all duration-300">
        <div className="flex items-center justify-between gap-2">
          {/* Brand Logo - Single line compact layout */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-full bg-gold-gradient p-0.5 shadow-2xs group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <span className="text-amber-800 font-extrabold text-sm font-serif-luxury">RJ</span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-sm xs:text-base sm:text-lg font-extrabold tracking-wide text-slate-950 font-serif-luxury uppercase">
                  RAMBADEVI
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-gold-gradient text-slate-950 shadow-2xs">
                  JEWELLERS
                </span>
              </div>
              <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase hidden sm:block whitespace-nowrap">
                Devdaha-5, Khaireni
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links - Guaranteed Single Line */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 xl:px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1 ${
                    active
                      ? 'bg-gold-gradient text-slate-950 shadow-xs'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-amber-50/80'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && !active && (
                    <span className="text-[9px] font-extrabold px-1 py-0.2 rounded-full bg-gold-gradient text-slate-950">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* WhatsApp Direct Chat Button */}
            <Link
              href={`https://wa.me/977${STORE_INFO.whatsapp}?text=${encodeURIComponent('Namaste RAMBADEVI Jewellers! I am browsing your website and would like to inquire.')}`}
              target="_blank"
              className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors shadow-2xs whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </Link>

            {/* Inquiry Cart Button - Single Line */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-gold-gradient text-slate-950 font-extrabold text-xs hover:brightness-105 transition-all flex items-center gap-1 sm:gap-1.5 shadow-sm active:scale-95 whitespace-nowrap"
              aria-label="Open Inquiry Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden xs:inline">Cart</span>
              <span className="min-w-[17px] h-4 px-1 rounded-full bg-slate-950 text-white font-extrabold text-[9px] flex items-center justify-center shadow-xs">
                {totalItemsCount}
              </span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-full text-slate-700 hover:bg-amber-50 focus:outline-hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pt-3 pb-2 mt-2 border-t border-amber-200/80 space-y-1 animate-in slide-in-from-top-2">
            <div className="p-2 mb-1.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-slate-800 flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                <span>Devdaha-5, Khaireni</span>
              </span>
              <span className="font-extrabold text-amber-900">Ph: 9857073727</span>
            </div>

            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                    active
                      ? 'bg-gold-gradient text-slate-950 shadow-2xs'
                      : 'text-slate-800 hover:bg-amber-50'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-950 text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
              <Link
                href={`https://wa.me/977${STORE_INFO.whatsapp}`}
                target="_blank"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-2xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Direct WhatsApp Inquiry</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
