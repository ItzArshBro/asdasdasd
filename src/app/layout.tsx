import type { Metadata } from 'next';
import { Inter, Cinzel } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InquiryCartDrawer from '@/components/InquiryCartDrawer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'RAMBADEVI Jewellers | Devdaha-5, Khaireni, Rupandehi | Live Gold Rates & Bridal Jewellery',
  description:
    'Official website for RAMBADEVI Jewellers in Devdaha-5, Khaireni, Rupandehi. Authentic 24K pure gold, 22K bridal sets, live metal price calculator, custom design orders, and repair bookings. Contact: 9857073727.',
  keywords: [
    'RAMBADEVI Jewellers',
    'Jewellery in Devdaha',
    'Khaireni Rupandehi jewellery store',
    'Nepal gold price live calculator',
    '24K Chhapawal Rani Haar',
    'Custom bridal jewelry Rupandehi',
    'Gold repair polish Devdaha',
    'Nepal 24K gold rates',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`}>
      <body className="min-h-screen bg-[#F7F4EF] text-[#1A1A1A] flex flex-col antialiased">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <InquiryCartDrawer />
          <WhatsAppFloatingButton />
        </CartProvider>
      </body>
    </html>
  );
}
