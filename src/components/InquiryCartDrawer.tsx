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
  X,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function InquiryCartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItemsCount,
  } = useCart();

  const [rates, setRates] = useState<DailyRates>(DEFAULT_RATES);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [inquiryNotes, setInquiryNotes] = useState('');

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

  if (!isCartOpen) return null;

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
      notes: inquiryNotes.trim(),
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-amber-300">
          {/* Drawer Header */}
          <div className="p-5 border-b border-amber-200 bg-amber-50/70 text-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gold-gradient text-slate-950 shadow-2xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base font-serif-luxury text-slate-900">
                  Your Inquiry Cart
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {totalItemsCount} item{totalItemsCount !== 1 ? 's' : ''} selected for inquiry
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mx-auto text-amber-800">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 font-serif-luxury text-lg">
                    Your inquiry cart is empty
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                    Explore our authentic 24K &amp; 22K jewellery collections and add items to inquire directly via WhatsApp.
                  </p>
                </div>
                <Link
                  href="/collections"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs shadow-md hover:brightness-105 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Browse Jewellery Catalog</span>
                </Link>
              </div>
            ) : (
              <>
                {/* Notice Banner */}
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-slate-800 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">No online card payment required!</span>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      Your cart items will be formatted into a WhatsApp inquiry sent directly to RAMBADEVI Jewellers for price lock and showroom viewing in Devdaha.
                    </p>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {items.map((item) => {
                    const price = calculateProductPrice(item.product, rates);
                    return (
                      <div
                        key={item.product.id}
                        className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:border-amber-300 transition-colors flex gap-3"
                      >
                        {/* Thumbnail */}
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-200">
                          <img
                            src={
                              item.product.images?.[0] ||
                              'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80'
                            }
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="text-xs font-bold text-slate-900 line-clamp-1 font-serif-luxury">
                                {item.product.name}
                              </h4>
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-slate-400 hover:text-red-600 p-1"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                              <span className="font-bold px-1.5 py-0.5 rounded bg-amber-100/80 text-amber-900">
                                {item.product.karat}
                              </span>
                              <span>•</span>
                              <span>{formatWeight(item.product.weightGrams * item.quantity)}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                            {/* Quantity */}
                            <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="p-1 text-slate-600 hover:text-slate-900 font-bold"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-bold text-slate-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="p-1 text-slate-600 hover:text-slate-900 font-bold"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-xs font-extrabold text-slate-950 font-serif-luxury">
                              {formatNPR(price.totalPrice * item.quantity)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Customer Details for WhatsApp Message */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Your Contact Information (Optional)
                  </h5>

                  <div>
                    <input
                      type="text"
                      placeholder="Your Full Name..."
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Phone / WhatsApp (e.g. 9841XXXXXX)..."
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <textarea
                      rows={2}
                      placeholder="Any specific questions, sizing, or making charge inquiry..."
                      value={inquiryNotes}
                      onChange={(e) => setInquiryNotes(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer / Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-amber-200 bg-white space-y-4 shadow-lg">
              {/* Totals Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Total Jewellery Weight:</span>
                  <span className="font-bold text-slate-900">
                    {formatWeight(totalWeightGrams)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-1 border-t border-slate-100">
                  <span className="text-sm font-bold text-slate-900">Estimated Total:</span>
                  <span className="text-xl font-extrabold text-slate-950 font-serif-luxury">
                    {formatNPR(totalEstPrice)}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 text-right">
                  *Based on today&apos;s daily market rate
                </div>
              </div>

              {/* WhatsApp Checkout Button */}
              <button
                type="button"
                onClick={handleCheckoutWhatsApp}
                className="w-full py-4 px-4 rounded-2xl bg-gold-gradient text-slate-950 font-extrabold text-sm hover:brightness-105 transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
              >
                <MessageCircle className="w-5 h-5 text-slate-950 fill-slate-950" />
                <span>Inquire &amp; Purchase via WhatsApp</span>
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  onClick={clearCart}
                  className="text-slate-400 hover:text-red-600 transition-colors font-medium"
                >
                  Clear Cart
                </button>
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="text-amber-800 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Open Full Cart Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
