import React from 'react';
import { PromotionEvent } from '../types';

interface CalendarViewProps {
  year: number;
  month: number;
  store: string;
  events: PromotionEvent[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ year, month, store, events }) => {
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptySlots = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const parseDate = (dateStr: string | undefined) => {
    if (!dateStr || dateStr === '-' || dateStr === '상시') return null;
    const cleanStr = dateStr.replace(/\./g, '-').trim();
    const d = new Date(cleanStr);
    return isNaN(d.getTime()) ? null : d;
  };

  const getDayEvents = (day: number) => {
    const currentDate = new Date(year, month - 1, day);
    
    return events.filter(ev => {
      if (!ev.showOnCalendar) return false;
      if (ev.start === "-" || ev.end === "-") return false;

      const startDate = parseDate(ev.start);
      const endDate = (ev.end === "상시" || !ev.end) ? null : parseDate(ev.end);

      const currTime = currentDate.setHours(0,0,0,0);
      const startTime = startDate ? startDate.setHours(0,0,0,0) : 0;
      const endTime = endDate ? endDate.setHours(0,0,0,0) : null;

      const inDateRange = currTime >= startTime && (!endTime || currTime <= endTime);
      const inStore = store === "전체" || ev.stores.includes("전체") || ev.stores.includes("전매장") || ev.stores.includes(store);

      return inDateRange && inStore;
    });
  };

  const isNewPromotion = (ev: PromotionEvent) => {
    const d = parseDate(ev.start);
    if (!d) return false;
    return d.getFullYear() === year && (d.getMonth() + 1) === month;
  };

  const isExpiringThisMonth = (ev: PromotionEvent) => {
    const d = parseDate(ev.end);
    if (!d) return false;
    return d.getFullYear() === year && (d.getMonth() + 1) === month;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden block">
      {/* 상단 헤더: 모바일에서 세로 배치 방지 및 텍스트 축소 */}
      <div className="bg-green-700 text-white px-3 py-2 sm:px-6 sm:py-3 font-bold flex flex-row justify-between items-center gap-1">
        <span className="text-[10px] sm:text-base tracking-tighter sm:tracking-normal">MONTHLY CALENDAR</span>
        <div className="flex gap-1.5 sm:gap-4 text-[8px] sm:text-[10px]">
          <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> 주요</span>
          <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> 신규</span>
          <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-black"></span> 종료</span>
        </div>
      </div>

      <div className="p-1 sm:p-4">
        {/* 요일 행: 폰트 크기 및 패딩 최적화 */}
        <div className="grid grid-cols-7 bg-slate-100 rounded-t-lg border-x border-t border-gray-200">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, idx) => (
            <div key={day} className={`py-1 sm:py-2 text-center text-[8px] sm:text-[11px] font-black ${idx === 0 ? 'text-red-500' : 'text-slate-600'}`}>
              {day}
            </div>
          ))}
        </div>

        {/* 달력 본문: min-h를 대폭 줄여 모바일 스크롤 최소화 */}
        <div className="grid grid-cols-7 border-l border-t border-gray-200 rounded-b-lg bg-white">
          {emptySlots.map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[50px] sm:min-h-[100px] md:min-h-[120px] bg-gray-50 border-r border-b border-gray-100"></div>
          ))}

          {days.map((day) => {
            const dayEvents = getDayEvents(day);
            return (
              <div key={day} className="min-h-[50px] sm:min-h-[100px] md:min-h-[120px] border-r border-b border-gray-200 p-0.5 sm:p-2 hover:bg-slate-50 transition-colors group">
                <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 group-hover:text-slate-600">{day}</span>
                <div className="flex flex-col gap-0.5 mt-0.5">
                  {dayEvents.map((ev, idx) => {
                    let badgeClass = 'bg-gray-100 text-gray-500 border-gray-200';
                    const isExp = isExpiringThisMonth(ev);
                    
                    if (isExp) {
                      badgeClass = 'bg-black text-white font-bold border-black';
                    } else if (ev.major_category === '주요 프로모션') {
                      badgeClass = 'bg-red-50 text-red-700 font-bold border-red-100';
                    } else if (isNewPromotion(ev)) {
                      badgeClass = 'bg-blue-50 text-blue-700 font-bold border-blue-100';
                    }

                    return (
                      <div 
                        key={idx} 
                        className={`text-[7px] sm:text-[9px] p-[1px] sm:p-0.5 rounded leading-[1.1] truncate border ${badgeClass}`}
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
