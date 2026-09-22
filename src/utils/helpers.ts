// Bengali number conversion & currency formatter

const bnDigits: { [key: string]: string } = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

export function toBengaliNumber(n: number | string | undefined | null): string {
  if (n === undefined || n === null) return '০';
  const str = n.toString();
  return str.replace(/[0-9]/g, (w) => bnDigits[w] || w);
}

export function formatTaka(amount: number | string | undefined | null, useBengaliDigits: boolean = true): string {
  const num = typeof amount === 'number' ? amount : Number(amount) || 0;
  const formatted = num.toLocaleString('en-IN'); // Indian/South Asian grouping 1,00,000
  if (useBengaliDigits) {
    return `৳ ${toBengaliNumber(formatted)}`;
  }
  return `৳ ${formatted}`;
}

export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const [y, m, d] = dateStr.split('-');
    if (y && m && d) {
      return `${toBengaliNumber(d)}-${toBengaliNumber(m)}-${toBengaliNumber(y)}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

export function getDaysRemaining(targetDateStr: string): { days: number; isExpired: boolean; text: string } {
  if (!targetDateStr) return { days: 0, isExpired: false, text: 'তারিখ নেই' };
  const target = new Date(targetDateStr).getTime();
  const now = new Date().getTime();
  const diffTime = target - now;
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (days < 0) {
    return {
      days,
      isExpired: true,
      text: `মেয়াদোত্তীর্ণ (${toBengaliNumber(Math.abs(days))} দিন আগে)`
    };
  }
  if (days <= 30) {
    return {
      days,
      isExpired: false,
      text: `${toBengaliNumber(days)} দিন বাকি (জরুরি)`
    };
  }
  return {
    days,
    isExpired: false,
    text: `${toBengaliNumber(days)} দিন বাকি`
  };
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export const STAFF_ROLE_LABELS: Record<string, string> = {
  owner: 'বাসের মালিক',
  manager: 'কোম্পানি ম্যানেজার',
  driver: 'ড্রাইভার / চালক',
  supervisor: 'সুপারভাইজার',
  helper: 'সহকারী / হেলপার',
  host: 'হোস্ট (যাত্রী সেবা)',
  electric_mechanic: 'ইলেকট্রিক মিস্ত্রি',
  engine_mechanic: 'ইঞ্জিন মিস্ত্রি',
  body_mechanic: 'ডেন্টিং / বডি মিস্ত্রি',
  other_staff: 'অন্যান্য স্টাফ'
};

export const SYSTEM_MODULE_LABELS: Record<string, { label: string; desc: string }> = {
  overview: { label: 'ড্যাশবোর্ড ওভারভিউ', desc: 'সার্বিক আয়-ব্যয়, চলমান ট্রিপ ও ফ্লিট সারাংশ' },
  fleet: { label: 'বাস বহর ও পেপারস', desc: 'নতুন বাস যুক্ত, ডকুমেন্ট আপলোড, মেয়াদ ট্র্যাকিং' },
  staff: { label: 'স্টাফ ও ব্যক্তি খতিয়ান', desc: 'মালিক, ড্রাইভার, মেকানিক প্রোফাইল, বেতন ও ব্যক্তিগত লেজার' },
  release: { label: 'রিলিজ ও রিজার্ভ ট্রিপ', desc: 'রিলিজ ট্রিপ বুকিং, চালান ও ভাউচার প্রিন্ট, বকেয়া আদায়' },
  road: { label: 'নিয়মিত রোড ট্রিপ', desc: 'দৈনিক কাউন্টার কালেকশন, তেল, টোল ও লাইন খরচ' },
  ledger: { label: 'আয়-ব্যয় ক্যাশবুক', desc: 'দৈনিক সাধারণ অফিস ও গাড়ির সকল ক্যাশ ট্রানজেকশন' },
  reports: { label: 'লাভ-ক্ষতি ও রিপোর্ট', desc: 'বাসভিত্তিক ও সামগ্রিক নিট মুনাফা বিশ্লেষণ' },
  inquiries: { label: 'পাবলিক বুকিং রিকোয়েস্ট', desc: 'গ্রাহকদের ওয়েবসাইট থেকে পাঠানো কোটেশন রিকোয়েস্ট' },
  users: { label: 'সফটওয়্যার ইউজার ও পারমিশন', desc: 'নতুন ইউজার তৈরি এবং চেকবক্স দিয়ে পারমিশন নিয়ন্ত্রণ' },
};

