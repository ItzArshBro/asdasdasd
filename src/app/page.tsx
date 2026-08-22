import React from 'react';
import Link from 'next/link';
import { getProducts, getDailyRates } from '@/lib/db';
import { STORE_INFO } from '@/lib/constants';
import MetalPriceCalculator from '@/components/MetalPriceCalculator';
import ProductCard from '@/components/ProductCard';
import {
  Sparkles,
  Gem,
  Calculator,
  Hammer,
  MapPin,
  Clock,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = getProducts();
  const rates = getDailyRates();

  return (
    <div className="space-y-24 sm:space-y-36 pb-24 bg-white">
      {/* Hero Section */}
      <section className="relative bg-white text-slate-900 overflow-hidden pt-12 pb-20 sm:pb-28 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              {/* Clean text-only tag instead of pill badge */}
              <div className="text-[11px] font-bold uppercase tracking-widest text-amber-800">
                Devdaha-5, Khaireni • Hallmark 24K &amp; 22K Gold
              </div>

              {/* Clean Luxury Headline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-serif-luxury text-slate-950 leading-tight">
                  Pure 24K Gold &amp; Bridal Grandeur
                </h1>
                <p className="text-xl sm:text-2xl font-bold font-serif-luxury text-amber-800">
                  Timeless Craftsmanship for Every Generation
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed font-medium">
                Welcome to <strong className="text-slate-950 font-extrabold">RAMBADEVI Jewellers</strong> in Devdaha-5, Khaireni, Rupandehi. Authentic 24K Chhapawal pure gold, royal 22K bridal sets, and bespoke custom design orders.
              </p>

              {/* Action Buttons: Clear Hierarchy */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1">
                {/* ONE HERO BUTTON: Solid Gold, Fully Rounded Pill, No Border */}
                <Link
                  href="/collections"
                  className="py-4 px-8 rounded-full bg-gold-gradient text-slate-950 font-extrabold text-sm hover:brightness-105 transition-all shadow-md active:scale-98"
                >
                  Explore Collections
                </Link>

                {/* Secondary Button: Flat/Ghost Link */}
                <Link
                  href="/custom-design"
                  className="py-4 px-6 rounded-lg text-slate-700 hover:text-slate-950 font-extrabold text-sm transition-all"
                >
                  Order Custom Design
                </Link>

                {/* Flat WhatsApp button with light bg and no border */}
                <Link
                  href={`https://wa.me/977${STORE_INFO.whatsapp}`}
                  target="_blank"
                  className="py-4 px-6 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-extrabold text-sm transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-emerald-800 text-emerald-50 shrink-0" />
                  <span>WhatsApp</span>
                </Link>
              </div>

              {/* Trust Indicators: Flat boxes, no borders, sharp corners */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-100 text-left">
                <div className="p-4 rounded-xl bg-slate-50">
                  <div className="text-xl font-bold text-slate-900 font-serif-luxury">100%</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Hallmarked</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50">
                  <div className="text-xl font-bold text-slate-900 font-serif-luxury">Live Rates</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Daily Sync</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50">
                  <div className="text-xl font-bold text-slate-900 font-serif-luxury">Artisan Made</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Devdaha Workshop</div>
                </div>
              </div>
            </div>

            {/* Right Hero Info Card: Soft Cream bg shift, no border, sharp corners */}
            <div className="lg:col-span-5">
              <div className="p-8 rounded-2xl bg-[#FDF8F0] shadow-sm space-y-6">
                <div>
                  <h3 className="text-xl font-bold font-serif-luxury text-slate-950">
                    RAMBADEVI Showroom
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Devdaha-5, Khaireni</p>
                </div>

                <div className="space-y-4 text-xs text-slate-600 leading-relaxed font-medium">
                  <p>
                    Real-time daily metal rates calculated with Nepali gold market standards.
                  </p>
                  <p>
                    Traditional gold filigree and custom bridal design orders prepared by master goldsmiths.
                  </p>
                  <p>
                    In-house precision ring resizing, laser repairs, and ultrasonic high-gloss cleaning.
                  </p>
                </div>

                <div className="pt-4 border-t border-amber-200/50 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact</span>
                  <Link
                    href={`https://wa.me/977${STORE_INFO.whatsapp}`}
                    target="_blank"
                    className="text-xs font-bold text-amber-900 hover:underline"
                  >
                    +977 9857073727
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Metal Price Calculator Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 mb-2">
            Interactive Calculator
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-serif-luxury">
            Live Daily Metal Price Calculator
          </h2>
          <p className="text-sm text-slate-600 mt-2 font-medium">
            Calculate the exact estimated price for 24K Fine Gold, 22K Tejabi Gold, or Silver with Nepal&apos;s live market rates.
          </p>
        </div>

        <MetalPriceCalculator initialRates={rates} />
      </section>

      {/* Featured Collections Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8 pb-4 border-b border-slate-100">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 mb-1">
              Showroom Highlights
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-serif-luxury">
              Showroom Jewellery Collections
            </h2>
          </div>

          <Link
            href="/collections"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-800 hover:text-amber-950 hover:underline uppercase tracking-wider"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Products Grid or Real Empty State */}
        {products.length === 0 ? (
          <div className="p-10 rounded-xl bg-[#FDF8F0] text-center space-y-4 max-w-xl mx-auto shadow-2xs">
            <h3 className="text-lg font-bold font-serif-luxury text-slate-900">
              Fresh Showroom Arrivals Coming Soon
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              We craft each jewellery ornament upon order or showcase in our Devdaha showroom. Have a specific design in mind? Order your custom design or chat with us on WhatsApp.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/custom-design"
                className="px-5 py-2.5 rounded-full bg-gold-gradient text-slate-950 font-bold text-xs shadow-xs"
              >
                Order Custom Design
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} rates={rates} />
            ))}
          </div>
        )}
      </section>

      {/* Feature Service Banners - Cream Background panels, no borders, clean design */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Order Custom Design */}
          <div className="rounded-xl p-8 bg-[#FDF8F0] shadow-xs flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800">
                  Bespoke Craftsmanship
                </span>
                <h3 className="text-2xl font-bold text-slate-950 font-serif-luxury mt-1">
                  Order Custom Design
                </h3>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Have a unique design in mind or a photograph of a bridal set you love? Share your reference, desired gold weight (in tola/grams), and budget. Our master goldsmiths in Devdaha will craft it with hallmark precision.
              </p>

              <ul className="space-y-2 text-xs text-slate-500 font-medium">
                <li>• 3D CAD design preview &amp; customized weight planning</li>
                <li>• 24K Chhapawal, 22K Tejabi, or 18K Diamond settings</li>
                <li>• Direct WhatsApp inquiry with immediate quote</li>
              </ul>
            </div>

            <Link
              href="/custom-design"
              className="py-3.5 px-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Submit Custom Design Inquiry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Book Repair / Polish */}
          <div className="rounded-xl p-8 bg-[#FDF8F0] shadow-xs flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800">
                  Expert Care &amp; Restoration
                </span>
                <h3 className="text-2xl font-bold text-slate-950 font-serif-luxury mt-1">
                  Book Repair / Polish
                </h3>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Restore your heirloom gold and silver ornaments to brand-new mirror brilliance. We provide high-gloss ultrasonic cleaning, laser soldering, ring resizing, and missing gemstone replacements.
              </p>

              <ul className="space-y-2 text-xs text-slate-500 font-medium">
                <li>• Ultrasonic buffing &amp; high-gloss mirror finish</li>
                <li>• Precision ring sizing &amp; invisible laser chain soldering</li>
                <li>• Book a showroom appointment at Devdaha-5, Khaireni</li>
              </ul>
            </div>

            <Link
              href="/repair-polish"
              className="py-3.5 px-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Book Repair / Polish Appointment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Showroom Visit & Location Section: Cream Panel, No Borders */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-[#FDF8F0] p-8 sm:p-12 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800">
                Visit Our Showroom
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-serif-luxury">
                Visit RAMBADEVI Jewellers in Devdaha
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                We warmly invite you and your family to our spacious showroom in Khaireni, Devdaha-5, Rupandehi. Experience our jewellery in person with personalized hospitality, certified karat testing, and expert bridal jewellery consultations.
              </p>

              <div className="space-y-3.5 text-xs text-slate-700">
                <div>
                  <span className="font-bold text-slate-900">Address:</span> Devdaha-5, Khaireni, Rupandehi, Lumbini Province, Nepal
                </div>
                <div>
                  <span className="font-bold text-slate-900">Opening Hours:</span> 9:30 AM - 7:30 PM (Sunday to Friday)
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                {/* Flat Ghost WhatsApp */}
                <Link
                  href={`https://wa.me/977${STORE_INFO.whatsapp}?text=${encodeURIComponent('Namaste RAMBADEVI Jewellers, I would like to schedule a visit to your Devdaha showroom.')}`}
                  target="_blank"
                  className="py-3 px-5 rounded-lg bg-emerald-50 text-emerald-800 font-extrabold text-xs hover:bg-emerald-100 flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-emerald-800 text-emerald-50" />
                  <span>Notify Us Before Visiting</span>
                </Link>

                <Link
                  href={STORE_INFO.googleMapsUrl}
                  target="_blank"
                  className="py-3 px-5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs flex items-center gap-1.5"
                >
                  <span>Get Google Maps Directions</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm aspect-4/3 bg-slate-100">
                <iframe
                  title="RAMBADEVI Jewellers Location"
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
