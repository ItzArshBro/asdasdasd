'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { DailyRates } from '@/lib/types';
import { DEFAULT_RATES } from '@/lib/constants';
import { calculateProductPrice, formatNPR, formatWeight } from '@/lib/rates';
import { generateCartInquiry } from '@/lib/whatsapp';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  Gem,
} from 'lucide-react';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalItemsCount } = useCart();
  const [rates, setRates] = useState<DailyRates>(DEFAULT_RATES);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetch('/api/rates')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.rates) {
          setRates(data.rates);
        }
      })
      .catch(() => {});
  }, []);

  let totalEstPrice = 0;
  let totalWeightGrams = 0;

  items.forEach((item) => {
    const price = calculateProductPrice(item.product, rates);
    totalEstPrice += price.totalPrice * item.quantity;
    totalWeightGrams += item.product.weightGrams * item.quantity;
  });

  const handleCheckoutWhatsApp = () => {
    if (items.length === 0) return;

    const url = generateCartInquiry({
      items,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerAddress: customerAddress.trim(),
      notes: notes.trim(),
      rates,
    });

    fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'totalCartInquiries' }),
    }).catch(() => {});

    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-amber-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>WhatsApp Inquiry Cart</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-950 font-serif-luxury">
            Your Selected Jewellery
          </h1>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-bold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Entire Cart</span>
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center bg-amber-50/40 rounded-3xl border-2 border-amber-200 p-8 space-y-6 max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-white border-2 border-amber-300 text-amber-800 flex items-center justify-center mx-auto shadow-sm">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-serif-luxury text-slate-950">
              Your inquiry cart is empty
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Browse our handcrafted 24K and 22K jewellery collections and add items to easily request availability and lock today&apos;s live market rates via WhatsApp.
            </p>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gold-gradient text-slate-950 font-extrabold text-sm shadow-md hover:brightness-105 transition-all"
          >
            <Gem className="w-4 h-4" />
            <span>Explore Jewellery Catalog</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-7 space-y-4">
            {/* Info Banner */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-slate-800 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">WhatsApp Direct Inquiry Checkout:</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  No online card payments or middleman fees. When you click proceed, your full cart list is formatted and opened directly in WhatsApp with RAMBADEVI Jewellers.
                </p>
              </div>
            </div>

            {/* Products List */}
            <div className="space-y-3">
              {items.map((item) => {
                const price = calculateProductPrice(item.product, rates);
                const itemTotal = price.totalPrice * item.quantity;

                return (
                  <div
                    key={item.product.id}
                    className="p-4 rounded-3xl border-2 border-slate-200 bg-white shadow-2xs hover:border-amber-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border border-slate-200">
                        <img
                          src={
                            item.product.images?.[0] ||
                            'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80'
                          }
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-1">
                        <Link href={`/collections/${item.product.id}`}>
                          <h3 className="text-sm font-bold text-slate-900 hover:text-amber-800 font-serif-luxury">
                            {item.product.name}
                          </h3>
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="px-2 py-0.5 rounded-lg bg-amber-100/80 text-amber-900 font-bold text-[10px]">
                            {item.product.karat}
                          </span>
                          <span>•</span>
                          <span>{formatWeight(item.product.weightGrams * item.quantity)}</span>
                          <span>•</span>
                          <span className="font-mono text-[10px]">SKU: {item.product.sku}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:border-l sm:pl-6 border-slate-200">
                      {/* Quantity Modifier */}
                      <div className="flex items-center border-2 border-slate-200 rounded-xl bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 font-bold"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Item Total Price */}
                      <div className="text-right">
                        <div className="text-sm font-extrabold text-slate-950 font-serif-luxury">
                          {formatNPR(itemTotal)}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[11px] text-slate-400 hover:text-red-600 transition-colors mt-0.5 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <Link
                href="/collections"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue Browsing Collections</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Checkout Summary - Pure White with Gold */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-amber-50/50 text-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-md space-y-6">
              <div className="border-b border-amber-200 pb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold font-serif-luxury text-slate-950">
                  Inquiry Order Summary
                </h3>
                <span className="text-xs font-bold text-slate-500">
                  {totalItemsCount} item{totalItemsCount !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Weight & Price Breakdown */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Total Gold / Metal Weight:</span>
                  <span className="font-bold text-slate-900">{formatWeight(totalWeightGrams)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Estimated Total (Live Rates):</span>
                  <span className="font-bold text-slate-900">{formatNPR(totalEstPrice)}</span>
                </div>

                <div className="flex justify-between items-baseline pt-3 border-t border-amber-200">
                  <span className="text-sm font-bold text-amber-900">Estimated Total:</span>
                  <span className="text-2xl font-extrabold text-slate-950 font-serif-luxury">
                    {formatNPR(totalEstPrice)}
                  </span>
                </div>
              </div>

              {/* Customer Contact Inputs */}
              <div className="space-y-3 pt-2 border-t border-amber-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                  Your Details (For WhatsApp Message)
                </span>

                <div>
                  <input
                    type="text"
                    placeholder="Your Name (e.g. Sunil Karki)..."
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs px-4 py-3 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Phone / WhatsApp (e.g. 9847XXXXXX)..."
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-xs px-4 py-3 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <textarea
                    rows={2}
                    placeholder="Questions on custom sizing, delivery date, or visiting Devdaha showroom..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-xs px-4 py-3 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Proceed to WhatsApp Button */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleCheckoutWhatsApp}
                  className="w-full py-4 px-6 rounded-2xl bg-gold-gradient text-slate-950 font-extrabold text-sm hover:brightness-105 transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
                >
                  <MessageCircle className="w-5 h-5 fill-slate-950" />
                  <span>Inquire &amp; Purchase via WhatsApp</span>
                </button>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 justify-center font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Direct connection with RAMBADEVI Jewellers store manager.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
