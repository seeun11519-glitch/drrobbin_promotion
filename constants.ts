import { PromotionEvent, StoreName } from './types';

export const MATRIX_CATEGORIES = ["VMD", "배달", "베이커리", "송출", "시즌", "오프라인", "쿠폰", "판매", "플레이스", "홍보", "환경"];

export const STORE_LIST: StoreName[] = ["전매장", "강서", "고척", "공덕", "광화문", "목동", "서초", "이대", "판교", "흑석", "한남", "타임스퀘어" ];

export const DB: PromotionEvent[] = [
  // 주요 프로모션
  { 
    showOnCalendar: true, 
    major_category: "주요 프로모션", 
    category: "오프라인", 
    matrixCat: "오프라인",
    title: "✅ 마이노멀", 
    detail: "닥터로빈 베이커리 10,000원 이상 구매 시 땅콩버터 파우치 3종 증정", 
    pos_key: "기타> 땅콩버터파우치3종",
    stores: ["전체"], 
    storeDetails: {},
    start: "1/13", 
    end: "상시" 
  },
  
  // 고정 정보
  { 
    showOnCalendar: true, 
    major_category: "고정 정보", 
    category: "송출", 
    matrixCat: "송출",
    title: "매장별 음악 송출시간", 
    detail: "매장별 음악 송출시간 고정", 
    pos_key: "-",
    stores: ["전체"], 
    storeDetails: {},
    start: "-", 
    end: "상시" 
  },
  { 
    showOnCalendar: false, 
    major_category: "고정 정보", 
    category: "판매", 
    matrixCat: "판매",
    title: "밀키트", 
    detail: "단호박스프 & 라자냐", 
    pos_key: "-",
    stores: ["전체"], 
    storeDetails: {},
    start: "-", 
    end: "상시",
    isV: true
  },
  { 
    showOnCalendar: false, 
    major_category: "고정 정보", 
    category: "송출", 
    matrixCat: "송출",
    title: "셋탑", 
    detail: "각 매장별 1개씩 보유", 
    pos_key: "-",
    stores: ["전체"], 
    storeDetails: {},
    start: "-", 
    end: "상시"
  },
  { 
    showOnCalendar: false, 
    major_category: "고정 정보", 
    category: "판매", 
    matrixCat: "판매",
    title: "와인리스트 통합", 
    detail: "신규 와인 리스트 통합 진행 중", 
    pos_key: "-",
    stores: ["전체"], 
    storeDetails: {},
    start: "-", 
    end: "상시"
  },
  { 
    showOnCalendar: false, 
    major_category: "고정 정보", 
    category: "쿠폰", 
    matrixCat: "쿠폰",
    title: "이벤트 쿠폰", 
    detail: "메뉴권/스파클링", 
    pos_key: "-",
    stores: ["전체"], 
    storeDetails: {},
    start: "-", 
    end: "상시"
  },
  { 
    showOnCalendar: false, 
    major_category: "고정 정보", 
    category: "쿠폰", 
    matrixCat: "쿠폰",
    title: "프렌즈쿠폰", 
    detail: "-", 
    pos_key: "직원할인(프렌즈쿠폰)",
    stores: ["전체"], 
    storeDetails: {},
    start: "-", 
    end: "상시",
    isV: true
  },

  // 온라인 광고
  { 
    showOnCalendar: true, 
    major_category: "온라인 광고", 
    category: "홍보", 
    matrixCat: "홍보",
    title: "네이버 플레이스 공지", 
    detail: "신규메뉴 홍보", 
    pos_key: "-",
    stores: ["전체"], 
    storeDetails: {},
    start: "2025.11.21", 
    end: "2026.01.31" 
  },
  { 
    showOnCalendar: true, 
    major_category: "온라인 광고", 
    category: "홍보", 
    matrixCat: "홍보",
    title: "네이버 플레이스 쿠폰", 
    detail: "리뷰이벤트", 
    pos_key: "-",
    stores: ["전체"], 
    storeDetails: {},
    start: "2025.11.21", 
    end: "상시" 
  },
  { 
    showOnCalendar: true, 
    major_category: "온라인 광고", 
    category: "오프라인", 
    matrixCat: "오프라인",
    title: "블로그/인스타그램 체험단", 
    detail: "winter glow set 제공", 
    pos_key: "리뷰체험단",
    stores: ["전체", "강서", "고척"], 
    storeDetails: {},
    start: "2025.12.27", 
    end: "2026.01.13" 
  },
  { 
    showOnCalendar: true, 
    major_category: "온라인 광고", 
    category: "홍보", 
    matrixCat: "홍보",
    title: "캐치테이블 쿠폰", 
    detail: "리뷰이벤트", 
    pos_key: "-",
    stores: ["전체"], 
    storeDetails: {},
    start: "2025.11.21", 
    end: "상시" 
  },
  { 
    showOnCalendar: true, 
    major_category: "온라인 광고", 
    category: "홍보", 
    matrixCat: "홍보",
    title: "QR배너", 
    detail: "신규 세트", 
    pos_key: "-",
    stores: ["전체"], 
    storeDetails: {},
    start: "2025.11.21", 
    end: "2026.01.31" 
  },

  // 제휴 할인
  { 
    showOnCalendar: true, 
    major_category: "제휴 할인", 
    category: "오프라인", 
    matrixCat: "오프라인",
    title: "귀뚜라미 임직원 할인", 
    detail: "런치 10% 할인 / 디너 20% 할인", 
    pos_key: "귀뚜라미(런치)\n귀뚜라미(디너)",
    stores: ["전체"], 
    storeDetails: {},
    start: "2025.6.23", 
    end: "상시" 
  },
  { 
    showOnCalendar: true, 
    major_category: "제휴 할인", 
    category: "베이커리", 
    matrixCat: "베이커리",
    title: "베이커리 20% 할인", 
    detail: "닥터로빈 및 귀뚜라미 계열사 임직원 베이커리 20% 할인", 
    pos_key: "베이커리20%_귀뚜라미",
    stores: ["전체"], 
    storeDetails: {},
    start: "2025.5.16", 
    end: "상시",
    isV: true
  },
  { 
    showOnCalendar: true, 
    major_category: "제휴 할인", 
    category: "오프라인", 
    matrixCat: "오프라인",
    title: "블루북스트리트", 
    detail: "4만원 이상 구매 시, 1인 단호박 스프 증정", 
    pos_key: "기타> 금액조정",
    stores: ["전체"], 
    storeDetails: {},
    start: "-", 
    end: "상시" 
  },
  { 
    showOnCalendar: true, 
    major_category: "제휴 할인", 
    category: "오프라인", 
    matrixCat: "오프라인",
    title: "웰페어복지클럽", 
    detail: "-", 
    pos_key: "-",
    stores: ["전체"], 
    storeDetails: {},
    start: "-", 
    end: "상시" 
  },
  { 
    showOnCalendar: true, 
    major_category: "제휴 할인", 
    category: "환경", 
    matrixCat: "환경",
    title: "텀블러 500원 할인", 
    detail: "텀블러 음료 포장시 500원 할인", 
    pos_key: "텀블러할인",
    stores: ["전체"], 
    storeDetails: {},
    start: "-", 
    end: "상시" 
  },
  { 
    showOnCalendar: true, 
    major_category: "제휴 할인", 
    category: "오프라인", 
    matrixCat: "오프라인",
    title: "하이비타민", 
    detail: "-", 
    pos_key: "-",
    stores: ["강서", "고척", "공덕", "목동", "서초"], 
    storeDetails: {},
    start: "2025.8.26", 
    end: "2026.02.28" 
  },

  // 프로모션
  { 
    showOnCalendar: true, 
    major_category: "프로모션", 
    category: "오프라인", 
    matrixCat: "오프라인",
    title: "리뷰 이벤트", 
    detail: "네이버 영수증 또는 인스타그램 리뷰 작성시 서비스 제공", 
    pos_key: "SNS리뷰",
    stores: ["전체"], 
    storeDetails: {},
    start: "2025.11.21", 
    end: "상시" 
  },
  { 
    showOnCalendar: true, 
    major_category: "프로모션", 
    category: "배달", 
    matrixCat: "배달",
    title: "배달 리뷰이벤트", 
    detail: "리뷰이벤트 참여 시, 랜덤 빵 증정", 
    pos_key: "리뷰베이커리",
    stores: ["전체"], 
    storeDetails: {},
    start: "2025.4.29", 
    end: "상시" 
  },
  { 
    showOnCalendar: false, 
    major_category: "프로모션", 
    category: "배달", 
    matrixCat: "배달",
    title: "배달 최소주문", 
    detail: "① 최소주문금액 : 20,000원\n② 고객부담요금 : <배민> 한집배달(0~3,500)...", 
    pos_key: "-",
    stores: ["전체"], 
    storeDetails: {},
    start: "2024.3.1", 
    end: "상시",
    isV: true
  },
  
  // 시즌 (Example extra)
  { 
    showOnCalendar: true, 
    major_category: "프로모션", 
    category: "시즌", 
    matrixCat: "시즌",
    title: "🆕 와인 30% 할인", 
    detail: "와인 전 품목 30% 할인", 
    pos_key: "와인할인",
    stores: ["전체"], 
    storeDetails: {},
    start: "2026-02-01", 
    end: "상시" 
  },
];
