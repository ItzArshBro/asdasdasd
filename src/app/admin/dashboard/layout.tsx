'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Gem,
  TrendingUp,
  MessageSquare,
  LogOut,
  ExternalLink,
  Plus,
} from 'lucide-react';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      router.push('/admin/login');
    }
  };

  const navItems = [
    { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/dashboard/products', icon: Gem },
    { name: 'Live Rates', href: '/admin/dashboard/rates', icon: TrendingUp },
    { name: 'Inquiries', href: '/admin/dashboard/inquiries', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      {/* Top Bar - Minimalist Dark */}
      <header className="bg-neutral-950 border-b border-neutral-800 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center font-bold text-xs text-white">
            RJ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white tracking-wide">
                RAMBADEVI JEWELLERS
              </span>
              <span className="px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-[10px] font-semibold text-neutral-400">
                Admin
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Direct link to dedicated New Product page */}
          <Link
            href="/admin/dashboard/products/new"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors border border-neutral-800"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-red-400 hover:bg-neutral-900 transition-colors border border-neutral-800"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Sub Navigation Bar */}
      <div className="bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 py-2 overflow-x-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin/dashboard'
                ? pathname === '/admin/dashboard'
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-neutral-800 text-white font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 bg-black">
        {children}
      </main>
    </div>
  );
}
