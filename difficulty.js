// 第 1～20 級共用設定；級數提高時增加搜尋預算，並逐步減少隨機失誤。
export const DEFAULT_LEVEL = 10;
export const MIN_LEVEL = 1;
export const MAX_LEVEL = 20;

// [最大深度, 每階段搜尋預算毫秒, 候選分差, 隨機走法比例]
const SETTINGS = [
  [1, 120, 140, 0.65],
  [1, 160, 120, 0.55],
  [1, 200, 100, 0.45],
  [2, 250, 85, 0.35],
  [2, 300, 70, 0.28],
  [2, 400, 55, 0.20],
  [2, 500, 40, 0.12],
  [3, 650, 28, 0.06],
  [3, 800, 16, 0.02],
  [3, 900, 8, 0],
  [3, 1100, 6, 0],
  [4, 1400, 5, 0],
  [4, 1700, 4, 0],
  [4, 2000, 3, 0],
  [4, 2400, 2, 0],
  [5, 2800, 1, 0],
  [5, 3200, 0, 0],
  [5, 3600, 0, 0],
  [6, 4000, 0, 0],
  [6, 4500, 0, 0],
];

export function getDifficulty(value = DEFAULT_LEVEL) {
  const parsed = typeof value === 'number' || typeof value === 'string' ? Number(value) : NaN;
  const level = Number.isInteger(parsed) && parsed >= MIN_LEVEL && parsed <= MAX_LEVEL
    ? parsed : DEFAULT_LEVEL;
  const [maxDepth, timeMs, window, randomRate] = SETTINGS[level - 1];
  return { level, label: `第 ${level} 級`, maxDepth, timeMs, window, randomRate };
}
