import React, { useState } from 'react';
import { 
  StaffMember, 
  StaffLedgerEntry, 
  StaffRole, 
  SalaryType, 
  StaffLedgerType, 
  Bus,
  DocumentImage 
} from '../../types';
import { 
  STAFF_ROLE_LABELS, 
  formatTaka, 
  toBengaliNumber, 
  formatDisplayDate,
  fileToDataUrl 
} from '../../utils/helpers';
import { DocumentUploader } from '../common/DocumentUploader';
import { DocumentViewerModal } from '../common/DocumentViewerModal';
import { ConfirmModal } from './ConfirmModal';
import { 
  Users, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Phone, 
  MapPin, 
  FileText, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  Search, 
  X, 
  Plus, 
  Briefcase, 
  Shield, 
  CheckCircle,
  Eye,
  Camera,
  History,
  Building2,
  Wrench
} from 'lucide-react';

interface StaffManagerProps {
  staffList: StaffMember[];
  staffLedger: StaffLedgerEntry[];
  buses: Bus[];
  onAddStaff: (staff: Omit<StaffMember, 'id' | 'createdAt'>) => void;
  onUpdateStaff: (staff: StaffMember) => void;
  onDeleteStaff: (staffId: string) => void;
  onAddLedgerEntry: (entry: Omit<StaffLedgerEntry, 'id' | 'createdAt'>) => void;
  onDeleteLedgerEntry: (entryId: string) => void;
}

export const StaffManager: React.FC<StaffManagerProps> = ({
  staffList,
  staffLedger,
  buses,
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
  onAddLedgerEntry,
  onDeleteLedgerEntry,
}) => {
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  
  // Ledger view modal
  const [selectedStaffForLedger, setSelectedStaffForLedger] = useState<StaffMember | null>(null);
  const [isLedgerEntryModalOpen, setIsLedgerEntryModalOpen] = useState(false);

  // Document preview modal
  const [docPreview, setDocPreview] = useState<{
    isOpen: boolean;
    title: string;
    front?: string;
    back?: string;
  }>({
    isOpen: false,
    title: '',
  });

  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);
  const [ledgerEntryToDelete, setLedgerEntryToDelete] = useState<StaffLedgerEntry | null>(null);

  // Staff Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState<StaffRole>('driver');
  const [phone, setPhone] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [address, setAddress] = useState('');
  const [salaryType, setSalaryType] = useState<SalaryType>('monthly');
  const [monthlySalary, setMonthlySalary] = useState<number>(18000);
  const [tripAllowanceRate, setTripAllowanceRate] = useState<number>(1200);
  const [status, setStatus] = useState<'active' | 'on_leave' | 'inactive'>('active');
  const [assignedBusId, setAssignedBusId] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [nidDocs, setNidDocs] = useState<DocumentImage>({});
  const [licenseDocs, setLicenseDocs] = useState<DocumentImage>({});
  const [unionCardDocs, setUnionCardDocs] = useState<DocumentImage>({});
  const [notes, setNotes] = useState('');

  // Ledger Entry Form state
  const [ledgerStaffId, setLedgerStaffId] = useState('');
  const [ledgerDate, setLedgerDate] = useState(new Date().toISOString().split('T')[0]);
  const [ledgerType, setLedgerType] = useState<StaffLedgerType>('salary_payment');
  const [ledgerTitle, setLedgerTitle] = useState('');
  const [ledgerAmount, setLedgerAmount] = useState<number>(5000);
  const [ledgerFlow, setLedgerFlow] = useState<'company_paid_out' | 'company_received_in'>('company_paid_out');
  const [ledgerMethod, setLedgerMethod] = useState<'cash' | 'bkash' | 'bank'>('cash');
  const [ledgerRef, setLedgerRef] = useState('');
  const [ledgerBusId, setLedgerBusId] = useState('');
  const [ledgerNotes, setLedgerNotes] = useState('');

  // Open add staff
  const openAddStaffModal = () => {
    setEditingStaff(null);
    setName('');
    setRole('driver');
    setPhone('');
    setEmergencyPhone('');
    setAddress('');
    setSalaryType('monthly');
    setMonthlySalary(18000);
    setTripAllowanceRate(1200);
    setStatus('active');
    setAssignedBusId('');
    setPhotoUrl('');
    setNidDocs({});
    setLicenseDocs({});
    setUnionCardDocs({});
    setNotes('');
    setIsStaffModalOpen(true);
  };

  // Open edit staff
  const openEditStaffModal = (staff: StaffMember) => {
    setEditingStaff(staff);
    setName(staff.name);
    setRole(staff.role);
    setPhone(staff.phone);
    setEmergencyPhone(staff.emergencyPhone || '');
    setAddress(staff.address || '');
    setSalaryType(staff.salaryType);
    setMonthlySalary(staff.monthlySalary || 0);
    setTripAllowanceRate(staff.tripAllowanceRate || 0);
    setStatus(staff.status);
    setAssignedBusId(staff.assignedBusId || '');
    setPhotoUrl(staff.photoUrl || '');
    setNidDocs(staff.nidDocuments || {});
    setLicenseDocs(staff.drivingLicenseDocuments || {});
    setUnionCardDocs(staff.laborUnionCardDocuments || {});
    setNotes(staff.notes || '');
    setIsStaffModalOpen(true);
  };

  const handleStaffFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('নাম এবং মোবাইল নম্বর দেওয়া আবশ্যক');
      return;
    }

    const payload = {
      name,
      role,
      phone,
      emergencyPhone: emergencyPhone || undefined,
      address: address || undefined,
      salaryType,
      monthlySalary: Number(monthlySalary) || 0,
      tripAllowanceRate: Number(tripAllowanceRate) || 0,
      status,
      assignedBusId: assignedBusId || undefined,
      photoUrl: photoUrl || undefined,
      nidDocuments: nidDocs,
      drivingLicenseDocuments: licenseDocs,
      laborUnionCardDocuments: unionCardDocs,
      notes: notes || undefined,
    };

    if (editingStaff) {
      onUpdateStaff({
        ...payload,
        id: editingStaff.id,
        createdAt: editingStaff.createdAt,
      });
    } else {
      onAddStaff(payload);
    }

    setIsStaffModalOpen(false);
  };

  // Ledger calculation helper
  const calculateStaffBalance = (staffId: string) => {
    const entries = staffLedger.filter((e) => e.staffId === staffId);
    let totalPaidToStaff = 0; // company paid out
    let totalReceivedFromStaff = 0; // company received in (e.g. staff deposit)

    entries.forEach((e) => {
      if (e.flow === 'company_paid_out') {
        totalPaidToStaff += e.amount;
      } else {
        totalReceivedFromStaff += e.amount;
      }
    });

    return {
      totalPaidToStaff,
      totalReceivedFromStaff,
      entriesCount: entries.length,
      netCompanyDepositBalance: totalReceivedFromStaff - totalPaidToStaff,
    };
  };

  const openAddLedgerEntryModal = (staff: StaffMember) => {
    setLedgerStaffId(staff.id);
    setLedgerDate(new Date().toISOString().split('T')[0]);
    if (staff.role === 'owner') {
      setLedgerType('owner_rent');
      setLedgerTitle('বাসের মাসিক চুক্তি রেন্ট প্রদান');
      setLedgerFlow('company_paid_out');
      setLedgerAmount(45000);
    } else if (staff.role.includes('mechanic')) {
      setLedgerType('mechanic_bill');
      setLedgerTitle('মিস্ত্রি কাজের মজুরি ও বিল পরিশোধ');
      setLedgerFlow('company_paid_out');
      setLedgerAmount(5000);
    } else {
      setLedgerType('salary_payment');
      setLedgerTitle('মাসিক বেতন প্রদান');
      setLedgerFlow('company_paid_out');
      setLedgerAmount(staff.monthlySalary || 15000);
    }
    setLedgerMethod('cash');
    setLedgerRef('');
    setLedgerBusId(staff.assignedBusId || '');
    setLedgerNotes('');
    setIsLedgerEntryModalOpen(true);
  };

  const handleLedgerFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ledgerTitle.trim() || ledgerAmount <= 0) {
      alert('বিবরণ এবং টাকার পরিমাণ সঠিক দিন');
      return;
    }

    onAddLedgerEntry({
      staffId: ledgerStaffId,
      date: ledgerDate,
      type: ledgerType,
      title: ledgerTitle,
      amount: Number(ledgerAmount),
      flow: ledgerFlow,
      paymentMethod: ledgerMethod,
      referenceNo: ledgerRef || undefined,
      busId: ledgerBusId || undefined,
      notes: ledgerNotes || undefined,
    });

    setIsLedgerEntryModalOpen(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await fileToDataUrl(file);
      setPhotoUrl(url);
    }
  };

  // Filtered staff
  const filteredStaff = staffList.filter((s) => {
    const matchesRole = selectedRoleFilter === 'all' || s.role === selectedRoleFilter;
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery) ||
      (s.address && s.address.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  // Unique roles present
  const staffRoleOptions: { value: StaffRole; label: string }[] = [
    { value: 'owner', label: 'বাস মালিক (Owner)' },
    { value: 'manager', label: 'কোম্পানি ম্যানেজার (Manager)' },
    { value: 'driver', label: 'ড্রাইভার / চালক (Driver)' },
    { value: 'supervisor', label: 'সুপারভাইজার (Supervisor)' },
    { value: 'helper', label: 'হেলপার / সহকারী (Helper)' },
    { value: 'host', label: 'হোস্ট / যাত্রী সহকারী (Host)' },
    { value: 'electric_mechanic', label: 'ইলেকট্রিক মিস্ত্রি (Electrician)' },
    { value: 'engine_mechanic', label: 'ইঞ্জিন মিস্ত্রি (Engine Mechanic)' },
    { value: 'body_mechanic', label: 'ডেন্টিং ও বডি মিস্ত্রি (Body Mechanic)' },
    { value: 'other_staff', label: 'অন্যান্য কর্মী (Other Staff)' },
  ];

  return (
    <div className="space-y-6">
      {/* Top action & Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>স্টাফ, মেম্বার ও ব্যক্তিগত লেজার খতিয়ান</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            বাস মালিক, ম্যানেজার, চালক, সুপারভাইজার, হেলপার, হোস্ট ও গ্যারেজ মিস্ত্রিদের পূর্ণাঙ্গ প্রোফাইল, ডকুমেন্টস ও আর্থিক হিসাব
          </p>
        </div>

        <button
          onClick={openAddStaffModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>নতুন স্টাফ / মেম্বার যোগ করুন</span>
        </button>
      </div>

      {/* Role filter pills and search */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedRoleFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedRoleFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            সকল ({toBengaliNumber(staffList.length)})
          </button>
          <button
            onClick={() => setSelectedRoleFilter('owner')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedRoleFilter === 'owner'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            মালিক ({toBengaliNumber(staffList.filter((s) => s.role === 'owner').length)})
          </button>
          <button
            onClick={() => setSelectedRoleFilter('driver')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedRoleFilter === 'driver'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ড্রাইভার ({toBengaliNumber(staffList.filter((s) => s.role === 'driver').length)})
          </button>
          <button
            onClick={() => setSelectedRoleFilter('supervisor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedRoleFilter === 'supervisor'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            সুপারভাইজার ({toBengaliNumber(staffList.filter((s) => s.role === 'supervisor').length)})
          </button>
          <button
            onClick={() => setSelectedRoleFilter('helper')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedRoleFilter === 'helper'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            সহকারী / হেলপার ({toBengaliNumber(staffList.filter((s) => s.role === 'helper').length)})
          </button>
          <button
            onClick={() => setSelectedRoleFilter('engine_mechanic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedRoleFilter === 'engine_mechanic'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            মিস্ত্রি ও টেকনিশিয়ান
          </button>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="নাম, ফোন বা পদবী দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      {/* Staff Grid Cards */}
      {filteredStaff.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-slate-800">কোনো স্টাফ বা মেম্বার পাওয়া যায়নি</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            {searchQuery
              ? 'আপনার সার্চ অনুযায়ী কোনো স্টাফের তথ্য মেলেনি।'
              : 'বর্তমানে কোনো স্টাফ বা সদস্যের প্রোফাইল যুক্ত নেই। বাস চালক, হেল্পার, সুপারভাইজার বা মেম্বার যোগ করতে নিচের বাটনে ক্লিক করুন।'}
          </p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>নতুন স্টাফ যোগ করুন</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStaff.map((staff) => {
          const balance = calculateStaffBalance(staff.id);
          const assignedBus = buses.find((b) => b.id === staff.assignedBusId);

          const hasNid = Boolean(staff.nidDocuments?.front || staff.nidDocuments?.back);
          const hasLicense = Boolean(staff.drivingLicenseDocuments?.front || staff.drivingLicenseDocuments?.back);
          const hasUnionCard = Boolean(staff.laborUnionCardDocuments?.front || staff.laborUnionCardDocuments?.back);

          return (
            <div
              key={staff.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Top header strip */}
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {staff.photoUrl ? (
                        <img
                          src={staff.photoUrl}
                          alt={staff.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-lg shadow-xs">
                          {staff.name.charAt(0)}
                        </div>
                      )}
                      <span
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          staff.status === 'active'
                            ? 'bg-emerald-500'
                            : staff.status === 'on_leave'
                            ? 'bg-amber-500'
                            : 'bg-slate-400'
                        }`}
                        title={staff.status === 'active' ? 'সক্রিয়' : 'ছুটিতে'}
                      />
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-900 leading-tight">{staff.name}</h4>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">
                        {STAFF_ROLE_LABELS[staff.role] || staff.role}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400">{toBengaliNumber(staff.createdAt)}</span>
                </div>

                {/* Details Body */}
                <div className="p-4 space-y-3 text-xs">
                  {/* Phone & Address */}
                  <div className="space-y-1 text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono font-bold text-slate-800">{staff.phone}</span>
                      {staff.emergencyPhone && (
                        <span className="text-[10px] text-slate-400">(জরুরি: {staff.emergencyPhone})</span>
                      )}
                    </div>
                    {staff.address && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{staff.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Salary / Remuneration info */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">বেতন / ভাতার ধরন:</span>
                      <strong className="text-slate-800 block truncate">
                        {staff.salaryType === 'monthly'
                          ? 'মাসিক বেতন'
                          : staff.salaryType === 'trip_wise'
                          ? 'ট্রিপভিত্তিক খোরাকি'
                          : staff.salaryType === 'both'
                          ? 'মাসিক + খোরাকি'
                          : staff.salaryType === 'commission_or_rent'
                          ? 'চুক্তি / মাসিক রেন্ট'
                          : 'বিল চুক্তি ভিত্তিক'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">নির্ধারিত রেট:</span>
                      <strong className="text-blue-700 font-bold block">
                        {staff.monthlySalary
                          ? `${formatTaka(staff.monthlySalary)} /মাস`
                          : staff.tripAllowanceRate
                          ? `${formatTaka(staff.tripAllowanceRate)} /ট্রিপ`
                          : 'চুক্তি প্রযোজ্য'}
                      </strong>
                    </div>
                  </div>

                  {/* Assigned Bus if any */}
                  {assignedBus && (
                    <div className="text-[11px] bg-blue-50/60 p-2 rounded-lg border border-blue-100 flex items-center justify-between text-blue-900">
                      <span className="font-medium">নিয়োজিত বাস:</span>
                      <span className="font-bold">{assignedBus.nickname || assignedBus.regNumber}</span>
                    </div>
                  )}

                  {/* Uploaded Documents Badges with View Buttons */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-600 block">কাগজপত্র ও ডকুমেন্টস:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {hasNid ? (
                        <button
                          type="button"
                          onClick={() =>
                            setDocPreview({
                              isOpen: true,
                              title: `${staff.name} - জাতীয় পরিচয়পত্র (NID)`,
                              front: staff.nidDocuments?.front,
                              back: staff.nidDocuments?.back,
                            })
                          }
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded border border-emerald-200 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>এনআইডি (NID)</span>
                          <Eye className="w-3 h-3 ml-0.5 text-emerald-600" />
                        </button>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded text-[10px]">
                          এনআইডি নেই
                        </span>
                      )}

                      {hasLicense && (
                        <button
                          type="button"
                          onClick={() =>
                            setDocPreview({
                              isOpen: true,
                              title: `${staff.name} - ড্রাইভিং লাইসেন্স`,
                              front: staff.drivingLicenseDocuments?.front,
                              back: staff.drivingLicenseDocuments?.back,
                            })
                          }
                          className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded border border-blue-200 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle className="w-3 h-3 text-blue-600" />
                          <span>লাইসেন্স</span>
                          <Eye className="w-3 h-3 ml-0.5 text-blue-600" />
                        </button>
                      )}

                      {hasUnionCard && (
                        <button
                          type="button"
                          onClick={() =>
                            setDocPreview({
                              isOpen: true,
                              title: `${staff.name} - শ্রমিক সমিতি কার্ড`,
                              front: staff.laborUnionCardDocuments?.front,
                              back: staff.laborUnionCardDocuments?.back,
                            })
                          }
                          className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded border border-purple-200 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle className="w-3 h-3 text-purple-600" />
                          <span>শ্রমিক ইউনিয়ন</span>
                          <Eye className="w-3 h-3 ml-0.5 text-purple-600" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Financial Ledger Balance Summary */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-500">ব্যক্তিগত লেজার স্ট্যাটাস:</span>
                      <span className="font-bold text-slate-700">
                        মোট লেনদেন: {toBengaliNumber(balance.entriesCount)} টি
                      </span>
                    </div>

                    <div className="bg-slate-900 text-white p-2.5 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">মোট পরিশোধিত:</span>
                        <span className="text-xs font-bold text-emerald-400">
                          {formatTaka(balance.totalPaidToStaff)}
                        </span>
                      </div>
                      {balance.totalReceivedFromStaff > 0 && (
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">কোম্পানিতে জমা/ঋণ:</span>
                          <span className="text-xs font-bold text-amber-400">
                            {formatTaka(balance.totalReceivedFromStaff)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStaffForLedger(staff)}
                  className="flex-1 py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <History className="w-3.5 h-3.5 text-blue-600" />
                  <span>লেজার খতিয়ান দেখুন</span>
                </button>

                <button
                  type="button"
                  onClick={() => openAddLedgerEntryModal(staff)}
                  className="py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                  title="টাকা দেওয়া বা জমা এন্ট্রি"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>লেনদেন</span>
                </button>

                <button
                  type="button"
                  onClick={() => openEditStaffModal(staff)}
                  className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors cursor-pointer"
                  title="প্রোফাইল সম্পাদনা"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setStaffToDelete(staff)}
                  className="p-1.5 bg-white border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* ======================================================== */}
      {/* ADD / EDIT STAFF PROFILE MODAL */}
      {/* ======================================================== */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-400" />
                <h4 className="text-base font-bold">
                  {editingStaff ? 'স্টাফ / সদস্য প্রোফাইল আপডেট' : 'নতুন স্টাফ / সদস্য নিবন্ধন'}
                </h4>
              </div>
              <button
                onClick={() => setIsStaffModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleStaffFormSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">সদস্য / স্টাফের পূর্ণ নাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মো: রফিকুল ইসলাম"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">পদবী / রোল *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as StaffRole)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {staffRoleOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="text"
                    required
                    placeholder="০১৭১২-০০০০০০"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">জরুরি যোগাযোগ (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    placeholder="০১৯১১-০০০০০০"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">বর্তমান স্ট্যাটাস</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="active">সক্রিয় (Active)</option>
                    <option value="on_leave">ছুটিতে (On Leave)</option>
                    <option value="inactive">অব্যাহতি / নিষ্ক্রিয়</option>
                  </select>
                </div>
              </div>

              {/* Remuneration / Salary details */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-blue-600" /> বেতন ও পারিশ্রমিক নির্ধারণ:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">বেতন বা ভাতার সিস্টেম</label>
                    <select
                      value={salaryType}
                      onChange={(e) => setSalaryType(e.target.value as SalaryType)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="monthly">ফিক্সড মাসিক বেতন</option>
                      <option value="trip_wise">শুধুমাত্র ট্রিপ খোরাকি/ভাতা</option>
                      <option value="both">উভয়ই (মাসিক বেতন + ট্রিপ ভাতা)</option>
                      <option value="commission_or_rent">মাসিক চুক্তি রেন্ট (মালিক)</option>
                      <option value="none">প্রযোজ্য নয় / মেকানিক বিল</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">মাসিক বেতন (টাকা)</label>
                    <input
                      type="number"
                      value={monthlySalary}
                      onChange={(e) => setMonthlySalary(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">প্রতি ট্রিপ খোরাকি (টাকা)</label>
                    <input
                      type="number"
                      value={tripAllowanceRate}
                      onChange={(e) => setTripAllowanceRate(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Bus assignment & address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">বরাদ্দকৃত বাস (ঐচ্ছিক)</label>
                  <select
                    value={assignedBusId}
                    onChange={(e) => setAssignedBusId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">কোনো নির্দিষ্ট বাস বরাদ্দ নেই</option>
                    {buses.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nickname || b.regNumber} ({b.regNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ঠিকানা / এলাকা</label>
                  <input
                    type="text"
                    placeholder="যেমন: গাবতলী, মিরপুর, ঢাকা"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Profile Photo direct upload */}
              <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="block font-semibold text-slate-700 mb-1">স্টাফের ছবি / পাসপোর্ট ফটো</label>
                <div className="flex items-center gap-3">
                  {photoUrl && (
                    <img
                      src={photoUrl}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded-lg border border-slate-300 shrink-0"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                  {photoUrl && (
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="text-rose-500 text-xs hover:underline cursor-pointer"
                    >
                      ছবি বাদ দিন
                    </button>
                  )}
                </div>
              </div>

              {/* ======================================================== */}
              {/* DOCUMENT UPLOADS (NID, LICENSE, UNION CARD) */}
              {/* ======================================================== */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>পরিচয়পত্র ও ডকুমেন্টস আপলোড (এপিট ও ওপিট)</span>
                </h5>

                {/* NID Uploader */}
                <DocumentUploader
                  label="জাতীয় পরিচয়পত্র (NID) এপিট ও ওপিট"
                  helperText="স্মার্টকার্ড বা সাধারণ জাতীয় পরিচয়পত্রের সামনের ও পেছনের অংশের ছবি"
                  documents={nidDocs}
                  onChange={setNidDocs}
                  onPreview={(title, front, back) =>
                    setDocPreview({ isOpen: true, title, front, back })
                  }
                  allowDoubleSided={true}
                />

                {/* Driving License Uploader */}
                {(role === 'driver' || role === 'owner' || role === 'supervisor') && (
                  <DocumentUploader
                    label="ড্রাইভিং লাইসেন্স (Driving License) এপিট ও ওপিট"
                    helperText="হেভি/মিডিয়াম ড্রাইভিং লাইসেন্সের সামনের ও পেছনের অংশের ছবি"
                    documents={licenseDocs}
                    onChange={setLicenseDocs}
                    onPreview={(title, front, back) =>
                      setDocPreview({ isOpen: true, title, front, back })
                    }
                    allowDoubleSided={true}
                  />
                )}

                {/* Labor Union Card Uploader */}
                <DocumentUploader
                  label="পরিবহন শ্রমিক সমিতি / ইউনিয়ন কার্ড"
                  helperText="স্থানীয় বা জাতীয় সড়ক পরিবহন শ্রমিক ইউনিয়ন সদস্য কার্ড"
                  documents={unionCardDocs}
                  onChange={setUnionCardDocs}
                  onPreview={(title, front, back) =>
                    setDocPreview({ isOpen: true, title, front, back })
                  }
                  allowDoubleSided={true}
                />
              </div>

              {/* Notes */}
              <div className="text-xs">
                <label className="block font-semibold text-slate-700 mb-1">বিশেষ মন্তব্য বা নোট</label>
                <textarea
                  rows={2}
                  placeholder="অন্য কোনো তথ্য বা চুক্তি..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                >
                  {editingStaff ? 'পরিবর্তন সংরক্ষণ করুন' : 'স্টাফ সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* INDIVIDUAL STAFF LEDGER VIEW MODAL */}
      {/* ======================================================== */}
      {selectedStaffForLedger && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-base">
                  {selectedStaffForLedger.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold">{selectedStaffForLedger.name}</h4>
                    <span className="text-[11px] bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded font-semibold">
                      {STAFF_ROLE_LABELS[selectedStaffForLedger.role]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">ব্যক্তিগত আর্থিক লেজার ও লেনদেনের ইতিহাস</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAddLedgerEntryModal(selectedStaffForLedger)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন এন্ট্রি</span>
                </button>
                <button
                  onClick={() => setSelectedStaffForLedger(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Ledger summary banner */}
            {(() => {
              const b = calculateStaffBalance(selectedStaffForLedger.id);
              return (
                <div className="bg-slate-50 p-4 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 block text-[11px]">কোম্পানি মোট দিয়েছে (Paid Out):</span>
                    <strong className="text-base text-rose-600 block mt-0.5">
                      {formatTaka(b.totalPaidToStaff)}
                    </strong>
                    <span className="text-[10px] text-slate-400">বেতন, ট্রিপ ভাতা, রেন্ট ও মেরামত বিল</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 block text-[11px]">স্টাফের ব্যক্তিগত জমা (Received In):</span>
                    <strong className="text-base text-emerald-600 block mt-0.5">
                      {formatTaka(b.totalReceivedFromStaff)}
                    </strong>
                    <span className="text-[10px] text-slate-400">ব্যক্তিগত টাকা ডিপোজিট বা ফান্ড জমা</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 block text-[11px]">নিট খতিয়ান অবস্থা:</span>
                    <strong className={`text-base block mt-0.5 ${b.netCompanyDepositBalance > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
                      {b.netCompanyDepositBalance > 0
                        ? `কোম্পানির কাছে পাওনা ${formatTaka(b.netCompanyDepositBalance)}`
                        : 'পরিশোধিত / ব্যালেন্স সমান'}
                    </strong>
                    <span className="text-[10px] text-slate-400">জমা ও পেমেন্টের চূড়ান্ত হিসাব</span>
                  </div>
                </div>
              );
            })()}

            {/* Ledger transactions list */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
              {staffLedger.filter((e) => e.staffId === selectedStaffForLedger.id).length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <History className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-semibold">এই স্টাফের কোনো লেনদেন বা লেজার এন্ট্রি পাওয়া যায়নি</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    উপরে "নতুন এন্ট্রি" বোতামে ক্লিক করে বেতন প্রদান বা জমা এন্ট্রি করুন।
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                  {staffLedger
                    .filter((e) => e.staffId === selectedStaffForLedger.id)
                    .map((entry) => {
                      const isPaidOut = entry.flow === 'company_paid_out';
                      const bus = buses.find((b) => b.id === entry.busId);

                      return (
                        <div
                          key={entry.id}
                          className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors text-xs"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                                isPaidOut ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                              }`}
                            >
                              {isPaidOut ? (
                                <ArrowUpRight className="w-4 h-4" />
                              ) : (
                                <ArrowDownLeft className="w-4 h-4" />
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-slate-900">{entry.title}</h5>
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                                  {entry.paymentMethod === 'bkash' ? 'বিকাশ' : entry.paymentMethod === 'bank' ? 'ব্যাংক' : 'ক্যাশ'}
                                </span>
                                {entry.referenceNo && (
                                  <span className="text-[10px] font-mono text-slate-400">
                                    রেফ: {entry.referenceNo}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                তারিখ: {formatDisplayDate(entry.date)}
                                {bus && ` • বাস: ${bus.nickname || bus.regNumber}`}
                              </p>
                              {entry.notes && (
                                <p className="text-[10px] text-slate-400 mt-0.5">{entry.notes}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <span
                                className={`text-sm font-bold block ${
                                  isPaidOut ? 'text-rose-600' : 'text-emerald-600'
                                }`}
                              >
                                {isPaidOut ? '-' : '+'} {formatTaka(entry.amount)}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {isPaidOut ? 'কোম্পানি দিল' : 'কোম্পানিতে জমা'}
                              </span>
                            </div>

                            <button
                              onClick={() => setLedgerEntryToDelete(entry)}
                              className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                              title="মুছুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                সকল লেনদেন স্বয়ংক্রিয়ভাবে সংরক্ষিত থাকে
              </span>
              <button
                onClick={() => setSelectedStaffForLedger(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD LEDGER TRANSACTION MODAL */}
      {/* ======================================================== */}
      {isLedgerEntryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold">ব্যক্তিগত লেনদেন ও ভাউচার এন্ট্রি</h4>
              </div>
              <button
                onClick={() => setIsLedgerEntryModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLedgerFormSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">স্টাফ / সদস্য</label>
                <select
                  value={ledgerStaffId}
                  onChange={(e) => setLedgerStaffId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({STAFF_ROLE_LABELS[s.role]})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">লেনদেনের তারিখ</label>
                  <input
                    type="date"
                    required
                    value={ledgerDate}
                    onChange={(e) => setLedgerDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">টাকার প্রবাহ (Flow)</label>
                  <select
                    value={ledgerFlow}
                    onChange={(e) => setLedgerFlow(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="company_paid_out">কোম্পানি দিল (Paid Out)</option>
                    <option value="company_received_in">কোম্পানিতে জমা (Received In)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">লেনদেনের ধরন</label>
                <select
                  value={ledgerType}
                  onChange={(e) => setLedgerType(e.target.value as StaffLedgerType)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="salary_payment">বেতন পরিশোধ (Salary)</option>
                  <option value="trip_allowance">ট্রিপ খোরাকি ও বিল (Trip Allowance)</option>
                  <option value="reserve_trip_advance">রিজার্ভ ট্রিপ অগ্রিম জমা গ্রহণ (Reserve Advance)</option>
                  <option value="reserve_trip_due">রিজার্ভ ট্রিপ বকেয়া আদায় জমা (Reserve Due Received)</option>
                  <option value="road_trip_deposit">রোড ট্রিপ নীট কালেকশন জমা (Road Trip Deposit)</option>
                  <option value="road_trip_shortage">রোড ট্রিপ ঘাটতি/লস সমন্বয় (Road Shortage)</option>
                  <option value="expense_payment">কোম্পানি খরচ পরিশোধ (Expense Payment)</option>
                  <option value="staff_transfer_in">অন্য কর্মী থেকে তহবিল গ্রহণ (Staff Transfer In)</option>
                  <option value="staff_transfer_out">অন্য কর্মীকে তহবিল প্রদান (Staff Transfer Out)</option>
                  <option value="company_deposit">স্টাফের ব্যক্তিগত টাকা কোম্পানিতে জমা (Deposit)</option>
                  <option value="deposit_refund">জমার টাকা বা পাওনা কর্মীকে ফেরত প্রদান (Refund)</option>
                  <option value="mechanic_bill">মিস্ত্রি কাজের মজুরি ও পার্টস বিল (Mechanic Bill)</option>
                  <option value="owner_rent">বাস মালিকের মাসিক চুক্তি ভাড়া/রেন্ট (Owner Rent)</option>
                  <option value="advance_taken">কর্মীর অগ্রিম টাকা নেওয়া (Advance)</option>
                  <option value="other_adjustment">অন্যান্য সমন্বয়</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">বিবরণ / শিরোনাম *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মার্চ মাসের বেতন প্রদান বা জরুরি জমা"
                  value={ledgerTitle}
                  onChange={(e) => setLedgerTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">টাকার পরিমাণ (টাকা) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={ledgerAmount}
                    onChange={(e) => setLedgerAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">পেমেন্ট মাধ্যম</label>
                  <select
                    value={ledgerMethod}
                    onChange={(e) => setLedgerMethod(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="cash">নগদ ক্যাশ (Cash)</option>
                    <option value="bkash">বিকাশ / নগদ (Mobile MFS)</option>
                    <option value="bank">ব্যাংক ট্রান্সফার (Bank)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ভাউচার / রেফারেন্স নং</label>
                  <input
                    type="text"
                    placeholder="যেমন: SAL-01 বা TR-98"
                    value={ledgerRef}
                    onChange={(e) => setLedgerRef(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">সম্পর্কিত বাস (ঐচ্ছিক)</label>
                  <select
                    value={ledgerBusId}
                    onChange={(e) => setLedgerBusId(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="">সাধারণ / নির্দিষ্ট বাস নেই</option>
                    {buses.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nickname || b.regNumber}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">নোট / মন্তব্য</label>
                <input
                  type="text"
                  placeholder="অন্য কোনো প্রাসঙ্গিক নোট..."
                  value={ledgerNotes}
                  onChange={(e) => setLedgerNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsLedgerEntryModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DOCUMENT VIEWER MODAL */}
      {/* ======================================================== */}
      <DocumentViewerModal
        isOpen={docPreview.isOpen}
        onClose={() => setDocPreview({ isOpen: false, title: '' })}
        title={docPreview.title}
        frontImage={docPreview.front}
        backImage={docPreview.back}
      />

      {/* Delete Staff Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(staffToDelete)}
        title="স্টাফ / মেম্বার মুছে ফেলার নিশ্চয়তা"
        message={`আপনি কি সত্যিই "${staffToDelete?.name}" (${staffToDelete?.phone || 'স্টাফ'}) এর প্রোফাইল, ছবি ও সকল ডকুমেন্টস মুছে ফেলতে চান?`}
        confirmText="হ্যাঁ, মুছে ফেলুন"
        cancelText="বাতিল"
        isDanger={true}
        onConfirm={() => {
          if (staffToDelete) {
            onDeleteStaff(staffToDelete.id);
            setStaffToDelete(null);
          }
        }}
        onClose={() => setStaffToDelete(null)}
      />

      {/* Delete Ledger Entry Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(ledgerEntryToDelete)}
        title="লেজার এন্ট্রি মুছে ফেলার নিশ্চয়তা"
        message={`আপনি কি "${ledgerEntryToDelete?.title}" (${ledgerEntryToDelete ? formatTaka(ledgerEntryToDelete.amount) : ''}) লেনদেন রেকর্ডটি মুছে ফেলতে চান?`}
        confirmText="হ্যাঁ, মুছে ফেলুন"
        cancelText="বাতিল"
        isDanger={true}
        onConfirm={() => {
          if (ledgerEntryToDelete) {
            onDeleteLedgerEntry(ledgerEntryToDelete.id);
            setLedgerEntryToDelete(null);
          }
        }}
        onClose={() => setLedgerEntryToDelete(null)}
      />
    </div>
  );
};
