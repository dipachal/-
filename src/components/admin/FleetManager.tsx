import React, { useState } from 'react';
import { Bus, BusType, BusStatus, StaffMember, DocumentImage } from '../../types';
import { toBengaliNumber, formatTaka, getDaysRemaining, fileToDataUrl, formatDisplayDate } from '../../utils/helpers';
import { DocumentUploader } from '../common/DocumentUploader';
import { DocumentViewerModal } from '../common/DocumentViewerModal';
import { ConfirmModal } from './ConfirmModal';
import { 
  Bus as BusIcon, 
  Plus, 
  Edit3, 
  Trash2, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Phone, 
  User, 
  X, 
  Sparkles,
  Search,
  UploadCloud,
  Eye,
  CreditCard,
  Building,
  ShieldAlert,
  UserCheck
} from 'lucide-react';

interface FleetManagerProps {
  buses: Bus[];
  staffList: StaffMember[];
  onAddBus: (bus: Omit<Bus, 'id'>) => void;
  onUpdateBus: (bus: Bus) => void;
  onDeleteBus: (busId: string) => void;
}

export const FleetManager: React.FC<FleetManagerProps> = ({
  buses,
  staffList,
  onAddBus,
  onUpdateBus,
  onDeleteBus,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBus, setEditingBus] = useState<Bus | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOwnership, setFilterOwnership] = useState<'all' | 'owned' | 'rented_monthly'>('all');

  // Document preview modal state
  const [docPreview, setDocPreview] = useState<{
    isOpen: boolean;
    title: string;
    front?: string;
    back?: string;
  }>({
    isOpen: false,
    title: '',
  });

  const [busToDelete, setBusToDelete] = useState<Bus | null>(null);

  // Form state - ONLY regNumber is strictly mandatory!
  const [regNumber, setRegNumber] = useState('');
  const [nickname, setNickname] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState<BusType>('ac_deluxe');
  const [seats, setSeats] = useState<number | undefined>(36);
  const [perDayReleaseRent, setPerDayReleaseRent] = useState<number | undefined>(20000);
  
  // Ownership & Monthly rent
  const [ownershipType, setOwnershipType] = useState<'owned' | 'rented_monthly'>('rented_monthly');
  const [monthlyRentAmount, setMonthlyRentAmount] = useState<number | undefined>(45000);
  const [ownerStaffId, setOwnerStaffId] = useState('');

  // Crew from Staff database (No manual typing)
  const [driverStaffId, setDriverStaffId] = useState('');
  const [supervisorStaffId, setSupervisorStaffId] = useState('');
  const [helperStaffId, setHelperStaffId] = useState('');

  const [status, setStatus] = useState<BusStatus>('available');
  const [currentLocation, setCurrentLocation] = useState('গাবতলী ডিপো, ঢাকা');
  const [fitnessExpiry, setFitnessExpiry] = useState('');
  const [taxTokenExpiry, setTaxTokenExpiry] = useState('');
  const [routePermitExpiry, setRoutePermitExpiry] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [featuresStr, setFeaturesStr] = useState('সুপার এসি, পুশ ব্যাক সিট, সাউন্ড সিস্টেম, ওয়াই-ফাই');
  const [notes, setNotes] = useState('');

  // Documents
  const [blueBookDoc, setBlueBookDoc] = useState<DocumentImage>({});
  const [fitnessDoc, setFitnessDoc] = useState<DocumentImage>({});
  const [taxTokenDoc, setTaxTokenDoc] = useState<DocumentImage>({});
  const [routePermitDoc, setRoutePermitDoc] = useState<DocumentImage>({});

  // Staff category lists for dropdowns
  const driversList = staffList.filter((s) => s.role === 'driver');
  const supervisorsList = staffList.filter((s) => s.role === 'supervisor');
  const helpersList = staffList.filter((s) => s.role === 'helper');
  const ownersList = staffList.filter((s) => s.role === 'owner' || s.role === 'manager');

  const openAddModal = () => {
    setEditingBus(null);
    setRegNumber(''); // ONLY MANDATORY FIELD
    setNickname(`দিবাচল এক্সপ্রেস ${toBengaliNumber(buses.length + 1)}`);
    setModel('হিনো ১জে আরএম২ (Hino 1J)');
    setType('ac_deluxe');
    setSeats(36);
    setPerDayReleaseRent(22000);
    setOwnershipType('rented_monthly');
    setMonthlyRentAmount(45000);
    setOwnerStaffId(ownersList[0]?.id || '');
    setDriverStaffId(driversList[0]?.id || '');
    setSupervisorStaffId(supervisorsList[0]?.id || '');
    setHelperStaffId(helpersList[0]?.id || '');
    setStatus('available');
    setCurrentLocation('গাবতলী ডিপো, ঢাকা');
    setFitnessExpiry('2026-12-31');
    setTaxTokenExpiry('2026-12-31');
    setRoutePermitExpiry('2027-04-30');
    setImageUrl('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80');
    setFeaturesStr('সুপার এসি, পুশ ব্যাক সিট, সাউন্ড সিস্টেম, ওয়াই-ফাই, লাগেজ বক্স');
    setNotes('');
    setBlueBookDoc({});
    setFitnessDoc({});
    setTaxTokenDoc({});
    setRoutePermitDoc({});
    setIsModalOpen(true);
  };

  const openEditModal = (bus: Bus) => {
    setEditingBus(bus);
    setRegNumber(bus.regNumber);
    setNickname(bus.nickname || '');
    setModel(bus.model || '');
    setType(bus.type || 'ac_deluxe');
    setSeats(bus.seats || 36);
    setPerDayReleaseRent(bus.perDayReleaseRent || 20000);
    setOwnershipType(bus.ownershipType || 'owned');
    setMonthlyRentAmount(bus.monthlyRentAmount || 0);
    setOwnerStaffId(bus.ownerStaffId || '');
    setDriverStaffId(bus.driverStaffId || '');
    setSupervisorStaffId(bus.supervisorStaffId || '');
    setHelperStaffId(bus.helperStaffId || '');
    setStatus(bus.status);
    setCurrentLocation(bus.currentLocation || 'গাবতলী ডিপো');
    setFitnessExpiry(bus.fitnessExpiry || '');
    setTaxTokenExpiry(bus.taxTokenExpiry || '');
    setRoutePermitExpiry(bus.routePermitExpiry || '');
    setImageUrl(bus.imageUrl || '');
    setFeaturesStr((bus.features || []).join(', '));
    setNotes(bus.notes || '');
    setBlueBookDoc(bus.blueBookDoc || {});
    setFitnessDoc(bus.fitnessDoc || {});
    setTaxTokenDoc(bus.taxTokenDoc || {});
    setRoutePermitDoc(bus.routePermitDoc || {});
    setIsModalOpen(true);
  };

  const handleBusImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await fileToDataUrl(file);
      setImageUrl(url);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNumber.trim()) {
      alert('রেজিস্ট্রেশন নম্বর দেওয়া আবশ্যক');
      return;
    }

    const featuresList = featuresStr
      ? featuresStr.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    // Derive names and phone numbers from staff selected
    const selectedDriver = staffList.find((s) => s.id === driverStaffId);
    const selectedSupervisor = staffList.find((s) => s.id === supervisorStaffId);
    const selectedHelper = staffList.find((s) => s.id === helperStaffId);

    const busPayload: Omit<Bus, 'id'> = {
      regNumber: regNumber.trim(),
      nickname: nickname.trim() || undefined,
      model: model.trim() || undefined,
      type: type || 'ac_deluxe',
      seats: seats ? Number(seats) : undefined,
      perDayReleaseRent: perDayReleaseRent ? Number(perDayReleaseRent) : undefined,
      ownershipType,
      monthlyRentAmount: monthlyRentAmount ? Number(monthlyRentAmount) : 0,
      ownerStaffId: ownerStaffId || undefined,
      driverStaffId: driverStaffId || undefined,
      supervisorStaffId: supervisorStaffId || undefined,
      helperStaffId: helperStaffId || undefined,
      driverName: selectedDriver?.name || undefined,
      driverPhone: selectedDriver?.phone || undefined,
      supervisorName: selectedSupervisor?.name || undefined,
      supervisorPhone: selectedSupervisor?.phone || undefined,
      helperName: selectedHelper?.name || undefined,
      helperPhone: selectedHelper?.phone || undefined,
      status,
      currentLocation: currentLocation || undefined,
      features: featuresList,
      fitnessExpiry: fitnessExpiry || undefined,
      taxTokenExpiry: taxTokenExpiry || undefined,
      routePermitExpiry: routePermitExpiry || undefined,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      blueBookDoc,
      fitnessDoc,
      taxTokenDoc,
      routePermitDoc,
      notes: notes || undefined,
    };

    if (editingBus) {
      onUpdateBus({
        ...busPayload,
        id: editingBus.id,
      });
    } else {
      onAddBus(busPayload);
    }

    setIsModalOpen(false);
  };

  const handleStatusQuickChange = (bus: Bus, newStatus: BusStatus) => {
    onUpdateBus({ ...bus, status: newStatus });
  };

  const filteredBuses = buses.filter((b) => {
    const matchesSearch =
      (b.nickname || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.regNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.driverName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOwnership =
      filterOwnership === 'all' || b.ownershipType === filterOwnership;
    return matchesSearch && matchesOwnership;
  });

  return (
    <div className="space-y-6">
      {/* Header action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BusIcon className="w-6 h-6 text-blue-600" />
            <span>দিবাচল বাস বহর, মালিকানা ও পেপারস ব্যবস্থাপনা</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            বাসের রেজিস্ট্রেশন, মাসিক রেন্ট, স্টাফ তালিকা থেকে ড্রাইভার-হেল্পার নির্ধারণ এবং কাগজপত্র আপলোড ও মেয়াদ ট্র্যাকিং
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন বাস যোগ করুন</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterOwnership('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterOwnership === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            সকল বাস ({toBengaliNumber(buses.length)})
          </button>
          <button
            onClick={() => setFilterOwnership('owned')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterOwnership === 'owned'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            কোম্পানির নিজস্ব ({toBengaliNumber(buses.filter((b) => b.ownershipType === 'owned').length)})
          </button>
          <button
            onClick={() => setFilterOwnership('rented_monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterOwnership === 'rented_monthly'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            মাসিক ভাড়ায় চালিত ({toBengaliNumber(buses.filter((b) => b.ownershipType === 'rented_monthly').length)})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="বাস বা প্লেট নম্বর দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      {/* Buses Cards Grid */}
      {filteredBuses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <BusIcon className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-slate-800">বহরে কোনো বাস পাওয়া যায়নি</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            {searchQuery
              ? 'আপনার সার্চ অনুযায়ী কোনো বাসের তথ্য মেলেনি।'
              : 'বর্তমানে বহরে কোনো বাস যুক্ত নেই। আপনার নিজস্ব বা ভাড়া করা বাস যোগ করতে নিচের বাটনে ক্লিক করুন।'}
          </p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন বাস যোগ করুন</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBuses.map((bus) => {
          const fitnessInfo = bus.fitnessExpiry ? getDaysRemaining(bus.fitnessExpiry) : null;
          const taxInfo = bus.taxTokenExpiry ? getDaysRemaining(bus.taxTokenExpiry) : null;
          const routeInfo = bus.routePermitExpiry ? getDaysRemaining(bus.routePermitExpiry) : null;

          const owner = staffList.find((s) => s.id === bus.ownerStaffId);
          const driver = staffList.find((s) => s.id === bus.driverStaffId) || { name: bus.driverName, phone: bus.driverPhone };
          const supervisor = staffList.find((s) => s.id === bus.supervisorStaffId) || { name: bus.supervisorName, phone: bus.supervisorPhone };
          const helper = staffList.find((s) => s.id === bus.helperStaffId) || { name: bus.helperName, phone: bus.helperPhone };

          const hasBlueBook = Boolean(bus.blueBookDoc?.front || bus.blueBookDoc?.back);
          const hasFitnessDoc = Boolean(bus.fitnessDoc?.front || bus.fitnessDoc?.back);
          const hasTaxDoc = Boolean(bus.taxTokenDoc?.front || bus.taxTokenDoc?.back);
          const hasRouteDoc = Boolean(bus.routePermitDoc?.front || bus.routePermitDoc?.back);

          return (
            <div
              key={bus.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Image & Quick Status Bar */}
                <div className="relative h-44 bg-slate-900">
                  <img
                    src={bus.imageUrl || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'}
                    alt={bus.nickname || bus.regNumber}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-black/40" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-white text-slate-950 shadow-xs border border-slate-300">
                        {bus.regNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold shadow-xs ${
                          bus.ownershipType === 'rented_monthly'
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {bus.ownershipType === 'rented_monthly' ? 'ভাড়ায় চালিত' : 'নিজস্ব বাস'}
                      </span>
                    </div>

                    <select
                      value={bus.status}
                      onChange={(e) => handleStatusQuickChange(bus, e.target.value as BusStatus)}
                      className={`text-xs font-bold px-2 py-1 rounded-md shadow-xs outline-none cursor-pointer ${
                        bus.status === 'available'
                          ? 'bg-emerald-500 text-white'
                          : bus.status === 'on_release'
                          ? 'bg-purple-600 text-white'
                          : bus.status === 'on_route'
                          ? 'bg-blue-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      <option value="available">🟢 ফ্রি / প্রস্তুত</option>
                      <option value="on_release">🟣 রিলিজ ট্রিপে</option>
                      <option value="on_route">🔵 রোডে ট্রিপে</option>
                      <option value="maintenance">🟠 মেইনটেন্যান্স</option>
                    </select>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <h4 className="text-base font-bold truncate">{bus.nickname || bus.regNumber}</h4>
                    <p className="text-xs text-slate-300">
                      {bus.model || 'মডেল নেই'} • {bus.seats ? `${toBengaliNumber(bus.seats)} সিট` : 'সিট উল্লেখ নেই'}
                    </p>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-4 space-y-3 text-xs">
                  {/* Financial Rent & Owner Strip */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-500 block text-[11px]">মালিকের তথ্য:</span>
                      <strong className="text-slate-800 block truncate">
                        {owner ? owner.name : 'কোম্পানি মালিকানাধীন'}
                      </strong>
                      {owner?.phone && (
                        <span className="text-[11px] text-slate-500 block font-mono">{owner.phone}</span>
                      )}
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">বাসের মাসিক রেন্ট:</span>
                      <strong className="text-amber-700 font-bold block text-sm">
                        {bus.monthlyRentAmount ? formatTaka(bus.monthlyRentAmount) : 'রেন্ট প্রযোজ্য নয়'}
                      </strong>
                      <span className="text-[10px] text-slate-400 block">ব্যবহার হোক বা না হোক</span>
                    </div>
                  </div>

                  {/* Crew info directly from staff selection */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">চালক (ড্রাইভার):</span>
                      <span className="font-bold text-slate-800">
                        {driver?.name || 'অ্যাসাইন করা হয়নি'} {driver?.phone ? `(${driver.phone})` : ''}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">সহকারী (হেলপার):</span>
                      <span className="font-medium text-slate-700">
                        {helper?.name || 'অ্যাসাইন করা হয়নি'} {helper?.phone ? `(${helper.phone})` : ''}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                      <span className="text-slate-500">দৈনিক রিলিজ ভাড়া:</span>
                      <strong className="text-blue-700 font-bold">
                        {bus.perDayReleaseRent ? formatTaka(bus.perDayReleaseRent) : 'দরদাম সাপেক্ষ'}
                      </strong>
                    </div>
                  </div>

                  {/* Documents with direct uploaded file preview */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-blue-600" /> বাসের পেপারস ও আপলোড ফাইল:
                      </span>
                    </span>

                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      {/* Blue book */}
                      <button
                        type="button"
                        onClick={() => {
                          if (hasBlueBook) {
                            setDocPreview({
                              isOpen: true,
                              title: `${bus.regNumber} - ব্লু বুক / রেজিস্ট্রেশন স্লিপ`,
                              front: bus.blueBookDoc?.front,
                              back: bus.blueBookDoc?.back,
                            });
                          }
                        }}
                        className={`p-1.5 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-colors ${
                          hasBlueBook
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                            : 'bg-slate-50 border-slate-200 text-slate-400 cursor-default'
                        }`}
                      >
                        <span className="font-medium truncate">ব্লু বুক / স্লিপ</span>
                        {hasBlueBook ? <Eye className="w-3 h-3 text-emerald-600 shrink-0" /> : <span className="text-[9px]">নেই</span>}
                      </button>

                      {/* Fitness */}
                      <button
                        type="button"
                        onClick={() => {
                          if (hasFitnessDoc) {
                            setDocPreview({
                              isOpen: true,
                              title: `${bus.regNumber} - ফিটনেস সার্টিফিকেট`,
                              front: bus.fitnessDoc?.front,
                              back: bus.fitnessDoc?.back,
                            });
                          }
                        }}
                        className={`p-1.5 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-colors ${
                          hasFitnessDoc
                            ? 'bg-blue-50/70 border-blue-200 text-blue-800 hover:bg-blue-100'
                            : 'bg-slate-50 border-slate-200 text-slate-400 cursor-default'
                        }`}
                      >
                        <span className="font-medium truncate">ফিটনেস পেপার</span>
                        {hasFitnessDoc ? <Eye className="w-3 h-3 text-blue-600 shrink-0" /> : <span className="text-[9px]">নেই</span>}
                      </button>

                      {/* Tax Token */}
                      <button
                        type="button"
                        onClick={() => {
                          if (hasTaxDoc) {
                            setDocPreview({
                              isOpen: true,
                              title: `${bus.regNumber} - ট্যাক্স টোকেন`,
                              front: bus.taxTokenDoc?.front,
                              back: bus.taxTokenDoc?.back,
                            });
                          }
                        }}
                        className={`p-1.5 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-colors ${
                          hasTaxDoc
                            ? 'bg-purple-50/70 border-purple-200 text-purple-800 hover:bg-purple-100'
                            : 'bg-slate-50 border-slate-200 text-slate-400 cursor-default'
                        }`}
                      >
                        <span className="font-medium truncate">ট্যাক্স টোকেন</span>
                        {hasTaxDoc ? <Eye className="w-3 h-3 text-purple-600 shrink-0" /> : <span className="text-[9px]">নেই</span>}
                      </button>

                      {/* Route Permit */}
                      <button
                        type="button"
                        onClick={() => {
                          if (hasRouteDoc) {
                            setDocPreview({
                              isOpen: true,
                              title: `${bus.regNumber} - রুট পারমিট কপি`,
                              front: bus.routePermitDoc?.front,
                              back: bus.routePermitDoc?.back,
                            });
                          }
                        }}
                        className={`p-1.5 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-colors ${
                          hasRouteDoc
                            ? 'bg-amber-50/70 border-amber-200 text-amber-800 hover:bg-amber-100'
                            : 'bg-slate-50 border-slate-200 text-slate-400 cursor-default'
                        }`}
                      >
                        <span className="font-medium truncate">রুট পারমিট</span>
                        {hasRouteDoc ? <Eye className="w-3 h-3 text-amber-600 shrink-0" /> : <span className="text-[9px]">নেই</span>}
                      </button>
                    </div>

                    {/* Expiry alerts */}
                    {(fitnessInfo || taxInfo || routeInfo) && (
                      <div className="pt-1 text-[11px] space-y-0.5">
                        {fitnessInfo && (
                          <div className="flex items-center justify-between text-slate-600">
                            <span>ফিটনেস মেয়াদ:</span>
                            <span className={`font-semibold ${fitnessInfo.isExpired ? 'text-rose-600 font-bold' : fitnessInfo.days <= 30 ? 'text-amber-600' : 'text-emerald-700'}`}>
                              {fitnessInfo.text}
                            </span>
                          </div>
                        )}
                        {taxInfo && (
                          <div className="flex items-center justify-between text-slate-600">
                            <span>ট্যাক্স মেয়াদ:</span>
                            <span className={`font-semibold ${taxInfo.isExpired ? 'text-rose-600 font-bold' : taxInfo.days <= 30 ? 'text-amber-600' : 'text-emerald-700'}`}>
                              {taxInfo.text}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => openEditModal(bus)}
                  className="flex-1 py-1.5 px-3 rounded-lg border border-slate-300 hover:bg-white text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                  <span>তথ্য ও পেপারস সম্পাদনা</span>
                </button>
                <button
                  onClick={() => setBusToDelete(bus)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* ======================================================== */}
      {/* ADD / EDIT BUS MODAL */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BusIcon className="w-5 h-5 text-blue-400" />
                <div>
                  <h4 className="text-base font-bold">
                    {editingBus ? 'বাসের তথ্য ও ডকুমেন্টস আপডেট' : 'বহরে নতুন বাস যুক্ত করুন'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    * শুধুমাত্র রেজিস্ট্রেশন নম্বর ম্যান্ডেটরি, বাকি সব তথ্য ঐচ্ছিক।
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Mandatory Registration Number Notice */}
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 flex items-center justify-between">
                <div className="w-full">
                  <label className="block text-xs font-bold text-blue-900 mb-1">
                    বাসের রেজিস্ট্রেশন নম্বর (প্লেট নম্বর) <span className="text-rose-600 font-bold">* আবশ্যক (একমাত্র বাধ্যতামূলক ফিল্ড)</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: ঢাকা মেট্রো-ব ১৪-৩২২৫"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 bg-white font-mono font-bold text-sm text-slate-900"
                  />
                </div>
              </div>

              {/* Optional General Bus Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">বাসের পরিচিতি নাম (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    placeholder="যেমন: দিবাচল এক্সপ্রেস ০১"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">মডেল ও চ্যাসিস (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    placeholder="যেমন: Hino 1J RM2"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">বাসের ক্যাটাগরি</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as BusType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="ac_deluxe">এসি ডিলাক্স কোচ</option>
                    <option value="non_ac">নন-এসি চেয়ার কোচ</option>
                    <option value="sleeper">লাক্সারি স্লিপার বাস</option>
                    <option value="minibus">মিনিবাস</option>
                  </select>
                </div>
              </div>

              {/* Ownership & Monthly Rent Amount */}
              <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 space-y-3 text-xs">
                <span className="font-bold text-amber-950 block">
                  বাসের মালিকানা ও মাসিক চুক্তি রেন্ট নির্ধারণ:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">মালিকানার ধরন</label>
                    <select
                      value={ownershipType}
                      onChange={(e) => setOwnershipType(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="rented_monthly">মাসিক ভাড়ায় চালিত (Leased/Rented)</option>
                      <option value="owned">কোম্পানির নিজস্ব (Company Owned)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">বাস মালিক নির্বাচন (স্টাফ থেকে)</label>
                    <select
                      value={ownerStaffId}
                      onChange={(e) => setOwnerStaffId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">কোনো নির্দিষ্ট মালিক নেই</option>
                      {ownersList.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.name} ({o.phone})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      বাসের মাসিক রেন্ট (টাকা)
                    </label>
                    <input
                      type="number"
                      placeholder="যেমন: 45000"
                      value={monthlyRentAmount || ''}
                      onChange={(e) => setMonthlyRentAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Crew Assignment from Staff database (No manual typing) */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3 text-xs">
                <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>স্টাফ তালিকা থেকে ড্রাইভার ও কর্মী নির্বাচন (ড্রপডাউন):</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">নির্ধারিত চালক (ড্রাইভার)</label>
                    <select
                      value={driverStaffId}
                      onChange={(e) => setDriverStaffId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">চালক নির্বাচন করুন...</option>
                      {driversList.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.phone})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">সুপারভাইজার</label>
                    <select
                      value={supervisorStaffId}
                      onChange={(e) => setSupervisorStaffId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">সুপারভাইজার নির্বাচন করুন...</option>
                      {supervisorsList.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.phone})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">সহকারী / হেলপার</label>
                    <select
                      value={helperStaffId}
                      onChange={(e) => setHelperStaffId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">সহকারী নির্বাচন করুন...</option>
                      {helpersList.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.name} ({h.phone})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Seats, Rent, Status, Location */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">সিট সংখ্যা</label>
                  <input
                    type="number"
                    value={seats || ''}
                    onChange={(e) => setSeats(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">দৈনিক রিলিজ ভাড়া (টাকা)</label>
                  <input
                    type="number"
                    value={perDayReleaseRent || ''}
                    onChange={(e) => setPerDayReleaseRent(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">বর্তমান স্ট্যাটাস</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="available">ফ্রি / প্রস্তুত</option>
                    <option value="on_release">রিলিজ ট্রিপে</option>
                    <option value="on_route">রোডে ট্রিপে</option>
                    <option value="maintenance">মেইনটেন্যান্স</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">বর্তমান অবস্থান/ডিপো</label>
                  <input
                    type="text"
                    value={currentLocation}
                    onChange={(e) => setCurrentLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Bus Image Upload (Direct File from computer/mobile) */}
              <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="block font-semibold text-slate-700 mb-1">বাসের মূল ছবি আপলোড</label>
                <div className="flex items-center gap-3">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Bus preview"
                      className="w-16 h-12 object-cover rounded-lg border border-slate-300 shrink-0"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBusImageUpload}
                    className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400">বা সরাসরি ক্যামেরা দিয়ে ছবি তুলুন</span>
                </div>
              </div>

              {/* ======================================================== */}
              {/* BUS DOCUMENTS UPLOAD (BLUE BOOK, FITNESS, TAX, ROUTE) */}
              {/* ======================================================== */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>বাসের বৈধ কাগজপত্র ও সার্টিফিকেট ছবি আপলোড (এপিট ও ওপিট):</span>
                </h5>

                {/* Blue Book / Registration Slip */}
                <DocumentUploader
                  label="ব্লু বুক / রেজিস্ট্রেশন সার্টিফিকেট স্লিপ"
                  helperText="বিআরটিএ প্রদত্ত ব্লু বুক বা রেজিস্ট্রেশন সার্টিফিকেটের সামনের ও পেছনের পাতার ছবি"
                  documents={blueBookDoc}
                  onChange={setBlueBookDoc}
                  onPreview={(title, front, back) =>
                    setDocPreview({ isOpen: true, title, front, back })
                  }
                  allowDoubleSided={true}
                />

                {/* Fitness Paper */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <DocumentUploader
                      label="ফিটনেস সার্টিফিকেট কপি"
                      documents={fitnessDoc}
                      onChange={setFitnessDoc}
                      onPreview={(title, front, back) =>
                        setDocPreview({ isOpen: true, title, front, back })
                      }
                      allowDoubleSided={true}
                    />
                  </div>
                  <div className="text-xs flex flex-col justify-center">
                    <label className="block font-semibold text-slate-700 mb-1">ফিটনেস মেয়াদ শেষ তারিখ</label>
                    <input
                      type="date"
                      value={fitnessExpiry}
                      onChange={(e) => setFitnessExpiry(e.target.value)}
                      className="w-full px-2.5 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Tax Token */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <DocumentUploader
                      label="ট্যাক্স টোকেন কপি"
                      documents={taxTokenDoc}
                      onChange={setTaxTokenDoc}
                      onPreview={(title, front, back) =>
                        setDocPreview({ isOpen: true, title, front, back })
                      }
                      allowDoubleSided={true}
                    />
                  </div>
                  <div className="text-xs flex flex-col justify-center">
                    <label className="block font-semibold text-slate-700 mb-1">ট্যাক্স মেয়াদ শেষ তারিখ</label>
                    <input
                      type="date"
                      value={taxTokenExpiry}
                      onChange={(e) => setTaxTokenExpiry(e.target.value)}
                      className="w-full px-2.5 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Route Permit */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <DocumentUploader
                      label="রুট পারমিট কপি"
                      documents={routePermitDoc}
                      onChange={setRoutePermitDoc}
                      onPreview={(title, front, back) =>
                        setDocPreview({ isOpen: true, title, front, back })
                      }
                      allowDoubleSided={true}
                    />
                  </div>
                  <div className="text-xs flex flex-col justify-center">
                    <label className="block font-semibold text-slate-700 mb-1">রুট পারমিট মেয়াদ শেষ তারিখ</label>
                    <input
                      type="date"
                      value={routePermitExpiry}
                      onChange={(e) => setRoutePermitExpiry(e.target.value)}
                      className="w-full px-2.5 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Features & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    সুযোগ-সুবিধাসমূহ (কমা দিয়ে আলাদা করুন)
                  </label>
                  <input
                    type="text"
                    value={featuresStr}
                    onChange={(e) => setFeaturesStr(e.target.value)}
                    placeholder="সুপার এসি, পুশ ব্যাক সিট, সাউন্ড সিস্টেম"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">বিশেষ নোট বা চুক্তি</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="গাড়ির ইঞ্জিন কন্ডিশন বা মালিকের বিশেষ চুক্তি..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                >
                  {editingBus ? 'পরিবর্তন সংরক্ষণ করুন' : 'বাস সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={docPreview.isOpen}
        onClose={() => setDocPreview({ isOpen: false, title: '' })}
        title={docPreview.title}
        frontImage={docPreview.front}
        backImage={docPreview.back}
      />

      {/* Delete Bus Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(busToDelete)}
        title="বাস মুছে ফেলার নিশ্চয়তা"
        message={`আপনি কি সত্যিই "${busToDelete?.regNumber}" (${busToDelete?.nickname || 'বাস'}) তালিকা ও বহর থেকে স্থায়ীভাবে মুছে ফেলতে চান?`}
        confirmText="হ্যাঁ, মুছে ফেলুন"
        cancelText="বাতিল"
        isDanger={true}
        onConfirm={() => {
          if (busToDelete) {
            onDeleteBus(busToDelete.id);
            setBusToDelete(null);
          }
        }}
        onClose={() => setBusToDelete(null)}
      />
    </div>
  );
};
