'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import InquiryCartDrawer from './InquiryCartDrawer';
import WhatsAppFloatingButton from './WhatsAppFloatingButton';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    // Admin routes render in a dedicated, isolated clean black view container 
    // without public client components or styling conflicts
    return (
      <div className="bg-black min-h-screen text-white w-full flex flex-col">
        <div className="flex-1 bg-black">{children}</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <InquiryCartDrawer />
      <WhatsAppFloatingButton />
    </>
  );
}
