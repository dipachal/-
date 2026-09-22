import React from 'react';
import { ReleaseTrip, Bus } from '../../types';
import { formatTaka, toBengaliNumber, formatDisplayDate } from '../../utils/helpers';
import { Printer, X, CheckCircle, Bus as BusIcon, Phone, MapPin } from 'lucide-react';

interface VoucherPrintModalProps {
  trip: ReleaseTrip;
  bus?: Bus;
  onClose: () => void;
}

export const VoucherPrintModal: React.FC<VoucherPrintModalProps> = ({ trip, bus, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-300">
        {/* Top Action Bar (hidden in print) */}
        <div className="print:hidden bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">মানি রিসিট ও রিলিজ চুক্তিপত্র</span>
            <span className="text-xs bg-slate-800 text-blue-300 px-2 py-0.5 rounded border border-slate-700">
              {trip.voucherNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট করুন</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Memo Document */}
        <div className="p-8 sm:p-10 bg-white text-slate-800 space-y-6 print:p-0 print:m-0" id="printable-voucher">
          {/* Header Memo Style */}
          <div className="border-b-2 border-slate-800 pb-4 text-center relative">
            <div className="flex items-center justify-center gap-2 mb-1">
              <BusIcon className="w-6 h-6 text-blue-700 print:text-black" />
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase">
                দিবাচল এন্টারপ্রাইজ
              </h2>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              অভিজাত বাস সার্ভিস, পিকনিক, বিয়ের বহর ও দেশব্যাপী রিলিজ/রিজার্ভ বুকিং
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              গাবতলী ও সায়েদাবাদ ডিপো, ঢাকা • মোবাইল: ০১৭১২-৩৪৫৬৭৮, ০১৯১১-২২৩৩৪৪ • ইমেইল: dwipachaltourbd@gmail.com
            </p>

            <div className="mt-3 inline-block bg-slate-900 text-white px-4 py-1 rounded text-xs font-bold tracking-wider uppercase print:bg-black">
              বাস রিলিজ বুকিং ও মানি রিসিট ভাউচার
            </div>
          </div>

          {/* Voucher Info Meta */}
          <div className="grid grid-cols-2 text-xs border border-slate-200 rounded-lg p-3 bg-slate-50 print:bg-transparent">
            <div>
              <span className="text-slate-500">ভাউচার নম্বর:</span>{' '}
              <strong className="text-slate-900 font-mono text-sm">{trip.voucherNumber}</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-500">ইস্যুর তারিখ:</span>{' '}
              <strong className="text-slate-900">{formatDisplayDate(trip.createdAt)}</strong>
            </div>
          </div>

          {/* Client & Bus Details 2-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Party / Client info */}
            <div className="border border-slate-200 rounded-lg p-3.5 space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1">
                গ্রাহক / পার্টির বিবরণ
              </h4>
              <p><strong>নাম:</strong> {trip.clientName}</p>
              <p><strong>মোবাইল:</strong> {trip.clientPhone}</p>
              {trip.clientOrg && <p><strong>প্রতিষ্ঠান/গ্রুপ:</strong> {trip.clientOrg}</p>}
              <p><strong>পিকআপ স্থান:</strong> {trip.pickupLocation}</p>
              <p><strong>ভ্রমণের গন্তব্য:</strong> {trip.destination}</p>
            </div>

            {/* Bus & Driver Info */}
            <div className="border border-slate-200 rounded-lg p-3.5 space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1">
                বরাদ্দকৃত বাসের বিবরণ
              </h4>
              <p><strong>বাসের নাম:</strong> {bus?.nickname || 'দিবাচল বাস'}</p>
              <p><strong>গাড়ির নম্বর:</strong> {bus?.regNumber || 'নির্ধারিত'}</p>
              <p><strong>আসন সংখ্যা:</strong> {bus ? toBengaliNumber(bus.seats) + ' সিট' : 'নিয়মিত'}</p>
              <p><strong>চালক:</strong> {trip.assignedDriver} ({trip.assignedDriverPhone})</p>
              <p><strong>যাত্রা শুরু:</strong> {formatDisplayDate(trip.startDate)} ➔ <strong>ফেরত:</strong> {formatDisplayDate(trip.endDate)}</p>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <th className="p-2.5">বিবরণ</th>
                  <th className="p-2.5 text-center">সময়কাল</th>
                  <th className="p-2.5 text-center">শর্তাবলী</th>
                  <th className="p-2.5 text-right">টাকার পরিমাণ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 font-medium">
                    বাস রিলিজ/রিজার্ভ চুক্তি ভাড়া ({trip.pickupLocation} থেকে {trip.destination})
                  </td>
                  <td className="p-2.5 text-center">{toBengaliNumber(trip.durationDays)} দিন</td>
                  <td className="p-2.5 text-center">
                    জ্বালানি: {trip.fuelBy === 'owner' ? 'মালিকের' : 'পার্টির'}, টোল: {trip.tollBy === 'owner' ? 'মালিকের' : 'পার্টির'}
                  </td>
                  <td className="p-2.5 text-right font-bold text-slate-900">{formatTaka(trip.contractAmount)}</td>
                </tr>
                <tr className="bg-slate-50 print:bg-transparent">
                  <td colSpan={3} className="p-2.5 text-right font-semibold text-slate-700">
                    পরিশোধিত অগ্রিম টাকা (Advance Paid):
                  </td>
                  <td className="p-2.5 text-right font-bold text-emerald-700">
                    {formatTaka(trip.advanceAmount)}
                  </td>
                </tr>
                <tr className="bg-slate-100 font-bold text-sm">
                  <td colSpan={3} className="p-2.5 text-right text-slate-900">
                    অবশিষ্ট বকেয়া টাকা (Due Balance):
                  </td>
                  <td className={`p-2.5 text-right ${trip.dueAmount > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {formatTaka(trip.dueAmount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Terms & Conditions */}
          <div className="text-[11px] text-slate-500 space-y-1 border border-slate-200 p-3 rounded-lg">
            <span className="font-bold text-slate-700 block">শর্তাবলী:</span>
            <p>১. গাড়িতে কোনো ধরনের বেআইনি বা অবৈধ মালামাল পরিবহন সম্পূর্ণ নিষিদ্ধ।</p>
            <p>২. ট্রিপ শুরুর পূর্বে অথবা সমাপ্তির সাথে সাথে অবশিষ্ট বকেয়া টাকা পরিশোধ করিতে হইবে।</p>
            <p>৩. অপ্রত্যাশিত প্রাকৃতিক দুর্যোগ বা রাজনৈতিক ধর্মঘটের কারণে বিলম্ব হইলে উভয় পক্ষ পারস্পরিক সমঝোতায় সমাধান করিবে।</p>
          </div>

          {/* Signatures */}
          <div className="pt-8 flex items-center justify-between text-xs text-slate-800">
            <div className="text-center w-40">
              <div className="border-t border-slate-400 pt-1 font-semibold">গ্রাহকের স্বাক্ষর</div>
            </div>
            <div className="text-center w-48">
              <div className="w-16 h-16 border-2 border-dashed border-blue-200 rounded-full flex items-center justify-center mx-auto mb-1 text-[10px] text-blue-400 uppercase tracking-widest print:border-black">
                সিলমোহর
              </div>
              <div className="border-t border-slate-400 pt-1 font-semibold">কর্তৃপক্ষ, দিবাচল এন্টারপ্রাইজ</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
