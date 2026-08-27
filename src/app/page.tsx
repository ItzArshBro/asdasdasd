import React from 'react';
import Link from 'next/link';
import { getProducts, getDailyRates } from '@/lib/db';
import { STORE_INFO } from '@/lib/constants';
import MetalPriceCalculator from '@/components/MetalPriceCalculator';
import ProductCarousel from '@/components/ProductCarousel';
import {
  Sparkles,
  ArrowRight,
  MessageCircle,
  MapPin,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = await getProducts();
  const rates = await getDailyRates();

  return (
    <div className="pb-24 bg-[#F7F4EF] text-slate-900 font-sans">
      
      {/* 1. Hero Section with Loop Video Background */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-black overflow-hidden pt-20 pb-32">
        {/* Dark Muted Video Overlay */}
        <div className="absolute inset-0 bg-black/65 z-10" />
        
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
        >
          <source src="/pinterest_video.mp4" type="video/mp4" />
        </video>

        {/* Centered Hero Content */}
        <div className="max-w-4xl mx-auto px-4 text-center relative z-20 space-y-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white font-serif-luxury leading-tight animate-fade-in">
            Discover Your Sparkle
          </h1>
          
          <p className="text-[10px] sm:text-xs text-neutral-300 max-w-md mx-auto uppercase tracking-[0.25em] font-semibold leading-relaxed">
            Welcoming In The Spring Season With An Enchanting Emerald, Diamond &amp; Gold Dance With Earrings
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/collections"
              className="px-8 py-3.5 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all active:scale-98"
            >
              Buy Now
            </Link>
            <Link
              href="#collections-slider"
              className="px-8 py-3.5 rounded-full border border-white/60 bg-transparent text-white font-extrabold text-xs uppercase tracking-wider hover:bg-white/10 transition-all active:scale-98"
            >
              Explore
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Overlapping Category Cards Grid */}
      <section className="relative -mt-24 sm:-mt-28 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Rings */}
          <Link
            href="/collections?category=Rings"
            className="group rounded-2xl bg-white border border-neutral-100 p-5 flex flex-col justify-between shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 min-h-[300px]"
          >
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
                Categories
              </span>
              <h3 className="text-xl font-bold text-neutral-900 font-serif-luxury mt-0.5">
                Rings
              </h3>
            </div>
            <div className="w-full h-36 my-3 relative overflow-hidden bg-neutral-50 rounded-xl flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop"
                alt="Gold & Diamond Rings"
                className="max-h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-xs font-bold text-neutral-950 flex items-center gap-1 mt-1 group-hover:underline">
              <span>Check More Product</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Card 2: Couple Rings */}
          <Link
            href="/collections?category=Rings"
            className="group rounded-2xl bg-white border border-neutral-100 p-5 flex flex-col justify-between shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 min-h-[300px]"
          >
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
                Categories
              </span>
              <h3 className="text-xl font-bold text-neutral-900 font-serif-luxury mt-0.5">
                Couple Rings
              </h3>
            </div>
            <div className="w-full h-36 my-3 relative overflow-hidden bg-neutral-50 rounded-xl flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop"
                alt="Couple Rings Set"
                className="max-h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-xs font-bold text-neutral-950 flex items-center gap-1 mt-1 group-hover:underline">
              <span>Check More Product</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Card 3: Earrings */}
          <Link
            href="/collections?category=Earrings%20%26%20Jhumkas"
            className="group rounded-2xl bg-white border border-neutral-100 p-5 flex flex-col justify-between shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 min-h-[300px]"
          >
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
                Categories
              </span>
              <h3 className="text-xl font-bold text-neutral-900 font-serif-luxury mt-0.5">
                Earrings
              </h3>
            </div>
            <div className="w-full h-36 my-3 relative overflow-hidden bg-neutral-50 rounded-xl flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=600&auto=format&fit=crop"
                alt="Exquisite Earrings"
                className="max-h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-xs font-bold text-neutral-950 flex items-center gap-1 mt-1 group-hover:underline">
              <span>Check More Product</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

        </div>
      </section>

      {/* 3. Diamonds & Engagement Ring Carousel (White Background) */}
      <section id="collections-slider" className="bg-white py-24 mb-24 border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Title / Description */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800">
                  Luxury Collection
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 font-serif-luxury mt-1 leading-tight">
                  Diamonds &amp; Engagement Rings
                </h2>
              </div>
              
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-medium">
                Experience the beauty of gold and diamond jewellery and find your perfect piece for a special occasion. Handcrafted designs tailored to capture eternal memories.
              </p>

              <Link
                href="/collections"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-neutral-950 text-white font-extrabold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-all"
              >
                More Products
              </Link>
            </div>

            {/* Slider Product List */}
            <div className="lg:col-span-8 w-full overflow-hidden">
              <ProductCarousel
                products={products}
                rates={rates}
                categoryFilter="Rings"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 4. Textured Fabric Carousel Section (Black Silk Background) */}
      <section
        className="relative py-24 mb-24 bg-black overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/black-silk.jfif')" }}
      >
        {/* Dark overlay to ensure contrast */}
        <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col space-y-8">
            
            {/* Heading row */}
            <div className="flex flex-wrap items-end justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-neutral-400">
                  Featured Ornaments
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif-luxury mt-1">
                  Find The Perfect Diamond For
                </h2>
              </div>
            </div>

            {/* Dark Styled Slider */}
            <div className="w-full overflow-hidden">
              <ProductCarousel
                products={products}
                rates={rates}
                categoryFilter="Earrings & Jhumkas"
                darkTheme={true}
              />
            </div>

          </div>
        </div>
      </section>

      {/* 5. Live Metal Price Calculator Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
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

      {/* 6. Showroom Visit & Location Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white border border-neutral-100/80 p-8 sm:p-12 shadow-2xs">
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
                <Link
                  href={`https://wa.me/977${STORE_INFO.whatsapp}?text=${encodeURIComponent('Namaste RAMBADEVI Jewellers, I would like to schedule a visit to your Devdaha showroom.')}`}
                  target="_blank"
                  className="py-3 px-5 rounded-lg bg-emerald-50 text-emerald-800 font-extrabold text-xs hover:bg-emerald-100 flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-emerald-800 text-emerald-50" />
                  <span>Notify Us Before Visiting</span>
                </Link>

                <Link
                  href={STORE_INFO.googleMapsUrl}
                  target="_blank"
                  className="py-3 px-5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-200"
                >
                  <span>Get Google Maps Directions</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-xl overflow-hidden border border-slate-150 shadow-xs aspect-4/3 bg-slate-100">
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
