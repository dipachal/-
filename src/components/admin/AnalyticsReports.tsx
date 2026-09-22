import React from 'react';
import { Bus, ReleaseTrip, RoadTrip, ExpenseRecord } from '../../types';
import { formatTaka, toBengaliNumber } from '../../utils/helpers';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Download, 
  Bus as BusIcon, 
  Award,
  Layers,
  Fuel,
  Wrench
} from 'lucide-react';

interface AnalyticsReportsProps {
  buses: Bus[];
  releaseTrips: ReleaseTrip[];
  roadTrips: RoadTrip[];
  expenses: ExpenseRecord[];
  onExportData: () => void;
}

export const AnalyticsReports: React.FC<AnalyticsReportsProps> = ({
  buses,
  releaseTrips,
  roadTrips,
  expenses,
  onExportData,
}) => {
  // Calculate revenue from release trips (Advance received + any completed trips)
  const totalReleaseIncome = releaseTrips.reduce((sum, t) => sum + t.advanceAmount, 0);
  const totalRoadDeposit = roadTrips.reduce((sum, t) => sum + t.netDeposit, 0);
  const totalRoadTicketSales = roadTrips.reduce((sum, t) => sum + t.ticketSalesAmount, 0);
  const totalDirectExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Total business revenue (Release money received + Road Net Deposit)
  const totalRevenue = totalReleaseIncome + totalRoadDeposit;
  const netEnterpriseProfit = totalRevenue - totalDirectExpenses;
  const profitMargin = totalRevenue > 0 ? Math.round((netEnterpriseProfit / totalRevenue) * 100) : 0;

  // Bus-wise profitability performance
  const busPerformances = buses.map((bus) => {
    // Release revenue for this bus
    const busReleaseRev = releaseTrips
      .filter((t) => t.busId === bus.id)
      .reduce((sum, t) => sum + t.advanceAmount, 0);

    // Road net revenue for this bus
    const busRoadRev = roadTrips
      .filter((t) => t.busId === bus.id)
      .reduce((sum, t) => sum + t.netDeposit, 0);

    const busTotalIncome = busReleaseRev + busRoadRev;

    // Bus direct expenses
    const busExpenses = expenses
      .filter((e) => e.busId === bus.id)
      .reduce((sum, e) => sum + e.amount, 0);

    const busNetProfit = busTotalIncome - busExpenses;
    const releaseTripCount = releaseTrips.filter((t) => t.busId === bus.id).length;
    const roadTripCount = roadTrips.filter((t) => t.busId === bus.id).length;

    return {
      bus,
      totalIncome: busTotalIncome,
      totalExpense: busExpenses,
      netProfit: busNetProfit,
      releaseTripCount,
      roadTripCount,
    };
  });

  // Sort by highest net profit
  const sortedBuses = [...busPerformances].sort((a, b) => b.netProfit - a.netProfit);

  return (
    <div className="space-y-6">
      {/* Top Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">লাভ-ক্ষতি ও ব্যবসায়িক পারফরম্যান্স রিপোর্ট</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            প্রতিটি বাসের পৃথক আয়, ব্যয় ও নীট লাভের তুলনামূলক হিসাব
          </p>
        </div>

        <button
          onClick={onExportData}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>সম্পূর্ণ হিসাবের ডেটা ব্যাকআপ (JSON)</span>
        </button>
      </div>

      {/* High level KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
          <span className="text-xs font-semibold text-blue-900 block">মোট ক্যাশ রাজস্ব আয়</span>
          <div className="text-2xl font-black text-blue-800 mt-1">{formatTaka(totalRevenue)}</div>
          <span className="text-[11px] text-blue-700 mt-0.5 block">রিলিজ জমা + রোড নীট কালেকশন</span>
        </div>

        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
          <span className="text-xs font-semibold text-rose-900 block">মোট ক্যাশবুক ব্যয়</span>
          <div className="text-2xl font-black text-rose-700 mt-1">{formatTaka(totalDirectExpenses)}</div>
          <span className="text-[11px] text-rose-600 mt-0.5 block">ডিজেল, সার্ভিসিং, পার্টস ও অফিস</span>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <span className="text-xs font-semibold text-emerald-900 block">সামগ্রিক নীট লাভ (Net Profit)</span>
          <div className="text-2xl font-black text-emerald-800 mt-1">{formatTaka(netEnterpriseProfit)}</div>
          <span className="text-[11px] text-emerald-700 mt-0.5 block">সব ব্যয় বাদে প্রতিষ্ঠানের লাভ</span>
        </div>

        <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
          <span className="text-xs font-semibold text-purple-900 block">লাভের শতকরা হার (Margin)</span>
          <div className="text-2xl font-black text-purple-800 mt-1">{toBengaliNumber(profitMargin)}%</div>
          <span className="text-[11px] text-purple-700 mt-0.5 block">মোট আয়ের তুলনায় মার্জিন</span>
        </div>
      </div>

      {/* Bus-wise Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h4 className="font-bold text-sm text-slate-800">
              বাসভিত্তিক লাভ-ক্ষতি ও কার্যক্ষমতা র‍্যাংকিং
            </h4>
          </div>
          <span className="text-xs text-slate-500">সবচেয়ে লাভজনক বাস অনুসারে ক্রমানুযায়ী</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-slate-700 font-bold">
                <th className="p-3.5">র‍্যাংক ও বাস</th>
                <th className="p-3.5">মডেল ও সিট</th>
                <th className="p-3.5 text-center">ট্রিপ সংখ্যা</th>
                <th className="p-3.5 text-right font-semibold text-blue-700">মোট সংগৃহীত আয়</th>
                <th className="p-3.5 text-right font-semibold text-rose-700">মোট সরাসরি ব্যয়</th>
                <th className="p-3.5 text-right font-black">নীট লাভ / ব্যালেন্স</th>
                <th className="p-3.5 text-center">পারফরম্যান্স</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedBuses.map((item, index) => {
                const isProfitable = item.netProfit >= 0;
                return (
                  <tr key={item.bus.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          index === 0
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {toBengaliNumber(index + 1)}
                        </span>
                        <div>
                          <strong className="text-slate-900 block font-semibold text-sm">
                            {item.bus.nickname}
                          </strong>
                          <span className="text-slate-500 font-mono text-[11px] block">
                            {item.bus.regNumber}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="text-slate-700 block">{item.bus.model}</span>
                      <span className="text-slate-500 text-[11px]">{toBengaliNumber(item.bus.seats)} সিট</span>
                    </td>

                    <td className="p-3.5 text-center">
                      <span className="text-purple-700 font-semibold block">
                        রিলিজ: {toBengaliNumber(item.releaseTripCount)} টি
                      </span>
                      <span className="text-blue-700 font-semibold block text-[11px]">
                        রোড: {toBengaliNumber(item.roadTripCount)} টি
                      </span>
                    </td>

                    <td className="p-3.5 text-right">
                      <strong className="text-blue-800 text-sm block">
                        {formatTaka(item.totalIncome)}
                      </strong>
                    </td>

                    <td className="p-3.5 text-right">
                      <span className="text-rose-600 font-bold block">
                        {formatTaka(item.totalExpense)}
                      </span>
                    </td>

                    <td className="p-3.5 text-right">
                      <span className={`text-sm font-black block ${
                        isProfitable ? 'text-emerald-700' : 'text-rose-600'
                      }`}>
                        {formatTaka(item.netProfit)}
                      </span>
                    </td>

                    <td className="p-3.5 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        isProfitable
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isProfitable ? (
                          <>
                            <TrendingUp className="w-3.5 h-3.5" /> লাভজনক
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-3.5 h-3.5" /> লোকসান
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transport Business Advice / Recommendations based on data */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white space-y-3">
        <h4 className="text-base font-bold flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" /> দিবাচল এন্টারপ্রাইজের বাসের পারফরম্যান্স বিশ্লেষণ ও পরামর্শ:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-blue-100 pt-1">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <strong className="text-white block mb-1">রিলিজ ট্রিপে অগ্রাধিকার:</strong>
            কক্সবাজার ও সাজেক ভ্যালির মতো ৩-৪ দিনের কর্পোরেট রিলিজ ট্রিপে বাসের জ্বালানি ও মেকানিক খরচ বাদে সর্বোচ্চ মুনাফা অর্জিত হয়।
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <strong className="text-white block mb-1">কাগজপত্র নবায়ন অ্যালার্ট:</strong>
            যেসব বাসের ফিটনেস ও রুট পারমিট ৩০ দিনের মধ্যে শেষ হবে, সেগুলো সময়মতো রিনিউ করলে মহাসড়কে পুলিশ জরিমানা বাঁচবে।
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <strong className="text-white block mb-1">ডিজেল পর্যবেক্ষণ:</strong>
            প্রতি ট্রিপে মাইলেজ (লিটার প্রতি কিমি) ট্র্যাক করলে তেলের অপচয় ও চালকের সঠিক হিসাব নিশ্চিত থাকে।
          </div>
        </div>
      </div>
    </div>
  );
};
