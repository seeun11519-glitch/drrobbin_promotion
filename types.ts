export interface PromotionEvent {
  showOnCalendar: boolean;
  major_category?: string; // 대분류 (e.g., 주요 프로모션, 고정 정보)
  category?: string; // 구분 (e.g., 오프라인, 송출)
  matrixCat: string; // Used for the Matrix view grouping
  type?: string;
  title: string;
  detail: string;
  pos_key?: string; // POS KEY (할인키)
  stores: string[];
  storeDetails: Record<string, string>; // Map store name to specific detail string (if different from default)
  start?: string;
  end?: string;
  isV?: boolean;
}

export type StoreName = 
  | "전체" 
  | "전매장"
  | "강서" 
  | "고척" 
  | "공덕" 
  | "목동" 
  | "서초" 
  | "이대" 
  | "판교" 
  | "흑석" 
  | "한남" 
  | "광화문"
  | "티임스퀘어";
