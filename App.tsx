import React, { useState, useEffect } from 'react';
import ControlBar from './components/ControlBar';
import CalendarView from './components/CalendarView';
import MatrixView from './components/MatrixView';
import ExpiryListView from './components/ExpiryListView';
import { DB } from './constants';
import { PromotionEvent } from './types';

// Apps Script Web App API URL
const API_URL = 'https://script.google.com/macros/s/AKfycbwtoXFAmJOlSP0SCfcjJF8BU7BrbaQ8OvLlzE7J4vxzYbSXQGqZW7OluQ5fBxNTh3qZ7A/exec';

// Actual store names to check in the row data
const REAL_STORES = ["강서", "고척", "공덕", "광화문", "목동", "서초", "이대", "판교", "흑석", "한남"];

const App: React.FC = () => {
  // State
  const [year] = useState<number>(2026);
  const [month, setMonth] = useState<number>(2);
  const [store, setStore] = useState<string>('전체');
  
  // Visibility toggles
  const [showCal, setShowCal] = useState<boolean>(true);
  const [showMat, setShowMat] = useState<boolean>(true);

  // Data state
  const [events, setEvents] = useState<PromotionEvent[]>(DB);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(API_URL);
        const result = await response.json();
        
        const rows = Array.isArray(result) ? result : (result.data || []);
        
        const parsedEvents: PromotionEvent[] = rows.map((row: any) => {
          const getVal = (keyPart: string) => {
            if (!row) return '';
            const key = Object.keys(row).find(k => k.replace(/\s+/g, '').includes(keyPart.replace(/\s+/g, '')));
            return key && row[key] != null ? String(row[key]).trim() : '';
          };

          const stores: string[] = [];
          const storeDetails: Record<string, string> = {};

          // 1. Check "대상매장" column first for "전체" flag
          const targetStr = getVal('대상매장');
          const isAllStores = targetStr.includes('전체') || targetStr.includes('전매장');

          if (isAllStores) {
            stores.push('전체');
            stores.push('전매장');
            REAL_STORES.forEach(s => stores.push(s));
          }

          // 2. Process individual store columns for overrides or specific participation
          REAL_STORES.forEach(s => {
            const val = getVal(s);
            if (val) {
              if (!stores.includes(s)) stores.push(s);
              
              const cleanVal = val.toUpperCase().trim();
              if (cleanVal !== 'V' && cleanVal !== 'O' && cleanVal !== 'TRUE' && cleanVal !== 'CHECK') {
                storeDetails[s] = val; 
              }
            }
          });

          // 3. Fallback manual parsing if not "전체" and no individual columns were checked
          if (stores.length === 0 && targetStr) {
             const manualStores = targetStr.split(',').map(st => st.trim());
             manualStores.forEach(st => {
               if(REAL_STORES.includes(st)) stores.push(st);
             });
          }

          const showCalVal = getVal('캘린더노출');
          const showOnCalendar = showCalVal === 'TRUE' || showCalVal === 'true' || showCalVal === 'O' || showCalVal === 'o';

          const isVVal = getVal('V체크') || getVal('강조');
          const isV = isVVal === 'TRUE' || isVVal === 'true' || isVVal === 'O' || isVVal === 'V';

          const cat = getVal('항목') || getVal('구분') || '기타';
          const matCat = getVal('매트릭스분류') || cat;

          return {
            showOnCalendar,
            major_category: getVal('대분류'),
            category: cat,
            matrixCat: matCat,
            title: getVal('행사명') || getVal('제목'),
            detail: getVal('상세내용') || getVal('내용'),
            // Updated to include '비고' (Remarks) which typically corresponds to Column G if POSKEY is missing
            pos_key: getVal('POSKEY') || getVal('포스키') || getVal('비고'),
            stores: Array.from(new Set(stores)), // Unique stores
            storeDetails: storeDetails,
            start: getVal('시작일'),
            end: getVal('종료일'),
            isV
          };
        });
        
        const validEvents = parsedEvents.filter(e => e.title);
        if (validEvents.length > 0) setEvents(validEvents);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4 md:p-6 font-sans text-slate-800">
      <div className="w-full max-w-[1920px] mx-auto space-y-4 sm:space-y-6">
        {isLoading && (
          <div className="fixed top-0 left-0 w-full h-1 bg-blue-100 z-50">
            <div className="h-full bg-blue-600 animate-pulse w-1/3 mx-auto"></div>
          </div>
        )}
        <ControlBar 
          year={year} month={month} setMonth={setMonth}
          store={store} setStore={setStore}
          showCal={showCal} setShowCal={setShowCal}
          showMat={showMat} setShowMat={setShowMat}
        />
        {showCal && <CalendarView year={year} month={month} store={store} events={events} />}
        {showMat && <MatrixView year={year} month={month} store={store} events={events} />}
        <ExpiryListView year={year} month={month} store={store} events={events} />
      </div>
    </div>
  );
};

export default App;