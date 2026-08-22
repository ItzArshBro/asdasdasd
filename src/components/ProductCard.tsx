'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product, DailyRates } from '@/lib/types';
import { calculateProductPrice, formatNPR, formatWeight } from '@/lib/rates';
import { generateSingleProductInquiry } from '@/lib/whatsapp';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, MessageCircle, Eye, Check } from 'lucide-react';

interface Props {
  product: Product;
  rates: DailyRates;
}

export default function ProductCard({ product, rates }: Props) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const priceInfo = calculateProductPrice(product, rates);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);

    fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'totalProductViews' }),
    }).catch(() => {});
  };

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = generateSingleProductInquiry(product, rates);
    
    fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'totalWhatsAppClicks' }),
    }).catch(() => {});

    window.open(url, '_blank');
  };

  return (
    <div className="rounded-xl overflow-hidden flex flex-col group relative bg-white shadow-xs border border-slate-100 hover:shadow-md transition-shadow">
      {/* Product Image Container */}
      <Link href={`/collections/${product.id}`} className="relative block aspect-4/3 overflow-hidden bg-slate-50 border-b border-slate-100">
        <img
          src={
            imgError || !product.images?.[0]
              ? 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
              : product.images[0]
          }
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Purity & Status Badges - Sharp corners, no outlines */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-white/95 text-slate-800 shadow-3xs">
            {product.karat}
          </span>
          {product.isTrending && (
            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-slate-900 text-white shadow-3xs">
              Popular
            </span>
          )}
        </div>

        {/* Weight Tag */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/95 text-amber-900 shadow-3xs">
            {formatWeight(product.weightGrams)}
          </span>
        </div>

        {/* Quick View Floating Overlay Button */}
        <div className="absolute inset-0 bg-slate-950/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold shadow-md flex items-center gap-1 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </span>
        </div>
      </Link>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-bold uppercase tracking-wider">
            <span>{product.category}</span>
            <span className="font-mono text-slate-300">{product.sku}</span>
          </div>

          <Link href={`/collections/${product.id}`}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-1 font-serif-luxury">
              {product.name}
            </h3>
          </Link>

          {product.nepaliName && (
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-medium">
              {product.nepaliName}
            </p>
          )}

          {/* Live Price Estimation */}
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Est. Live Price
            </div>
            <div className="text-lg font-extrabold text-slate-950 font-serif-luxury mt-0.5">
              {formatNPR(priceInfo.totalPrice)}
            </div>
          </div>
        </div>

        {/* Actions Button Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          {/* Add to Inquiry Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          {/* WhatsApp Direct Inquiry Button */}
          <button
            type="button"
            onClick={handleWhatsAppInquiry}
            className="py-2.5 px-3 rounded-lg text-xs font-extrabold bg-gold-gradient text-slate-950 hover:brightness-105 transition-all flex items-center justify-center gap-1.5 active:scale-98"
          >
            <MessageCircle className="w-3.5 h-3.5 text-slate-950 fill-slate-950 shrink-0" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
