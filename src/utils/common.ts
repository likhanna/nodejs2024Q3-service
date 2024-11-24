export type ConvertArray<T, TResult> = { (item: T, index: number): TResult };
export type IndexTypes = number | string;

/** Convert array of string to map */
export function map(items: string[]): Record<string, string>;

/** Convert array of items to map with these items */
export function map<T, TKey extends IndexTypes>(
  items: T[],
  callback: ConvertArray<T, TKey>,
): Record<TKey, T>;

export function map<T, TKey extends IndexTypes>(
  items: T[],
  callback?: ConvertArray<T, TKey>,
): Record<TKey, T> {
  const result: Record<TKey, T> = {} as Record<TKey, T>;
  if (callback) {
    items.forEach((it, index) => {
      result[callback(it, index)] = it;
    });
  } else {
    // if no callback present items should be array of strings
    (items as unknown as string[]).forEach((it) => {
      result[it as TKey] = it as unknown as T;
    });
  }

  return result;
}

/** Select items from map related to ids */
export function selectFromMap<T>(ids: string[], map: Record<string, T>): T[] {
  return ids.reduce<T[]>((acc, it) => {
    const value = map[it];
    if (value) {
      acc.push(value);
    }

    return acc;
  }, []);
}
