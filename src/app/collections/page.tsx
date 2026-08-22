'use client';

import React, { useState, useEffect } from 'react';
import { Product, DailyRates, ProductCategory, MetalType } from '@/lib/types';
import { CATEGORIES, DEFAULT_RATES } from '@/lib/constants';
import ProductCard from '@/components/ProductCard';
import { calculateProductPrice } from '@/lib/rates';
import {
  Search,
  Gem,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export default function CollectionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [rates, setRates] = useState<DailyRates>(DEFAULT_RATES);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [selectedMetal, setSelectedMetal] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('trending');

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then((r) => r.json()),
      fetch('/api/rates').then((r) => r.json()),
    ])
      .then(([prodData, rateData]) => {
        if (prodData.success && prodData.products) {
          setProducts(prodData.products);
        }
        if (rateData.success && rateData.rates) {
          setRates(rateData.rates);
        }
      })
      .catch((e) => console.error('Failed to load collections', e))
      .finally(() => setLoading(false));
  }, []);

  // Filter & Sort logic
  const filteredProducts = products.filter((product) => {
    if (selectedCategory !== 'All' && product.category !== selectedCategory) {
      return false;
    }
    if (selectedMetal !== 'all') {
      if (selectedMetal === 'gold_24k' && product.metalType !== 'gold_24k') return false;
      if (selectedMetal === 'gold_22k' && product.metalType !== 'gold_22k') return false;
      if (selectedMetal === 'gold_18k' && product.metalType !== 'gold_18k') return false;
      if (selectedMetal === 'silver' && !product.metalType.startsWith('silver')) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        product.name.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        (product.nepaliName && product.nepaliName.toLowerCase().includes(q)) ||
        product.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'trending') {
      return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
    }
    if (sortBy === 'weight_asc') {
      return a.weightGrams - b.weightGrams;
    }
    if (sortBy === 'weight_desc') {
      return b.weightGrams - a.weightGrams;
    }
    if (sortBy === 'price_asc') {
      const priceA = calculateProductPrice(a, rates).totalPrice;
      const priceB = calculateProductPrice(b, rates).totalPrice;
      return priceA - priceB;
    }
    if (sortBy === 'price_desc') {
      const priceA = calculateProductPrice(a, rates).totalPrice;
      const priceB = calculateProductPrice(b, rates).totalPrice;
      return priceB - priceA;
    }
    return 0;
  });

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedMetal('all');
    setSearchQuery('');
    setSortBy('trending');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-transparent">
      {/* Header Banner - White & Gold Theme */}
      <div className="rounded-xl bg-white text-slate-900 p-8 sm:p-10 relative overflow-hidden border border-slate-200 shadow-sm">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-amber-300 text-amber-900 text-xs font-bold shadow-2xs">
            <Gem className="w-3.5 h-3.5 text-amber-700" />
            <span>Devdaha Showroom Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-luxury tracking-tight text-slate-950">
            Authentic Jewellery Collections
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Discover hallmarked 24K pure gold, 22K bridal sets, and handcrafted silverware. Add any pieces to your inquiry cart to request direct availability and custom quotes via WhatsApp.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 rounded-3xl border-2 border-amber-200 shadow-sm space-y-5">
        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by necklace, jhumka, ring, SKU (e.g. RJ-BR-001)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 bg-white focus:outline-hidden focus:border-amber-400"
            />
          </div>

          {/* Metal & Sort dropdowns */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <select
              value={selectedMetal}
              onChange={(e) => setSelectedMetal(e.target.value)}
              className="text-xs font-bold px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:border-amber-400"
            >
              <option value="all">All Metal Purities</option>
              <option value="gold_24k">24K Fine Gold (छापावाल)</option>
              <option value="gold_22k">22K Tejabi Gold (तेजाबी)</option>
              <option value="gold_18k">18K Gold / Diamond</option>
              <option value="silver">Silver &amp; Coins (चाँदी)</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:border-amber-400"
            >
              <option value="trending">Sort: Popular &amp; Trending</option>
              <option value="weight_asc">Weight: Low to High</option>
              <option value="weight_desc">Weight: High to Low</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>

            {(selectedCategory !== 'All' || selectedMetal !== 'all' || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
                title="Reset filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-slate-100">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gold-gradient text-slate-950 shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-amber-50 hover:text-slate-950'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Catalog Results Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading RAMBADEVI Jewellers catalog...</p>
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border-2 border-amber-200 p-8 space-y-4 shadow-2xs">
          <Gem className="w-12 h-12 text-amber-700 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-900 font-serif-luxury">
              No matching jewellery found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Try adjusting your category filter or search query, or submit a Custom Design inquiry.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-2xl bg-gold-gradient text-slate-950 font-bold text-xs shadow-xs"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1 font-medium">
            <span>
              Showing <strong className="text-slate-900">{sortedProducts.length}</strong> piece{sortedProducts.length !== 1 ? 's' : ''} in {selectedCategory}
            </span>
            <span>Live daily prices updated</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} rates={rates} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
