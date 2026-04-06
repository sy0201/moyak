import type { DrugInfo } from '../api/medicineApi';

export interface CabinetItem {
  drug: DrugInfo;
  addedAt: string; // ISO date string
}

const STORAGE_KEY = 'moyak_cabinet';

export function getCabinetItems(): CabinetItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToCabinet(drug: DrugInfo): boolean {
  const items = getCabinetItems();
  if (items.some((item) => item.drug.itemSeq === drug.itemSeq)) {
    return false; // already exists
  }
  items.unshift({ drug, addedAt: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  return true;
}

export function removeFromCabinet(itemSeq: string): void {
  const items = getCabinetItems().filter((item) => item.drug.itemSeq !== itemSeq);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function isInCabinet(itemSeq: string): boolean {
  return getCabinetItems().some((item) => item.drug.itemSeq === itemSeq);
}
