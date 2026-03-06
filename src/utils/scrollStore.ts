// src/utils/scrollStore.ts
// Puur utility bestand (geen React) — voorkomt Vite Fast Refresh conflict

const scrollPositions = new Map<string, number>();

export function saveScrollPosition(key: string, y: number) {
  scrollPositions.set(key, y);
}

export function getScrollPosition(key: string): number {
  return scrollPositions.get(key) ?? 0;
}