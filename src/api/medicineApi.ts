const API_KEY = import.meta.env.VITE_DRUG_API_KEY;
const BASE_URL = '/api/drug/1471000/MdcinGrnIdntfcInfoService03/getMdcinGrnIdntfcInfoList03';

/** 식약처 API 원본 아이템 */
export interface DrugItemRaw {
  ITEM_SEQ: string;
  ITEM_NAME: string;
  ENTP_NAME: string;
  CHART: string;
  ITEM_IMAGE: string;
  PRINT_FRONT: string;
  PRINT_BACK: string;
  DRUG_SHAPE: string;
  COLOR_CLASS1: string;
  COLOR_CLASS2: string;
  CLASS_NAME: string;
  ETC_OTC_NAME: string;
  ITEM_PERMIT_DATE: string;
  FORM_CODE_NAME: string;
  MARK_CODE_FRONT_ANAL: string;
  MARK_CODE_BACK_ANAL: string;
  ITEM_ENG_NAME: string;
  EDI_CODE: string;
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

interface ApiResponse {
  header: { resultCode: string; resultMsg: string };
  body: {
    pageNo: number;
    totalCount: number;
    numOfRows: number;
    items: DrugItemRaw[] | '';
  };
}

const SHAPE_MAP: Record<string, string> = {
  circle: '원형',
  oval: '타원형',
  oblong: '장방형',
  triangle: '삼각형',
  square: '사각형',
  diamond: '마름모형',
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
};

export interface SearchParams {
  shape?: string | null;
  color?: string | null;
  imprint?: string | null;
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
  page = 1,
  numOfRows = 10,
): Promise<{ items: DrugInfo[]; totalCount: number }> {
  let url = `${BASE_URL}?serviceKey=${API_KEY}&type=json&pageNo=${page}&numOfRows=${numOfRows}`;

  if (params.shape && SHAPE_MAP[params.shape]) {
    url += `&DRUG_SHAPE=${SHAPE_MAP[params.shape]}`;
  }
  if (params.color && COLOR_MAP[params.color]) {
    url += `&COLOR_CLASS1=${COLOR_MAP[params.color]}`;
  }
  if (params.imprint?.trim()) {
    url += `&PRINT_FRONT=${params.imprint.trim()}`;
  }
  console.log('[medicineApi] 요청 URL:', url);
  console.log('[medicineApi] 요청 파라미터:', {
    shape: params.shape ? SHAPE_MAP[params.shape] : null,
    color: params.color ? COLOR_MAP[params.color] : null,
    imprint: params.imprint,
  });

  const res = await fetch(url);

  if (!res.ok) {
    console.error('[medicineApi] HTTP 오류:', res.status, res.statusText);
    throw new Error(`API 요청 실패: ${res.status}`);
  }

  const data: ApiResponse = await res.json();
  console.log('[medicineApi] 응답 데이터:', data);

  if (data.header.resultCode !== '00') {
    console.error('[medicineApi] API 오류:', data.header);
    throw new Error(`API 오류: ${data.header.resultMsg}`);
  }

  const rawItems = data.body.items;
  const items = Array.isArray(rawItems) ? rawItems.map(toItem) : [];
  console.log('[medicineApi] 변환된 결과:', items.length, '건');

  return { items, totalCount: data.body.totalCount };
}
