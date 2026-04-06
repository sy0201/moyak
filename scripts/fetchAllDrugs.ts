import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_KEY = '5a55093c694a00f9707f16f59ea96ee20a6e3101966b3b35c2239402f1624685';
const BASE_URL = 'https://apis.data.go.kr/1471000/MdcinGrnIdntfcInfoService03/getMdcinGrnIdntfcInfoList03';
const NUM_OF_ROWS = 100;
const OUTPUT_PATH = path.resolve(__dirname, '../public/drugs.json');

interface DrugItem {
  ITEM_SEQ: string;
  ITEM_NAME: string;
  ENTP_NAME: string;
  CHART: string;
  ITEM_IMAGE: string;
  PRINT_FRONT: string | null;
  PRINT_BACK: string | null;
  DRUG_SHAPE: string;
  COLOR_CLASS1: string;
  COLOR_CLASS2: string | null;
  CLASS_NAME: string;
  ETC_OTC_NAME: string;
  FORM_CODE_NAME: string;
  ITEM_ENG_NAME: string | null;
}

interface ApiResponse {
  header: { resultCode: string; resultMsg: string };
  body: {
    pageNo: number;
    totalCount: number;
    numOfRows: number;
    items: DrugItem[] | '';
  };
}

async function fetchPage(page: number): Promise<{ items: DrugItem[]; totalCount: number }> {
  const url = `${BASE_URL}?serviceKey=${API_KEY}&type=json&pageNo=${page}&numOfRows=${NUM_OF_ROWS}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} at page ${page}`);
  }

  const data: ApiResponse = await res.json();

  if (data.header.resultCode !== '00') {
    throw new Error(`API error: ${data.header.resultMsg}`);
  }

  const items = Array.isArray(data.body.items) ? data.body.items : [];
  return { items, totalCount: data.body.totalCount };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('식약처 낱알식별 데이터 수집 시작...\n');

  // 첫 페이지로 totalCount 확인
  const first = await fetchPage(1);
  const totalCount = first.totalCount;
  const totalPages = Math.ceil(totalCount / NUM_OF_ROWS);

  console.log(`전체 ${totalCount}건, ${totalPages}페이지 수집 예정\n`);

  const allItems: DrugItem[] = [...first.items];
  console.log(`페이지 1/${totalPages} — ${allItems.length}건 수집`);

  for (let page = 2; page <= totalPages; page++) {
    try {
      const { items } = await fetchPage(page);
      allItems.push(...items);
      console.log(`페이지 ${page}/${totalPages} — 누적 ${allItems.length}건`);
    } catch (err) {
      console.error(`페이지 ${page} 실패:`, err);
      console.log('3초 후 재시도...');
      await sleep(3000);
      try {
        const { items } = await fetchPage(page);
        allItems.push(...items);
        console.log(`페이지 ${page}/${totalPages} (재시도 성공) — 누적 ${allItems.length}건`);
      } catch (retryErr) {
        console.error(`페이지 ${page} 재시도 실패, 건너뜀:`, retryErr);
      }
    }

    // API 부하 방지 딜레이
    await sleep(200);
  }

  // public 디렉터리 확인
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allItems, null, 2), 'utf-8');
  console.log(`\n완료! ${allItems.length}건 → ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error('치명적 오류:', err);
  process.exit(1);
});
