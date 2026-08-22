'use client';

import React, { useState } from 'react';
import { generateCustomDesignInquiry } from '@/lib/whatsapp';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  MessageCircle,
  CheckCircle2,
  ShieldCheck,
  Image as ImageIcon,
} from 'lucide-react';

export default function CustomDesignPage() {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [metalType, setMetalType] = useState('24K Fine Gold (छापावाल सुन)');
  const [category, setCategory] = useState('Bridal Set / Rani Haar');
  const [weightRange, setWeightRange] = useState('2 - 3 Tola (~25g - 35g)');
  const [budgetNpr, setBudgetNpr] = useState('');
  const [notes, setNotes] = useState('');
  const [referenceImageUrl, setReferenceImageUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !phone.trim() || !notes.trim()) {
      setErrorMsg('Please provide your name, phone number, and brief design notes.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'custom_design',
          customerName: customerName.trim(),
          phone: phone.trim(),
          whatsapp: whatsapp.trim() || phone.trim(),
          metalType,
          category,
          weightRange,
          budgetNpr: budgetNpr.trim(),
          notes: notes.trim(),
          referenceImageUrl: referenceImageUrl.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.inquiry) {
        setSubmittedInquiry(data.inquiry);
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}
      } else {
        setErrorMsg(data.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please check your connection or contact us via WhatsApp directly.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendToWhatsApp = () => {
    const url = generateCustomDesignInquiry({
      customerName: customerName.trim(),
      phone: phone.trim(),
      metalType,
      category,
      weightRange,
      budgetNpr: budgetNpr.trim(),
      notes: notes.trim(),
    });
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 bg-white">
      {/* Page Header - Pure White & Gold Theme */}
      <div className="rounded-3xl bg-amber-50/60 text-slate-900 p-8 sm:p-10 relative overflow-hidden border-2 border-amber-300 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-amber-300 text-amber-900 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Bespoke Artisan Goldsmiths</span>
          </div>
          {/* Main User Specified Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif-luxury tracking-tight text-slate-950">
            Order Custom Design
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Turn your dream jewellery into reality. Share your ideas, sketches, Pinterest inspirations, or exact weight requirements. Our master goldsmiths in Devdaha-5, Khaireni will craft your bespoke masterpiece with hallmark certified purity.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form Column */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border-2 border-amber-300 p-6 sm:p-8 shadow-md">
            {submittedInquiry ? (
              <div className="py-8 text-center space-y-6 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900 font-serif-luxury">
                    Custom Design Request Received!
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
                    Inquiry Reference ID: <strong className="font-mono text-slate-800">{submittedInquiry.id}</strong>. Our head artisan is reviewing your specifications.
                  </p>
                </div>

                {/* Instant WhatsApp Send Button */}
                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-left space-y-3">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                    Speed up your quotation:
                  </span>
                  <p className="text-xs text-slate-700">
                    Click below to open WhatsApp with your pre-filled inquiry details and chat directly with RAMBADEVI Jewellers.
                  </p>
                  <button
                    onClick={handleSendToWhatsApp}
                    className="w-full py-4 px-4 rounded-2xl bg-gold-gradient text-slate-950 font-extrabold text-sm hover:brightness-105 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5 fill-slate-950" />
                    <span>Send to WhatsApp Now (9857073727)</span>
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSubmittedInquiry(null);
                      setCustomerName('');
                      setPhone('');
                      setNotes('');
                    }}
                    className="text-xs text-slate-500 hover:text-slate-900 underline font-medium"
                  >
                    Submit Another Custom Design Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-amber-200 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 font-serif-luxury">
                    Order Custom Design Inquiry Form
                  </h3>
                  <p className="text-xs text-slate-500">
                    Fill in your details below to get a custom quote and 3D preview consultation.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold">
                    {errorMsg}
                  </div>
                )}

                {/* Contact Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maya Shrestha"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border-2 border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9847XXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border-2 border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
                    />
                  </div>
                </div>

                {/* Metal Purity & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                      Metal Purity *
                    </label>
                    <select
                      value={metalType}
                      onChange={(e) => setMetalType(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border-2 border-slate-200 bg-white focus:outline-hidden focus:border-amber-400"
                    >
                      <option value="24K Fine Gold (छापावाल सुन)">24K Fine Gold (छापावाल सुन 99.5%)</option>
                      <option value="22K Tejabi Gold (तेजाबी सुन)">22K Tejabi Gold (तेजाबी सुन 91.6%)</option>
                      <option value="18K Hallmarked Gold">18K Hallmarked Gold (Rose / Yellow / White)</option>
                      <option value="999 Fine Silver">999 Fine Silver (शुद्ध चाँदी)</option>
                      <option value="925 Sterling Silver">925 Sterling Silver</option>
                      <option value="Diamond Studded Gold">Diamond Studded (IGI Certified)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                      Jewellery Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border-2 border-slate-200 bg-white focus:outline-hidden focus:border-amber-400"
                    >
                      <option value="Bridal Set / Rani Haar">Bridal Set / Rani Haar</option>
                      <option value="Traditional Naugedi / Tilhari">Traditional Naugedi / Tilhari</option>
                      <option value="Bangles / Chura / Kada">Bangles / Chura / Kada</option>
                      <option value="Earrings / Jhumka / Top">Earrings / Jhumka / Top</option>
                      <option value="Engagement & Couple Rings">Engagement &amp; Couple Rings</option>
                      <option value="Mangalsutra & Pendants">Mangalsutra &amp; Pendants</option>
                      <option value="Men's Chain & Kada">Men&apos;s Chain &amp; Kada</option>
                      <option value="Silver Pooja Kalash & Utensils">Silver Pooja Kalash &amp; Utensils</option>
                      <option value="Other Custom Ornaments">Other Custom Ornaments</option>
                    </select>
                  </div>
                </div>

                {/* Desired Weight & Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                      Desired Weight Range
                    </label>
                    <select
                      value={weightRange}
                      onChange={(e) => setWeightRange(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border-2 border-slate-200 bg-white focus:outline-hidden focus:border-amber-400"
                    >
                      <option value="Under 1 Tola (< 11.66g)">Under 1 Tola (&lt; 11.66g)</option>
                      <option value="1 - 2 Tola (~12g - 23g)">1 - 2 Tola (~12g - 23g)</option>
                      <option value="2 - 3 Tola (~25g - 35g)">2 - 3 Tola (~25g - 35g)</option>
                      <option value="3 - 5 Tola (~35g - 58g)">3 - 5 Tola (~35g - 58g)</option>
                      <option value="5 - 10 Tola (Heavy Bridal)">5 - 10 Tola (Heavy Bridal)</option>
                      <option value="Custom / Flexible Weight">Custom / Flexible Weight</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                      Approximate Target Budget (NPR)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NPR 2,50,000 - 3,00,000"
                      value={budgetNpr}
                      onChange={(e) => setBudgetNpr(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border-2 border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
                    />
                  </div>
                </div>

                {/* Reference Image */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                    Reference Photo Link or Image URL (Optional)
                  </label>
                  <div className="relative">
                    <ImageIcon className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                    <input
                      type="url"
                      placeholder="Paste image link from Pinterest, Google Photos, or Unsplash..."
                      value={referenceImageUrl}
                      onChange={(e) => setReferenceImageUrl(e.target.value)}
                      className="w-full text-xs sm:text-sm pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    You can also directly attach photos when chatting with us on WhatsApp.
                  </p>
                </div>

                {/* Design Notes */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                    Custom Design Specifications &amp; Notes *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your design specifications (e.g. peacock filigree motifs, antique polish, ruby gemstone settings, exact ring size, urgent delivery date for wedding)..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-xs sm:text-sm p-4 rounded-2xl border-2 border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-2xl bg-gold-gradient text-slate-950 font-extrabold text-sm hover:brightness-105 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-slate-950" />
                        <span>Submit Custom Design Inquiry</span>
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleSendToWhatsApp}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5 mx-auto"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Or directly message RAMBADEVI Jewellers on WhatsApp (9857073727)</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Info Column - Pure White & Gold Cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* Process Timeline */}
          <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/50 border-2 border-amber-300 shadow-md space-y-6">
            <h3 className="text-xl font-bold font-serif-luxury text-slate-950">
              How Custom Orders Work
            </h3>

            <div className="space-y-5 text-xs">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-gold-gradient text-slate-950 font-extrabold flex items-center justify-center shrink-0 shadow-2xs">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Design Consultation &amp; Estimate</h4>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    Share your idea. We calculate the exact gold weight, making charge, and total quotation based on live rates.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-gold-gradient text-slate-950 font-extrabold flex items-center justify-center shrink-0 shadow-2xs">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">3D / Prototype Approval</h4>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    We create a prototype layout or sketch for your approval so the final piece matches your vision 100%.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-gold-gradient text-slate-950 font-extrabold flex items-center justify-center shrink-0 shadow-2xs">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Master Goldsmith Handcrafting</h4>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    Crafted in our Devdaha workshop using pure hallmarked gold with precision filigree and gem setting.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-gold-gradient text-slate-950 font-extrabold flex items-center justify-center shrink-0 shadow-2xs">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Showroom Pickup or Secure Handover</h4>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    Visit our Devdaha-5, Khaireni showroom to try on your finished jewel with official hallmark certificate.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Guarantees */}
          <div className="p-6 rounded-3xl bg-white border-2 border-amber-200 shadow-2xs space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-serif-luxury">
              Our Custom Design Guarantees
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <span>100% Purity Hallmarking (24K / 22K / 18K)</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Transparent weight measurement before and after crafting</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Free lifetime cleaning and maintenance service</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
