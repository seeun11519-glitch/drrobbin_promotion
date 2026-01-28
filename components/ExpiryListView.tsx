import React from 'react';
import { Flag } from 'lucide-react';
import { PromotionEvent } from '../types';

interface ExpiryListViewProps {
  year: number;
  month: number;
  store: string;
  events: PromotionEvent[];
}

const ExpiryListView: React.FC<ExpiryListViewProps> = ({ year, month, store, events }) => {
  // Helper to parse dates robustly (matching other components)
  const parseDate = (dateStr: string | undefined) => {
    if (!dateStr || dateStr === '-' || dateStr === '상시') return null;
    const cleanStr = dateStr.replace(/\./g, '-').trim();
    const d = new Date(cleanStr);
    return isNaN(d.getTime()) ? null : d;
  };

  const expiringEvents = events.filter(ev => {
    // Basic validation
    if (!ev.end || ev.end === "상시" || ev.end === "-") return false;
    
    // Parse end date
    const endDate = parseDate(ev.end);
    if (!endDate) return false;

    // Check year/month match
    const isSameMonth = endDate.getFullYear() === year && (endDate.getMonth() + 1) === month;
    if (!isSameMonth) return false;

    // Check store match
    const isStoreMatch = store === "전체" || ev.stores.includes("전체") || ev.stores.includes(store);
    
    return isStoreMatch;
  });

  return (
    <div className="bg-red-50 rounded-xl shadow-inner p-4 sm:p-6 border border-red-100">
      <h3 className="text-red-700 font-black mb-4 flex items-center text-lg italic tracking-tighter">
        <span className="mr-2 animate-pulse"><Flag fill="currentColor" size={20} /></span>
        <span>{month}월 종료 예정 리스트</span>
      </h3>
      <div className="overflow-x-auto rounded-lg border border-red-200 shadow-sm bg-white">
        <table className="w-full min-w-[800px]">
          <thead className="bg-red-600 text-white text-[10px] uppercase font-bold text-center">
            <tr>
              <th className="p-3 w-[12%] border-r border-red-500 whitespace-nowrap">시작일</th>
              <th className="p-3 w-[12%] border-r border-red-500 whitespace-nowrap">종료일</th>
              <th className="p-3 w-[10%] border-r border-red-500 whitespace-nowrap">항목</th>
              <th className="p-3 w-[18%] border-r border-red-500 text-left whitespace-nowrap">제목</th>
              <th className="p-3 text-left border-r border-red-500 min-w-[200px]">내용</th>
              <th className="p-3 w-[20%] text-center whitespace-nowrap">대상 매장</th>
            </tr>
          </thead>
          <tbody className="text-[11px]">
            {expiringEvents.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-10 text-center text-slate-400 italic">
                  해당 조건에 종료 예정인 행사가 없습니다.
                </td>
              </tr>
            ) : (
              expiringEvents.map((ev, idx) => {
                // Determine detail: Specific override if specific store selected, otherwise default
                const detailText = (store !== "전체" && ev.storeDetails?.[store]) 
                  ? ev.storeDetails[store] 
                  : ev.detail;

                return (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-red-50/30 transition-colors">
                    <td className="p-3 text-center text-gray-400 border-r border-gray-100 whitespace-nowrap">{ev.start}</td>
                    <td className="p-3 text-center text-red-600 font-black underline underline-offset-4 border-r border-gray-100 whitespace-nowrap">{ev.end}</td>
                    <td className="p-3 text-center border-r border-gray-100 whitespace-nowrap">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase text-[9px] border border-slate-200">
                        {ev.category}
                      </span>
                    </td>
                    <td className="p-3 text-left font-bold text-slate-800 border-r border-gray-100">{ev.title}</td>
                    <td className="p-3 text-left text-slate-500 border-r border-gray-100">{detailText}</td>
                    <td className="p-3 text-center text-slate-400 text-[10px]">{ev.stores.join(', ')}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpiryListView;