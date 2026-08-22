import React from 'react';
import Link from 'next/link';
import { STORE_INFO } from '@/lib/constants';
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ShieldCheck,
  Award,
  Sparkles,
  ChevronRight,
  Gem,
  Lock,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white text-slate-700 pt-16 pb-10 border-t-2 border-amber-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 pb-12 border-b border-amber-200/80">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-2xs">
            <div className="p-2 rounded-xl bg-gold-gradient text-slate-950 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">100% Hallmarked Gold</h4>
              <p className="text-xs text-slate-600 mt-1">Guaranteed 24K Chhapawal &amp; 22K Tejabi official purity certification.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-2xs">
            <div className="p-2 rounded-xl bg-gold-gradient text-slate-950 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Live Daily Market Rates</h4>
              <p className="text-xs text-slate-600 mt-1">Transparent daily pricing aligned with Nepal bullion standards.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-2xs">
            <div className="p-2 rounded-xl bg-gold-gradient text-slate-950 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Custom Handcrafted Design</h4>
              <p className="text-xs text-slate-600 mt-1">Bespoke bridal &amp; traditional jewellery tailored to your exact vision.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-2xs">
            <div className="p-2 rounded-xl bg-gold-gradient text-slate-950 shrink-0">
              <Gem className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Showroom in Devdaha</h4>
              <p className="text-xs text-slate-600 mt-1">Visit our welcoming showroom in Khaireni for personal consultation.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-12">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-gradient p-0.5 flex items-center justify-center shadow-md">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <span className="text-amber-800 font-extrabold font-serif-luxury text-sm">RJ</span>
                </div>
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-wider text-slate-900 font-serif-luxury uppercase">
                  RAMBADEVI
                </span>
                <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full bg-gold-gradient text-slate-950">
                  JEWELLERS
                </span>
              </div>
            </div>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pr-6">
              RAMBADEVI Jewellers is your trusted luxury destination in Devdaha-5, Khaireni, Rupandehi for genuine 24K pure gold, 22K Tejabi bridal sets, certified diamonds, and handcrafted sterling silverware.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                ✨ Traditional Rani Haar
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                💍 Bridal Jewellery
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                🪔 Silver Pooja Items
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-serif-luxury">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/collections" className="hover:text-amber-800 flex items-center gap-1.5 transition-colors font-medium">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                  <span>Jewellery Catalog</span>
                </Link>
              </li>
              <li>
                <Link href="/live-rates" className="hover:text-amber-800 flex items-center gap-1.5 transition-colors font-medium">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                  <span>Live Metal Price Calculator</span>
                </Link>
              </li>
              <li>
                <Link href="/custom-design" className="hover:text-amber-800 flex items-center gap-1.5 transition-colors font-medium">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                  <span>Order Custom Design</span>
                </Link>
              </li>
              <li>
                <Link href="/repair-polish" className="hover:text-amber-800 flex items-center gap-1.5 transition-colors font-medium">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                  <span>Book Repair / Polish</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-800 flex items-center gap-1.5 transition-colors font-medium">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                  <span>Visit Showroom &amp; Map</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Showroom Details */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-serif-luxury">
              Visit / Contact Us
            </h4>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">RAMBADEVI Jewellers Showroom</p>
                  <p className="text-slate-600">Devdaha-5, Khaireni, Rupandehi, Nepal</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">Phone / WhatsApp</p>
                  <Link
                    href={`https://wa.me/977${STORE_INFO.whatsapp}`}
                    target="_blank"
                    className="text-amber-800 font-extrabold hover:underline"
                  >
                    +977 {STORE_INFO.phone}
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">Store Working Hours</p>
                  <p className="text-slate-600">{STORE_INFO.workingHours} (Sun - Fri)</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={STORE_INFO.googleMapsUrl}
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-300 hover:bg-amber-100 text-xs font-bold text-amber-900 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                <span>Get Directions on Google Maps</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-6 border-t border-amber-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} RAMBADEVI Jewellers. Devdaha-5, Khaireni, Rupandehi. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-slate-700 font-medium">
              Customer Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
