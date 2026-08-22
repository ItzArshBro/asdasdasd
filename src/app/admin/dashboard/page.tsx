'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DailyRates, CustomDesignInquiry, RepairBooking } from '@/lib/types';
import { DEFAULT_RATES } from '@/lib/constants';
import {
  Gem,
  Sparkles,
  Hammer,
  TrendingUp,
  MessageCircle,
  Plus,
  RefreshCw,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [rates, setRates] = useState<DailyRates>(DEFAULT_RATES);
  const [recentInquiries, setRecentInquiries] = useState<CustomDesignInquiry[]>([]);
  const [recentBookings, setRecentBookings] = useState<RepairBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, ratesRes, inqRes] = await Promise.all([
        fetch('/api/stats').then((r) => r.json()),
        fetch('/api/rates').then((r) => r.json()),
        fetch('/api/inquiries').then((r) => r.json()),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (ratesRes.success) setRates(ratesRes.rates);
      if (inqRes.success) {
        setRecentInquiries((inqRes.customInquiries || []).slice(0, 5));
        setRecentBookings((inqRes.repairBookings || []).slice(0, 5));
      }
    } catch (e) {
      console.error('Failed to load dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 text-white">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-neutral-950 border border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Store Performance &amp; Web Statistics
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time analytics for your RAMBADEVI Jewellers web platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Direct Link to Dedicated New Product Page */}
          <Link
            href="/admin/dashboard/products/new"
            className="py-2.5 px-4 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Products</span>
            <Gem className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="text-2xl font-bold text-white">
            {stats?.totalProductsCount ?? 0}
          </div>
          <div className="text-[11px] text-neutral-500 flex items-center justify-between">
            <span>In Stock: {stats?.inStockProducts ?? 0}</span>
            <Link href="/admin/dashboard/products" className="text-neutral-300 hover:text-white">
              Manage →
            </Link>
          </div>
        </div>

        {/* Custom Designs */}
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Custom Designs</span>
            <Sparkles className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="text-2xl font-bold text-white">
            {stats?.totalCustomDesignInquiries ?? 0}
          </div>
          <div className="text-[11px] text-neutral-500 flex items-center justify-between">
            <span className="text-amber-400">{stats?.pendingCustomInquiries ?? 0} Pending</span>
            <Link href="/admin/dashboard/inquiries" className="text-neutral-300 hover:text-white">
              View →
            </Link>
          </div>
        </div>

        {/* Repair Bookings */}
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Repair Bookings</span>
            <Hammer className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="text-2xl font-bold text-white">
            {stats?.totalRepairBookings ?? 0}
          </div>
          <div className="text-[11px] text-neutral-500 flex items-center justify-between">
            <span className="text-amber-400">{stats?.pendingRepairBookings ?? 0} New</span>
            <Link href="/admin/dashboard/inquiries" className="text-neutral-300 hover:text-white">
              View →
            </Link>
          </div>
        </div>

        {/* Cart Checkouts */}
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">WhatsApp Cart Inquiries</span>
            <MessageCircle className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="text-2xl font-bold text-white">
            {stats?.totalCartInquiries ?? 0}
          </div>
          <div className="text-[11px] text-neutral-500">
            Dispatched to 9857073727
          </div>
        </div>
      </div>

      {/* Live Market Rates Bar */}
      <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-neutral-800/80">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-neutral-400" />
            <h3 className="text-sm font-semibold text-white">
              Current Live Metal Rates (Public Website Active)
            </h3>
          </div>
          <Link
            href="/admin/dashboard/rates"
            className="py-1.5 px-3 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white font-medium text-xs transition-colors"
          >
            Edit Rates →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
            <span className="text-[10px] font-semibold text-neutral-400 uppercase">24K Fine Gold</span>
            <div className="text-base font-bold text-white mt-0.5">
              NPR {rates.gold24kPerTola.toLocaleString('en-IN')}<span className="text-xs font-normal text-neutral-500">/tola</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
            <span className="text-[10px] font-semibold text-neutral-400 uppercase">22K Tejabi Gold</span>
            <div className="text-base font-bold text-white mt-0.5">
              NPR {rates.gold22kPerTola.toLocaleString('en-IN')}<span className="text-xs font-normal text-neutral-500">/tola</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
            <span className="text-[10px] font-semibold text-neutral-400 uppercase">18K Hallmarked</span>
            <div className="text-base font-bold text-white mt-0.5">
              NPR {rates.gold18kPerGram.toLocaleString('en-IN')}<span className="text-xs font-normal text-neutral-500">/g</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
            <span className="text-[10px] font-semibold text-neutral-400 uppercase">Fine Silver 999</span>
            <div className="text-base font-bold text-white mt-0.5">
              NPR {rates.silverPerTola.toLocaleString('en-IN')}<span className="text-xs font-normal text-neutral-500">/tola</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Inquiries and Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Custom Design Inquiries */}
        <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neutral-400" />
              <span>Recent Custom Design Orders</span>
            </h3>
            <Link
              href="/admin/dashboard/inquiries"
              className="text-xs font-semibold text-neutral-400 hover:text-white"
            >
              View All
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <p className="text-xs text-neutral-500 py-6 text-center">No custom inquiries received yet.</p>
          ) : (
            <div className="space-y-2.5">
              {recentInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-3.5 rounded-xl border border-neutral-800/80 bg-neutral-900/60 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-white">{inq.customerName}</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-md bg-neutral-800 text-neutral-300 uppercase">
                        {inq.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">
                      {inq.category} • {inq.metalType} • {inq.weightRange}
                    </p>
                  </div>

                  <Link
                    href={`https://wa.me/977${inq.phone}`}
                    target="_blank"
                    className="p-2 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition-colors shrink-0"
                    title="Reply on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Repair Bookings */}
        <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Hammer className="w-4 h-4 text-neutral-400" />
              <span>Recent Repair &amp; Polish Appointments</span>
            </h3>
            <Link
              href="/admin/dashboard/inquiries"
              className="text-xs font-semibold text-neutral-400 hover:text-white"
            >
              View All
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <p className="text-xs text-neutral-500 py-6 text-center">No repair bookings received yet.</p>
          ) : (
            <div className="space-y-2.5">
              {recentBookings.map((bk) => (
                <div
                  key={bk.id}
                  className="p-3.5 rounded-xl border border-neutral-800/80 bg-neutral-900/60 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-white">{bk.customerName}</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-md bg-neutral-800 text-neutral-300 uppercase">
                        {bk.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">
                      {bk.serviceType} • {bk.itemType}
                    </p>
                    <p className="text-[11px] text-neutral-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{bk.preferredDate} ({bk.preferredTimeSlot})</span>
                    </p>
                  </div>

                  <Link
                    href={`https://wa.me/977${bk.phone}`}
                    target="_blank"
                    className="p-2 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition-colors shrink-0"
                    title="Reply on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
