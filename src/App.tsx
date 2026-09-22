import React, { useState, useEffect } from 'react';
import { 
  Bus, 
  ReleaseTrip, 
  RoadTrip, 
  ExpenseRecord, 
  BookingInquiry, 
  PopularRoute,
  StaffMember,
  StaffLedgerEntry,
  SystemUser
} from './types';
import { 
  INITIAL_BUSES, 
  INITIAL_RELEASE_TRIPS, 
  INITIAL_ROAD_TRIPS, 
  INITIAL_EXPENSES, 
  INITIAL_INQUIRIES, 
  INITIAL_STAFF,
  INITIAL_STAFF_LEDGER,
  INITIAL_USERS,
  POPULAR_ROUTES 
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { PublicShowcase } from './components/public/PublicShowcase';
import { BusDetailModal } from './components/public/BusDetailModal';
import { BookingInquiryForm } from './components/public/BookingInquiryForm';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { VoucherPrintModal } from './components/admin/VoucherPrintModal';
import { LoginModal } from './components/admin/LoginModal';
import { toBengaliNumber } from './utils/helpers';
import { Sparkles, HelpCircle, CheckCircle, Info } from 'lucide-react';

export default function App() {
  // Persistence state - Bus Fleet
  const [buses, setBuses] = useState<Bus[]>(() => {
    try {
      const saved = localStorage.getItem('dwipachal_buses');
      return saved ? JSON.parse(saved) : INITIAL_BUSES;
    } catch {
      return INITIAL_BUSES;
    }
  });

  // Persistence state - Release Trips
  const [releaseTrips, setReleaseTrips] = useState<ReleaseTrip[]>(() => {
    try {
      const saved = localStorage.getItem('dwipachal_release_trips');
      return saved ? JSON.parse(saved) : INITIAL_RELEASE_TRIPS;
    } catch {
      return INITIAL_RELEASE_TRIPS;
    }
  });

  // Persistence state - Road Trips
  const [roadTrips, setRoadTrips] = useState<RoadTrip[]>(() => {
    try {
      const saved = localStorage.getItem('dwipachal_road_trips');
      return saved ? JSON.parse(saved) : INITIAL_ROAD_TRIPS;
    } catch {
      return INITIAL_ROAD_TRIPS;
    }
  });

  // Persistence state - Expenses
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    try {
      const saved = localStorage.getItem('dwipachal_expenses');
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  // Persistence state - Public Booking Inquiries
  const [inquiries, setInquiries] = useState<BookingInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('dwipachal_inquiries');
      return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
    } catch {
      return INITIAL_INQUIRIES;
    }
  });

  // Persistence state - Staff & Members
  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    try {
      const saved = localStorage.getItem('dwipachal_staff');
      return saved ? JSON.parse(saved) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  // Persistence state - Staff Ledgers
  const [staffLedger, setStaffLedger] = useState<StaffLedgerEntry[]>(() => {
    try {
      const saved = localStorage.getItem('dwipachal_staff_ledger');
      return saved ? JSON.parse(saved) : INITIAL_STAFF_LEDGER;
    } catch {
      return INITIAL_STAFF_LEDGER;
    }
  });

  // Persistence state - System Users (RBAC)
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>(() => {
    try {
      const saved = localStorage.getItem('dwipachal_system_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Active user session
  const [currentActiveUser, setCurrentActiveUser] = useState<SystemUser>(() => {
    try {
      const saved = localStorage.getItem('dwipachal_current_active_user');
      return saved ? JSON.parse(saved) : (INITIAL_USERS[0] || systemUsers[0]);
    } catch {
      return INITIAL_USERS[0];
    }
  });

  // UI state
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedBusForDetail, setSelectedBusForDetail] = useState<Bus | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedBusForBooking, setSelectedBusForBooking] = useState<Bus | null>(null);
  const [printableTrip, setPrintableTrip] = useState<ReleaseTrip | null>(null);
  const [showSoftwareGuide, setShowSoftwareGuide] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('dwipachal_buses', JSON.stringify(buses));
    } catch (e) {
      console.error(e);
    }
  }, [buses]);

  useEffect(() => {
    try {
      localStorage.setItem('dwipachal_release_trips', JSON.stringify(releaseTrips));
    } catch (e) {
      console.error(e);
    }
  }, [releaseTrips]);

  useEffect(() => {
    try {
      localStorage.setItem('dwipachal_road_trips', JSON.stringify(roadTrips));
    } catch (e) {
      console.error(e);
    }
  }, [roadTrips]);

  useEffect(() => {
    try {
      localStorage.setItem('dwipachal_expenses', JSON.stringify(expenses));
    } catch (e) {
      console.error(e);
    }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem('dwipachal_inquiries', JSON.stringify(inquiries));
    } catch (e) {
      console.error(e);
    }
  }, [inquiries]);

  useEffect(() => {
    try {
      localStorage.setItem('dwipachal_staff', JSON.stringify(staffList));
    } catch (e) {
      console.error(e);
    }
  }, [staffList]);

  useEffect(() => {
    try {
      localStorage.setItem('dwipachal_staff_ledger', JSON.stringify(staffLedger));
    } catch (e) {
      console.error(e);
    }
  }, [staffLedger]);

  useEffect(() => {
    try {
      localStorage.setItem('dwipachal_system_users', JSON.stringify(systemUsers));
    } catch (e) {
      console.error(e);
    }
  }, [systemUsers]);

  useEffect(() => {
    try {
      localStorage.setItem('dwipachal_current_active_user', JSON.stringify(currentActiveUser));
    } catch (e) {
      console.error(e);
    }
  }, [currentActiveUser]);

  // Auth toggle
  const handleToggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  // Bus Fleet actions
  const handleAddBus = (newBusData: Omit<Bus, 'id'>) => {
    const newBus: Bus = {
      ...newBusData,
      id: `bus-${Date.now()}`,
    };
    setBuses((prev) => [newBus, ...prev]);
  };

  const handleUpdateBus = (updatedBus: Bus) => {
    setBuses((prev) => prev.map((b) => (b.id === updatedBus.id ? updatedBus : b)));
  };

  const handleDeleteBus = (busId: string) => {
    setBuses((prev) => prev.filter((b) => b.id !== busId));
  };

  // Staff & Member Actions
  const handleAddStaff = (staffData: Omit<StaffMember, 'id' | 'createdAt'>) => {
    const newStaff: StaffMember = {
      ...staffData,
      id: `staff-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setStaffList((prev) => [newStaff, ...prev]);
  };

  const handleUpdateStaff = (updatedStaff: StaffMember) => {
    setStaffList((prev) => prev.map((s) => (s.id === updatedStaff.id ? updatedStaff : s)));
  };

  const handleDeleteStaff = (staffId: string) => {
    setStaffList((prev) => prev.filter((s) => s.id !== staffId));
    setStaffLedger((prev) => prev.filter((l) => l.staffId !== staffId));
  };

  // Staff Ledger Actions
  const handleAddLedgerEntry = (entryData: Omit<StaffLedgerEntry, 'id' | 'createdAt'>) => {
    const newEntry: StaffLedgerEntry = {
      ...entryData,
      id: `sledger-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setStaffLedger((prev) => [newEntry, ...prev]);
  };

  const handleDeleteLedgerEntry = (entryId: string) => {
    setStaffLedger((prev) => prev.filter((l) => l.id !== entryId));
  };

  // System User Actions (RBAC)
  const handleAddUser = (userData: Omit<SystemUser, 'id' | 'createdAt'>) => {
    const newUser: SystemUser = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setSystemUsers((prev) => [...prev, newUser]);
  };

  const handleUpdateUser = (updatedUser: SystemUser) => {
    setSystemUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    if (currentActiveUser.id === updatedUser.id) {
      setCurrentActiveUser(updatedUser);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setSystemUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleSwitchUser = (user: SystemUser) => {
    setCurrentActiveUser(user);
  };

  // Release / Reserve Trip actions
  const handleAddReleaseTrip = (tripData: Omit<ReleaseTrip, 'id' | 'createdAt' | 'voucherNumber'>) => {
    const voucherNumber = `DWP-RES-${new Date().getFullYear().toString().slice(-2)}-${Math.floor(100 + Math.random() * 900)}`;
    const newTrip: ReleaseTrip = {
      ...tripData,
      id: `rel-${Date.now()}`,
      voucherNumber,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setReleaseTrips((prev) => [newTrip, ...prev]);

    // Update bus status if trip is active or confirmed
    setBuses((prev) =>
      prev.map((b) => (b.id === tripData.busId ? { ...b, status: 'on_release' } : b))
    );

    // Auto record advance in receiving staff ledger
    if (tripData.advanceAmount > 0 && tripData.advanceReceivedByStaffId) {
      const today = new Date().toISOString().split('T')[0];
      const newLedgerEntry: StaffLedgerEntry = {
        id: `sledger-${Date.now()}`,
        staffId: tripData.advanceReceivedByStaffId,
        date: tripData.startDate || today,
        type: 'reserve_trip_advance',
        title: `রিজার্ভ ট্রিপ অগ্রিম জমা (${voucherNumber}) - ${tripData.clientName}`,
        amount: tripData.advanceAmount,
        flow: 'company_received_in',
        paymentMethod: 'cash',
        referenceNo: voucherNumber,
        busId: tripData.busId,
        notes: `রেফারেন্স: ${tripData.referenceStaffName || 'অফিস'}। গন্তব্য: ${tripData.destination}`,
        createdAt: today,
      };
      setStaffLedger((prev) => [newLedgerEntry, ...prev]);
    }
  };

  const handleUpdateReleaseTrip = (updatedTrip: ReleaseTrip) => {
    setReleaseTrips((prev) => prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)));
  };

  const handleReceiveDue = (
    tripId: string, 
    amount: number, 
    receivedByStaffId?: string, 
    receivedByStaffName?: string
  ) => {
    let tripVoucher = '';
    let tripClient = '';
    let tripBusId = '';

    setReleaseTrips((prev) =>
      prev.map((t) => {
        if (t.id === tripId) {
          tripVoucher = t.voucherNumber;
          tripClient = t.clientName;
          tripBusId = t.busId;
          const newAdvance = t.advanceAmount + amount;
          const newDue = Math.max(0, t.contractAmount - newAdvance);
          return {
            ...t,
            advanceAmount: newAdvance,
            dueAmount: newDue,
            dueReceivedByStaffId: receivedByStaffId || t.dueReceivedByStaffId,
            dueReceivedByStaffName: receivedByStaffName || t.dueReceivedByStaffName,
            paymentStatus: newDue === 0 ? 'paid' : 'partial',
          };
        }
        return t;
      })
    );

    if (receivedByStaffId && amount > 0) {
      const today = new Date().toISOString().split('T')[0];
      const newLedgerEntry: StaffLedgerEntry = {
        id: `sledger-${Date.now()}`,
        staffId: receivedByStaffId,
        date: today,
        type: 'reserve_trip_due',
        title: `রিজার্ভ ট্রিপ বকেয়া আদায় (${tripVoucher}) - ${tripClient}`,
        amount: amount,
        flow: 'company_received_in',
        paymentMethod: 'cash',
        referenceNo: tripVoucher,
        busId: tripBusId,
        notes: `বকেয়া আদায় গ্রহণকারী: ${receivedByStaffName || 'স্টাফ'}`,
        createdAt: today,
      };
      setStaffLedger((prev) => [newLedgerEntry, ...prev]);
    }
  };

  // Road Trip actions
  const handleAddRoadTrip = (roadData: Omit<RoadTrip, 'id'>) => {
    const newRoadTrip: RoadTrip = {
      ...roadData,
      id: `road-${Date.now()}`,
    };
    setRoadTrips((prev) => [newRoadTrip, ...prev]);

    const today = new Date().toISOString().split('T')[0];

    // If positive net deposit and receiver staff specified
    if (roadData.netDeposit > 0 && roadData.receivedByStaffId) {
      const depositEntry: StaffLedgerEntry = {
        id: `sledger-${Date.now()}`,
        staffId: roadData.receivedByStaffId,
        date: roadData.date || today,
        type: 'road_trip_deposit',
        title: `রোড ট্রিপ নীট জমা (${roadData.tripCode}) - ${roadData.routeName}`,
        amount: roadData.netDeposit,
        flow: 'company_received_in',
        paymentMethod: 'cash',
        referenceNo: roadData.tripCode,
        busId: roadData.busId,
        notes: `টিকিট বিক্রি: ${roadData.ticketSalesAmount} টাকা, লাইন খরচ বাদে নীট ক্যাশ`,
        createdAt: today,
      };
      setStaffLedger((prev) => [depositEntry, ...prev]);
    } else if (roadData.netDeposit < 0 && roadData.lossBearingStaffId) {
      // Deficit / loss borne by staff
      const lossAmount = Math.abs(roadData.netDeposit);
      const shortageEntry: StaffLedgerEntry = {
        id: `sledger-${Date.now()}`,
        staffId: roadData.lossBearingStaffId,
        date: roadData.date || today,
        type: 'road_trip_shortage',
        title: `রোড ট্রিপ ঘাটতি/লস সমন্বয় (${roadData.tripCode}) - ${roadData.routeName}`,
        amount: lossAmount,
        flow: 'company_paid_out',
        paymentMethod: 'cash',
        referenceNo: roadData.tripCode,
        busId: roadData.busId,
        notes: `ঘাটতির পরিমাণ: ${lossAmount} টাকা`,
        createdAt: today,
      };
      setStaffLedger((prev) => [shortageEntry, ...prev]);
    }
  };

  // Expense & Transfer actions
  const handleAddExpense = (expData: Omit<ExpenseRecord, 'id'>) => {
    const newExpense: ExpenseRecord = {
      ...expData,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [newExpense, ...prev]);

    const today = new Date().toISOString().split('T')[0];

    if (expData.isStaffTransfer || expData.category === 'staff_transfer') {
      // Staff-to-staff internal transfer (Not company expense)
      if (expData.transferFromStaffId) {
        const outEntry: StaffLedgerEntry = {
          id: `sledger-${Date.now()}-out`,
          staffId: expData.transferFromStaffId,
          date: expData.date || today,
          type: 'staff_transfer_out',
          title: `তহবিল হস্তান্তর ➔ ${expData.transferToStaffName || 'সহকর্মী'}`,
          amount: expData.amount,
          flow: 'company_paid_out',
          paymentMethod: expData.paymentMethod || 'cash',
          referenceNo: expData.voucherNo,
          relatedStaffId: expData.transferToStaffId,
          notes: expData.notes || 'অভ্যন্তরীণ তহবিল স্থানান্তর',
          createdAt: today,
        };
        setStaffLedger((prev) => [outEntry, ...prev]);
      }
      if (expData.transferToStaffId) {
        const inEntry: StaffLedgerEntry = {
          id: `sledger-${Date.now() + 1}-in`,
          staffId: expData.transferToStaffId,
          date: expData.date || today,
          type: 'staff_transfer_in',
          title: `তহবিল গ্রহণ ⬅ ${expData.transferFromStaffName || 'সহকর্মী'}`,
          amount: expData.amount,
          flow: 'company_received_in',
          paymentMethod: expData.paymentMethod || 'cash',
          referenceNo: expData.voucherNo,
          relatedStaffId: expData.transferFromStaffId,
          notes: expData.notes || 'অভ্যন্তরীণ তহবিল স্থানান্তর',
          createdAt: today,
        };
        setStaffLedger((prev) => [inEntry, ...prev]);
      }
    } else if (expData.spentByStaffId) {
      // Regular company expense paid by staff custodian
      const expEntry: StaffLedgerEntry = {
        id: `sledger-${Date.now()}`,
        staffId: expData.spentByStaffId,
        date: expData.date || today,
        type: 'expense_payment',
        title: `খরচ পরিশোধ: ${expData.title}`,
        amount: expData.amount,
        flow: 'company_paid_out',
        paymentMethod: expData.paymentMethod || 'cash',
        referenceNo: expData.voucherNo,
        busId: expData.busId,
        notes: expData.notes || `${expData.spentByStaffName || 'স্টাফ'} কর্তৃক পরিশোধিত`,
        createdAt: today,
      };
      setStaffLedger((prev) => [expEntry, ...prev]);
    }
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Public Booking Inquiries
  const handleCreateInquiry = (inqData: Omit<BookingInquiry, 'id' | 'createdAt' | 'status'>) => {
    const newInq: BookingInquiry = {
      ...inqData,
      id: `inq-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toLocaleString('bn-BD'),
    };
    setInquiries((prev) => [newInq, ...prev]);
  };

  const handleUpdateInquiryStatus = (id: string, status: BookingInquiry['status']) => {
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  const handleConvertToReleaseTrip = (inq: BookingInquiry) => {
    const assignedBus = buses.find((b) => b.id === inq.preferredBusId) || buses[0];
    const contract = inq.estimatedBudget || (assignedBus?.perDayReleaseRent ? assignedBus.perDayReleaseRent * 3 : 60000);
    const advance = Math.round(contract * 0.5);

    handleAddReleaseTrip({
      busId: assignedBus?.id || buses[0]?.id || '',
      clientName: inq.clientName,
      clientPhone: inq.clientPhone,
      pickupLocation: inq.pickupLocation,
      destination: inq.destination,
      startDate: inq.journeyDate,
      endDate: inq.returnDate || inq.journeyDate,
      durationDays: 3,
      contractAmount: contract,
      advanceAmount: advance,
      dueAmount: contract - advance,
      fuelBy: 'owner',
      tollBy: 'owner',
      assignedDriver: assignedBus?.driverName || 'ড্রাইভার',
      assignedDriverPhone: assignedBus?.driverPhone || '',
      paymentStatus: 'partial',
      status: 'confirmed',
      notes: `অনলাইন রিকোয়েস্ট হতে কনভার্ট করা হয়েছে: ${inq.notes || ''}`,
    });

    handleUpdateInquiryStatus(inq.id, 'confirmed');
  };

  // Export JSON with comprehensive system state
  const handleExportData = () => {
    const backupData = {
      organization: 'দিবাচল এন্টারপ্রাইজ (Dwipachal Enterprise)',
      exportedAt: new Date().toISOString(),
      buses,
      staffList,
      staffLedger,
      systemUsers,
      releaseTrips,
      roadTrips,
      expenses,
      inquiries,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `dwipachal_enterprise_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Counts
  const activeTripsCount = releaseTrips.filter((t) => t.status === 'active').length + roadTrips.length;
  const availableBusesCount = buses.filter((b) => b.status === 'available').length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col justify-between">
      <div>
        {/* Navigation Bar */}
        <Navbar
          isAdmin={isAdmin}
          currentActiveUser={currentActiveUser}
          onToggleAdmin={handleToggleAdmin}
          activeTripsCount={activeTripsCount}
          availableBusesCount={availableBusesCount}
          totalBusesCount={buses.length}
          onOpenBookingModal={() => {
            setSelectedBusForBooking(null);
            setIsBookingModalOpen(true);
          }}
        />

        {/* Floating Architectural / Software Idea Advisory for the User */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-blue-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/50 border border-blue-400/30 flex items-center justify-center shrink-0 text-blue-200 mt-0.5">
                <Info className="w-5 h-5 text-amber-300" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    দিবাচল এন্টারপ্রাইজের হাইব্রিড সফটওয়্যার ও রোল ম্যানেজমেন্ট
                  </h3>
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    সুপার অ্যাডমিন ও স্টাফ লেজার সক্রিয়
                  </span>
                </div>
                <p className="text-xs text-blue-200 leading-relaxed max-w-4xl">
                  সুপার অ্যাডমিন ইচ্ছেমতো একাউন্টেন্ট বা এটেন্ডেন্ট ইউজার তৈরি করতে পারবে এবং চেকবক্স দিয়ে কে কোন মডিউল চালাতে পারবে তা নির্ধারণ করতে পারবে। এছাড়া সব বাস মালিক, চালক ও মিস্ত্রিদের NID ও লাইসেন্স ডকুমেন্টস এবং ব্যক্তিগত লেজার খতিয়ান সম্পূর্ণ প্রস্তুত।
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowSoftwareGuide(!showSoftwareGuide)}
                className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors cursor-pointer"
              >
                {showSoftwareGuide ? 'পরামর্শ সংক্ষিপ্ত করুন' : 'মডিউল নির্দেশিকা দেখুন'}
              </button>
            </div>
          </div>

          {/* Expanded Software Architecture Guide */}
          {showSoftwareGuide && (
            <div className="mt-3 bg-white rounded-2xl border border-blue-200 p-5 shadow-sm text-xs space-y-4 animate-in fade-in duration-150">
              <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" /> দিবাচল এন্টারপ্রাইজ সিস্টেমের পূর্ণাঙ্গ মডিউল তালিকা
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <strong className="text-slate-900 font-bold block text-sm">১. ইউজার ও পারমিশন কন্ট্রোল (RBAC)</strong>
                  <p>সুপার অ্যাডমিন ছাড়াও একাউন্টেন্ট, টার্মিনাল এটেন্ডেন্ট বা ম্যানেজার ইউজার তৈরি করা যাবে। প্রতিটি ইউজারের জন্য কোন কোন মডিউল এক্সেস থাকবে তা চেকবক্সে টিক দিয়ে সহজে ঠিক করা যায়।</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <strong className="text-slate-900 font-bold block text-sm">২. স্টাফ, মেম্বার ও ব্যক্তিগত খতিয়ান</strong>
                  <p>বাস মালিক, ড্রাইভার, সুপারভাইজার, হেলপার, হোস্ট ও ইলেকট্রিক/ইঞ্জিন মিস্ত্রিদের পূর্ণ প্রোফাইল। জাতীয় পরিচয়পত্র (NID), ড্রাইভিং লাইসেন্স ও শ্রমিক ইউনিয়ন কার্ডের এপিট-ওপিট ছবি আপলোড এবং নিজস্ব লেজার হিসাব।</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <strong className="text-slate-900 font-bold block text-sm">৩. বাস রেজিস্ট্রেশন ও ডকুমেন্টস</strong>
                  <p>বাস যুক্ত করার জন্য শুধুমাত্র রেজিস্ট্রেশন নম্বর ম্যান্ডেটরি। ব্লু বুক, ফিটনেস সার্টিফিকেট, ট্যাক্স টোকেন ও রুট পারমিটের কপি আপলোড ও মেয়াদের অ্যালার্ট রয়েছে। বাসের মাসিক চুক্তি রেন্টও স্বয়ংক্রিয়ভাবে হিসাব থাকবে।</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content View Switcher (Public Guest View vs Admin/Manager Dashboard) */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {isAdmin ? (
            <AdminDashboard
              buses={buses}
              staffList={staffList}
              staffLedger={staffLedger}
              systemUsers={systemUsers}
              currentActiveUser={currentActiveUser}
              releaseTrips={releaseTrips}
              roadTrips={roadTrips}
              expenses={expenses}
              inquiries={inquiries}
              onAddBus={handleAddBus}
              onUpdateBus={handleUpdateBus}
              onDeleteBus={handleDeleteBus}
              onAddStaff={handleAddStaff}
              onUpdateStaff={handleUpdateStaff}
              onDeleteStaff={handleDeleteStaff}
              onAddLedgerEntry={handleAddLedgerEntry}
              onDeleteLedgerEntry={handleDeleteLedgerEntry}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              onSwitchUser={handleSwitchUser}
              onAddReleaseTrip={handleAddReleaseTrip}
              onUpdateReleaseTrip={handleUpdateReleaseTrip}
              onReceiveDue={handleReceiveDue}
              onPrintVoucher={(trip) => setPrintableTrip(trip)}
              onAddRoadTrip={handleAddRoadTrip}
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
              onUpdateInquiryStatus={handleUpdateInquiryStatus}
              onConvertToReleaseTrip={handleConvertToReleaseTrip}
              onExportData={handleExportData}
            />
          ) : (
            <PublicShowcase
              buses={buses}
              popularRoutes={POPULAR_ROUTES}
              inquiries={inquiries}
              onSelectBusForDetail={(bus) => setSelectedBusForDetail(bus)}
              onOpenBookingModal={(bus) => {
                setSelectedBusForBooking(bus || null);
                setIsBookingModalOpen(true);
              }}
            />
          )}
        </main>
      </div>

      {/* Modals & Dialogs */}
      {/* 1. Bus Detail Modal (Public) */}
      {selectedBusForDetail && (
        <BusDetailModal
          bus={selectedBusForDetail}
          onClose={() => setSelectedBusForDetail(null)}
          onBookNow={(bus) => {
            setSelectedBusForBooking(bus);
            setIsBookingModalOpen(true);
          }}
        />
      )}

      {/* 2. Public Booking Inquiry Form */}
      {isBookingModalOpen && (
        <BookingInquiryForm
          buses={buses}
          selectedBus={selectedBusForBooking}
          onClose={() => setIsBookingModalOpen(false)}
          onSubmitInquiry={handleCreateInquiry}
        />
      )}

      {/* 3. Printable Voucher / Money Receipt */}
      {printableTrip && (
        <VoucherPrintModal
          trip={printableTrip}
          bus={buses.find((b) => b.id === printableTrip.busId)}
          onClose={() => setPrintableTrip(null)}
        />
      )}

      {/* 4. Manager & Operator Login Modal with RBAC user switcher */}
      <LoginModal
        isOpen={isLoginModalOpen}
        systemUsers={systemUsers}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentActiveUser(user);
          setIsAdmin(true);
        }}
      />
    </div>
  );
}
