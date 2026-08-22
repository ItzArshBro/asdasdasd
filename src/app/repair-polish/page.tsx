'use client';

import React, { useState } from 'react';
import { STORE_INFO, REPAIR_SERVICES } from '@/lib/constants';
import { generateRepairBookingInquiry } from '@/lib/whatsapp';
import confetti from 'canvas-confetti';
import {
  Hammer,
  Sparkles,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  MapPin,
  Clock,
} from 'lucide-react';

export default function RepairPolishPage() {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [itemType, setItemType] = useState('24K / 22K Gold Necklace / Rani Haar');
  const [serviceType, setServiceType] = useState(REPAIR_SERVICES[0].name);
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('Morning (10:00 AM - 1:00 PM)');
  const [damageDescription, setDamageDescription] = useState('');
  const [referenceImageUrl, setReferenceImageUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !phone.trim() || !damageDescription.trim()) {
      setErrorMsg('Please fill in your name, phone number, and describe the condition of your item.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'repair_booking',
          customerName: customerName.trim(),
          phone: phone.trim(),
          whatsapp: whatsapp.trim() || phone.trim(),
          itemType,
          serviceType,
          preferredDate: preferredDate || new Date().toISOString().split('T')[0],
          preferredTimeSlot,
          damageDescription: damageDescription.trim(),
          referenceImageUrl: referenceImageUrl.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.booking) {
        setSubmittedBooking(data.booking);
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}
      } else {
        setErrorMsg(data.error || 'Failed to submit booking. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again or chat with us directly on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendToWhatsApp = () => {
    const url = generateRepairBookingInquiry({
      customerName: customerName.trim(),
      phone: phone.trim(),
      itemType,
      serviceType,
      preferredDate: preferredDate || 'As soon as possible',
      preferredTimeSlot,
      damageDescription: damageDescription.trim(),
    });
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 bg-transparent">
      {/* Page Header - Pure White & Gold Theme */}
      <div className="rounded-xl bg-white text-slate-900 p-8 sm:p-10 relative overflow-hidden border border-slate-200 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800">
            Professional Restoration Workshop
          </div>
          {/* Main User Specified Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif-luxury tracking-tight text-slate-950">
            Book Repair / Polish
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Give your cherished gold, silver, and diamond ornaments a brand-new brilliant shine. From high-gloss ultrasonic polishing and ring resizing to laser joint soldering, RAMBADEVI Jewellers handles every repair with utmost care in Devdaha-5, Khaireni.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 min-[375px]:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {REPAIR_SERVICES.map((srv) => (
          <div
            key={srv.id}
            onClick={() => setServiceType(srv.name)}
            className={`p-5 rounded-xl border transition-all cursor-pointer ${
              serviceType === srv.name
                ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-200'
                : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-xs'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-gold-gradient text-slate-950 flex items-center justify-center font-bold text-sm shadow-2xs mb-3">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-serif-luxury">
              {srv.name}
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {srv.desc}
            </p>
            <div className="mt-3 text-[11px] font-extrabold text-amber-800 flex items-center gap-1">
              <span>Select Service</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form Column */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-md">
            {submittedBooking ? (
              <div className="py-8 text-center space-y-6 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900 font-serif-luxury">
                    Repair / Polish Appointment Booked!
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
                    Booking Reference ID: <strong className="font-mono text-slate-800">{submittedBooking.id}</strong>. We look forward to welcoming you at our Devdaha-5, Khaireni showroom.
                  </p>
                </div>

                {/* Instant WhatsApp Send Button */}
                <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-3">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                    Confirm your appointment on WhatsApp:
                  </span>
                  <p className="text-xs text-slate-700">
                    Click below to send your repair booking details directly to RAMBADEVI Jewellers for express slot confirmation.
                  </p>
                  <button
                    onClick={handleSendToWhatsApp}
                    className="w-full py-4 px-4 rounded-xl bg-gold-gradient text-slate-950 font-extrabold text-sm hover:brightness-105 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5 fill-slate-950" />
                    <span>Confirm via WhatsApp (9857073727)</span>
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSubmittedBooking(null);
                      setCustomerName('');
                      setPhone('');
                      setDamageDescription('');
                    }}
                    className="text-xs text-slate-500 hover:text-slate-900 underline font-medium"
                  >
                    Book Another Repair / Polish Service
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 font-serif-luxury">
                    Book Repair / Polish Appointment Form
                  </h3>
                  <p className="text-xs text-slate-500">
                    Schedule a drop-off or same-day polishing visit at our Devdaha showroom.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold">
                    {errorMsg}
                  </div>
                )}

                {/* Customer Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Giri"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9857XXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
                    />
                  </div>
                </div>

                {/* Item Type & Service */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                      Jewellery Item Type *
                    </label>
                    <select
                      value={itemType}
                      onChange={(e) => setItemType(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-amber-400"
                    >
                      <option value="24K / 22K Gold Necklace / Rani Haar">24K / 22K Gold Necklace / Rani Haar</option>
                      <option value="Gold Ring / Diamond Engagement Ring">Gold Ring / Diamond Engagement Ring</option>
                      <option value="Gold Bangles / Chura / Kada">Gold Bangles / Chura / Kada</option>
                      <option value="Gold Jhumka / Earrings">Gold Jhumka / Earrings</option>
                      <option value="Naugedi / Mangalsutra / Chain">Naugedi / Mangalsutra / Chain</option>
                      <option value="Silver Payal (Pauju) / Utensils">Silver Payal (Pauju) / Utensils</option>
                      <option value="Antique Heritage Gold Ornaments">Antique Heritage Gold Ornaments</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                      Service Required *
                    </label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-amber-400"
                    >
                      {REPAIR_SERVICES.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Preferred Date & Time Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                      Preferred Date of Visit
                    </label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                      Preferred Time Slot
                    </label>
                    <select
                      value={preferredTimeSlot}
                      onChange={(e) => setPreferredTimeSlot(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-amber-400"
                    >
                      <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                      <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM)</option>
                      <option value="Evening (4:00 PM - 7:00 PM)">Evening (4:00 PM - 7:00 PM)</option>
                    </select>
                  </div>
                </div>

                {/* Damage & Repair Details */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                    Damage Condition &amp; Specific Request *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe the issue (e.g. broken clasp lock, missing small stone, resize ring from size 12 to 14, deep buffing polish needed)..."
                    value={damageDescription}
                    onChange={(e) => setDamageDescription(e.target.value)}
                    className="w-full text-xs sm:text-sm p-4 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-xl bg-gold-gradient text-slate-950 font-extrabold text-sm hover:brightness-105 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Hammer className="w-4 h-4 text-slate-950" />
                        <span>Book Repair / Polish Service</span>
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
                      <span>Or WhatsApp us your jewellery photo for an instant quote</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Info Column - White & Gold */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-md space-y-6">
            <h3 className="text-xl font-bold font-serif-luxury text-slate-950">
              Showroom Repair Service
            </h3>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Devdaha-5, Khaireni, Rupandehi</h4>
                  <p className="text-slate-600 mt-0.5">Drop off your items safely at our main showroom counter.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Weight &amp; Purity Receipt Issued</h4>
                  <p className="text-slate-600 mt-0.5">Exact weight recorded in front of you upon handover.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Express Polish Available</h4>
                  <p className="text-slate-600 mt-0.5">Same-day high-gloss ultrasonic polishing within 30-45 minutes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
