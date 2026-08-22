'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Product, DailyRates } from '@/lib/types';
import { DEFAULT_RATES, STORE_INFO } from '@/lib/constants';
import { calculateProductPrice, formatNPR, formatWeight } from '@/lib/rates';
import { generateSingleProductInquiry } from '@/lib/whatsapp';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import {
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Check,
  Scale,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;

  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [rates, setRates] = useState<DailyRates>(DEFAULT_RATES);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (!productId) return;

    Promise.all([
      fetch(`/api/products/${productId}`).then((r) => r.json()),
      fetch('/api/rates').then((r) => r.json()),
      fetch('/api/products').then((r) => r.json()),
    ])
      .then(([singleData, rateData, allData]) => {
        if (singleData.success && singleData.product) {
          setProduct(singleData.product);
        }
        if (rateData.success && rateData.rates) {
          setRates(rateData.rates);
        }
        if (allData.success && allData.products) {
          const related = allData.products
            .filter((p: Product) => p.id !== productId)
            .slice(0, 3);
          setRelatedProducts(related);
        }
      })
      .catch((e) => console.error('Failed to load product details', e))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center bg-white">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-slate-500">Loading jewellery item details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4 bg-white">
        <h2 className="text-2xl font-bold font-serif-luxury text-slate-900">Jewellery Item Not Found</h2>
        <p className="text-xs text-slate-500">The product you are looking for does not exist or has been removed.</p>
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const priceInfo = calculateProductPrice(product, rates);
  const totalPrice = priceInfo.totalPrice * quantity;

  const handleAddToCart = () => {
    addToCart(product, quantity, customNote);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);

    fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'totalProductViews' }),
    }).catch(() => {});
  };

  const handleWhatsAppInquiry = () => {
    const url = generateSingleProductInquiry(product, rates);
    fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'totalWhatsAppClicks' }),
    }).catch(() => {});

    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 bg-white">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-amber-800">Home</Link>
        <span>/</span>
        <Link href="/collections" className="hover:text-amber-800">Collections</Link>
        <span>/</span>
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-3xl overflow-hidden aspect-4/3 sm:aspect-square bg-slate-50 border-2 border-amber-200 shadow-sm relative group">
            <img
              src={
                product.images?.[selectedImageIndex] ||
                'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80'
              }
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="px-3 py-1 rounded-xl text-xs font-extrabold uppercase bg-white/95 backdrop-blur-xs text-slate-950 border border-amber-300 shadow-2xs">
                {product.karat}
              </span>
              {product.isTrending && (
                <span className="px-2.5 py-0.5 rounded-xl text-[11px] font-bold uppercase bg-gold-gradient text-slate-950 shadow-2xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Trending
                </span>
              )}
            </div>

            <div className="absolute bottom-4 left-4">
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-white/95 backdrop-blur-xs text-amber-900 border border-amber-300 shadow-2xs inline-flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-amber-700" />
                <span>Weight: {formatWeight(product.weightGrams)}</span>
              </span>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-amber-500 ring-2 ring-amber-200'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Pricing */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-bold uppercase tracking-wider text-amber-800">
                {product.category}
              </span>
              <span className="font-mono bg-slate-100 px-2.5 py-0.5 rounded-lg text-slate-700 font-semibold">
                SKU: {product.sku}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-serif-luxury">
              {product.name}
            </h1>

            {product.nepaliName && (
              <p className="text-sm font-semibold text-slate-600 mt-1">
                {product.nepaliName}
              </p>
            )}
          </div>

          {/* Live Price Estimation Box - Pure White & Gold */}
          <div className="p-6 rounded-3xl bg-white text-slate-900 border-2 border-amber-300 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-amber-900 font-extrabold uppercase tracking-widest">
                  Live Estimated Price (Today)
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-serif-luxury mt-1">
                  {formatNPR(totalPrice)}
                </div>
              </div>
              <span className="text-[11px] px-3 py-1 rounded-full bg-gold-gradient text-slate-950 font-bold shadow-2xs">
                Live Market Rate
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-amber-200 text-xs">
              <div>
                <span className="text-slate-500">Net Metal Weight:</span>
                <p className="font-bold text-slate-900 mt-0.5">{formatWeight(product.weightGrams * quantity)}</p>
              </div>
              <div>
                <span className="text-slate-500">Purity Certification:</span>
                <p className="font-bold text-amber-900 mt-0.5">{product.karat}</p>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-amber-200">
              *Making charges ({product.makingChargePercentage}%) calculated based on today&apos;s bullion market rates.
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Product Description
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Purity &amp; Craftsmanship Highlights
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity & Notes */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Quantity:
              </label>
              <div className="flex items-center border-2 border-slate-200 rounded-xl bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-bold"
                >
                  -
                </button>
                <span className="px-3 text-sm font-bold text-slate-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <input
                type="text"
                placeholder="Add custom notes (e.g. Ring size 14, specific chain length, rush order)..."
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:outline-hidden focus:border-amber-400"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`py-4 px-5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-2xs border ${
                isAdded
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-100 text-slate-900 border-slate-300 hover:bg-amber-50 hover:border-amber-300'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Added to Inquiry Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-amber-700" />
                  <span>Add to Inquiry Cart</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleWhatsAppInquiry}
              className="py-4 px-5 rounded-2xl text-xs sm:text-sm font-extrabold bg-gold-gradient text-slate-950 hover:brightness-105 transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
            >
              <MessageCircle className="w-4 h-4 text-slate-950 fill-slate-950" />
              <span>Inquire on WhatsApp</span>
            </button>
          </div>

          {/* Hallmark Guarantee */}
          <div className="p-4 rounded-2xl bg-white border border-amber-200 text-xs text-slate-800 space-y-2 shadow-3xs">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>100% Genuine Devdaha Hallmark Quality</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Every item is tested for purity before handover. You can inspect this piece directly at our Devdaha-5, Khaireni showroom.
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-amber-200 space-y-6">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-950 font-serif-luxury">
            You May Also Love
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} rates={rates} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
