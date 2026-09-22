import React, { useState } from 'react';
import { BookingInquiry, Bus } from '../../types';
import { toBengaliNumber, formatTaka, formatDisplayDate } from '../../utils/helpers';
import { 
  PhoneCall, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowRight, 
  X,
  MessageSquare,
  Trash2
} from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface InquiriesManagerProps {
  inquiries: BookingInquiry[];
  buses: Bus[];
  onUpdateStatus: (id: string, status: BookingInquiry['status']) => void;
  onConvertToReleaseTrip: (inquiry: BookingInquiry) => void;
  onDeleteInquiry: (id: string) => void;
}

export const InquiriesManager: React.FC<InquiriesManagerProps> = ({
  inquiries,
  buses,
  onUpdateStatus,
  onConvertToReleaseTrip,
  onDeleteInquiry,
}) => {
  const [inquiryToDelete, setInquiryToDelete] = useState<BookingInquiry | null>(null);
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">পাবলিক গেস্টদের বুকিং রিকোয়েস্ট ও ইনকোয়ারি</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            ওয়েবসাইট ভিজিটরদের পাঠানো রিলিজ বাস ভাড়ার অনুরোধ ও কোটেশন তালিকা
          </p>
        </div>
        <div className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          মোট রিকোয়েস্ট: <strong>{toBengaliNumber(inquiries.length)}</strong> টি
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inquiries.map((inq) => {
          const matchedBus = buses.find((b) => b.id === inq.preferredBusId);
          return (
            <div
              key={inq.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-colors"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      রিকোয়েস্ট প্রাপ্তি: {inq.createdAt}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">{inq.clientName}</h4>
                    <a
                      href={`tel:${inq.clientPhone}`}
                      className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{inq.clientPhone}</span>
                    </a>
                  </div>

                  <select
                    value={inq.status}
                    onChange={(e) => onUpdateStatus(inq.id, e.target.value as any)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border outline-none cursor-pointer ${
                      inq.status === 'confirmed'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : inq.status === 'contacted'
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    <option value="pending">⏳ অপেক্ষমান</option>
                    <option value="contacted">📞 কথা হয়েছে</option>
                    <option value="confirmed">✅ কনফার্মড</option>
                    <option value="cancelled">❌ বাতিল</option>
                  </select>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[11px] text-slate-500 block">রুট ও স্থান:</span>
                    <span className="font-semibold text-slate-800 block">
                      {inq.pickupLocation} ➔ {inq.destination}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[11px] text-slate-500 block">ভ্রমণের তারিখ:</span>
                    <span className="font-semibold text-slate-800 block">
                      {formatDisplayDate(inq.journeyDate)} {inq.returnDate && ` হতে ${formatDisplayDate(inq.returnDate)}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-blue-50/60 border border-blue-100">
                  <span className="text-slate-600">
                    যাত্রী: <strong>{toBengaliNumber(inq.passengerCount)} জন</strong>
                  </span>
                  <span className="text-blue-800 font-medium">
                    পছন্দের বাস: <strong>{matchedBus?.nickname || 'যে কোনো উপযুক্ত বাস'}</strong>
                  </span>
                </div>

                {inq.notes && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 italic">
                    "{inq.notes}"
                  </p>
                )}
              </div>

              {/* Action convert */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={`tel:${inq.clientPhone}`}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                  <span>কল দিন</span>
                </a>

                <button
                  onClick={() => onConvertToReleaseTrip(inq)}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <span>রিলিজ ট্রিপে রূপান্তর করুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
