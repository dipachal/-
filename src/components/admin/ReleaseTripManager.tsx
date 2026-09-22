import React, { useState } from 'react';
import { ReleaseTrip, Bus, TripStatus, PaymentStatus, StaffMember } from '../../types';
import { formatTaka, toBengaliNumber, formatDisplayDate } from '../../utils/helpers';
import { 
  Calendar, 
  Plus, 
  Printer, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  DollarSign, 
  X, 
  Search,
  Filter,
  AlertCircle,
  FileCheck,
  UserCheck,
  Wallet,
  Trash2
} from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface ReleaseTripManagerProps {
  trips: ReleaseTrip[];
  buses: Bus[];
  staffList: StaffMember[];
  onAddTrip: (trip: Omit<ReleaseTrip, 'id' | 'createdAt' | 'voucherNumber'>) => void;
  onUpdateTrip: (trip: ReleaseTrip) => void;
  onDeleteTrip: (tripId: string) => void;
  onReceiveDue: (tripId: string, amount: number, receivedByStaffId?: string, receivedByStaffName?: string) => void;
  onPrintVoucher: (trip: ReleaseTrip) => void;
}

export const ReleaseTripManager: React.FC<ReleaseTripManagerProps> = ({
  trips,
  buses,
  staffList,
  onAddTrip,
  onUpdateTrip,
  onDeleteTrip,
  onReceiveDue,
  onPrintVoucher,
}) => {
  const [tripToDelete, setTripToDelete] = useState<ReleaseTrip | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dueModalTrip, setDueModalTrip] = useState<ReleaseTrip | null>(null);
  const [dueReceiveAmount, setDueReceiveAmount] = useState<number>(0);
  const [dueReceiverStaffId, setDueReceiverStaffId] = useState<string>('');

  // New trip form state
  const [busId, setBusId] = useState(buses[0]?.id || '');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientOrg, setClientOrg] = useState('');
  const [pickupLocation, setPickupLocation] = useState('উত্তরা, ঢাকা');
  const [destination, setDestination] = useState('কক্সবাজার ও ইনানী বিচ');
  const [startDate, setStartDate] = useState('2026-09-24');
  const [endDate, setEndDate] = useState('2026-09-27');
  const [durationDays, setDurationDays] = useState(4);
  const [contractAmount, setContractAmount] = useState(80000);
  const [advanceAmount, setAdvanceAmount] = useState(40000);
  const [referenceStaffId, setReferenceStaffId] = useState<string>('');
  const [advanceReceivedByStaffId, setAdvanceReceivedByStaffId] = useState<string>('');
  const [fuelBy, setFuelBy] = useState<'owner' | 'client'>('owner');
  const [tollBy, setTollBy] = useState<'owner' | 'client'>('owner');
  const [notes, setNotes] = useState('');

  // Selected bus helper
  const selectedBus = buses.find((b) => b.id === busId);

  const handleOpenAdd = () => {
    setBusId(buses[0]?.id || '');
    setClientName('');
    setClientPhone('');
    setClientOrg('');
    setPickupLocation('ঢাকা');
    setDestination('কক্সবাজার');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]);
    setDurationDays(3);
    setContractAmount(65000);
    setAdvanceAmount(30000);
    setReferenceStaffId(staffList[0]?.id || '');
    setAdvanceReceivedByStaffId(staffList[0]?.id || '');
    setFuelBy('owner');
    setTollBy('owner');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedBus = buses.find((b) => b.id === busId);
    const due = Math.max(0, contractAmount - advanceAmount);
    const paymentStatus: PaymentStatus = due === 0 ? 'paid' : advanceAmount > 0 ? 'partial' : 'due';

    const refStaff = staffList.find((s) => s.id === referenceStaffId);
    const recStaff = staffList.find((s) => s.id === advanceReceivedByStaffId);

    onAddTrip({
      busId,
      clientName,
      clientPhone,
      clientOrg,
      pickupLocation,
      destination,
      startDate,
      endDate,
      durationDays: Number(durationDays),
      contractAmount: Number(contractAmount),
      advanceAmount: Number(advanceAmount),
      dueAmount: due,
      referenceStaffId: referenceStaffId || undefined,
      referenceStaffName: refStaff?.name,
      advanceReceivedByStaffId: advanceReceivedByStaffId || undefined,
      advanceReceivedByStaffName: recStaff?.name,
      fuelBy,
      tollBy,
      assignedDriver: assignedBus?.driverName || 'চালকের নাম',
      assignedDriverPhone: assignedBus?.driverPhone || '',
      paymentStatus,
      status: 'confirmed',
      notes,
    });

    setIsModalOpen(false);
  };

  // Submit Due Payment
  const handleDueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dueModalTrip) return;
    const dueRecStaff = staffList.find((s) => s.id === dueReceiverStaffId);
    onReceiveDue(dueModalTrip.id, dueReceiveAmount, dueReceiverStaffId || undefined, dueRecStaff?.name);
    setDueModalTrip(null);
  };

  // Totals
  const totalContract = trips.reduce((sum, t) => sum + t.contractAmount, 0);
  const totalAdvance = trips.reduce((sum, t) => sum + t.advanceAmount, 0);
  const totalDue = trips.reduce((sum, t) => sum + t.dueAmount, 0);

  const filteredTrips = trips.filter((trip) => {
    const matchesStatus = filterStatus === 'all' || trip.status === filterStatus;
    const matchesSearch =
      trip.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.clientPhone.includes(searchQuery) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.voucherNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trip.referenceStaffName && trip.referenceStaffName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (trip.advanceReceivedByStaffName && trip.advanceReceivedByStaffName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Financial Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
          <span className="text-xs font-semibold text-blue-900 block">মোট রিজার্ভ চুক্তি মূল্য</span>
          <div className="text-2xl font-black text-blue-800 mt-1">{formatTaka(totalContract)}</div>
          <span className="text-[11px] text-blue-700 mt-0.5 block">সর্বমোট {toBengaliNumber(trips.length)} টি রিজার্ভ ট্রিপ বুকিং</span>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <span className="text-xs font-semibold text-emerald-900 block">মোট প্রাপ্ত নগদ / অগ্রিম জমা</span>
          <div className="text-2xl font-black text-emerald-800 mt-1">{formatTaka(totalAdvance)}</div>
          <span className="text-[11px] text-emerald-700 mt-0.5 block">স্টাফ বা একাউন্টে সংরক্ষিত</span>
        </div>

        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
          <span className="text-xs font-semibold text-rose-900 block">মোট অবশিষ্ট বকেয়া টাকা</span>
          <div className="text-2xl font-black text-rose-700 mt-1">{formatTaka(totalDue)}</div>
          <span className="text-[11px] text-rose-600 mt-0.5 block">পার্টির কাছ থেকে আদায়যোগ্য</span>
        </div>
      </div>

      {/* Action and Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'সব রিজার্ভ ট্রিপ' },
            { id: 'active', label: 'চলমান ট্রিপ' },
            { id: 'confirmed', label: 'নিশ্চিত বুকিং' },
            { id: 'completed', label: 'সম্পন্ন ট্রিপ' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-48 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="পার্টি, রেফারেন্স বা গন্তব্য..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন রিজার্ভ ট্রিপ এন্ট্রি</span>
          </button>
        </div>
      </div>

      {/* Trips Table & Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <th className="p-3.5">ভাউচার নং ও তারিখ</th>
                <th className="p-3.5">গ্রাহক ও রেফারেন্স</th>
                <th className="p-3.5">বরাদ্দকৃত বাস</th>
                <th className="p-3.5">রুট ও সময়কাল</th>
                <th className="p-3.5 text-right">চুক্তি ও জমা কার কাছে</th>
                <th className="p-3.5 text-right">বকেয়া টাকা</th>
                <th className="p-3.5 text-center">স্ট্যাটাস</th>
                <th className="p-3.5 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-sm text-slate-600">কোনো রিজার্ভ ট্রিপ পাওয়া যায়নি</p>
                    <p className="text-xs text-slate-400 mt-1">নতুন রিজার্ভ বুকিং যুক্ত করতে উপরে ডানপাশের '+ নতুন রিজার্ভ ট্রিপ' বাটনে ক্লিক করুন।</p>
                  </td>
                </tr>
              ) : (
                filteredTrips.map((trip) => {
                const bus = buses.find((b) => b.id === trip.busId);
                return (
                  <tr key={trip.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Voucher & Date */}
                    <td className="p-3.5 align-top">
                      <span className="font-mono font-bold text-blue-700 block">{trip.voucherNumber}</span>
                      <span className="text-slate-400 text-[11px] block">{formatDisplayDate(trip.createdAt)}</span>
                    </td>

                    {/* Client info & Reference */}
                    <td className="p-3.5 align-top">
                      <strong className="text-slate-900 block font-semibold text-sm">{trip.clientName}</strong>
                      <span className="text-slate-600 block">{trip.clientPhone}</span>
                      {trip.clientOrg && (
                        <span className="text-blue-600 text-[11px] font-medium block truncate max-w-[180px]">
                          {trip.clientOrg}
                        </span>
                      )}
                      {trip.referenceStaffName && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded mt-1 font-medium">
                          <UserCheck className="w-3 h-3 text-amber-600" />
                          <span>রেফারেন্স: {trip.referenceStaffName}</span>
                        </span>
                      )}
                    </td>

                    {/* Bus Info */}
                    <td className="p-3.5 align-top">
                      <span className="font-semibold text-slate-800 block">{bus?.nickname || 'বাস'}</span>
                      <span className="text-slate-500 font-mono text-[11px] block">{bus?.regNumber}</span>
                      <span className="text-slate-600 text-[11px] block">চালক: {trip.assignedDriver}</span>
                    </td>

                    {/* Route & Dates */}
                    <td className="p-3.5 align-top">
                      <div className="font-medium text-slate-800">
                        {trip.pickupLocation} ➔ {trip.destination}
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        {formatDisplayDate(trip.startDate)} হতে {formatDisplayDate(trip.endDate)} ({toBengaliNumber(trip.durationDays)} দিন)
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        তেল: {trip.fuelBy === 'owner' ? 'মালিকের' : 'পার্টির'} | টোল: {trip.tollBy === 'owner' ? 'মালিকের' : 'পার্টির'}
                      </div>
                    </td>

                    {/* Contract & Advance Custodian */}
                    <td className="p-3.5 align-top text-right">
                      <div className="font-bold text-slate-900 text-sm">{formatTaka(trip.contractAmount)}</div>
                      <div className="text-emerald-700 font-semibold text-[11px]">
                        জমা: {formatTaka(trip.advanceAmount)}
                      </div>
                      {trip.advanceReceivedByStaffName && (
                        <div className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-1 font-medium">
                          <Wallet className="w-2.5 h-2.5 text-emerald-600" />
                          <span>জমা: {trip.advanceReceivedByStaffName}</span>
                        </div>
                      )}
                    </td>

                    {/* Due */}
                    <td className="p-3.5 align-top text-right">
                      {trip.dueAmount > 0 ? (
                        <div className="space-y-1">
                          <span className="font-bold text-rose-600 text-sm block">
                            {formatTaka(trip.dueAmount)}
                          </span>
                          <button
                            onClick={() => {
                              setDueModalTrip(trip);
                              setDueReceiveAmount(trip.dueAmount);
                              setDueReceiverStaffId(staffList[0]?.id || '');
                            }}
                            className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[10px] font-bold cursor-pointer"
                          >
                            বকেয়া জমা নিন
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-full">
                            পরিশোধিত
                          </span>
                          {trip.dueReceivedByStaffName && (
                            <span className="block text-[10px] text-slate-500">
                              আদায়: {trip.dueReceivedByStaffName}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-3.5 align-top text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          trip.status === 'active'
                            ? 'bg-purple-100 text-purple-800'
                            : trip.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {trip.status === 'active'
                          ? 'চলমান'
                          : trip.status === 'confirmed'
                          ? 'নিশ্চিত'
                          : 'সম্পন্ন'}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="p-3.5 align-top text-center space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => onPrintVoucher(trip)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                        title="ভাউচার প্রিন্ট"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>ভাউচার</span>
                      </button>

                      {trip.status === 'confirmed' && (
                        <button
                          onClick={() => onUpdateTrip({ ...trip, status: 'active' })}
                          className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          স্টার্ট
                        </button>
                      )}

                      {trip.status === 'active' && (
                        <button
                          onClick={() => onUpdateTrip({ ...trip, status: 'completed' })}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          সম্পন্ন
                        </button>
                      )}

                      <button
                        onClick={() => setTripToDelete(trip)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer inline-flex items-center"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receive Due Modal */}
      {dueModalTrip && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-base">রিজার্ভ ট্রিপ বকেয়া সংগ্রহ</h4>
                <p className="text-xs text-slate-500">ভাউচার নং: {dueModalTrip.voucherNumber}</p>
              </div>
              <button
                onClick={() => setDueModalTrip(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDueSubmit} className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-600">গ্রাহকের নাম:</span>
                  <span className="font-bold text-slate-900">{dueModalTrip.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">মোট চুক্তি মূল্য:</span>
                  <span className="font-bold">{formatTaka(dueModalTrip.contractAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">পূর্বে অগ্রিম জমা:</span>
                  <span className="font-bold text-emerald-600">{formatTaka(dueModalTrip.advanceAmount)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1">
                  <span className="font-semibold text-rose-600">বর্তমান বকেয়া:</span>
                  <span className="font-bold text-rose-600">{formatTaka(dueModalTrip.dueAmount)}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  বর্তমানে সংগৃহীত টাকার পরিমাণ *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={dueModalTrip.dueAmount}
                  value={dueReceiveAmount}
                  onChange={(e) => setDueReceiveAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-emerald-700 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  টাকা কে রিসিভ করলেন? (হিসাবধারী স্টাফ) *
                </label>
                <select
                  required
                  value={dueReceiverStaffId}
                  onChange={(e) => setDueReceiverStaffId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- স্টাফ / মেম্বার নির্বাচন করুন --</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role === 'owner' ? 'মালিক' : s.role === 'manager' ? 'ম্যানেজার' : s.role === 'driver' ? 'ড্রাইভার' : s.role === 'supervisor' ? 'সুপারভাইজার' : 'স্টাফ'})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  এই টাকা স্বয়ংক্রিয়ভাবে উক্ত স্টাফের ব্যক্তিগত লেজারে কোম্পানির জমা হিসেবে রেকর্ড হবে।
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setDueModalTrip(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                >
                  বকেয়া জমা নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Trip Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-lg">নতুন রিজার্ভ চুক্তি ও বুকিং এন্ট্রি</h4>
                <p className="text-xs text-slate-500">
                  বাস রিজার্ভ, রেফারেন্স ও অগ্রিম টাকা গ্রহণকারী নির্বাচন করুন
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Bus Selector */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">রিজার্ভের জন্য বাস বরাদ্দ *</label>
                <select
                  value={busId}
                  onChange={(e) => {
                    setBusId(e.target.value);
                    const b = buses.find((item) => item.id === e.target.value);
                    if (b) {
                      const rent = b.perDayReleaseRent || 20000;
                      setContractAmount(rent * durationDays);
                      setAdvanceAmount(Math.round((rent * durationDays) / 2));
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {buses.map((bus) => (
                    <option key={bus.id} value={bus.id}>
                      {bus.nickname || bus.regNumber} ({bus.regNumber}) - {toBengaliNumber(bus.seats || 36)} সিট - দৈনিক {formatTaka(bus.perDayReleaseRent || 0)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reference and Custodian Staff (New User Requirement) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
                <div>
                  <label className="block font-bold text-amber-950 mb-1 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                    <span>রিজার্ভের রেফারেন্স (কে রিজার্ভ ধরল?)</span>
                  </label>
                  <select
                    value={referenceStaffId}
                    onChange={(e) => setReferenceStaffId(e.target.value)}
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-800"
                  >
                    <option value="">-- অফিস / সরাসরি রিজার্ভ --</option>
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role === 'owner' ? 'বাস মালিক' : s.role === 'manager' ? 'ম্যানেজার' : s.role === 'driver' ? 'ড্রাইভার' : s.role === 'supervisor' ? 'সুপারভাইজার' : 'স্টাফ'})
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-amber-700 mt-1">মালিক, ম্যানেজার বা চালক যিনি ট্রিপটি নিয়ে এসেছেন</p>
                </div>

                <div>
                  <label className="block font-bold text-emerald-950 mb-1 flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5 text-emerald-700" />
                    <span>অগ্রিম টাকা কার কাছে জমা হলো? *</span>
                  </label>
                  <select
                    required
                    value={advanceReceivedByStaffId}
                    onChange={(e) => setAdvanceReceivedByStaffId(e.target.value)}
                    className="w-full px-3 py-2 border border-emerald-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-800 font-semibold"
                  >
                    <option value="">-- টাকা গ্রহণকারী নির্বাচন করুন --</option>
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role === 'owner' ? 'বাস মালিক' : s.role === 'manager' ? 'ম্যানেজার' : s.role === 'driver' ? 'ড্রাইভার' : 'হিসাবধারী'})
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-emerald-700 mt-1">এই টাকা স্বয়ংক্রিয়ভাবে উক্ত স্টাফের ব্যক্তিগত লেজারে যুক্ত হবে</p>
                </div>
              </div>

              {/* Client Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">গ্রাহক / পার্টির নাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: ইঞ্জিনিয়ার মোস্তাফিজুর"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    placeholder="০১৭১২-XXXXXX"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">প্রতিষ্ঠান / গ্রুপ নাম</label>
                  <input
                    type="text"
                    placeholder="যেমন: প্রাইম ব্যাংক ট্যুর ক্লাব"
                    value={clientOrg}
                    onChange={(e) => setClientOrg(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Location & Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">পিকআপ বা ছাড়ার স্থান *</label>
                  <input
                    type="text"
                    required
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">গন্তব্য বা ভ্রমণের স্থান *</label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">যাত্রা শুরুর তারিখ</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ফেরার তারিখ</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">মোট সময়কাল (দিন)</label>
                  <input
                    type="number"
                    min="1"
                    value={durationDays}
                    onChange={(e) => {
                      const d = Number(e.target.value);
                      setDurationDays(d);
                      if (selectedBus) {
                        const rent = selectedBus.perDayReleaseRent || 20000;
                        setContractAmount(rent * d);
                      }
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Financials & Terms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-blue-50/60 p-3.5 rounded-xl border border-blue-200">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">মোট রিজার্ভ চুক্তি ভাড়া (টাকা) *</label>
                  <input
                    type="number"
                    required
                    value={contractAmount}
                    onChange={(e) => setContractAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">অগ্রিম জমা প্রাপ্তি (টাকা) *</label>
                  <input
                    type="number"
                    required
                    value={advanceAmount}
                    onChange={(e) => setAdvanceAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-lg bg-white text-emerald-700"
                  />
                </div>

                <div className="sm:col-span-2 pt-1 flex items-center justify-between font-bold text-xs border-t border-blue-200">
                  <span className="text-slate-700">অবশিষ্ট বকেয়া টাকা:</span>
                  <span className="text-rose-600 text-sm">
                    {formatTaka(Math.max(0, contractAmount - advanceAmount))}
                  </span>
                </div>
              </div>

              {/* Terms */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">জ্বালানি/ডিজেল খরচ কার?</label>
                  <select
                    value={fuelBy}
                    onChange={(e) => setFuelBy(e.target.value as 'owner' | 'client')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="owner">মালিকপক্ষের (দিবাচল এন্টারপ্রাইজ)</option>
                    <option value="client">গ্রাহক / পার্টির</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">রোড ও ব্রিজ টোল কার?</label>
                  <select
                    value={tollBy}
                    onChange={(e) => setTollBy(e.target.value as 'owner' | 'client')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="owner">মালিকপক্ষের</option>
                    <option value="client">গ্রাহক / পার্টির</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">বিশেষ চুক্তি বা নোট</label>
                <input
                  type="text"
                  placeholder="যেমন: ড্রাইভার খোরাকি পার্টি বহন করবে..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs cursor-pointer"
                >
                  রিজার্ভ চুক্তি বুকিং সম্পন্ন করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Release Trip Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(tripToDelete)}
        title="রিজার্ভ ট্রিপ মুছে ফেলার নিশ্চয়তা"
        message={`আপনি কি সত্যিই "${tripToDelete?.clientName}" এর রিজার্ভ ট্রিপ ভাউচার (${tripToDelete?.voucherNumber}) রেকর্ডটি তালিকা থেকে মুছে ফেলতে চান?`}
        confirmText="হ্যাঁ, মুছে ফেলুন"
        cancelText="বাতিল"
        isDanger={true}
        onConfirm={() => {
          if (tripToDelete) {
            onDeleteTrip(tripToDelete.id);
            setTripToDelete(null);
          }
        }}
        onClose={() => setTripToDelete(null)}
      />
    </div>
  );
};
