import React from 'react';
import { Bus, Shield, PhoneCall, LogIn, LogOut, Sparkles, MapPin, Calendar, UserCheck } from 'lucide-react';
import { toBengaliNumber } from '../utils/helpers';
import { SystemUser } from '../types';

interface NavbarProps {
  isAdmin: boolean;
  currentActiveUser?: SystemUser;
  onToggleAdmin: () => void;
  activeTripsCount: number;
  availableBusesCount: number;
  totalBusesCount: number;
  onOpenBookingModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAdmin,
  currentActiveUser,
  onToggleAdmin,
  activeTripsCount,
  availableBusesCount,
  totalBusesCount,
  onOpenBookingModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      {/* Top micro bar for transport hotline & fleet availability */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>মোট বাস: {toBengaliNumber(totalBusesCount)} টি</span>
            <span className="text-slate-500">|</span>
            <span>প্রস্তুত/ফ্রি: {toBengaliNumber(availableBusesCount)} টি</span>
            <span className="text-slate-500">|</span>
            <span className="text-amber-300">চলমান ট্রিপ: {toBengaliNumber(activeTripsCount)} টি</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-slate-400 text-xs">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>প্রধান ডিপো: গাবতলী ও সায়েদাবাদ, ঢাকা</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="tel:01712345678"
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-slate-200">হটলাইন: ০১৭১২-৩৪৫৬৭৮</span>
          </a>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400 text-xs hidden sm:inline">২৪ ঘণ্টা রিলিজ ও রিজার্ভ সেবা</span>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Logo & Org Name */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-tight">
                দিবাচল এন্টারপ্রাইজ
              </h1>
              <span className="bg-blue-100 text-blue-800 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                বাস ও ট্যুর সার্ভিস
              </span>
            </div>
            <p className="text-xs text-slate-500">
              আধুনিক বাস বহর • সাশ্রয়ী রিলিজ ও রিজার্ভ বুকিং • পূর্ণাঙ্গ রোড, স্টাফ ও আর্থিক হিসাব
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!isAdmin && onOpenBookingModal && (
            <button
              onClick={onOpenBookingModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>রিলিজ বুকিং রিকোয়েস্ট</span>
            </button>
          )}

          {/* If admin, display active operator pill */}
          {isAdmin && currentActiveUser && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <div>
                <span className="font-bold text-slate-800 leading-tight block">
                  {currentActiveUser.name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {currentActiveUser.isSuperAdmin ? '👑 সুপার অ্যাডমিন' : `@${currentActiveUser.username}`}
                </span>
              </div>
            </div>
          )}

          {/* Mode Switcher Button */}
          <button
            onClick={onToggleAdmin}
            id="auth-mode-toggle-btn"
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all shadow-xs cursor-pointer border ${
              isAdmin
                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
            }`}
          >
            {isAdmin ? (
              <>
                <LogOut className="w-4 h-4 text-amber-700" />
                <span className="hidden sm:inline">লগআউট (গেস্ট ভিউ)</span>
                <span className="sm:hidden">লগআউট</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="hidden sm:inline">অ্যাডমিন ও ইউজার লগইন</span>
                <span className="sm:hidden">লগইন</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
