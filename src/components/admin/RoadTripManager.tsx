import React, { useState } from 'react';
import { RoadTrip, Bus, StaffMember } from '../../types';
import { formatTaka, toBengaliNumber, formatDisplayDate } from '../../utils/helpers';
import { 
  Compass, 
  Plus, 
  Fuel, 
  Coins, 
  Receipt, 
  CheckCircle2, 
  X, 
  Search,
  ArrowRight,
  Wallet,
  AlertTriangle,
  UserCheck,
  Trash2
} from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface RoadTripManagerProps {
  trips: RoadTrip[];
  buses: Bus[];
  staffList: StaffMember[];
  onAddRoadTrip: (trip: Omit<RoadTrip, 'id'>) => void;
  onDeleteRoadTrip: (tripId: string) => void;
}

export const RoadTripManager: React.FC<RoadTripManagerProps> = ({
  trips,
  buses,
  staffList,
  onAddRoadTrip,
  onDeleteRoadTrip,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<RoadTrip | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [busId, setBusId] = useState(buses[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [routeName, setRouteName] = useState('ঢাকা ➔ বরিশাল ➔ পটুয়াখালী');
  const [tripCode, setTripCode] = useState('ডি-১০৩ আপ');
  const [ticketSalesAmount, setTicketSalesAmount] = useState(40000);
  const [counterCommission, setCounterCommission] = useState(2500);
  const [fuelLiters, setFuelLiters] = useState(110);
  const [fuelCost, setFuelCost] = useState(12650);
  const [roadToll, setRoadToll] = useState(2800);
  const [driverFoodAllowance, setDriverFoodAllowance] = useState(1800);
  const [policeExpenses, setPoliceExpenses] = useState(500);
  const [otherExpenses, setOtherExpenses] = useState(300);
  const [receivedByStaffId, setReceivedByStaffId] = useState<string>('');
  const [lossBearingStaffId, setLossBearingStaffId] = useState<string>('');
  const [notes, setNotes] = useState('');

  // Calculate raw net deposit (can be positive or negative)
  const totalTripCosts =
    Number(counterCommission) +
    Number(fuelCost) +
    Number(roadToll) +
    Number(driverFoodAllowance) +
    Number(policeExpenses) +
    Number(otherExpenses);

  const calculatedNetDeposit = Number(ticketSalesAmount) - totalTripCosts;
  const isDeficit = calculatedNetDeposit < 0;

  const handleOpenModal = () => {
    const selectedBus = buses[0];
    setBusId(selectedBus?.id || '');
    setDate(new Date().toISOString().split('T')[0]);
    setRouteName('ঢাকা ➔ বরিশাল ➔ পটুয়াখালী');
    setTripCode(`ডি-${toBengaliNumber(trips.length + 101)} আপ`);
    setTicketSalesAmount(42000);
    setCounterCommission(2500);
    setFuelLiters(115);
    setFuelCost(13225);
    setRoadToll(2800);
    setDriverFoodAllowance(1800);
    setPoliceExpenses(500);
    setOtherExpenses(350);
    // Pre-select manager or driver
    setReceivedByStaffId(staffList[0]?.id || '');
    setLossBearingStaffId(staffList.find(s => s.role === 'driver')?.id || staffList[0]?.id || '');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const recStaff = staffList.find((s) => s.id === receivedByStaffId);
    const lossStaff = staffList.find((s) => s.id === lossBearingStaffId);

    onAddRoadTrip({
      busId,
      date,
      routeName,
      tripCode,
      ticketSalesAmount: Number(ticketSalesAmount),
      counterCommission: Number(counterCommission),
      fuelLiters: Number(fuelLiters),
      fuelCost: Number(fuelCost),
      roadToll: Number(roadToll),
      driverFoodAllowance: Number(driverFoodAllowance),
      policeExpenses: Number(policeExpenses),
      otherExpenses: Number(otherExpenses),
      netDeposit: calculatedNetDeposit,
      driverHandoverReceived: true,
      receivedByStaffId: !isDeficit && receivedByStaffId ? receivedByStaffId : undefined,
      receivedByStaffName: !isDeficit && recStaff ? recStaff.name : undefined,
      lossBearingStaffId: isDeficit && lossBearingStaffId ? lossBearingStaffId : undefined,
      lossBearingStaffName: isDeficit && lossStaff ? lossStaff.name : undefined,
      notes,
    });
    setIsModalOpen(false);
  };

  // Aggregates
  const totalSales = trips.reduce((sum, t) => sum + t.ticketSalesAmount, 0);
  const totalFuelCost = trips.reduce((sum, t) => sum + t.fuelCost, 0);
  const totalNetDeposit = trips.reduce((sum, t) => sum + t.netDeposit, 0);

  const filteredTrips = trips.filter(
    (t) =>
      t.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tripCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.receivedByStaffName && t.receivedByStaffName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.lossBearingStaffName && t.lossBearingStaffName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
          <span className="text-xs font-semibold text-blue-900 block">মোট রোড টিকিট বিক্রি</span>
          <div className="text-2xl font-black text-blue-800 mt-1">{formatTaka(totalSales)}</div>
          <span className="text-[11px] text-blue-700 mt-0.5 block">{toBengaliNumber(trips.length)} টি রোড ট্রিপ থেকে</span>
        </div>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
          <span className="text-xs font-semibold text-amber-900 block">মোট রোডের ডিজেল খরচ</span>
          <div className="text-2xl font-black text-amber-800 mt-1">{formatTaka(totalFuelCost)}</div>
          <span className="text-[11px] text-amber-700 mt-0.5 block">রোড ট্রিপে ফুয়েল বাবদ ব্যয়</span>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <span className="text-xs font-semibold text-emerald-900 block">কাউন্টারে প্রাপ্ত নীট জমা</span>
          <div className="text-2xl font-black text-emerald-800 mt-1">{formatTaka(totalNetDeposit)}</div>
          <span className="text-[11px] text-emerald-700 mt-0.5 block">সকল রোড খরচ বাদে নীট ক্যাশ</span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">নিয়মিত রোড ট্রিপ ও লাইন হিসাব</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            বাসের দৈনিক টিকিট কালেকশন, তেল-টোল খরচ ও জমা গ্রহণকারী স্টাফের খতিয়ান
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-48 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="রুট, কোড বা স্টাফ খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <button
            onClick={handleOpenModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন রোড ট্রিপ এন্ট্রি</span>
          </button>
        </div>
      </div>

      {/* Road Trips Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <th className="p-3.5">তারিখ ও বাস</th>
                <th className="p-3.5">রুট ও ট্রিপ কোড</th>
                <th className="p-3.5 text-right">টিকিট কালেকশন</th>
                <th className="p-3.5 text-right">ডিজেল খরচ</th>
                <th className="p-3.5 text-right">টোল ও পুলিশ</th>
                <th className="p-3.5 text-right">খোরাকি ও বিবিধ</th>
                <th className="p-3.5 text-right font-black">নীট জমা / লস</th>
                <th className="p-3.5 text-center">টাকা কার কাছে / সমন্বয়</th>
                <th className="p-3.5 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-sm text-slate-600">কোনো নিয়মিত রোড ট্রিপের রেকর্ড পাওয়া যায়নি</p>
                    <p className="text-xs text-slate-400 mt-1">নতুন রোড ট্রিপ হিসাব যুক্ত করতে উপরে ডানপাশের '+ নতুন রোড ট্রিপ এন্ট্রি' বাটনে ক্লিক করুন।</p>
                  </td>
                </tr>
              ) : (
                filteredTrips.map((trip) => {
                const bus = buses.find((b) => b.id === trip.busId);
                const isLoss = trip.netDeposit < 0;
                return (
                  <tr key={trip.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <strong className="text-slate-900 block">{formatDisplayDate(trip.date)}</strong>
                      <span className="text-slate-500 text-[11px] font-mono">{bus?.regNumber || 'বাস'}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-800 block">{trip.routeName}</span>
                      <span className="text-blue-600 text-[11px] font-mono">{trip.tripCode}</span>
                    </td>
                    <td className="p-3.5 text-right">
                      <strong className="text-slate-900 block">{formatTaka(trip.ticketSalesAmount)}</strong>
                      <span className="text-slate-400 text-[10px]">কমিশন: {formatTaka(trip.counterCommission)}</span>
                    </td>
                    <td className="p-3.5 text-right">
                      <span className="text-amber-800 font-bold block">{formatTaka(trip.fuelCost)}</span>
                      <span className="text-slate-500 text-[10px]">({toBengaliNumber(trip.fuelLiters)} লিটার)</span>
                    </td>
                    <td className="p-3.5 text-right">
                      <span className="text-slate-700 block">টোল: {formatTaka(trip.roadToll)}</span>
                      <span className="text-slate-500 text-[10px]">লাইন: {formatTaka(trip.policeExpenses)}</span>
                    </td>
                    <td className="p-3.5 text-right">
                      <span className="text-slate-700 block">খোরাকি: {formatTaka(trip.driverFoodAllowance)}</span>
                      <span className="text-slate-500 text-[10px]">অন্যান্য: {formatTaka(trip.otherExpenses)}</span>
                    </td>
                    <td className="p-3.5 text-right">
                      <span className={`font-extrabold text-sm block ${isLoss ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {isLoss ? `-${formatTaka(Math.abs(trip.netDeposit))}` : formatTaka(trip.netDeposit)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {isLoss ? 'রোডে ঘাটতি / লস' : 'নীট সারপ্লাস জমা'}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      {!isLoss ? (
                        <div className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                          <Wallet className="w-3 h-3 text-emerald-600" />
                          <span>জমা: {trip.receivedByStaffName || 'কাউন্টার / ড্রাইভার'}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>লস বহন: {trip.lossBearingStaffName || 'স্টাফ'}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => setTripToDelete(trip)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer inline-flex items-center"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
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

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-base">দৈনিক রোড ট্রিপ ও লাইন খরচ এন্ট্রি</h4>
                <p className="text-xs text-slate-300">টিকিট বিক্রি ও রোড খরচ দিয়ে জমা বা লস হিসাব করুন</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">বাস নির্বাচন করুন *</label>
                  <select
                    value={busId}
                    onChange={(e) => setBusId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white"
                  >
                    {buses.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nickname} ({b.regNumber})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">তারিখ *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">রুটের নাম *</label>
                  <input
                    type="text"
                    required
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ট্রিপ নম্বর / কোড</label>
                  <input
                    type="text"
                    required
                    value={tripCode}
                    onChange={(e) => setTripCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              {/* Collections & Commission */}
              <div className="grid grid-cols-2 gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">মোট টিকিট বিক্রি কালেকশন (টাকা) *</label>
                  <input
                    type="number"
                    required
                    value={ticketSalesAmount}
                    onChange={(e) => setTicketSalesAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">কাউন্টার বুকিং কমিশন</label>
                  <input
                    type="number"
                    value={counterCommission}
                    onChange={(e) => setCounterCommission(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              {/* Diesel cost */}
              <div className="grid grid-cols-2 gap-3 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ডিজেল তেল খরচ (টাকা) *</label>
                  <input
                    type="number"
                    required
                    value={fuelCost}
                    onChange={(e) => setFuelCost(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-semibold text-amber-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ডিজেল পরিমাণ (লিটার)</label>
                  <input
                    type="number"
                    value={fuelLiters}
                    onChange={(e) => setFuelLiters(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              {/* Road Costs */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">সেতু ও রোড টোল</label>
                  <input
                    type="number"
                    value={roadToll}
                    onChange={(e) => setRoadToll(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ড্রাইভার-হেল্পার খোরাকি</label>
                  <input
                    type="number"
                    value={driverFoodAllowance}
                    onChange={(e) => setDriverFoodAllowance(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">পুলিশ ও লাইন খরচ</label>
                  <input
                    type="number"
                    value={policeExpenses}
                    onChange={(e) => setPoliceExpenses(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ঘাট বা বিবিধ খরচ (টাকা)</label>
                <input
                  type="number"
                  value={otherExpenses}
                  onChange={(e) => setOtherExpenses(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              {/* Summary net calculation */}
              <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                isDeficit ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                <div>
                  <span className="text-xs font-bold block">
                    {isDeficit ? 'রোড ট্রিপে ঘাটতি / লস:' : 'চূড়ান্ত নীট ক্যাশ জমা:'}
                  </span>
                  <span className="text-[11px] opacity-80">
                    টিকিট আয় ({formatTaka(ticketSalesAmount)}) - মোট খরচ ({formatTaka(totalTripCosts)})
                  </span>
                </div>
                <div className={`text-xl font-black ${isDeficit ? 'text-rose-700' : 'text-emerald-800'}`}>
                  {isDeficit ? `-${formatTaka(Math.abs(calculatedNetDeposit))}` : formatTaka(calculatedNetDeposit)}
                </div>
              </div>

              {/* Custodian Staff or Loss Bearer (User Requirement) */}
              {!isDeficit ? (
                <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
                  <label className="block font-bold text-emerald-950 mb-1 flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-emerald-700" />
                    <span>এই নীট জমা টাকা কে রিসিভ করতেছে? *</span>
                  </label>
                  <select
                    required
                    value={receivedByStaffId}
                    onChange={(e) => setReceivedByStaffId(e.target.value)}
                    className="w-full px-3 py-2 border border-emerald-300 rounded-lg bg-white text-slate-900 font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">-- জমা গ্রহণকারী স্টাফ নির্বাচন করুন --</option>
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role === 'manager' ? 'কাউন্টার মাস্টার / ম্যানেজার' : s.role === 'driver' ? 'ড্রাইভারের কাছে জমা' : s.role === 'owner' ? 'বাস মালিক' : 'স্টাফ'})
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-emerald-700 mt-1">
                    এই নীট জমার টাকা উক্ত স্টাফের ব্যক্তিগত লেজারে কোম্পানির জমা হিসেবে স্বয়ংক্রিয়ভাবে সংরক্ষিত হবে।
                  </p>
                </div>
              ) : (
                <div className="bg-rose-50/80 p-3.5 rounded-xl border border-rose-200">
                  <label className="block font-bold text-rose-950 mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-700" />
                    <span>ঘাটতি / লস কার একাউন্ট বা পকেট থেকে সমন্বয় হবে? *</span>
                  </label>
                  <select
                    required
                    value={lossBearingStaffId}
                    onChange={(e) => setLossBearingStaffId(e.target.value)}
                    className="w-full px-3 py-2 border border-rose-300 rounded-lg bg-white text-slate-900 font-semibold outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">-- লস বহনকারী স্টাফ নির্বাচন করুন --</option>
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role === 'driver' ? 'চালকের খোরাকি কর্তন' : s.role === 'manager' ? 'কাউন্টার ম্যানেজার' : s.role === 'owner' ? 'মালিকের ভর্তুকি' : 'স্টাফ'})
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-rose-700 mt-1">
                    এই ঘাটতি উক্ত স্টাফের ব্যক্তিগত লেজারে সমন্বয় বা কর্তন হিসেবে প্রদর্শিত হবে।
                  </p>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">অতিরিক্ত নোট বা মন্তব্য</label>
                <input
                  type="text"
                  placeholder="যেমন: পদ্মা সেতু পারাপার, ট্রাফিক জ্যাম..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
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
                  রোড ট্রিপ জমা নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Road Trip Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(tripToDelete)}
        title="রোড ট্রিপ হিসাব মুছে ফেলার নিশ্চয়তা"
        message={`আপনি কি সত্যিই "${tripToDelete?.routeName}" (${tripToDelete?.tripCode}) ট্রিপের দৈনিক হিসাব ও খরচ রেকর্ডটি মুছে ফেলতে চান?`}
        confirmText="হ্যাঁ, মুছে ফেলুন"
        cancelText="বাতিল"
        isDanger={true}
        onConfirm={() => {
          if (tripToDelete) {
            onDeleteRoadTrip(tripToDelete.id);
            setTripToDelete(null);
          }
        }}
        onClose={() => setTripToDelete(null)}
      />
    </div>
  );
};
