'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { Product, DailyRates } from '@/lib/types';
import { calculateProductPrice, formatNPR } from '@/lib/rates';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, ChevronLeft, ChevronRight, Heart, Check } from 'lucide-react';

interface Props {
  products: Product[];
  rates: DailyRates;
  categoryFilter?: string;
  darkTheme?: boolean;
}

export default function ProductCarousel({ products, rates, categoryFilter, darkTheme = false }: Props) {
  const { addToCart } = useCart();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter products by category if a filter is set
  let displayedProducts = products;
  if (categoryFilter && categoryFilter !== 'All') {
    displayedProducts = products.filter(
      (p) => p.category.toLowerCase() === categoryFilter.toLowerCase()
    );
    
    // If the database has products, but none match this specific category filter,
    // display all real database products instead of the mock sample data!
    if (displayedProducts.length === 0 && products.length > 0) {
      displayedProducts = products;
    }
  }

  // Fallback to high-end sample data ONLY if there are absolutely no products in the database
  if (displayedProducts.length === 0 && products.length === 0) {
    const isRingFilter = categoryFilter?.toLowerCase().includes('ring');
    
    const sampleRings: Product[] = [
      {
        id: 'sample-ring-1',
        name: 'Solitaire Princess-Cut Gold Ring',
        sku: 'R-DM-001',
        category: 'Rings',
        metalType: 'gold_18k',
        karat: '18K',
        weightGrams: 5.2,
        weightTola: 0.446,
        makingChargePercentage: 12,
        description: 'Exquisite princess-cut solitaire diamond ring set in 18K hallmarked yellow gold.',
        features: ['18K Gold', 'Certified VVS1 Diamond', 'Handcrafted Setting'],
        images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop'],
        inStock: true,
        isFeatured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'sample-ring-2',
        name: 'Royal Crown Couple Bands',
        sku: 'R-CP-002',
        category: 'Rings',
        metalType: 'gold_22k',
        karat: '22K',
        weightGrams: 9.5,
        weightTola: 0.814,
        makingChargePercentage: 10,
        description: 'Exquisite couple rings featuring a crown design carved in 22K Tejabi Gold.',
        features: ['22K Tejabi Gold', 'Laser Carvings', 'Matching Bridal Set'],
        images: ['https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop'],
        inStock: true,
        isFeatured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'sample-ring-3',
        name: 'Vintage Halo Floral Ring',
        sku: 'R-DM-003',
        category: 'Rings',
        metalType: 'gold_18k',
        karat: '18K',
        weightGrams: 6.8,
        weightTola: 0.583,
        makingChargePercentage: 15,
        description: 'A classic halo design mimicking a blooming flower in 18K white gold.',
        features: ['18K White Gold', 'Vintage Design', 'Cluster Prongs'],
        images: ['https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=600&auto=format&fit=crop'],
        inStock: true,
        isFeatured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'sample-ring-4',
        name: 'Eternity Diamond Accent Ring',
        sku: 'R-DM-004',
        category: 'Rings',
        metalType: 'gold_18k',
        karat: '18K',
        weightGrams: 4.8,
        weightTola: 0.412,
        makingChargePercentage: 12,
        description: 'Continuous pavé-set diamonds wrapping around an 18K yellow gold band.',
        features: ['18K Gold', 'Eternity Pavé', 'Ultra Slim Design'],
        images: ['https://images.unsplash.com/photo-1543294001-f7cbfe92237e?q=80&w=600&auto=format&fit=crop'],
        inStock: true,
        isFeatured: true,
        createdAt: new Date().toISOString()
      }
    ];

    const sampleEarrings: Product[] = [
      {
        id: 'sample-ear-1',
        name: 'Emerald Halo Stud Earrings',
        sku: 'E-EM-001',
        category: 'Earrings & Jhumkas',
        metalType: 'gold_18k',
        karat: '18K',
        weightGrams: 6.5,
        weightTola: 0.557,
        makingChargePercentage: 14,
        description: 'Vibrant oval emeralds surrounded by a double halo of micro-pavé diamonds.',
        features: ['18K Yellow Gold', 'Genuine Emeralds', 'Comfort Push Back'],
        images: ['https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=600&auto=format&fit=crop'],
        inStock: true,
        isFeatured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'sample-ear-2',
        name: 'Royal Ruby Tear-Drop Jhumkas',
        sku: 'E-RB-002',
        category: 'Earrings & Jhumkas',
        metalType: 'gold_22k',
        karat: '22K',
        weightGrams: 11.2,
        weightTola: 0.960,
        makingChargePercentage: 12,
        description: 'Stunning traditional design featuring rubies cascading down a drop setting.',
        features: ['22K Gold', 'Natural Pigeon-Blood Rubies', 'Traditional Handcrafting'],
        images: ['https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop'],
        inStock: true,
        isFeatured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'sample-ear-3',
        name: 'Sapphire Cushion Drop Earrings',
        sku: 'E-SP-003',
        category: 'Earrings & Jhumkas',
        metalType: 'gold_18k',
        karat: '18K',
        weightGrams: 8.4,
        weightTola: 0.720,
        makingChargePercentage: 14,
        description: 'Velvety blue sapphire drops suspended below a diamond set bale in white gold.',
        features: ['18K White Gold', 'Royal Blue Sapphires', 'Drop Hook Clasp'],
        images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop'],
        inStock: true,
        isFeatured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'sample-ear-4',
        name: 'Classic Diamond Studs',
        sku: 'E-DM-004',
        category: 'Earrings & Jhumkas',
        metalType: 'gold_18k',
        karat: '18K',
        weightGrams: 3.5,
        weightTola: 0.300,
        makingChargePercentage: 10,
        description: 'Minimalist round brilliant cut solitaire diamond stud earrings.',
        features: ['18K White Gold', '0.50 Carat Total Weight', 'Four Prong Setting'],
        images: ['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600&auto=format&fit=crop'],
        inStock: true,
        isFeatured: true,
        createdAt: new Date().toISOString()
      }
    ];

    displayedProducts = isRingFilter ? sampleRings : sampleEarrings;
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo =
        direction === 'left' ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);

    // Increment stats event
    fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'totalProductViews' }),
    }).catch(() => {});
  };

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="relative group/carousel w-full">
      {/* Slider Controls (Absolute arrows visible on hover) */}
      <div className="absolute -top-16 right-0 flex items-center gap-2">
        <button
          onClick={() => scroll('left')}
          className={`p-2 rounded-lg border transition-all ${
            darkTheme
              ? 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white hover:border-neutral-700'
              : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => scroll('right')}
          className={`p-2 rounded-lg border transition-all ${
            darkTheme
              ? 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white hover:border-neutral-700'
              : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Product Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4 select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayedProducts.map((product) => {
          const priceInfo = calculateProductPrice(product, rates);
          // Standard original price (10% higher for mockup/sale display)
          const originalPrice = priceInfo.totalPrice * 1.1;
          const isAdded = addedIds[product.id];
          const isLiked = likedIds[product.id];

          return (
            <div
              key={product.id}
              className="w-[280px] sm:w-[320px] shrink-0 snap-start rounded-2xl bg-white border border-neutral-100/80 p-4 flex flex-col group relative shadow-2xs hover:shadow-md transition-all duration-300"
            >
              {/* Product Header details */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-400">
                  {product.category}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-100 text-[9px] font-extrabold uppercase">
                  Sale
                </span>
              </div>

              {/* Product Image Container */}
              <Link
                href={`/collections/${product.id}`}
                className="relative block aspect-square overflow-hidden bg-neutral-50 rounded-xl mb-4"
              >
                <img
                  src={product.images[0] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'}
                  alt={product.name}
                  className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Heart Button */}
                <button
                  onClick={(e) => toggleLike(e, product.id)}
                  className={`absolute top-2.5 right-2.5 p-1.5 rounded-full border transition-all backdrop-blur-xs ${
                    isLiked
                      ? 'bg-red-500 border-red-500 text-white'
                      : 'bg-white/80 border-neutral-200 text-neutral-400 hover:text-red-500'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
              </Link>

              {/* Title & Metal info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900 font-serif-luxury line-clamp-1">
                    {product.name}
                  </h4>
                  <p className="text-[10px] text-neutral-400 mt-1 font-semibold">
                    {product.karat} • {product.weightGrams.toFixed(2)}g
                  </p>
                </div>

                {/* Pricing & Add to Cart */}
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] line-through text-neutral-400 font-semibold leading-none">
                      {formatNPR(originalPrice)}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-neutral-900 mt-1">
                      {formatNPR(priceInfo.totalPrice)}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
                      isAdded
                        ? 'bg-neutral-900 border-neutral-900 text-white'
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-900 hover:text-white hover:border-neutral-900'
                    }`}
                    aria-label="Add to cart"
                  >
                    {isAdded ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <ShoppingBag className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
