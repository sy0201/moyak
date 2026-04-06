import type { DrugInfo } from '../api/medicineApi';

const STORAGE_KEY = 'moyak_search_history';
const MAX_ITEMS = 10;

export function getSearchHistory(): DrugInfo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToSearchHistory(drug: DrugInfo): void {
  const items = getSearchHistory().filter((d) => d.itemSeq !== drug.itemSeq);
  items.unshift(drug);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
}
