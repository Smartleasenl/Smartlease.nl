// src/utils/scrollStore.ts
const scrollPositions = new Map<string, number>();

export function saveScrollPosition(key: string, y: number) {
  scrollPositions.set(key, y);
}

export function getScrollPosition(key: string): number {
  return scrollPositions.get(key) ?? 0;
}