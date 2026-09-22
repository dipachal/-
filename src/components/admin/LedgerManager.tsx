import React, { useState } from 'react';
import { ExpenseRecord, ExpenseCategory, Bus, StaffMember } from '../../types';
import { formatTaka, toBengaliNumber, formatDisplayDate } from '../../utils/helpers';
import { 
  DollarSign, 
  Plus, 
  Fuel, 
  Wrench, 
  Users, 
  FileText, 
  Building, 
  X, 
  Search, 
  Filter,
  Layers,
  ArrowRightLeft,
  Calendar,
  Wallet,
  CheckCircle2,
  Trash2,
  Info
} from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface LedgerManagerProps {
  expenses: ExpenseRecord[];
  buses: Bus[];
  staffList: StaffMember[];
  onAddExpense: (expense: Omit<ExpenseRecord, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
}

export const LedgerManager: React.FC<LedgerManagerProps> = ({
  expenses,
  buses,
  staffList,
  onAddExpense,
  onDeleteExpense,
}) => {
  const [expenseToDelete, setExpenseToDelete] = useState<ExpenseRecord | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterBusId, setFilterBusId] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Mode: Company Expense vs Staff Transfer
  const [entryMode, setEntryMode] = useState<'expense' | 'staff_transfer'>('expense');

  // Common Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [busId, setBusId] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('fuel');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(5000);
  const [voucherNo, setVoucherNo] = useState('');
  const [paidTo, setPaidTo] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bkash' | 'bank'>('cash');
  const [notes, setNotes] = useState('');

  // Spender Staff
  const [spentByStaffId, setSpentByStaffId] = useState<string>('');

  // Transfer specific
  const [transferFromStaffId, setTransferFromStaffId] = useState<string>('');
  const [transferToStaffId, setTransferToStaffId] = useState<string>('');

  const categoryLabels: Record<ExpenseCategory, { label: string; icon: any; color: string }> = {
    fuel: { label: 'ডিজেল ও ফুয়েল', icon: Fuel, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    maintenance: { label: 'মেরামত ও পার্টস', icon: Wrench, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    driver_salary: { label: 'চালক-হেল্পার বেতন', icon: Users, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    driver_food: { label: 'খোরাকি ও ট্রিপ খরচ', icon: Users, color: 'text-sky-600 bg-sky-50 border-sky-200' },
    toll: { label: 'সেতু ও এক্সপ্রেসওয়ে টোল', icon: Layers, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    police_road: { label: 'পুলিশ ও রোড চাঁদা', icon: FileText, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    paper_renewal: { label: 'কাগজপত্র ও ফিটনেস', icon: FileText, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    tire_body: { label: 'টায়ার ও বডি ডেন্টিং', icon: Wrench, color: 'text-orange-600 bg-orange-50 border-orange-200' },
    staff_transfer: { label: 'সাধারণ লেনদেন / স্টাফ হস্তান্তর', icon: ArrowRightLeft, color: 'text-teal-700 bg-teal-50 border-teal-200' },
    office_misc: { label: 'অফিস ভাড়া ও বিবিধ', icon: Building, color: 'text-slate-600 bg-slate-50 border-slate-200' },
  };

  const handleOpenAdd = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setBusId(buses[0]?.id || '');
    setCategory('fuel');
    setTitle('ডিজেল ফুয়েল রিচার্জ');
    setAmount(12000);
    setVoucherNo(`V-${Math.floor(1000 + Math.random() * 9000)}`);
    setPaidTo('ফিলিং স্টেশন');
    setPaymentMethod('cash');
    setSpentByStaffId(staffList[0]?.id || '');
    setTransferFromStaffId(staffList[0]?.id || '');
    setTransferToStaffId(staffList[1]?.id || '');
    setNotes('');
    setEntryMode('expense');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (entryMode === 'staff_transfer') {
      const fromStaff = staffList.find((s) => s.id === transferFromStaffId);
      const toStaff = staffList.find((s) => s.id === transferToStaffId);

      onAddExpense({
        date,
        busId: busId || undefined,
        category: 'staff_transfer',
        isStaffTransfer: true,
        title: title || `${fromStaff?.name || 'স্টাফ'} ➔ ${toStaff?.name || 'স্টাফ'} তহবিল স্থানান্তর`,
        amount: Number(amount),
        voucherNo,
        transferFromStaffId,
        transferFromStaffName: fromStaff?.name,
        transferToStaffId,
        transferToStaffName: toStaff?.name,
        paymentMethod,
        notes: notes || 'অভ্যন্তরীণ তহবিল রদবদল (কোম্পানি ব্যয় নয়)',
      });
    } else {
      const spender = staffList.find((s) => s.id === spentByStaffId);

      onAddExpense({
        date,
        busId: busId || undefined,
        category,
        isStaffTransfer: false,
        title,
        amount: Number(amount),
        voucherNo,
        spentByStaffId: spentByStaffId || undefined,
        spentByStaffName: spender?.name,
        paidTo,
        paymentMethod,
        notes,
      });
    }

    setIsModalOpen(false);
  };

  // Pure Company Expenses (Excluding Staff Transfers)
  const companyExpenses = expenses.filter(
    (e) => !e.isStaffTransfer && e.category !== 'staff_transfer'
  );

  // Staff Transfers only
  const staffTransfers = expenses.filter(
    (e) => e.isStaffTransfer || e.category === 'staff_transfer'
  );

  const totalCompanyExpenses = companyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalTransfers = staffTransfers.reduce((sum, e) => sum + e.amount, 0);

  // Month filter options
  const currentYearMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const prevMonthDate = new Date();
  prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
  const prevYearMonth = prevMonthDate.toISOString().slice(0, 7);

  // Filtered entries
  const filteredExpenses = expenses.filter((e) => {
    // Category or Type Filter
    const matchesCategory =
      filterCategory === 'all'
        ? true
        : filterCategory === 'transfers_only'
        ? e.isStaffTransfer || e.category === 'staff_transfer'
        : filterCategory === 'expenses_only'
        ? !e.isStaffTransfer && e.category !== 'staff_transfer'
        : e.category === filterCategory;

    // Bus Filter
    const matchesBus =
      filterBusId === 'all'
        ? true
        : filterBusId === 'general'
        ? !e.busId
        : e.busId === filterBusId;

    // Month Filter
    const matchesMonth =
      filterMonth === 'all'
        ? true
        : filterMonth === 'current'
        ? e.date.startsWith(currentYearMonth)
        : filterMonth === 'prev'
        ? e.date.startsWith(prevYearMonth)
        : true;

    // Search Query
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.paidTo && e.paidTo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.voucherNo && e.voucherNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.spentByStaffName && e.spentByStaffName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.transferFromStaffName && e.transferFromStaffName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.transferToStaffName && e.transferToStaffName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesBus && matchesMonth && matchesSearch;
  });

  // Calculate filtered sum
  const filteredCompanySum = filteredExpenses
    .filter((e) => !e.isStaffTransfer && e.category !== 'staff_transfer')
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
          <span className="text-xs font-semibold text-rose-900 block">মোট কোম্পানির প্রত্যক্ষ ব্যয়</span>
          <div className="text-2xl font-black text-rose-700 mt-1">{formatTaka(totalCompanyExpenses)}</div>
          <span className="text-[11px] text-rose-600 mt-0.5 block">
            ডিজেল, মেরামত, বেতন ও টোল বাবদ (হস্তান্তর বাদে)
          </span>
        </div>

        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
          <span className="text-xs font-semibold text-teal-900 block">সাধারণ লেনদেন / কর্মী হস্তান্তর</span>
          <div className="text-2xl font-black text-teal-800 mt-1">{formatTaka(totalTransfers)}</div>
          <span className="text-[11px] text-teal-700 mt-0.5 block">
            স্টাফদের পারস্পরিক রদবদল (কোম্পানির খরচ নয়)
          </span>
        </div>

        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
          <span className="text-xs font-semibold text-blue-900 block">ফিল্টারকৃত কোম্পানির খরচ</span>
          <div className="text-2xl font-black text-blue-800 mt-1">{formatTaka(filteredCompanySum)}</div>
          <span className="text-[11px] text-blue-700 mt-0.5 block">
            নির্বাচিত বাস বা মাসের মোট ব্যয়
          </span>
        </div>
      </div>

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">আয়-ব্যয় ক্যাশবুক ও তহবিল হস্তান্তর</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            বাসের ডিজেল, মেরামত, স্টাফদের খরচ ও অভ্যন্তরীণ রদবদল এন্ট্রি
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-48 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="পারপাস, স্টাফ, ভাউচার নং..."
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
            <span>নতুন ভাউচার / খরচ এন্ট্রি</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
          <Filter className="w-3.5 h-3.5" />
          <span>ফিল্টারিং:</span>
        </div>

        {/* Bus Filter */}
        <select
          value={filterBusId}
          onChange={(e) => setFilterBusId(e.target.value)}
          className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          <option value="all">-- সকল বাস ও অফিস --</option>
          <option value="general">শুধুমাত্র সার্বজনীন / অফিস খরচ</option>
          {buses.map((b) => (
            <option key={b.id} value={b.id}>
              {b.nickname || b.regNumber} ({b.regNumber})
            </option>
          ))}
        </select>

        {/* Month Filter */}
        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          <option value="all">সকল সময় / তারিখ</option>
          <option value="current">চলতি মাস</option>
          <option value="prev">বিগত মাস</option>
        </select>

        {/* Category / Type Filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          <option value="all">সকল প্রকার লেনদেন</option>
          <option value="expenses_only">শুধুমাত্র কোম্পানির ব্যয়সমূহ</option>
          <option value="transfers_only">শুধুমাত্র স্টাফ হস্তান্তর (সাধারণ লেনদেন)</option>
          <option value="fuel">ডিজেল ও ফুয়েল</option>
          <option value="maintenance">মেরামত ও পার্টস</option>
          <option value="driver_salary">চালক-হেল্পার বেতন</option>
          <option value="toll">সেতু ও রোড টোল</option>
          <option value="tire_body">টায়ার ও বডি</option>
          <option value="office_misc">অফিস ও বিবিধ</option>
        </select>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <th className="p-3.5">তারিখ ও ভাউচার</th>
                <th className="p-3.5">ক্যাটাগরি / পারপাস</th>
                <th className="p-3.5">সংযুক্ত বাস</th>
                <th className="p-3.5">বিবরণ / লেনদেনের বিবরণ</th>
                <th className="p-3.5">কে খরচ করল / হস্তান্তর</th>
                <th className="p-3.5 text-right">টাকার পরিমাণ</th>
                <th className="p-3.5 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    কোনো লেনদেনের রেকর্ড পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => {
                  const bus = buses.find((b) => b.id === exp.busId);
                  const isTransfer = exp.isStaffTransfer || exp.category === 'staff_transfer';
                  const catConfig = categoryLabels[exp.category] || {
                    label: exp.category,
                    icon: DollarSign,
                    color: 'text-slate-600 bg-slate-50 border-slate-200',
                  };
                  const CatIcon = catConfig.icon;

                  return (
                    <tr
                      key={exp.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isTransfer ? 'bg-teal-50/30' : ''
                      }`}
                    >
                      {/* Date & Voucher */}
                      <td className="p-3.5 align-top">
                        <strong className="text-slate-900 block">{formatDisplayDate(exp.date)}</strong>
                        <span className="text-slate-500 font-mono text-[11px] block">{exp.voucherNo || '—'}</span>
                        <span className="text-[10px] text-slate-400">
                          {exp.paymentMethod === 'bkash' ? 'বিকাশ' : exp.paymentMethod === 'bank' ? 'ব্যাংক' : 'ক্যাশ'}
                        </span>
                      </td>

                      {/* Category Badge */}
                      <td className="p-3.5 align-top">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${catConfig.color}`}
                        >
                          <CatIcon className="w-3 h-3" />
                          <span>{catConfig.label}</span>
                        </span>
                      </td>

                      {/* Bus */}
                      <td className="p-3.5 align-top">
                        {bus ? (
                          <div>
                            <span className="font-semibold text-slate-800 block">{bus.nickname || 'বাস'}</span>
                            <span className="text-slate-500 font-mono text-[11px] block">{bus.regNumber}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium">সার্বজনীন / অফিস</span>
                        )}
                      </td>

                      {/* Title & Notes */}
                      <td className="p-3.5 align-top">
                        <strong className="text-slate-900 text-xs block">{exp.title}</strong>
                        {exp.paidTo && !isTransfer && (
                          <span className="text-slate-500 text-[11px] block">পাবে/গ্রহীতা: {exp.paidTo}</span>
                        )}
                        {exp.notes && (
                          <span className="text-slate-400 text-[10px] block mt-0.5 italic">{exp.notes}</span>
                        )}
                      </td>

                      {/* Who Spent or Staff Transfer Route */}
                      <td className="p-3.5 align-top">
                        {isTransfer ? (
                          <div className="inline-flex items-center gap-1.5 text-teal-900 bg-teal-100/80 px-2 py-1 rounded-lg border border-teal-200">
                            <span className="font-semibold">{exp.transferFromStaffName || 'প্রেরক'}</span>
                            <ArrowRightLeft className="w-3 h-3 text-teal-600" />
                            <span className="font-semibold">{exp.transferToStaffName || 'প্রাপক'}</span>
                          </div>
                        ) : exp.spentByStaffName ? (
                          <div className="inline-flex items-center gap-1 text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            <Wallet className="w-3 h-3 text-slate-500" />
                            <span>{exp.spentByStaffName}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">কোম্পানি ক্যাশ</span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="p-3.5 align-top text-right">
                        <span
                          className={`font-black text-sm block ${
                            isTransfer ? 'text-teal-700' : 'text-rose-600'
                          }`}
                        >
                          {isTransfer ? '' : '-'}{formatTaka(exp.amount)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {isTransfer ? 'তহবিল রদবদল' : 'কোম্পানি ব্যয়'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="p-3.5 align-top text-center">
                        <button
                          onClick={() => setExpenseToDelete(exp)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
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

      {/* Add Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-lg">নতুন ক্যাশবুক ভাউচার ও লেনদেন এন্ট্রি</h4>
                <p className="text-xs text-slate-500">
                  কোম্পানির ব্যয় অথবা এক কর্মী হতে অন্য কর্মীতে সাধারণ তহবিল হস্তান্তর
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Entry Mode Switcher (Expense vs Staff Transfer) */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setEntryMode('expense')}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  entryMode === 'expense'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔴 কোম্পানির ব্যয় (Expense)
              </button>
              <button
                type="button"
                onClick={() => setEntryMode('staff_transfer')}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  entryMode === 'staff_transfer'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔄 সাধারণ লেনদেন (স্টাফ হস্তান্তর)
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {entryMode === 'staff_transfer' ? (
                /* ================= STAFF TRANSFER FIELDS ================= */
                <div className="space-y-3 bg-teal-50/60 p-4 rounded-xl border border-teal-200">
                  <div className="flex items-start gap-2 text-teal-900 text-[11px] mb-2 bg-teal-100/70 p-2.5 rounded-lg">
                    <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>সাধারণ রদবদল:</strong> এক স্টাফের হাত থেকে অন্য স্টাফের হাতে টাকা যাওয়ার হিসাব। এটি কোম্পানির নিজস্ব খরচ বা লাভ-ক্ষতিতে যোগ হবে না।
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-teal-950 mb-1">
                        প্রেরক কর্মী (কার তহবিল থেকে কমবে) *
                      </label>
                      <select
                        required
                        value={transferFromStaffId}
                        onChange={(e) => setTransferFromStaffId(e.target.value)}
                        className="w-full px-3 py-2 border border-teal-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                      >
                        <option value="">-- প্রেরক নির্বাচন করুন --</option>
                        {staffList.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.role === 'owner' ? 'মালিক' : s.role === 'manager' ? 'ম্যানেজার' : s.role === 'driver' ? 'ড্রাইভার' : 'স্টাফ'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-teal-950 mb-1">
                        প্রাপক কর্মী (কার তহবিলে যোগ হবে) *
                      </label>
                      <select
                        required
                        value={transferToStaffId}
                        onChange={(e) => setTransferToStaffId(e.target.value)}
                        className="w-full px-3 py-2 border border-teal-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                      >
                        <option value="">-- প্রাপক নির্বাচন করুন --</option>
                        {staffList.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.role === 'owner' ? 'মালিক' : s.role === 'manager' ? 'ম্যানেজার' : s.role === 'driver' ? 'ড্রাইভার' : 'স্টাফ'})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">হস্তান্তরের কারণ / বিবরণ</label>
                    <input
                      type="text"
                      placeholder="যেমন: রাস্তার তেলের জন্য ড্রাইভারকে ক্যাশ প্রদান..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              ) : (
                /* ================= REGULAR EXPENSE FIELDS ================= */
                <div className="space-y-3">
                  {/* Bus and Staff Spender */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">কোন বাসের সাথে যুক্ত?</label>
                      <select
                        value={busId}
                        onChange={(e) => setBusId(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">-- সার্বজনীন / হেড অফিস খরচ --</option>
                        {buses.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.nickname || b.regNumber} ({b.regNumber})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        খরচটি কে পরিশোধ করতেছে? (স্টাফ) *
                      </label>
                      <select
                        value={spentByStaffId}
                        onChange={(e) => setSpentByStaffId(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-900"
                      >
                        <option value="">-- কোম্পানি ফান্ড / সরাসরি ক্যাশ --</option>
                        {staffList.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.role === 'manager' ? 'ম্যানেজার' : s.role === 'driver' ? 'ড্রাইভার' : s.role === 'owner' ? 'মালিক' : 'স্টাফ'})
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        উক্ত স্টাফের হাতে থাকা কোম্পানি ফান্ড থেকে এই টাকা সমন্বয় হবে
                      </p>
                    </div>
                  </div>

                  {/* Category & Title */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">খরচের ক্যাটাগরি / পারপাস *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
                      >
                        <option value="fuel">ডিজেল ও ফুয়েল</option>
                        <option value="maintenance">মেরামত ও পার্টস</option>
                        <option value="driver_salary">চালক-হেল্পার বেতন</option>
                        <option value="driver_food">খোরাকি ও ট্রিপ খরচ</option>
                        <option value="toll">সেতু ও এক্সপ্রেসওয়ে টোল</option>
                        <option value="police_road">পুলিশ ও রোড চাঁদা</option>
                        <option value="paper_renewal">কাগজপত্র ও ফিটনেস</option>
                        <option value="tire_body">টায়ার ও বডি ডেন্টিং</option>
                        <option value="office_misc">অফিস ভাড়া ও বিবিধ</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">খরচের শিরোনাম / বাবদ *</label>
                      <input
                        type="text"
                        required
                        placeholder="যেমন: ইঞ্জিনের মবিল ও ফিল্টার পরিবর্তন"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">টাকা কাকে দেওয়া হলো (দোকান / ব্যক্তি)</label>
                    <input
                      type="text"
                      placeholder="যেমন: মেসার্স রহিম ইঞ্জিন ওয়ার্কশপ"
                      value={paidTo}
                      onChange={(e) => setPaidTo(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Financials & Voucher for both modes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">টাকার পরিমাণ *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 font-bold text-sm border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">তারিখ *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ভাউচার / মেমো নং</label>
                  <input
                    type="text"
                    value={voucherNo}
                    onChange={(e) => setVoucherNo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">পেমেন্ট মেথড</label>
                <div className="flex gap-4">
                  {[
                    { id: 'cash', label: 'ক্যাশ টাকা' },
                    { id: 'bkash', label: 'বিকাশ / নগদ' },
                    { id: 'bank', label: 'ব্যাংক চেক' },
                  ].map((m) => (
                    <label key={m.id} className="flex items-center gap-1.5 cursor-pointer font-medium">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={m.id}
                        checked={paymentMethod === m.id}
                        onChange={() => setPaymentMethod(m.id as any)}
                      />
                      <span>{m.label}</span>
                    </label>
                  ))}
                </div>
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
                  {entryMode === 'staff_transfer' ? 'তহবিল হস্তান্তর নিশ্চিত করুন' : 'খরচ ভাউচার জমা দিন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Expense Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(expenseToDelete)}
        title="খরচ / লেনদেন রেকর্ড মুছে ফেলার নিশ্চয়তা"
        message={`আপনি কি সত্যিই "${expenseToDelete?.description}" (${expenseToDelete ? formatTaka(expenseToDelete.amount) : ''}) খরচের রেকর্ডটি মুছে ফেলতে চান?`}
        confirmText="হ্যাঁ, মুছে ফেলুন"
        cancelText="বাতিল"
        isDanger={true}
        onConfirm={() => {
          if (expenseToDelete) {
            onDeleteExpense(expenseToDelete.id);
            setExpenseToDelete(null);
          }
        }}
        onClose={() => setExpenseToDelete(null)}
      />
    </div>
  );
};
