import React, { useState, useEffect } from 'react';
import { 
  Bus, 
  ReleaseTrip, 
  RoadTrip, 
  ExpenseRecord, 
  BookingInquiry, 
  StaffMember, 
  StaffLedgerEntry, 
  SystemUser, 
  SystemModuleId 
} from '../../types';
import { formatTaka, toBengaliNumber, formatDisplayDate } from '../../utils/helpers';
import { FleetManager } from './FleetManager';
import { StaffManager } from './StaffManager';
import { UserManager } from './UserManager';
import { ReleaseTripManager } from './ReleaseTripManager';
import { RoadTripManager } from './RoadTripManager';
import { LedgerManager } from './LedgerManager';
import { AnalyticsReports } from './AnalyticsReports';
import { InquiriesManager } from './InquiriesManager';
import { 
  LayoutDashboard, 
  Bus as BusIcon, 
  Users, 
  CalendarDays, 
  Compass, 
  Receipt, 
  TrendingUp, 
  MessageSquare, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowUpRight, 
  CheckCircle,
  Plus,
  Shield,
  UserCheck,
  Building2
} from 'lucide-react';

interface AdminDashboardProps {
  buses: Bus[];
  staffList: StaffMember[];
  staffLedger: StaffLedgerEntry[];
  systemUsers: SystemUser[];
  currentActiveUser: SystemUser;
  releaseTrips: ReleaseTrip[];
  roadTrips: RoadTrip[];
  expenses: ExpenseRecord[];
  inquiries: BookingInquiry[];
  onAddBus: (bus: Omit<Bus, 'id'>) => void;
  onUpdateBus: (bus: Bus) => void;
  onDeleteBus: (busId: string) => void;
  onAddStaff: (staff: Omit<StaffMember, 'id' | 'createdAt'>) => void;
  onUpdateStaff: (staff: StaffMember) => void;
  onDeleteStaff: (staffId: string) => void;
  onAddLedgerEntry: (entry: Omit<StaffLedgerEntry, 'id' | 'createdAt'>) => void;
  onDeleteLedgerEntry: (entryId: string) => void;
  onAddUser: (user: Omit<SystemUser, 'id' | 'createdAt'>) => void;
  onUpdateUser: (user: SystemUser) => void;
  onDeleteUser: (userId: string) => void;
  onSwitchUser: (user: SystemUser) => void;
  onAddReleaseTrip: (trip: Omit<ReleaseTrip, 'id' | 'createdAt' | 'voucherNumber'>) => void;
  onUpdateReleaseTrip: (trip: ReleaseTrip) => void;
  onReceiveDue: (tripId: string, amount: number) => void;
  onPrintVoucher: (trip: ReleaseTrip) => void;
  onAddRoadTrip: (trip: Omit<RoadTrip, 'id'>) => void;
  onAddExpense: (expense: Omit<ExpenseRecord, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
  onUpdateInquiryStatus: (id: string, status: BookingInquiry['status']) => void;
  onConvertToReleaseTrip: (inquiry: BookingInquiry) => void;
  onExportData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  buses,
  staffList,
  staffLedger,
  systemUsers,
  currentActiveUser,
  releaseTrips,
  roadTrips,
  expenses,
  inquiries,
  onAddBus,
  onUpdateBus,
  onDeleteBus,
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
  onAddLedgerEntry,
  onDeleteLedgerEntry,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onSwitchUser,
  onAddReleaseTrip,
  onUpdateReleaseTrip,
  onReceiveDue,
  onPrintVoucher,
  onAddRoadTrip,
  onAddExpense,
  onDeleteExpense,
  onUpdateInquiryStatus,
  onConvertToReleaseTrip,
  onExportData,
}) => {
  const [activeTab, setActiveTab] = useState<SystemModuleId>('overview');

  // Aggregates for executive overview
  const totalReleaseIncome = releaseTrips.reduce((sum, t) => sum + t.advanceAmount, 0);
  const totalRoadDeposit = roadTrips.reduce((sum, t) => sum + t.netDeposit, 0);
  const totalRevenue = totalReleaseIncome + totalRoadDeposit;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalDueReceivable = releaseTrips.reduce((sum, t) => sum + t.dueAmount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const availableBuses = buses.filter((b) => b.status === 'available').length;
  const onReleaseBuses = buses.filter((b) => b.status === 'on_release').length;
  const onRouteBuses = buses.filter((b) => b.status === 'on_route').length;
  const maintenanceBuses = buses.filter((b) => b.status === 'maintenance').length;
  const pendingInquiriesCount = inquiries.filter((i) => i.status === 'pending').length;

  // Master definition of all 9 modules
  const allNavTabs: {
    id: SystemModuleId;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: string;
    badgeColor?: string;
  }[] = [
    { id: 'overview', label: 'ড্যাশবোর্ড ওভারভিউ', icon: LayoutDashboard },
    { id: 'fleet', label: 'বাস বহর ও পেপারস', icon: BusIcon, badge: `${buses.length}` },
    { id: 'staff', label: 'স্টাফ ও ব্যক্তিগত লেজার', icon: Users, badge: `${staffList.length}` },
    { id: 'release', label: 'রিজার্ভ ট্রিপ ও বুকিং', icon: CalendarDays, badge: `${releaseTrips.length}` },
    { id: 'road', label: 'নিয়মিত রোড ট্রিপ', icon: Compass, badge: `${roadTrips.length}` },
    { id: 'ledger', label: 'আয়-ব্যয় ক্যাশবুক', icon: Receipt },
    { id: 'reports', label: 'লাভ-ক্ষতি রিপোর্ট', icon: TrendingUp },
    { 
      id: 'inquiries', 
      label: 'বুকিং রিকোয়েস্ট', 
      icon: MessageSquare, 
      badge: pendingInquiriesCount > 0 ? `${pendingInquiriesCount} নতুন` : undefined,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold'
    },
    { id: 'users', label: 'ইউজার ও RBAC পারমিশন', icon: ShieldCheck, badge: `${systemUsers.length}` },
  ];

  // RBAC Permission Filter: Super admin sees all, other users see only allowed modules!
  const permittedTabs = allNavTabs.filter((tab) => {
    if (currentActiveUser.isSuperAdmin) return true;
    return currentActiveUser.allowedModules.includes(tab.id);
  });

  // Ensure current active tab is permitted; if not, fallback to first permitted tab
  useEffect(() => {
    const isAllowed = currentActiveUser.isSuperAdmin || currentActiveUser.allowedModules.includes(activeTab);
    if (!isAllowed) {
      const fallback = permittedTabs[0]?.id || 'overview';
      setActiveTab(fallback);
    }
  }, [currentActiveUser, activeTab, permittedTabs]);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Welcome & RBAC User Identity Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              দিবাচল এন্টারপ্রাইজ • অভ্যন্তরীণ সফটওয়্যার
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-600 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>লগইন ইউজার: <strong>{currentActiveUser.name}</strong></span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
              {currentActiveUser.isSuperAdmin ? '👑 সুপার অ্যাডমিন' : currentActiveUser.role.toUpperCase()}
            </span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            বাস বহর, স্টাফ লেজার ও ট্রিপ ম্যানেজমেন্ট
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            রিলিজ ট্রিপ ভাউচার, স্টাফদের এনআইডি ও ড্রাইভিং লাইসেন্স, বাসের মাসিক রেন্ট এবং ক্যাশবুক
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {(currentActiveUser.isSuperAdmin || currentActiveUser.allowedModules.includes('release')) && (
            <button
              onClick={() => setActiveTab('release')}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন রিলিজ বুকিং</span>
            </button>
          )}

          {(currentActiveUser.isSuperAdmin || currentActiveUser.allowedModules.includes('staff')) && (
            <button
              onClick={() => setActiveTab('staff')}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>স্টাফ লেজার</span>
            </button>
          )}

          {(currentActiveUser.isSuperAdmin || currentActiveUser.allowedModules.includes('ledger')) && (
            <button
              onClick={() => setActiveTab('ledger')}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>খরচ এন্ট্রি</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation Strip (Filtered strictly by RBAC permissions) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {permittedTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    tab.badgeColor || (isActive ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-700')
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* MODULE 1: Overview */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Financial KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">চলতি মোট ক্যাশ রাজস্ব</span>
              <div className="text-2xl font-black text-blue-700 mt-1">{formatTaka(totalRevenue)}</div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                <span>রিলিজ: {formatTaka(totalReleaseIncome)}</span>
                <span>•</span>
                <span>রোড: {formatTaka(totalRoadDeposit)}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">মোট ব্যয়ের খতিয়ান</span>
              <div className="text-2xl font-black text-rose-600 mt-1">{formatTaka(totalExpenses)}</div>
              <div className="text-[11px] text-slate-500 mt-1">ডিজেল, সার্ভিসিং, টোল ও কর্মচারীদের বেতন</div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">মোট নীট লাভ (Net Profit)</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">{formatTaka(netProfit)}</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                মার্জিন: {toBengaliNumber(totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0)}%
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">আদায়যোগ্য অবশিষ্ট বকেয়া</span>
              <div className="text-2xl font-black text-amber-700 mt-1">{formatTaka(totalDueReceivable)}</div>
              <div className="text-[11px] text-amber-700 mt-1">রিলিজ ট্রিপের পার্টির থেকে বকেয়া</div>
            </div>
          </div>

          {/* Quick Module Access Shortcuts Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              onClick={() => setActiveTab('fleet')}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-400 shadow-xs cursor-pointer transition-all hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <BusIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">বাস বহর ও পেপারস</h4>
                  <p className="text-xs text-slate-500">মোট {toBengaliNumber(buses.length)} টি বাস • কাগজপত্র ও মেয়াদ ট্র্যাকিং</p>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('staff')}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 shadow-xs cursor-pointer transition-all hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">স্টাফ ও খতিয়ান</h4>
                  <p className="text-xs text-slate-500">{toBengaliNumber(staffList.length)} জন মেম্বার • NID, লাইসেন্স ও লেজার</p>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('users')}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-purple-400 shadow-xs cursor-pointer transition-all hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">ইউজার ও RBAC পারমিশন</h4>
                  <p className="text-xs text-slate-500">{toBengaliNumber(systemUsers.length)} জন অপারেটর • মডিউল চেকবক্স কন্ট্রোল</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bus Fleet Status Pill Indicators */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <BusIcon className="w-4 h-4 text-blue-600" /> বাসের বর্তমান কর্মসংস্থান ও বহর স্ট্যাটাস
              </h4>
              <button
                onClick={() => setActiveTab('fleet')}
                className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
              >
                বহরের বিস্তারিত দেখুন →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-xs text-emerald-800 font-semibold block">ফ্রি ও প্রস্তুত বাস</span>
                <span className="text-2xl font-black text-emerald-700 mt-1 block">
                  {toBengaliNumber(availableBuses)}
                </span>
                <span className="text-[10px] text-emerald-600">যেকোনো রিলিজ বা রোডের জন্য রেডি</span>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-center">
                <span className="text-xs text-purple-800 font-semibold block">রিলিজ ট্রিপে নিয়োজিত</span>
                <span className="text-2xl font-black text-purple-700 mt-1 block">
                  {toBengaliNumber(onReleaseBuses)}
                </span>
                <span className="text-[10px] text-purple-600">রিজার্ভ পার্টি ভ্রমণে রয়েছে</span>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-center">
                <span className="text-xs text-blue-800 font-semibold block">নিয়মিত রোডে রানিং</span>
                <span className="text-2xl font-black text-blue-700 mt-1 block">
                  {toBengaliNumber(onRouteBuses)}
                </span>
                <span className="text-[10px] text-blue-600">যাত্রী সেবায় চলাচল করছে</span>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-xs text-amber-800 font-semibold block">গ্যারেজ / মেরামতাধীন</span>
                <span className="text-2xl font-black text-amber-700 mt-1 block">
                  {toBengaliNumber(maintenanceBuses)}
                </span>
                <span className="text-[10px] text-amber-600">সার্ভিসিং বা পার্টস লাগানো হচ্ছে</span>
              </div>
            </div>
          </div>

          {/* Quick Recent Activity Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Release Trips */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-blue-600" />
                  <span>সাম্প্রতিক রিলিজ বুকিং ও জমা</span>
                </h4>
                <button
                  onClick={() => setActiveTab('release')}
                  className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                >
                  সবগুলো ({toBengaliNumber(releaseTrips.length)}) →
                </button>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {releaseTrips.slice(0, 4).map((trip) => (
                  <div key={trip.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{trip.clientName}</div>
                      <div className="text-[11px] text-slate-500">
                        {trip.destination} • {formatDisplayDate(trip.startDate)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-700">
                        অগ্রিম: {formatTaka(trip.advanceAmount)}
                      </div>
                      {trip.dueAmount > 0 && (
                        <div className="text-[10px] text-rose-600 font-semibold">
                          বকেয়া: {formatTaka(trip.dueAmount)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Staff Ledger Activity */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>স্টাফ ও মেম্বারদের সাম্প্রতিক লেনদেন</span>
                </h4>
                <button
                  onClick={() => setActiveTab('staff')}
                  className="text-xs text-indigo-600 hover:underline font-semibold cursor-pointer"
                >
                  সকল স্টাফ খতিয়ান →
                </button>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {staffLedger.slice(0, 4).map((entry) => {
                  const staff = staffList.find((s) => s.id === entry.staffId);
                  const isOut = entry.flow === 'company_paid_out';
                  return (
                    <div key={entry.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{staff?.name || 'স্টাফ'}</span>
                          <span className="text-[10px] text-slate-400">({entry.title})</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {formatDisplayDate(entry.date)} • {entry.paymentMethod === 'bkash' ? 'বিকাশ' : 'ক্যাশ'}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold ${isOut ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {isOut ? '-' : '+'} {formatTaka(entry.amount)}
                        </span>
                        <span className="block text-[10px] text-slate-400">
                          {isOut ? 'কোম্পানি দিল' : 'কোম্পানিতে জমা'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODULE 2: Bus Fleet Management */}
      {/* ======================================================== */}
      {activeTab === 'fleet' && (
        <FleetManager
          buses={buses}
          staffList={staffList}
          onAddBus={onAddBus}
          onUpdateBus={onUpdateBus}
          onDeleteBus={onDeleteBus}
        />
      )}

      {/* ======================================================== */}
      {/* MODULE 3: Staff & Member Management with Ledgers */}
      {/* ======================================================== */}
      {activeTab === 'staff' && (
        <StaffManager
          staffList={staffList}
          staffLedger={staffLedger}
          buses={buses}
          onAddStaff={onAddStaff}
          onUpdateStaff={onUpdateStaff}
          onDeleteStaff={onDeleteStaff}
          onAddLedgerEntry={onAddLedgerEntry}
          onDeleteLedgerEntry={onDeleteLedgerEntry}
        />
      )}

      {/* ======================================================== */}
      {/* MODULE 4: Release & Reserve Trips */}
      {/* ======================================================== */}
      {activeTab === 'release' && (
        <ReleaseTripManager
          trips={releaseTrips}
          buses={buses}
          staffList={staffList}
          onAddTrip={onAddReleaseTrip}
          onUpdateTrip={onUpdateReleaseTrip}
          onReceiveDue={onReceiveDue}
          onPrintVoucher={onPrintVoucher}
        />
      )}

      {/* ======================================================== */}
      {/* MODULE 5: Road Trips */}
      {/* ======================================================== */}
      {activeTab === 'road' && (
        <RoadTripManager
          trips={roadTrips}
          buses={buses}
          staffList={staffList}
          onAddRoadTrip={onAddRoadTrip}
        />
      )}

      {/* ======================================================== */}
      {/* MODULE 6: Cashbook / Expenses Ledger */}
      {/* ======================================================== */}
      {activeTab === 'ledger' && (
        <LedgerManager
          expenses={expenses}
          buses={buses}
          staffList={staffList}
          onAddExpense={onAddExpense}
          onDeleteExpense={onDeleteExpense}
        />
      )}

      {/* ======================================================== */}
      {/* MODULE 7: Reports & Profit-Loss */}
      {/* ======================================================== */}
      {activeTab === 'reports' && (
        <AnalyticsReports
          buses={buses}
          releaseTrips={releaseTrips}
          roadTrips={roadTrips}
          expenses={expenses}
          onExportData={onExportData}
        />
      )}

      {/* ======================================================== */}
      {/* MODULE 8: Booking Inquiries */}
      {/* ======================================================== */}
      {activeTab === 'inquiries' && (
        <InquiriesManager
          inquiries={inquiries}
          buses={buses}
          onUpdateStatus={onUpdateInquiryStatus}
          onConvertToReleaseTrip={(inq) => {
            onConvertToReleaseTrip(inq);
            setActiveTab('release');
          }}
        />
      )}

      {/* ======================================================== */}
      {/* MODULE 9: Users & RBAC Permissions */}
      {/* ======================================================== */}
      {activeTab === 'users' && (
        <UserManager
          users={systemUsers}
          currentActiveUser={currentActiveUser}
          onAddUser={onAddUser}
          onUpdateUser={onUpdateUser}
          onDeleteUser={onDeleteUser}
          onSwitchUser={onSwitchUser}
        />
      )}
    </div>
  );
};
