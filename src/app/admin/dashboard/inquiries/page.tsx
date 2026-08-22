'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CustomDesignInquiry, RepairBooking } from '@/lib/types';
import {
  Sparkles,
  Hammer,
  MessageCircle,
  Clock,
  Phone,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';

export default function AdminInquiriesPage() {
  const [customInquiries, setCustomInquiries] = useState<CustomDesignInquiry[]>([]);
  const [repairBookings, setRepairBookings] = useState<RepairBooking[]>([]);
  const [activeTab, setActiveTab] = useState<'custom' | 'repairs'>('custom');
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      if (data.success) {
        setCustomInquiries(data.customInquiries || []);
        setRepairBookings(data.repairBookings || []);
      }
    } catch (e) {
      console.error('Failed to load inquiries', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (type: 'custom' | 'repair', id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        if (type === 'custom') {
          setCustomInquiries((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status: newStatus as any } : item))
          );
        } else {
          setRepairBookings((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status: newStatus as any } : item))
          );
        }
      }
    } catch (e) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="space-y-8 text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-neutral-950 border border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Customer Inquiries &amp; Service Bookings
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Review custom design orders, repair appointments, and customer specifications.
          </p>
        </div>

        <button
          onClick={fetchInquiries}
          className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
        <button
          onClick={() => setActiveTab('custom')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'custom'
              ? 'bg-white text-black'
              : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Custom Designs ({customInquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('repairs')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'repairs'
              ? 'bg-white text-black'
              : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          <Hammer className="w-4 h-4" />
          <span>Repair &amp; Polish Bookings ({repairBookings.length})</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 text-center text-neutral-500">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Loading inquiries...</p>
        </div>
      ) : activeTab === 'custom' ? (
        customInquiries.length === 0 ? (
          <div className="py-16 text-center bg-neutral-950 rounded-2xl border border-neutral-800 p-8">
            <Sparkles className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No custom design orders yet</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Customer inquiries submitted via the public &quot;Order Custom Design&quot; form will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {customInquiries.map((inq) => (
              <div
                key={inq.id}
                className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-neutral-800/80">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{inq.customerName}</h3>
                      <span className="font-mono text-[10px] text-neutral-500">ID: {inq.id}</span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{inq.phone}</span>
                      <span>•</span>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(inq.createdAt).toLocaleString()}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={inq.status}
                      onChange={(e) => handleUpdateStatus('custom', inq.id, e.target.value)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-white focus:outline-none"
                    >
                      <option value="new">Status: New</option>
                      <option value="in_discussion">In Discussion</option>
                      <option value="quoted">Price Quoted</option>
                      <option value="in_production">In Production</option>
                      <option value="completed">Completed</option>
                    </select>

                    <Link
                      href={`https://wa.me/977${inq.phone}?text=${encodeURIComponent(`Namaste ${inq.customerName}, this is RAMBADEVI Jewellers regarding your custom design inquiry (${inq.category}).`)}`}
                      target="_blank"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800/80">
                    <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Category</span>
                    <span className="font-semibold text-white mt-0.5 block">{inq.category}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800/80">
                    <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Metal Purity</span>
                    <span className="font-semibold text-white mt-0.5 block">{inq.metalType}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800/80">
                    <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Weight Range</span>
                    <span className="font-semibold text-white mt-0.5 block">{inq.weightRange}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800/80">
                    <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Budget (NPR)</span>
                    <span className="font-semibold text-white mt-0.5 block">{inq.budgetNpr || 'Not specified'}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">
                    Design Notes &amp; Specifications:
                  </span>
                  <p className="text-xs text-neutral-200 leading-relaxed font-sans">{inq.notes}</p>
                </div>

                {inq.referenceImageUrl && (
                  <div className="flex items-center gap-2 text-xs pt-1">
                    <ImageIcon className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-400">Reference Photo:</span>
                    <Link
                      href={inq.referenceImageUrl}
                      target="_blank"
                      className="text-white hover:underline truncate max-w-sm"
                    >
                      {inq.referenceImageUrl}
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : repairBookings.length === 0 ? (
        <div className="py-16 text-center bg-neutral-950 rounded-2xl border border-neutral-800 p-8">
          <Hammer className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No repair appointments yet</h3>
          <p className="text-xs text-neutral-400 mt-1">
            Customer appointments booked from &quot;Book Repair / Polish&quot; will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {repairBookings.map((bk) => (
            <div
              key={bk.id}
              className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-neutral-800/80">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{bk.customerName}</h3>
                    <span className="font-mono text-[10px] text-neutral-500">ID: {bk.id}</span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{bk.phone}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5" />
                    <span>Scheduled for: {bk.preferredDate} ({bk.preferredTimeSlot})</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={bk.status}
                    onChange={(e) => handleUpdateStatus('repair', bk.id, e.target.value)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-white focus:outline-none"
                  >
                    <option value="pending">Status: Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="ready_for_pickup">Ready for Pickup</option>
                    <option value="completed">Completed</option>
                  </select>

                  <Link
                    href={`https://wa.me/977${bk.phone}?text=${encodeURIComponent(`Namaste ${bk.customerName}, this is RAMBADEVI Jewellers regarding your repair appointment for ${bk.itemType}.`)}`}
                    target="_blank"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800/80">
                  <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Service Type</span>
                  <span className="font-semibold text-white mt-0.5 block">{bk.serviceType}</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800/80">
                  <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Jewellery Item</span>
                  <span className="font-semibold text-white mt-0.5 block">{bk.itemType}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">
                  Damage Description &amp; Specific Request:
                </span>
                <p className="text-xs text-neutral-200 leading-relaxed font-sans">{bk.damageDescription}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
