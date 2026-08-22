import React from 'react';
import Link from 'next/link';
import { STORE_INFO } from '@/lib/constants';
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 bg-white">
      {/* Header Banner - Pure White & Gold Theme */}
      <div className="rounded-3xl bg-white text-slate-900 p-8 sm:p-10 relative overflow-hidden border-2 border-amber-300 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-amber-300 text-amber-900 text-xs font-bold shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-amber-700" />
            <span>Showroom Location</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif-luxury tracking-tight text-slate-950">
            Visit &amp; Contact Us
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            We are honored to welcome you to <strong>RAMBADEVI Jewellers</strong> in Devdaha-5, Khaireni, Rupandehi. Connect with us via WhatsApp, call, or visit our showroom for personal jewellery consultation and hallmark certified purchases.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Contact Cards */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-amber-300 shadow-md space-y-6">
            <h3 className="text-xl font-bold text-slate-950 font-serif-luxury">
              Direct Contact Channels
            </h3>

            <div className="space-y-4 text-sm text-slate-800">
              {/* Showroom Address */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-amber-200 shadow-3xs">
                <div className="w-10 h-10 rounded-2xl bg-gold-gradient text-slate-950 flex items-center justify-center shrink-0 shadow-2xs">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Showroom Address</h4>
                  <p className="text-slate-600 text-xs mt-0.5">
                    Devdaha-5, Khaireni, Rupandehi, Lumbini Province, Nepal
                  </p>
                  <Link
                    href={STORE_INFO.googleMapsUrl}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:underline mt-2"
                  >
                    <span>View on Google Maps</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-amber-200 shadow-3xs">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Phone &amp; WhatsApp</h4>
                  <p className="text-slate-600 text-xs mt-0.5">
                    Call or chat directly with our store manager for live gold rates, booking, and custom designs.
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <Link
                      href={`https://wa.me/977${STORE_INFO.whatsapp}`}
                      target="_blank"
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-2xs"
                    >
                      Chat on WhatsApp
                    </Link>
                    <a
                      href={`tel:+977${STORE_INFO.phone}`}
                      className="text-xs font-bold text-slate-900 hover:underline"
                    >
                      +977 {STORE_INFO.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-amber-200 shadow-3xs">
                <div className="w-10 h-10 rounded-2xl bg-gold-gradient text-slate-950 flex items-center justify-center shrink-0 shadow-2xs">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Opening Hours</h4>
                  <p className="text-slate-600 text-xs mt-0.5">
                    <strong>Sunday - Friday:</strong> 9:30 AM - 7:30 PM
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    (Open on Saturdays during festive seasons: Dashain, Tihar, Teej &amp; wedding seasons)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Google Maps Embed */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-amber-300 shadow-md space-y-4">
            <h3 className="text-xl font-bold font-serif-luxury text-slate-950">
              Interactive Showroom Map
            </h3>
            <p className="text-xs text-slate-500">
              Conveniently located on the main highway road in Khaireni, Devdaha-5, Rupandehi with ample customer parking.
            </p>

            <div className="rounded-2xl overflow-hidden border-2 border-amber-200 aspect-4/3 bg-slate-100">
              <iframe
                title="RAMBADEVI Jewellers Showroom Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14138.489377484435!2d83.567!3d27.674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39969a5323985555%3A0x23a670355b2520!2sDevdaha%2C%20Khaireni%2C%20Rupandehi!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>

            <div className="pt-2">
              <Link
                href={STORE_INFO.googleMapsUrl}
                target="_blank"
                className="w-full py-4 px-4 rounded-2xl bg-gold-gradient text-slate-950 font-extrabold text-xs hover:brightness-105 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <MapPin className="w-4 h-4 text-slate-950" />
                <span>Open in Google Maps Navigation</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
