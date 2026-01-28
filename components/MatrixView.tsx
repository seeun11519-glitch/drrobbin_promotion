import React from 'react';
import { PromotionEvent, StoreName } from '../types';
import { MATRIX_CATEGORIES, STORE_LIST } from '../constants';

interface MatrixViewProps {
  year: number;
  month: number;
  store: string;
  events: PromotionEvent[];
}

const MatrixView: React.FC<MatrixViewProps> = ({ year, month, store, events }) => {
  const parseDate = (dateStr: string | undefined) => {
    if (!dateStr || dateStr === '-' || dateStr === '상시') return null;
    const cleanStr = dateStr.replace(/\./g, '-').trim();
    const d = new Date(cleanStr);
    return isNaN(d.getTime()) ? null : d;
  };

  const isNewPromotion = (ev: PromotionEvent) => {
    const startDate = parseDate(ev.start);
    if (!startDate) return false;
    return startDate.getFullYear() === year && (startDate.getMonth() + 1) === month;
  };

  const isExpiringThisMonth = (ev: PromotionEvent) => {
    const endDate = parseDate(ev.end);
    if (!endDate) return false;
    return endDate.getFullYear() === year && (endDate.getMonth() + 1) === month;
  };

  const getTitleClass = (ev: PromotionEvent, isExpiring: boolean) => {
    if (isExpiring) return 'text-white font-bold'; 
    if (ev.major_category === '주요 프로모션') return 'text-red-600 font-bold';
    if (isNewPromotion(ev)) return 'text-blue-600 font-bold';
    return 'text-slate-800 font-medium';
  };

  const filteredEvents = events.filter(ev => {
    const endDate = parseDate(ev.end);
    if (!endDate) return true;
    const startOfMonth = new Date(year, month - 1, 1);
    startOfMonth.setHours(0,0,0,0);
    endDate.setHours(23, 59, 59, 999);
    return endDate >= startOfMonth;
  });

  if (store === "전체") {
    return (
      <MatrixTableMode 
        year={year}
        month={month}
        store={store} 
        events={filteredEvents} 
        getTitleClass={getTitleClass} 
        isExpiringThisMonth={isExpiringThisMonth}
      />
    );
  }
  
  return (
    <ListTableMode 
      year={year}
      month={month}
      store={store} 
      events={filteredEvents} 
      getTitleClass={getTitleClass}
      isExpiringThisMonth={isExpiringThisMonth}
    />
  );
};

const MatrixTableMode: React.FC<{ 
  year: number;
  month: number;
  store: string; 
  events: PromotionEvent[];
  getTitleClass: (ev: PromotionEvent, isExpiring: boolean) => string;
  isExpiringThisMonth: (ev: PromotionEvent) => boolean;
}> = ({ year, month, store, events, getTitleClass, isExpiringThisMonth }) => {
  const storesToRender: StoreName[] = STORE_LIST;

  const getCellContent = (storeName: string, category: string) => {
    const items = events.filter(ev => {
      const isCatMatch = ev.matrixCat === category;
      const isStoreMatch = storeName === "전매장" 
        ? (ev.stores.includes("전체") || ev.stores.includes("전매장"))
        : ev.stores.includes(storeName);
      return isCatMatch && isStoreMatch;
    });

    if (items.length > 0) {
      return items.map((item, idx) => {
        const storeOverride = item.storeDetails?.[storeName];
        const isExpiring = isExpiringThisMonth(item);
        
        const content = storeOverride || item.detail;
        const hasExtra = content && content !== "-" && content !== item.title;
        const displayText = hasExtra ? `${item.title}: ${content}` : item.title;
            
        const titleClass = getTitleClass(item, isExpiring);
        const boxClass = isExpiring 
          ? "bg-black text-white border-black" 
          : "bg-white text-slate-800 border-gray-200 shadow-sm";
        
        return (
          <div key={idx} className="mb-1 block w-full">
            <div className={`text-[10px] border rounded w-full overflow-hidden break-words text-left px-1.5 py-1 inline-block leading-tight ${boxClass}`}>
              {item.isV && !storeOverride && !isExpiring && <span className="text-emerald-600 font-bold mr-1">V</span>}
              <span className={titleClass}>{displayText}</span>
            </div>
          </div>
        );
      });
    }

    if (storeName !== "전매장") {
      const commonV = events.find(ev => 
        ev.matrixCat === category && 
        (ev.stores.includes("전체") || ev.stores.includes("전매장")) && 
        ev.isV
      );
      if (commonV) {
         const override = commonV.storeDetails?.[storeName];
         const isExp = isExpiringThisMonth(commonV);
         const content = override || commonV.detail;
         const hasExtra = content && content !== "-" && content !== commonV.title;
         const displayText = hasExtra ? `${commonV.title}: ${content}` : commonV.title;

         return (
           <div key="common-v" className="mb-1 block w-full">
              <div className={`text-[10px] rounded font-medium border shadow-sm w-full px-1.5 py-1 leading-tight ${isExp ? 'bg-black text-white border-black' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>
                {displayText}
              </div>
           </div>
         );
      }
    }

    return <div className="text-center text-gray-200 text-[10px] p-1">-</div>;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden break-inside-avoid">
      <div className="bg-blue-800 text-white px-6 py-3 font-bold flex justify-between items-center">
        <span>PROMOTION MATRIX (현황판)</span>
        <div className="flex gap-4 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> 주요</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> 신규</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-black"></span> 종료예정</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed min-w-[1200px]">
          <thead>
            <tr className="bg-slate-700 text-white">
              <th className="border border-gray-300 w-[85px] sticky left-0 z-20 bg-slate-700 text-center text-xs p-2">매장</th>
              {MATRIX_CATEGORIES.map(cat => (
                <th key={cat} className="border border-gray-300 text-center font-black uppercase text-xs p-2">{cat}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {storesToRender.map(storeName => (
              <tr key={storeName} className={storeName === "전매장" ? "bg-gray-100 font-bold" : "bg-white"}>
                <td className="border border-gray-300 text-[11px] text-center sticky left-0 z-10 bg-inherit shadow-[1px_0_3px_rgba(0,0,0,0.1)] p-2 align-middle">
                  {storeName}
                </td>
                {MATRIX_CATEGORIES.map(cat => (
                  <td key={cat} className="border border-gray-300 align-top p-1">
                    <div className="w-full">{getCellContent(storeName, cat)}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ListTableMode: React.FC<{ 
  year: number;
  month: number;
  store: string; 
  events: PromotionEvent[];
  getTitleClass: (ev: PromotionEvent, isExpiring: boolean) => string;
  isExpiringThisMonth: (ev: PromotionEvent) => boolean;
}> = ({ year, month, store, events, getTitleClass, isExpiringThisMonth }) => {
  // Filter for current store AND exclude expiring events
  const filteredEvents = events.filter(ev => 
    (ev.stores.includes("전체") || ev.stores.includes("전매장") || ev.stores.includes(store)) &&
    !isExpiringThisMonth(ev)
  );

  const categoryOrder = ["주요 프로모션", "고정 정보", "온라인 광고", "제휴 할인", "프로모션"];
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const idxA = categoryOrder.indexOf(a.major_category || "");
    const idxB = categoryOrder.indexOf(b.major_category || "");
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    return (a.major_category || "").localeCompare(b.major_category || "");
  });

  const rowSpanMap = new Map<number, number>();
  let currentCategory = "";
  let startIndex = 0;
  sortedEvents.forEach((ev, index) => {
    const cat = ev.major_category || "기타";
    if (cat !== currentCategory) {
      if (index > 0) rowSpanMap.set(startIndex, index - startIndex);
      currentCategory = cat;
      startIndex = index;
    }
    if (index === sortedEvents.length - 1) rowSpanMap.set(startIndex, index - startIndex + 1);
  });

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden break-inside-avoid">
      <div className="bg-blue-800 text-white px-6 py-3 font-bold">
        {store} 상세 리스트
      </div>
      <div className="w-full">
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr className="bg-gray-600 text-white text-[11px]">
              <th className="border border-gray-500 w-[11%] p-1 sm:p-2 break-words">대분류</th>
              <th className="border border-gray-500 w-[8%] p-1 sm:p-2 break-words">항목</th>
              <th className="border border-gray-500 w-[18%] p-1 sm:p-2 break-words">행사명</th>
              <th className="border border-gray-500 w-[35%] p-1 sm:p-2 break-words">상세 내용</th>
              <th className="border border-gray-500 w-[12%] p-1 sm:p-2 break-words">POS KEY</th>
              <th className="border border-gray-500 w-[8%] p-1 sm:p-2 break-words">시작일</th>
              <th className="border border-gray-500 w-[8%] p-1 sm:p-2 break-words">종료일</th>
            </tr>
          </thead>
          <tbody className="text-[11px]">
            {sortedEvents.map((ev, index) => {
              const rowSpan = rowSpanMap.get(index);
              // Since we filtered out expiring items, isExp will always be false in this view
              const isExp = false; 
              const majorCatBg = ev.major_category === "주요 프로모션" ? "bg-red-50" : "bg-gray-50";
              const displayDetail = ev.storeDetails?.[store] || ev.detail || "-";
              
              const rowClass = "hover:bg-slate-50 text-slate-700";
              const borderClass = "border-gray-200";

              return (
                <tr key={index} className={`${rowClass} border-b ${borderClass}`}>
                  {rowSpan !== undefined && (
                    <td className={`border border-gray-300 text-center font-bold align-middle p-1 sm:p-2 break-words ${majorCatBg}`} rowSpan={rowSpan}>
                      {ev.major_category || "기타"}
                    </td>
                  )}
                  <td className="border border-gray-300 text-center align-middle p-1 sm:p-2 bg-white break-words">
                    <span className="px-1 py-0.5 rounded font-semibold text-[10px] bg-slate-100 text-slate-600 inline-block">
                      {ev.category}
                    </span>
                  </td>
                  <td className="border border-gray-300 font-bold align-middle p-1 sm:p-2 break-words">
                    <span className={getTitleClass(ev, false)}>{ev.title}</span>
                  </td>
                  <td className="border border-gray-300 whitespace-pre-wrap align-top p-1 sm:p-2 leading-relaxed break-words">{displayDetail}</td>
                  <td className="border border-gray-300 text-center font-mono text-[10px] align-middle p-1 sm:p-2 break-words">{ev.pos_key || "-"}</td>
                  <td className="border border-gray-300 text-center align-middle p-1 sm:p-2 break-words">{ev.start || "-"}</td>
                  <td className="border border-gray-300 text-center align-middle p-1 sm:p-2 break-words">
                    <span>{ev.end || "-"}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MatrixView;