import React, { useEffect, useState } from 'react';
import { Calendar, ClipboardList, FileDown, Loader2 } from 'lucide-react';
import { STORE_LIST } from '../constants';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

interface ControlBarProps {
  year: number;
  month: number;
  setMonth: (m: number) => void;
  store: string;
  setStore: (s: string) => void;
  showCal: boolean;
  setShowCal: (v: boolean) => void;
  showMat: boolean;
  setShowMat: (v: boolean) => void;
}

const ControlBar: React.FC<ControlBarProps> = ({
  year,
  month,
  setMonth,
  store,
  setStore,
  showCal,
  setShowCal,
  showMat,
  setShowMat,
}) => {
  const [lastUpdated, setLastUpdated] = useState<string>('-');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  useEffect(() => {
    setLastUpdated(new Date().toLocaleString());
  }, []);

  const handleExportPdf = async () => {
    setIsExporting(true);
    // Give UI a moment to update (spinner)
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const element = document.getElementById('root');
      if (!element) throw new Error('Root element not found');

      // Ensure fonts are loaded
      await document.fonts.ready;

      // Filter out the export button
      const filter = (node: HTMLElement) => {
        if (node.id === 'pdf-export-btn') return false;
        return true;
      };

      // Capture the full scrollable content
      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 2, // 2x resolution for clear text
        filter: filter as any,
        cacheBust: true, // Force reload of external resources (fonts)
        backgroundColor: '#f3f4f6', // bg-gray-100
        style: {
           width: element.scrollWidth + 'px',
           height: element.scrollHeight + 'px',
           overflow: 'visible', // Reveal all overflow content
           maxHeight: 'none',
           maxWidth: 'none',
        }
      });

      // Create A4 Portrait PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      const imgProps = pdf.getImageProperties(dataUrl);
      const imgWidth = imgProps.width;
      const imgHeight = imgProps.height;
      
      // Calculate scale to fit within A4 dimensions (Fit to Page)
      // Use the smaller ratio to ensure both width and height fit within 210x297
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const printWidth = imgWidth * ratio;
      const printHeight = imgHeight * ratio;

      // Center horizontally
      const x = (pdfWidth - printWidth) / 2;
      const y = 0; // Top align

      pdf.addImage(dataUrl, 'PNG', x, y, printWidth, printHeight);

      pdf.save(`DrRobbin_Promotion_${year}_${month}_${store}.pdf`);

    } catch (error) {
      console.error('PDF Export failed:', error);
      alert('PDF 생성에 실패했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  const dropdownStores = STORE_LIST.filter(s => s !== "전매장");

  return (
    <div id="control-bar" className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-slate-800 p-3 sm:p-2 flex flex-col sm:flex-row justify-between items-center sm:px-6 gap-2 sm:gap-0">
        <h1 className="text-white text-xs font-bold tracking-tight uppercase text-center sm:text-left">Dr.Robbin Integrated Promotion System</h1>
        <div className="flex items-center gap-4">
          <div className="text-gray-400 text-[10px] hidden sm:block">최종 동기화: {lastUpdated}</div>
          <button 
            id="pdf-export-btn"
            onClick={handleExportPdf}
            disabled={isExporting}
            className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white text-[10px] py-1 px-3 rounded transition-colors disabled:opacity-50 shadow-inner"
          >
            {isExporting ? <Loader2 size={12} className="animate-spin" /> : <FileDown size={12} />}
            <span>{isExporting ? 'PDF 생성 중...' : 'PDF 다운로드'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 items-stretch border-b border-gray-100">
        <div className="p-3 sm:p-4 border-r border-b lg:border-b-0 border-gray-100 bg-gray-50/50 flex flex-col justify-center">
          <label className="text-[10px] font-bold text-slate-400 mb-1 uppercase">Year</label>
          <div className="font-bold text-slate-800">{year}</div>
        </div>

        <div className="p-3 sm:p-4 border-r border-b lg:border-b-0 border-gray-100 flex flex-col justify-center">
          <label className="text-[10px] font-bold text-slate-400 mb-1 uppercase">Month</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="w-full bg-transparent font-bold text-blue-600 focus:outline-none cursor-pointer"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>{m}월</option>
            ))}
          </select>
        </div>

        <div className="col-span-2 md:col-span-1 p-3 sm:p-4 border-r border-b lg:border-b-0 border-gray-100 flex flex-col justify-center">
          <label className="text-[10px] font-bold text-slate-400 mb-1 uppercase">Store Filter</label>
          <select
            value={store}
            onChange={(e) => setStore(e.target.value)}
            className="w-full bg-transparent font-bold text-green-600 focus:outline-none cursor-pointer"
          >
            <option value="전체">전매장</option>
            {dropdownStores.map((s) => (
              <option key={s} value={s}>{s}점</option>
            ))}
          </select>
        </div>

        <div className="col-span-2 md:col-span-3 lg:col-span-3 grid grid-cols-2">
          <button
            onClick={() => setShowCal(!showCal)}
            className={`flex items-center justify-center gap-2 font-bold border-r border-gray-100 transition-all py-3 sm:py-0 ${
              showCal ? 'bg-slate-800 text-white' : 'bg-white text-slate-400 hover:bg-slate-50'
            }`}
          >
            <Calendar size={16} />
            <span>캘린더 보기</span>
          </button>
          <button
            onClick={() => setShowMat(!showMat)}
            className={`flex items-center justify-center gap-2 font-bold transition-all py-3 sm:py-0 ${
              showMat ? 'bg-slate-800 text-white' : 'bg-white text-slate-400 hover:bg-slate-50'
            }`}
          >
            <ClipboardList size={16} />
            <span>리스트 보기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlBar;