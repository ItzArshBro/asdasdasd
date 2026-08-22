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
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Plus,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = getProducts();
  const rates = getDailyRates();
  const featuredProducts = products.filter((p) => p.isFeatured);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 bg-white">
      {/* Hero Section */}
      <section className="relative bg-white text-slate-900 overflow-hidden pt-6 pb-12 sm:pb-16 border-b border-amber-200/80">
        {/* Soft Ambient Glows */}
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Devdaha-5, Khaireni • Hallmark 24K &amp; 22K Jewellery</span>
              </div>

              {/* Clean Luxury Headline */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-serif-luxury text-slate-950 leading-tight">
                  Pure 24K Gold &amp; Bridal Grandeur
                </h1>
                <p className="text-xl sm:text-2xl font-bold font-serif-luxury text-amber-800">
                  Timeless Craftsmanship for Every Generation
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed font-medium">
                Welcome to <strong className="text-slate-950 font-extrabold">RAMBADEVI Jewellers</strong> in Devdaha-5, Khaireni, Rupandehi. Authentic 24K Chhapawal pure gold, royal 22K bridal sets, and bespoke custom design orders.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
                <Link
                  href="/collections"
                  className="py-3.5 px-6 rounded-full bg-gold-gradient text-slate-950 font-extrabold text-xs sm:text-sm hover:brightness-105 transition-all shadow-md flex items-center gap-2 active:scale-98"
                >
                  <Gem className="w-4 h-4 text-slate-950" />
                  <span>Explore Collections</span>
                </Link>

                <Link
                  href="/custom-design"
                  className="py-3.5 px-6 rounded-full bg-amber-50/80 border-2 border-amber-300 text-amber-950 hover:bg-amber-100 font-extrabold text-xs sm:text-sm transition-all shadow-2xs flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>Order Custom Design</span>
                </Link>

                <Link
                  href={`https://wa.me/977${STORE_INFO.whatsapp}`}
                  target="_blank"
                  className="py-3.5 px-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp 9857073727</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-amber-200 text-left">
                <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200">
                  <div className="text-base sm:text-lg font-extrabold text-amber-900 font-serif-luxury">100%</div>
                  <div className="text-[11px] text-slate-600 font-bold">Hallmarked 24K/22K</div>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200">
                  <div className="text-base sm:text-lg font-extrabold text-amber-900 font-serif-luxury">Live Rates</div>
                  <div className="text-[11px] text-slate-600 font-bold">Daily Bullion Sync</div>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200">
                  <div className="text-base sm:text-lg font-extrabold text-amber-900 font-serif-luxury">Artisan Made</div>
                  <div className="text-[11px] text-slate-600 font-bold">Devdaha Workshop</div>
                </div>
              </div>
            </div>

            {/* Right Hero Info Card */}
            <div className="lg:col-span-5">
              <div className="p-8 rounded-3xl bg-amber-50/60 border-2 border-amber-300 shadow-md space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gold-gradient text-slate-950 flex items-center justify-center font-bold shadow-2xs">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-serif-luxury text-slate-950">
                      RAMBADEVI Showroom
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Devdaha-5, Khaireni, Rupandehi</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>Real-time Nepali daily metal rates (24K, 22K, Silver).</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>Bespoke 3D custom bridal and traditional ornament design.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>In-house ultrasonic polishing, resizing, and laser soldering.</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-amber-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Contact:</span>
                  <Link
                    href={`https://wa.me/977${STORE_INFO.whatsapp}`}
                    target="_blank"
                    className="text-xs font-extrabold text-amber-800 hover:underline"
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
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5 text-amber-700" />
            <span>Interactive Tool</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-serif-luxury">
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
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8 pb-4 border-b border-amber-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-widest mb-1">
              <Gem className="w-3.5 h-3.5" />
              <span>Showroom Highlights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-serif-luxury">
              Showroom Jewellery Collections
            </h2>
          </div>

          <Link
            href="/collections"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-800 hover:text-amber-950 hover:underline"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid or Real Empty State */}
        {products.length === 0 ? (
          <div className="p-10 rounded-3xl bg-amber-50/40 border-2 border-amber-200 text-center space-y-4 max-w-xl mx-auto">
            <Gem className="w-10 h-10 text-amber-700 mx-auto" />
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

      {/* Feature Service Banners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Order Custom Design */}
          <div className="rounded-3xl p-8 bg-amber-50/50 border-2 border-amber-300 shadow-md flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full border border-amber-300/80 bg-white flex items-center justify-center text-amber-800 shadow-3xs">
                <Gem className="w-5 h-5" />
              </div>

              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                  Bespoke Craftsmanship
                </span>
                <h3 className="text-2xl font-bold text-slate-950 font-serif-luxury mt-1">
                  Order Custom Design
                </h3>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Have a unique design in mind or a photograph of a bridal set you love? Share your reference, desired gold weight (in tola/grams), and budget. Our master goldsmiths in Devdaha will craft it with hallmark precision.
              </p>

              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>3D CAD design preview &amp; customized weight planning</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>24K Chhapawal, 22K Tejabi, or 18K Diamond settings</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Direct WhatsApp inquiry with immediate quote</span>
                </li>
              </ul>
            </div>

            <Link
              href="/custom-design"
              className="py-4 px-6 rounded-full bg-gold-gradient text-slate-950 hover:brightness-105 font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <span>Submit Custom Design Inquiry</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Book Repair / Polish */}
          <div className="rounded-3xl p-8 bg-amber-50/50 border-2 border-amber-300 shadow-md flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full border border-amber-300/80 bg-white flex items-center justify-center text-amber-800 shadow-3xs">
                <Hammer className="w-5 h-5" />
              </div>

              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                  Expert Care &amp; Restoration
                </span>
                <h3 className="text-2xl font-bold text-slate-950 font-serif-luxury mt-1">
                  Book Repair / Polish
                </h3>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Restore your heirloom gold and silver ornaments to brand-new mirror brilliance. We provide high-gloss ultrasonic cleaning, laser soldering, ring resizing, and missing gemstone replacements.
              </p>

              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Ultrasonic buffing &amp; high-gloss mirror finish</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Precision ring sizing &amp; invisible laser chain soldering</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Book a showroom appointment at Devdaha-5, Khaireni</span>
                </li>
              </ul>
            </div>

            <Link
              href="/repair-polish"
              className="py-4 px-6 rounded-full bg-gold-gradient text-slate-950 hover:brightness-105 font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <span>Book Repair / Polish Appointment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Showroom Visit & Location Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border-2 border-amber-300 p-8 sm:p-12 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                <span>Visit Our Showroom</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-serif-luxury">
                Visit RAMBADEVI Jewellers in Devdaha
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                We warmly invite you and your family to our spacious showroom in Khaireni, Devdaha-5, Rupandehi. Experience our jewellery in person with personalized hospitality, certified karat testing, and expert bridal jewellery consultations.
              </p>

              <div className="space-y-3 text-sm text-slate-800">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Address:</span> Devdaha-5, Khaireni, Rupandehi, Lumbini Province, Nepal
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Opening Hours:</span> 9:30 AM - 7:30 PM (Sunday to Friday)
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href={`https://wa.me/977${STORE_INFO.whatsapp}?text=${encodeURIComponent('Namaste RAMBADEVI Jewellers, I would like to schedule a visit to your Devdaha showroom.')}`}
                  target="_blank"
                  className="py-3 px-5 rounded-full bg-gold-gradient text-slate-950 font-extrabold text-xs shadow-md hover:brightness-105 flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950" />
                  <span>Notify Us Before Visiting</span>
                </Link>

                <Link
                  href={STORE_INFO.googleMapsUrl}
                  target="_blank"
                  className="py-3 px-5 rounded-full bg-white border-2 border-amber-300 hover:bg-amber-50 text-slate-900 font-bold text-xs shadow-2xs flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-amber-700" />
                  <span>Get Google Maps Directions</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md aspect-4/3 bg-slate-100">
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
