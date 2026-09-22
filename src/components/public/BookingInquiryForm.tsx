import React, { useState } from 'react';
import { Bus, BusType, BookingInquiry } from '../../types';
import { toBengaliNumber, formatTaka } from '../../utils/helpers';
import { X, Send, Calendar, MapPin, Users, Phone, User, CheckCircle } from 'lucide-react';

interface BookingInquiryFormProps {
  buses: Bus[];
  selectedBus?: Bus | null;
  onClose: () => void;
  onSubmitInquiry: (inquiry: Omit<BookingInquiry, 'id' | 'createdAt' | 'status'>) => void;
}

export const BookingInquiryForm: React.FC<BookingInquiryFormProps> = ({
  buses,
  selectedBus,
  onClose,
  onSubmitInquiry,
}) => {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [journeyDate, setJourneyDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengerCount, setPassengerCount] = useState<number>(35);
  const [preferredBusType, setPreferredBusType] = useState<BusType>(selectedBus?.type || 'ac_deluxe');
  const [preferredBusId, setPreferredBusId] = useState<string>(selectedBus?.id || '');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !pickupLocation || !destination || !journeyDate) {
      alert('দয়া করে আবশ্যকীয় ঘরগুলো পূরণ করুন।');
      return;
    }

    // Estimate budget
    let estimatedBudget = 20000;
    const matchedBus = buses.find(b => b.id === preferredBusId);
    if (matchedBus && matchedBus.perDayReleaseRent) {
      estimatedBudget = matchedBus.perDayReleaseRent;
    }

    onSubmitInquiry({
      clientName,
      clientPhone,
      pickupLocation,
      destination,
      journeyDate,
      returnDate: returnDate || journeyDate,
      passengerCount,
      preferredBusType,
      preferredBusId: preferredBusId || undefined,
      estimatedBudget,
      notes,
    });

    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold block">
              দিবাচল এন্টারপ্রাইজ
            </span>
            <h3 className="text-xl font-bold">রিলিজ / রিজার্ভ বাস বুকিং রিকোয়েস্ট</h3>
            <p className="text-xs text-blue-100 mt-0.5">
              আপনার ভ্রমণের তথ্য দিন, আমাদের টিম দ্রুত ভাড়া ও কনফার্মেশন জানাবে
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">
              বুকিং রিকোয়েস্ট সফলভাবে গ্রহণ করা হয়েছে!
            </h4>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              ধন্যবাদ <strong>{clientName}</strong>! দিবাচল এন্টারপ্রাইজের প্রতিনিধি আপনার মোবাইল নম্বরে (
              <strong>{clientPhone}</strong>) অতি দ্রুত কল করে ভাড়ার চুক্তি ও কনফার্মেশন নিশ্চিত করবে।
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                ঠিক আছে
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  আপনার নাম *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মো: কামরুল ইসলাম"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  মোবাইল নম্বর *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    placeholder="০১৭১২-XXXXXX"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  পিকআপ বা ছাড়ার স্থান *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="যেমন: ঢাকা, উত্তরা / গাবতলী"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  গন্তব্য বা ভ্রমণের স্থান *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="যেমন: কক্সবাজার / সাজেক ভ্যালি"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  যাত্রার শুরুর তারিখ *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    required
                    value={journeyDate}
                    onChange={(e) => setJourneyDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ফেরার তারিখ (ঐচ্ছিক)
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  পছন্দের বাস নির্বাচন করুন
                </label>
                <select
                  value={preferredBusId}
                  onChange={(e) => {
                    setPreferredBusId(e.target.value);
                    const b = buses.find((item) => item.id === e.target.value);
                    if (b && b.type) setPreferredBusType(b.type);
                  }}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="">যে কোনো উপযোগী বাস</option>
                  {buses.map((bus) => (
                    <option key={bus.id} value={bus.id}>
                      {bus.nickname || bus.regNumber} ({toBengaliNumber(bus.seats || 36)} সিট{bus.model ? ` - ${bus.model}` : ''})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  যাত্রীর সংখ্যা (আনুমানিক)
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={passengerCount}
                    onChange={(e) => setPassengerCount(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                বিশেষ কোনো চাওয়া বা বিবরণ (ঐচ্ছিক)
              </label>
              <textarea
                rows={2}
                placeholder="যেমন: সাউন্ড সিস্টেম জরুরি, ড্রাইভারের থাকা-খাওয়ার ব্যবস্থা ইত্যাদি..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                বুকিং রিকোয়েস্ট পাঠান
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
