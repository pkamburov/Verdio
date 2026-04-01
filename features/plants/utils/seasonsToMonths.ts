const seasonToMonthsMap: Record<string, number[]> = {
  early_spring: [3],
  spring: [3, 4, 5],
  late_spring: [5],

  early_summer: [6],
  summer: [6, 7, 8],
  late_summer: [8],

  early_autumn: [9],
  autumn: [9, 10, 11],
  late_autumn: [11],

  winter: [12, 1, 2],
};

export function seasonsToMonths(seasons: string[]): number[] {
  const result = new Set<number>();

  seasons.forEach((season) => {
    const months = seasonToMonthsMap[season];
    if (months) {
      months.forEach((m) => result.add(m));
    }
  });

  return Array.from(result).sort((a, b) => a - b);
}
