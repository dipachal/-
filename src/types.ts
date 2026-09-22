export type BusType = 'ac_deluxe' | 'non_ac' | 'sleeper' | 'minibus' | 'double_decker';
export type BusStatus = 'available' | 'on_release' | 'on_route' | 'maintenance';

export interface DocumentImage {
  front?: string; // Base64 data URL or external URL
  back?: string;  // Base64 data URL or external URL
}

// Staff & Team Members (মালিক, ম্যানেজার, চালক, সুপারভাইজার, হেলপার, হোস্ট, ইলেকট্রিক মিস্ত্রি, ইঞ্জিন মিস্ত্রি ইত্যাদি)
export type StaffRole = 
  | 'owner'             // বাস মালিক
  | 'manager'           // কোম্পানি ম্যানেজার
  | 'driver'            // ড্রাইভার / চালক
  | 'supervisor'        // সুপারভাইজার
  | 'helper'            // হেলপার / সহকারী
  | 'host'              // হোস্ট (যাত্রী সেবা)
  | 'electric_mechanic' // ইলেকট্রিক মিস্ত্রি
  | 'engine_mechanic'   // ইঞ্জিন মিস্ত্রি
  | 'body_mechanic'     // ডেন্টিং / বডি মিস্ত্রি
  | 'other_staff';      // অন্যান্য পরিবহন কর্মী

export type SalaryType = 'monthly' | 'trip_wise' | 'both' | 'commission_or_rent' | 'none';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  phone: string;
  emergencyPhone?: string;
  address?: string;
  salaryType: SalaryType;
  monthlySalary?: number; // মাসিক বেতন (টাকা)
  tripAllowanceRate?: number; // ট্রিপ অনুযায়ী খোরাকি বা রেট (টাকা)
  status: 'active' | 'on_leave' | 'inactive';
  // Documents (Front & Back uploads)
  nidDocuments?: DocumentImage;
  drivingLicenseDocuments?: DocumentImage;
  laborUnionCardDocuments?: DocumentImage; // শ্রমিক সমিতি কার্ড
  photoUrl?: string;
  assignedBusId?: string;
  notes?: string;
  createdAt: string;
}

export type StaffLedgerType = 
  | 'salary_payment'        // বেতন প্রদান (কোম্পানি দিল)
  | 'trip_allowance'        // ট্রিপ ভাতা / খোরাকি
  | 'company_deposit'       // কর্মী থেকে কোম্পানিতে ব্যক্তিগত জমা / ঋণ জমা
  | 'deposit_refund'        // জমার টাকা বা খরচ কর্মীকে ফেরত প্রদান
  | 'mechanic_bill'         // মিস্ত্রি কাজ বিল
  | 'owner_rent'            // বাসের মাসিক রেন্ট / চুক্তি ভাড়া প্রদান
  | 'advance_taken'         // স্টাফের অগ্রিম নেওয়া
  | 'reserve_trip_advance'  // রিজার্ভ ট্রিপের অগ্রিম প্রাপ্তি (স্টাফের হাতে জমা)
  | 'reserve_trip_due'      // রিজার্ভ ট্রিপের বকেয়া আদায়
  | 'road_trip_deposit'     // রোড ট্রিপের নীট জমা গ্রহণ
  | 'road_trip_shortage'    // রোড ট্রিপের ঘাটতি / লস বহন
  | 'expense_payment'       // বাসের খরচ পরিশোধ
  | 'staff_transfer_out'    // তহবিল হস্তান্তর (প্রদানকারী)
  | 'staff_transfer_in'     // তহবিল হস্তান্তর (গ্রহণকারী)
  | 'other_adjustment';     // অন্যান্য সমন্বয়

export interface StaffLedgerEntry {
  id: string;
  staffId: string;
  date: string;
  type: StaffLedgerType;
  title: string;
  amount: number; // Taka
  flow: 'company_paid_out' | 'company_received_in'; // debit / credit
  paymentMethod: 'cash' | 'bkash' | 'bank';
  referenceNo?: string;
  busId?: string; // Optional: specific bus
  relatedStaffId?: string; // For transfers
  notes?: string;
  createdAt: string;
}

// System Users & Role-Based Access Control (RBAC) with Checkboxes
export type SystemModuleId = 
  | 'overview'   // ড্যাশবোর্ড ওভারভিউ
  | 'fleet'      // বাস বহর ও পেপারস
  | 'staff'      // স্টাফ প্রোফাইল ও লেজার
  | 'release'    // রিজার্ভ ট্রিপ (রিজার্ভ বুকিং ও ভাউচার)
  | 'road'       // নিয়মিত রোড ট্রিপ
  | 'ledger'     // আয়-ব্যয় ক্যাশবুক ও তহবিল হস্তান্তর
  | 'reports'    // লাভ-ক্ষতি রিপোর্ট
  | 'inquiries'  // বুকিং রিকোয়েস্ট
  | 'users';     // সফটওয়্যার ইউজার ও পারমিশন কন্ট্রোল

export type SystemUserRole = 'super_admin' | 'admin' | 'accountant' | 'attendant' | 'manager' | 'custom';

export interface SystemUser {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: SystemUserRole;
  phone: string;
  isActive: boolean;
  isSuperAdmin: boolean; // সুপার অ্যাডমিনের ফুল পাওয়ার থাকবে
  allowedModules: SystemModuleId[]; // চেকবক্স ভিত্তিক মডিউল নির্বাচন
  notes?: string;
  createdAt: string;
}

export interface Bus {
  id: string;
  regNumber: string; // রেজিস্ট্রেশন নম্বর (ম্যান্ডেটরি ফিল্ড)
  nickname?: string; // পরিচিতি নাম (ঐচ্ছিক)
  model?: string; // মডেল (ঐচ্ছিক)
  type?: BusType;
  seats?: number;
  perDayReleaseRent?: number; // আনুমানিক দৈনিক রিলিজ ভাড়া
  ownershipType?: 'owned' | 'rented_monthly'; // নিজস্ব নাকি মাসিক ভাড়ায়
  monthlyRentAmount?: number; // বাসের মাসিক রেন্ট (আমরা ব্যবহার করি আর না করি)
  ownerStaffId?: string; // বাস মালিকের আইডি (স্টাফ তালিকা থেকে নির্বাচিত)
  driverStaffId?: string; // চালক আইডি (স্টাফ তালিকা থেকে নির্বাচিত)
  supervisorStaffId?: string; // সুপারভাইজার আইডি (স্টাফ তালিকা থেকে)
  helperStaffId?: string; // হেলপার আইডি (স্টাফ তালিকা থেকে)
  driverName?: string;
  driverPhone?: string;
  supervisorName?: string;
  supervisorPhone?: string;
  helperName?: string;
  helperPhone?: string;
  status: BusStatus;
  currentLocation?: string;
  features?: string[];
  fitnessExpiry?: string; // YYYY-MM-DD
  taxTokenExpiry?: string;
  routePermitExpiry?: string;
  imageUrl?: string;
  // Document Images (Direct upload)
  blueBookDoc?: DocumentImage;
  fitnessDoc?: DocumentImage;
  taxTokenDoc?: DocumentImage;
  routePermitDoc?: DocumentImage;
  notes?: string;
}

export type TripStatus = 'confirmed' | 'active' | 'completed' | 'cancelled';
export type PaymentStatus = 'paid' | 'partial' | 'due';

export interface ReleaseTrip {
  id: string;
  voucherNumber: string; // e.g. DWP-RES-2026-001 (রিজার্ভ ভাউচার)
  busId: string;
  clientName: string;
  clientPhone: string;
  clientOrg?: string; // e.g. ব্র্যাক ইউনিভার্সিটি ট্যুর ক্লাব
  pickupLocation: string;
  destination: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  contractAmount: number; // মোট চুক্তি মূল্য
  advanceAmount: number; // অগ্রিম জমা
  dueAmount: number; // বকেয়া
  // Reference & Receiver logic (মালিক, ম্যানেজার বা ড্রাইভারের মাধ্যমে রিজার্ভ ও অগ্রিম রিসিভ)
  referenceStaffId?: string; // রিজার্ভটা কার মাধ্যমে / রেফারেন্সে এসেছে
  referenceStaffName?: string;
  advanceReceivedByStaffId?: string; // অগ্রিম টাকাটা কে রিসিভ করেছে (তার লেজারে জমা হবে)
  advanceReceivedByStaffName?: string;
  dueReceivedByStaffId?: string; // বকেয়া টাকাটা কে রিসিভ করেছে
  dueReceivedByStaffName?: string;
  fuelBy: 'owner' | 'client'; // তেল কার? মালিকের না পার্টির
  tollBy: 'owner' | 'client'; // টোল কার?
  assignedDriver: string;
  assignedDriverPhone: string;
  paymentStatus: PaymentStatus;
  status: TripStatus;
  notes?: string;
  createdAt: string;
}

export interface RoadTrip {
  id: string;
  busId: string;
  date: string;
  routeName: string; // e.g. ঢাকা - কক্সবাজার
  tripCode: string; // e.g. D-01 আপ
  ticketSalesAmount: number; // টিকিট বিক্রি আয়
  counterCommission: number; // কাউন্টার কমিশন
  fuelLiters: number;
  fuelCost: number; // তেলের খরচ
  roadToll: number; // টোল
  driverFoodAllowance: number; // ড্রাইভার-হেল্পার খোরাকি ও ট্রিপ
  policeExpenses: number; // পুলিশ ও লাইন খরচ
  otherExpenses: number; // ঘাট বা বিবিধ
  netDeposit: number; // কাউন্টারে নীট জমা
  driverHandoverReceived: boolean;
  // জমা গ্রহণকারী ও লস বহনকারী স্টাফ
  receivedByStaffId?: string; // টাকাটা কে রিসিভ করলো (কাউন্টার মাস্টার/ম্যানেজার/ড্রাইভার)
  receivedByStaffName?: string;
  lossBearingStaffId?: string; // ট্রিপে লস হলে কে বহন করলো
  lossBearingStaffName?: string;
  notes?: string;
}

export type ExpenseCategory = 
  | 'fuel' 
  | 'maintenance' 
  | 'driver_salary' 
  | 'driver_food' 
  | 'police_road' 
  | 'toll' 
  | 'paper_renewal' 
  | 'tire_body' 
  | 'staff_transfer' // সাধারণ লেনদেন / কর্মী হতে কর্মী তহবিল হস্তান্তর (কোম্পানি খরচ নয়)
  | 'office_misc';

export interface ExpenseRecord {
  id: string;
  date: string;
  busId?: string; // কোন বাসের সাথে যুক্ত
  category: ExpenseCategory;
  isStaffTransfer?: boolean; // সাধারণ হস্তান্তর কি না
  title: string;
  amount: number;
  voucherNo?: string;
  // খরচকারী স্টাফ
  spentByStaffId?: string;
  spentByStaffName?: string;
  // সাধারণ হস্তান্তরের ক্ষেত্র
  transferFromStaffId?: string;
  transferFromStaffName?: string;
  transferToStaffId?: string;
  transferToStaffName?: string;
  paidTo?: string;
  paymentMethod: 'cash' | 'bkash' | 'bank';
  notes?: string;
}

export interface BookingInquiry {
  id: string;
  clientName: string;
  clientPhone: string;
  pickupLocation: string;
  destination: string;
  journeyDate: string;
  returnDate: string;
  passengerCount: number;
  preferredBusType: BusType;
  preferredBusId?: string;
  estimatedBudget?: number;
  status: 'pending' | 'contacted' | 'confirmed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface PopularRoute {
  id: string;
  name: string;
  origin: string;
  destination: string;
  estimatedKm: number;
  estimatedHours: string;
  approxRateAc: number;
  approxRateNonAc: number;
  imageUrl: string;
  highlights: string[];
}

