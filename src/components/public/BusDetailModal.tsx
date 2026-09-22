import React from 'react';
import { Bus } from '../../types';
import { toBengaliNumber, formatTaka } from '../../utils/helpers';
import { X, CheckCircle2, User, Phone, ShieldCheck, MapPin, Calendar, Sparkles } from 'lucide-react';

interface BusDetailModalProps {
  bus: Bus | null;
  onClose: () => void;
  onBookNow: (bus: Bus) => void;
}

export const BusDetailModal: React.FC<BusDetailModalProps> = ({ bus, onClose, onBookNow }) => {
  if (!bus) return null;

  const typeLabels: Record<string, string> = {
    ac_deluxe: 'এসি ডিলাক্স কোচ',
    non_ac: 'নন-এসি চেয়ার কোচ',
    sleeper: 'লাক্সারি স্লিপার বাস',
    minibus: 'কমফোর্ট মিনিবাস',
    double_decker: 'ডাবল ডেকার',
  };

  const statusLabels: Record<string, { label: string; badge: string }> = {
    available: { label: 'বর্তমানে বুকিংয়ের জন্য ফ্রি আছে', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    on_release: { label: 'বর্তমানে রিলিজ ট্রিপে রয়েছে', badge: 'bg-purple-100 text-purple-800 border-purple-200' },
    on_route: { label: 'নিয়মিত রোড ট্রিপে চলমান', badge: 'bg-blue-100 text-blue-800 border-blue-200' },
    maintenance: { label: 'সার্ভিসিং ও মেইনটেন্যান্সে আছে', badge: 'bg-amber-100 text-amber-800 border-amber-200' },
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header photo & badge */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-900">
          <img
            src={bus.imageUrl}
            alt={bus.nickname}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-600 text-white shadow-xs">
                {bus.type ? (typeLabels[bus.type] || bus.type) : 'সাধারণ বাস'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/60 backdrop-blur text-slate-200 border border-white/20">
                রেজিস্ট্রেশন: {bus.regNumber}
              </span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight">{bus.nickname || bus.regNumber}</h3>
            {bus.model && <p className="text-slate-300 text-sm">{bus.model}</p>}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Status & Price Highlight */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="text-xs text-slate-500 font-medium mb-1">দৈনিক রিলিজ/রিজার্ভ আনুমানিক ভাড়া</div>
              <div className="text-2xl font-extrabold text-blue-700">
                {formatTaka(bus.perDayReleaseRent)} <span className="text-sm font-normal text-slate-600">/ দিন</span>
              </div>
              <div className="text-[11px] text-slate-500">* স্থান, দূরত্ব ও দিনভেদে আলোচনা সাপেক্ষে পরিবর্তনশীল</div>
            </div>

            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${statusLabels[bus.status]?.badge}`}>
                {statusLabels[bus.status]?.label}
              </span>
              <div className="text-xs text-slate-500 mt-1.5 flex items-center gap-1 justify-end">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>বর্তমান অবস্থান: {bus.currentLocation}</span>
              </div>
            </div>
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs text-slate-500 block">মোট আসন সংখ্যা</span>
              <span className="text-lg font-bold text-slate-800">{toBengaliNumber(bus.seats)} টি সিট</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs text-slate-500 block">বাসের ক্লাস</span>
              <span className="text-base font-bold text-slate-800">
                {bus.type === 'ac_deluxe' ? 'এসি লাক্সারি' : bus.type === 'sleeper' ? 'স্লিপার' : bus.type === 'minibus' ? 'মিনিবাস' : 'নন-এসি'}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs text-slate-500 block">চালক</span>
              <span className="text-sm font-semibold text-slate-800 truncate block">{bus.driverName}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs text-slate-500 block">কাগজপত্র ও ফিটনেস</span>
              <span className="text-xs font-semibold text-emerald-700 block">আপ-টু-ডেট ভেরিফাইড</span>
            </div>
          </div>

          {/* Features and Amenities */}
          {bus.features && bus.features.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" /> বাসের বিশেষ সুযোগ-সুবিধাসমূহ
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {bus.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50/80 p-2 rounded-md border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {bus.notes && (
            <div className="text-xs text-slate-600 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
              <span className="font-semibold text-blue-900">বিশেষ নোট:</span> {bus.notes}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              বন্ধ করুন
            </button>
            <button
              onClick={() => {
                onClose();
                onBookNow(bus);
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              এই বাসের জন্য বুকিং রিকোয়েস্ট পাঠান
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
