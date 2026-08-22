'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductCategory, MetalType } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Image as ImageIcon,
  Check,
  Sparkles,
} from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [nepaliName, setNepaliName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Rani Haar & Necklaces');
  const [metalType, setMetalType] = useState<MetalType>('gold_24k');
  const [karat, setKarat] = useState('24K Fine Gold');
  const [weightGrams, setWeightGrams] = useState('');
  const [weightTola, setWeightTola] = useState('');
  const [makingChargePercentage, setMakingChargePercentage] = useState('10');
  const [description, setDescription] = useState('');
  const [inStock, setInStock] = useState(true);
  const [isFeatured, setIsFeatured] = useState(true);
  const [isTrending, setIsTrending] = useState(false);
  const [features, setFeatures] = useState<string[]>(['100% Hallmark Certified', 'Devdaha Workshop Handcrafted']);
  const [newFeature, setNewFeature] = useState('');

  // Image Upload state
  const [images, setImages] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-sync Weight Grams <-> Tola
  const handleGramsChange = (val: string) => {
    setWeightGrams(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setWeightTola((num / 11.6638).toFixed(3));
    } else {
      setWeightTola('');
    }
  };

  const handleTolaChange = (val: string) => {
    setWeightTola(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setWeightGrams((num * 11.6638).toFixed(2));
    } else {
      setWeightGrams('');
    }
  };

  // Helper to compress images client-side to prevent network/body payload limit issues
  const compressImage = (file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
  };

  // Handle local file uploads with auto-compression
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        let fileToUpload = files[i];
        if (fileToUpload.type.startsWith('image/')) {
          try {
            fileToUpload = await compressImage(fileToUpload);
          } catch (e) {
            console.error('[UPLOAD COMPRESSION] Failed, using original file', e);
          }
        }
        formData.append('files', fileToUpload);
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.urls) {
        setImages((prev) => [...prev, ...data.urls]);
      } else {
        setErrorMsg(data.error || 'Server rejected the file upload.');
      }
    } catch (err: any) {
      setErrorMsg(`Failed to upload: ${err.message || err}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Add external image URL
  const handleAddImageUrl = () => {
    if (customImageUrl.trim()) {
      setImages((prev) => [...prev, customImageUrl.trim()]);
      setCustomImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures((prev) => [...prev, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit product creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const parsedWeight = parseFloat(weightGrams);
    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      setErrorMsg('Please provide a valid weight in grams or tola.');
      return;
    }

    if (!name.trim()) {
      setErrorMsg('Please enter product name.');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          nepaliName: nepaliName.trim() || undefined,
          category,
          metalType,
          karat,
          weightGrams: parsedWeight,
          makingChargePercentage: parseFloat(makingChargePercentage) || 10,
          description: description.trim() || `${name} hallmarked by RAMBADEVI Jewellers, Devdaha-5.`,
          images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'],
          inStock,
          isFeatured,
          isTrending,
          features,
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/admin/dashboard/products');
        router.refresh();
      } else {
        setErrorMsg(data.error || 'Failed to create product.');
      }
    } catch (err: any) {
      setErrorMsg('Network error. Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard/products"
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Add New Jewellery Product
            </h1>
            <p className="text-xs text-neutral-400">
              List authentic jewellery in your public showroom catalog.
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300 font-medium">
          {errorMsg}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Details */}
        <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            1. Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Product Name (English) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Royal 24K Bridal Rani Haar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Nepali Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. २४ क्यारेट रानी हार"
                value={nepaliName}
                onChange={(e) => setNepaliName(e.target.value)}
                className="w-full text-sm px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Jewellery Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full text-sm px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900 text-white focus:outline-none focus:border-neutral-500"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Metal Purity Type *
              </label>
              <select
                value={metalType}
                onChange={(e) => {
                  const val = e.target.value as MetalType;
                  setMetalType(val);
                  if (val === 'gold_24k') setKarat('24K Fine Gold (छापावाल)');
                  if (val === 'gold_22k') setKarat('22K Tejabi Gold (तेजाबी)');
                  if (val === 'gold_18k') setKarat('18K Hallmarked');
                  if (val === 'silver_999') setKarat('999 Fine Silver (चाँदी)');
                  if (val === 'silver_925') setKarat('925 Sterling Silver');
                }}
                className="w-full text-sm px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900 text-white focus:outline-none focus:border-neutral-500"
              >
                <option value="gold_24k">24K Fine Gold (छापावाल सुन 99.5%+)</option>
                <option value="gold_22k">22K Tejabi Gold (तेजाबी सुन 91.6%)</option>
                <option value="gold_18k">18K Hallmarked Gold (75.0%)</option>
                <option value="silver_999">Fine Silver 999 (शुद्ध चाँदी)</option>
                <option value="silver_925">925 Sterling Silver</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Weight & Pricing */}
        <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            2. Weight &amp; Making Charge
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Weight in Grams (g) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="e.g. 11.66"
                value={weightGrams}
                onChange={(e) => handleGramsChange(e.target.value)}
                className="w-full text-sm px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Weight in Tola (तोला)
              </label>
              <input
                type="number"
                step="0.001"
                placeholder="e.g. 1.0"
                value={weightTola}
                onChange={(e) => handleTolaChange(e.target.value)}
                className="w-full text-sm px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Making Charge Percentage (%)
              </label>
              <input
                type="number"
                step="0.5"
                required
                placeholder="10"
                value={makingChargePercentage}
                onChange={(e) => setMakingChargePercentage(e.target.value)}
                className="w-full text-sm px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Product Image Uploads */}
        <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
              3. Product Images (Upload from Computer)
            </h2>
            <span className="text-xs text-neutral-500">{images.length} images added</span>
          </div>

          {/* Upload Drop Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-8 rounded-2xl border-2 border-dashed border-neutral-800 hover:border-neutral-600 bg-neutral-900/50 flex flex-col items-center justify-center cursor-pointer transition-colors text-center space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Click to browse or drag &amp; drop product photos
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Supports JPG, PNG, WEBP (Multiple images supported)
              </p>
            </div>
            {uploading && (
              <div className="text-xs font-medium text-amber-400 animate-pulse">
                Uploading photo(s) to server...
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Fallback Image URL Input */}
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Or paste direct image URL (https://...)..."
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
              className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors"
            >
              Add URL
            </button>
          </div>

          {/* Uploaded Images Gallery Previews */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900"
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 text-neutral-300 hover:text-white hover:bg-red-950 transition-colors"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-bold text-white">
                      Cover Photo
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Description & Highlights */}
        <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            4. Description &amp; Highlights
          </h2>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">
              Product Description
            </label>
            <textarea
              rows={4}
              placeholder="Detailed description of craftsmanship, purity, motifs, design heritage..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm p-4 rounded-xl border border-neutral-800 bg-neutral-900 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
            />
          </div>

          {/* Feature Highlights */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-neutral-400">
              Bullet Highlights
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 100% Chhapawal Hallmarked, Antique Matte Polish..."
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors"
              >
                Add Highlight
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {features.map((f, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-300"
                >
                  <span>{f}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(i)}
                    className="text-neutral-500 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: Visibility Switches */}
        <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            5. Catalog Visibility
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-4 h-4 rounded bg-neutral-800 border-neutral-700"
              />
              <span className="text-xs font-medium text-white">In Showroom Stock</span>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded bg-neutral-800 border-neutral-700"
              />
              <span className="text-xs font-medium text-white">Feature on Homepage</span>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 cursor-pointer">
              <input
                type="checkbox"
                checked={isTrending}
                onChange={(e) => setIsTrending(e.target.checked)}
                className="w-4 h-4 rounded bg-neutral-800 border-neutral-700"
              />
              <span className="text-xs font-medium text-white">Mark as Trending</span>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
          <Link
            href="/admin/dashboard/products"
            className="py-3 px-6 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white font-medium text-sm transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="py-3 px-8 rounded-xl bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save &amp; Publish Product</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
