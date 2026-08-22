'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, DailyRates } from '@/lib/types';
import { DEFAULT_RATES } from '@/lib/constants';
import { calculateProductPrice, formatNPR, formatWeight } from '@/lib/rates';
import {
  Plus,
  Search,
  Trash2,
  ExternalLink,
  Gem,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [rates, setRates] = useState<DailyRates>(DEFAULT_RATES);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [prodRes, rateRes] = await Promise.all([
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/rates').then((r) => r.json()),
      ]);

      if (prodRes.success) setProducts(prodRes.products || []);
      if (rateRes.success) setRates(rateRes.rates || DEFAULT_RATES);
    } catch (e) {
      console.error('Failed to load products', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from your catalog?`)) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(data.error || 'Failed to delete product');
      }
    } catch (err) {
      alert('Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.karat.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 text-white">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-neutral-950 border border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Product Inventory Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage your authentic Devdaha showroom jewellery catalog.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Dedicated Page Navigation Button */}
          <Link
            href="/admin/dashboard/products/new"
            className="py-2.5 px-4 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, SKU, category, karat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2 rounded-xl border border-neutral-800 bg-neutral-900 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
          />
        </div>

        <span className="text-xs text-neutral-500 hidden sm:block">
          {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''} listed
        </span>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="py-20 text-center text-neutral-500">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Loading inventory...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-neutral-950 rounded-2xl border border-neutral-800 p-8 space-y-4 max-w-lg mx-auto">
          <Gem className="w-10 h-10 text-neutral-600 mx-auto" />
          <div>
            <h3 className="text-base font-semibold text-white">No products listed</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Your catalog is currently empty with zero fake data. Click below to add your real showroom pieces.
            </p>
          </div>
          <Link
            href="/admin/dashboard/products/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Product</span>
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-neutral-900/80 text-neutral-400 font-semibold uppercase tracking-wider text-[11px] border-b border-neutral-800">
                  <th className="py-3.5 px-4">Item</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Purity &amp; Karat</th>
                  <th className="py-3.5 px-4">Weight</th>
                  <th className="py-3.5 px-4">Est. Live Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredProducts.map((p) => {
                  const price = calculateProductPrice(p, rates);
                  return (
                    <tr key={p.id} className="hover:bg-neutral-900/40 transition-colors">
                      {/* Product Thumbnail & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 shrink-0">
                            <img
                              src={p.images?.[0] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=200&q=80'}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-white block text-sm">{p.name}</span>
                            <span className="text-[10px] text-neutral-500 font-mono">SKU: {p.sku}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-neutral-300 font-medium">
                        {p.category}
                      </td>

                      {/* Karat */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-[11px] font-semibold text-neutral-200">
                          {p.karat}
                        </span>
                      </td>

                      {/* Weight */}
                      <td className="py-3.5 px-4 text-neutral-300 font-medium">
                        {formatWeight(p.weightGrams)}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-bold text-white">
                        {formatNPR(price.totalPrice)}
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-4">
                        {p.inStock ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500">
                            <XCircle className="w-3.5 h-3.5" /> Made to Order
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/collections/${p.id}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
                            title="View on store"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            disabled={deletingId === p.id}
                            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-400 hover:border-red-900 transition-colors disabled:opacity-50"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
