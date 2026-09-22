import React, { useState } from 'react';
import { Bus, BusType, PopularRoute, BookingInquiry } from '../../types';
import { toBengaliNumber, formatTaka } from '../../utils/helpers';
import { 
  Bus as BusIcon, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Users, 
  Phone, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  HelpCircle,
  ArrowRight,
  Compass
} from 'lucide-react';

interface PublicShowcaseProps {
  buses: Bus[];
  popularRoutes: PopularRoute[];
  inquiries: BookingInquiry[];
  onSelectBusForDetail: (bus: Bus) => void;
  onOpenBookingModal: (bus?: Bus) => void;
}

export const PublicShowcase: React.FC<PublicShowcaseProps> = ({
  buses,
  popularRoutes,
  inquiries,
  onSelectBusForDetail,
  onOpenBookingModal,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [trackPhone, setTrackPhone] = useState('');
  const [trackingResults, setTrackingResults] = useState<BookingInquiry[] | null>(null);

  // Filter buses
  const filteredBuses = buses.filter((bus) => {
    const matchesType = filterType === 'all' || bus.type === filterType;
    const matchesSearch =
      (bus.nickname || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bus.model || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bus.regNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleTrackInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackPhone.trim()) return;
    const cleanQuery = trackPhone.replace(/[^0-9]/g, '');
    const results = inquiries.filter((inq) =>
      inq.clientPhone.replace(/[^0-9]/g, '').includes(cleanQuery)
    );
    setTrackingResults(results);
  };

  const getStatusBadge = (status: BookingInquiry['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">কনফার্মড / চূড়ান্ত হয়েছে</span>;
      case 'contacted':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">যোগাযোগ করা হয়েছে</span>;
      case 'pending':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">অপেক্ষমান / প্রসেসিং হচ্ছে</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-5xl mx-auto px-6 py-12 sm:py-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs sm:text-sm font-medium backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-blue-300" />
            <span>দিবাচল এন্টারপ্রাইজ • নির্ভরযোগ্য ও আরামদায়ক বাস সেবা</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            যেকোনো ট্যুর, পিকনিক কিংবা বিয়ের সফরে <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-indigo-200">
              আধুনিক বাসের নির্ভরযোগ্য রিলিজ ও রিজার্ভ
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            কক্সবাজার, সাজেক ভ্যালি, সিলেট, কুয়াকাটাসহ বাংলাদেশের যেকোনো প্রান্তে গ্রুপ ট্যুরের জন্য আমাদের বিলাসবহুল এসি ও নন-এসি বাস সরাসরি বুকিং করুন।
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenBookingModal()}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-base font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-5 h-5" />
              <span>অনলাইন রিলিজ বুকিং রিকোয়েস্ট দিন</span>
            </button>
            <a
              href="#fleet-section"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-base font-semibold border border-white/20 backdrop-blur-xs transition-all flex items-center gap-2"
            >
              <BusIcon className="w-5 h-5 text-blue-300" />
              <span>আমাদের বাস বহর দেখুন</span>
            </a>
          </div>

          {/* Highlights Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10 text-left">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block">কাগজপত্র ও নিরাপত্তা</span>
                <span className="text-sm font-semibold text-white">১০০% ভেরিফাইড ফিটনেস</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-7 h-7 text-blue-400 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block">অভিজ্ঞ ড্রাইভার</span>
                <span className="text-sm font-semibold text-white">লং রুট ও পাহাড়ি রাস্তায় দক্ষ</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-7 h-7 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block">২৪/৭ সেবা</span>
                <span className="text-sm font-semibold text-white">যেকোনো সময় যোগাযোগ</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-sky-400 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block">আরামদায়ক সিট</span>
                <span className="text-sm font-semibold text-white">পুশ-ব্যাক ও সাউন্ড সিস্টেম</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Showcase Section */}
      <section id="fleet-section" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-wider">
              <BusIcon className="w-4 h-4" /> দিবাচল এন্টারপ্রাইজ বাস বহর
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              আমাদের বাসসমূহ ও বৈশিষ্ট্য
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              আপনার প্রয়োজন অনুযায়ী আসন সংখ্যা ও পছন্দের বাস বাছাই করুন
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="বাসের নাম বা মডেল খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-xs"
            />
          </div>
        </div>

        {/* Filter categories pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'সব বাস' },
            { id: 'ac_deluxe', label: 'এসি ডিলাক্স কোচ' },
            { id: 'non_ac', label: 'নন-এসি চেয়ার কোচ' },
            { id: 'sleeper', label: 'স্লিপার বাস' },
            { id: 'minibus', label: 'মিনিবাস (পাহাড়ি ট্যুর)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterType(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                filterType === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Bus Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuses.map((bus) => {
            const isFree = bus.status === 'available';
            return (
              <div
                key={bus.id}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Photo with badges */}
                  <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
                    <img
                      src={bus.imageUrl}
                      alt={bus.nickname}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30" />

                    {/* Top tags */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur text-slate-800 shadow-xs">
                        {toBengaliNumber(bus.seats)} সিট
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-xs ${
                          isFree
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-900/80 text-slate-200 backdrop-blur'
                        }`}
                      >
                        {isFree ? 'বুকিং ফ্রি আছে' : 'রোডে/রিলিজ চলমান'}
                      </span>
                    </div>

                    {/* Bottom plate */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[11px] text-blue-200 font-mono tracking-wider block">
                        {bus.regNumber}
                      </span>
                      <h4 className="text-lg font-bold truncate">{bus.nickname}</h4>
                    </div>
                  </div>

                  {/* Body Specs */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="text-xs text-slate-500 font-medium">{bus.model}</div>

                    {/* Rent Rate Display */}
                    <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-500 block">আনুমানিক রিলিজ ভাড়া</span>
                        <div className="text-lg font-bold text-blue-700">
                          {formatTaka(bus.perDayReleaseRent)} <span className="text-xs font-normal text-slate-600">/ দিন</span>
                        </div>
                      </div>
                      <div className="text-right text-[11px] text-slate-500">
                        <span className="block">অবস্থান:</span>
                        <span className="font-semibold text-slate-700">{bus.currentLocation}</span>
                      </div>
                    </div>

                    {/* Top Amenities */}
                    {bus.features && bus.features.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-xs font-semibold text-slate-700 block">সুবিধাসমূহ:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {bus.features.slice(0, 4).map((f, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                            >
                              {f}
                            </span>
                          ))}
                          {bus.features.length > 4 && (
                            <span className="text-[11px] text-blue-600 font-medium self-center">
                              +{toBengaliNumber(bus.features.length - 4)} আরও
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 sm:p-5 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectBusForDetail(bus)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer text-center"
                  >
                    বিস্তারিত তথ্য
                  </button>
                  <button
                    onClick={() => onOpenBookingModal(bus)}
                    className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer text-center flex items-center justify-center gap-1"
                  >
                    <span>বুকিং রিকোয়েস্ট</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular Rental & Tour Routes Chart */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider">
              <Compass className="w-4 h-4" /> জনপ্রিয় রিলিজ ও ট্যুর প্যাকেজ
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              জনপ্রিয় রুটের আনুমানিক ভাড়ার তালিকা
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              সরাসরি প্যাকেজ বুকিং করতে পারেন বা ইচ্ছামতো ট্রিপ কাস্টমাইজ করতে পারেন
            </p>
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            * জ্বালানি, টোল ও দিনের সংখ্যার ওপর ভিত্তি করে চূড়ান্ত ভাড়া নির্ধারিত হয়।
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularRoutes.map((route) => (
            <div
              key={route.id}
              className="rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-300 transition-colors flex flex-col justify-between"
            >
              <div className="relative h-32 w-full bg-slate-800">
                <img
                  src={route.imageUrl}
                  alt={route.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 text-white">
                  <h4 className="text-sm font-bold truncate">{route.name}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-300">
                    <span>{toBengaliNumber(route.estimatedKm)} কিমি</span>
                    <span>•</span>
                    <span>{route.estimatedHours}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>এসি লাক্সারি বাস:</span>
                    <span className="font-bold text-blue-700">{formatTaka(route.approxRateAc)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>নন-এসি বাস:</span>
                    <span className="font-bold text-slate-800">{formatTaka(route.approxRateNonAc)}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  {route.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onOpenBookingModal()}
                  className="w-full mt-2 py-2 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>এই রুটে বুকিং কোটেশন নিন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Track Booking Inquiry Status Section */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-6">
        <div className="max-w-2xl">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
            আপনার পাঠানো বুকিং রিকোয়েস্টের বর্তমান অবস্থা ট্র্যাক করুন
          </h3>
          <p className="text-sm text-blue-200 mt-1">
            আপনার মোবাইল নম্বর দিয়ে সহজেই দেখুন আমাদের প্রতিনিধি আপনার রিকোয়েস্ট যাচাই করেছেন কিনা
          </p>
        </div>

        <form onSubmit={handleTrackInquiry} className="flex flex-col sm:flex-row gap-3 max-w-xl">
          <input
            type="text"
            placeholder="আপনার মোবাইল নম্বর (যেমন: 01712...)"
            value={trackPhone}
            onChange={(e) => setTrackPhone(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-400 outline-none shadow-xs"
          />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-colors cursor-pointer"
          >
            স্ট্যাটাস খুঁজুন
          </button>
        </form>

        {trackingResults !== null && (
          <div className="mt-4 pt-4 border-t border-white/20 space-y-3">
            {trackingResults.length === 0 ? (
              <div className="text-sm text-blue-200 bg-white/10 p-3 rounded-xl">
                এই মোবাইল নম্বরে কোনো বুকিং রিকোয়েস্ট পাওয়া যায়নি। প্রয়োজনে সরাসরি হটলাইনে কল করুন: <strong>০১৭১২-৩৪৫৬৭৮</strong>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-xs text-blue-200 font-semibold uppercase">পাওয়া গেছে {toBengaliNumber(trackingResults.length)} টি রিকোয়েস্ট:</div>
                {trackingResults.map((inq) => (
                  <div
                    key={inq.id}
                    className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-3 text-sm"
                  >
                    <div>
                      <div className="font-bold text-white">
                        {inq.clientName} ({inq.pickupLocation} ➔ {inq.destination})
                      </div>
                      <div className="text-xs text-blue-200 mt-0.5">
                        তারিখ: {inq.journeyDate} • যাত্রী: {toBengaliNumber(inq.passengerCount)} জন
                      </div>
                    </div>
                    <div>{getStatusBadge(inq.status)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Footer Info & Depot Addresses */}
      <footer className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-slate-600 text-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-base font-bold text-slate-900 mb-2">দিবাচল এন্টারপ্রাইজ</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              সারা দেশে নির্ভরযোগ্য বাস রিলিজ ও রিজার্ভের এক বিশ্বস্ত প্রতিষ্ঠান। আমাদের সকল বাসের নিয়মিত সার্ভিসিং ও কাগজপত্র সুবিন্যস্ত থাকে।
            </p>
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-900 mb-2">আমাদের কাউন্টার ও ডিপো</h4>
            <ul className="text-xs space-y-1.5 text-slate-600">
              <li>📍 <strong>গাবতলী কাউন্টার:</strong> মাজার রোড মোড়, ঢাকা</li>
              <li>📍 <strong>সায়েদাবাদ টার্মিনাল:</strong> জনপথ মোড় কাউন্টার ০৪, ঢাকা</li>
              <li>📍 <strong>চট্টগ্রাম অফিস:</strong> একে খান মোড়, অলংকার</li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-900 mb-2">যোগাযোগ ও বুকিং হেল্পলাইন</h4>
            <div className="space-y-1 text-xs">
              <p>📞 <strong>মোবাইল:</strong> ০১৭১২-৩৪৫৬৭৮, ০১৯১১-২২৩৩৪৪</p>
              <p>✉️ <strong>ইমেইল:</strong> dwipachaltourbd@gmail.com</p>
              <p className="text-emerald-700 font-semibold pt-1">
                সপ্তাহের ৭ দিনই ২৪ ঘণ্টা খোলা থাকে।
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <span>© ২০২৬ দিবাচল এন্টারপ্রাইজ (Dwipachal Enterprise). সর্বস্বত্ব সংরক্ষিত।</span>
          <span>ডিজিটাল বাস বহর ও রিলিজ ম্যানেজমেন্ট সিস্টেম</span>
        </div>
      </footer>
    </div>
  );
};
