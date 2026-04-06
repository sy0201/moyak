/** 식약처 API 원본 아이템 (drugs.json 구조) */
export interface DrugItemRaw {
  ITEM_SEQ: string;
  ITEM_NAME: string;
  ENTP_SEQ: string;
  ENTP_NAME: string;
  CHART: string;
  ITEM_IMAGE: string;
  PRINT_FRONT: string | null;
  PRINT_BACK: string | null;
  DRUG_SHAPE: string;
  COLOR_CLASS1: string;
  COLOR_CLASS2: string | null;
  LINE_FRONT: string | null;
  LINE_BACK: string | null;
  LENG_LONG: string | null;
  LENG_SHORT: string | null;
  THICK: string | null;
  CLASS_NO: string;
  CLASS_NAME: string;
  ETC_OTC_NAME: string;
  ITEM_PERMIT_DATE: string;
  FORM_CODE_NAME: string;
  MARK_CODE_FRONT_ANAL: string;
  MARK_CODE_BACK_ANAL: string;
  ITEM_ENG_NAME: string | null;
  EDI_CODE: string | null;
  CHANGE_DATE: string;
}

/** 앱 내부에서 사용하는 약 정보 타입 */
export interface DrugInfo {
  itemSeq: string;
  name: string;
  manufacturer: string;
  shape: string;
  color: string;
  image: string | null;
  printFront: string;
  printBack: string;
  className: string;
  formName: string;
  etcOtcName: string;
}

const SHAPE_MAP: Record<string, string> = {
  circle: '원형',
  oval: '타원형',
  oblong: '장방형',
  triangle: '삼각형',
  square: '사각형',
  diamond: '마름모형',
  pentagon: '오각형',
  hexagon: '육각형',
  octagon: '팔각형',
  semicircle: '반원형',
  etc: '기타',
};

const COLOR_MAP: Record<string, string> = {
  white: '하양',
  yellow: '노랑',
  orange: '주황',
  pink: '분홍',
  red: '빨강',
  brown: '갈색',
  green: '초록',
  blue: '파랑',
  purple: '보라',
  gray: '회색',
  black: '검정',
  lightgreen: '연두',
  cyan: '청록',
  magenta: '자주',
  navy: '남색',
  transparent: '투명',
};

export interface SearchParams {
  shape?: string | null;
  color?: string | null;
  imprint?: string | null;
}

// 메모리 캐시
let cachedData: DrugItemRaw[] | null = null;

async function loadDrugData(): Promise<DrugItemRaw[]> {
  if (cachedData) return cachedData;

  console.log('[medicineApi] drugs.json 로딩 중...');
  const res = await fetch('/drugs.json');

  if (!res.ok) {
    throw new Error(`drugs.json 로드 실패: ${res.status}`);
  }

  cachedData = await res.json();
  console.log('[medicineApi] drugs.json 로드 완료:', cachedData!.length, '건');
  console.log('[medicineApi] 샘플 데이터 3건:');
  cachedData!.slice(0, 3).forEach((item, i) => {
    console.log(`  [${i}] DRUG_SHAPE: '${item.DRUG_SHAPE}' | COLOR_CLASS1: '${item.COLOR_CLASS1}' | PRINT_FRONT: '${item.PRINT_FRONT}'`);
  });
  return cachedData!;
}

function toItem(raw: DrugItemRaw): DrugInfo {
  return {
    itemSeq: raw.ITEM_SEQ,
    name: raw.ITEM_NAME,
    manufacturer: raw.ENTP_NAME,
    shape: raw.DRUG_SHAPE,
    color: raw.COLOR_CLASS1,
    image: raw.ITEM_IMAGE || null,
    printFront: raw.PRINT_FRONT || '',
    printBack: raw.PRINT_BACK || '',
    className: raw.CLASS_NAME || '',
    formName: raw.FORM_CODE_NAME || '',
    etcOtcName: raw.ETC_OTC_NAME || '',
  };
}

export async function searchMedicine(
  params: SearchParams,
): Promise<{ items: DrugInfo[]; totalCount: number }> {
  const allData = await loadDrugData();

  console.log('[medicineApi] 검색 파라미터:', params);
  console.log('[medicineApi] allData 건수:', allData.length);
  console.log('[medicineApi] 장방형 건수:', allData.filter(item => item.DRUG_SHAPE === '장방형').length);
  console.log('[medicineApi] 분홍 건수:', allData.filter(item => item.COLOR_CLASS1?.includes('분홍')).length);
  console.log('[medicineApi] DL5 각인 건수:', allData.filter(item => item.PRINT_FRONT?.includes('DL5') || item.PRINT_BACK?.includes('DL5')).length);
  console.log('[DL5 약 데이터]:', allData.filter(item =>
    item.PRINT_FRONT?.includes('DL5') || item.PRINT_BACK?.includes('DL5')
  ));

  let filtered = allData;

  // 모양 필터
  if (params.shape && SHAPE_MAP[params.shape]) {
    const target = SHAPE_MAP[params.shape];
    filtered = filtered.filter((item) => item.DRUG_SHAPE === target);
  }

  // 색상 필터 (복합 색상 '노랑, 투명' 등도 매칭)
  if (params.color && COLOR_MAP[params.color]) {
    const target = COLOR_MAP[params.color];
    filtered = filtered.filter((item) => item.COLOR_CLASS1.includes(target));
  }

  // 각인 필터
  if (params.imprint?.trim()) {
    const target = params.imprint.trim().toUpperCase();
    filtered = filtered.filter(
      (item) =>
        (item.PRINT_FRONT || '').toUpperCase().includes(target) ||
        (item.PRINT_BACK || '').toUpperCase().includes(target),
    );
  }

  const items = filtered.map(toItem);
  console.log('[medicineApi] 검색 결과:', items.length, '건');

  return { items, totalCount: items.length };
}
