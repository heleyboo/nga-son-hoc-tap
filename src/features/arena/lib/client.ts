import { useSyncExternalStore } from "react";

const noop = () => () => {};
/** true khi đang chạy ở trình duyệt sau hydrate, false khi render ở server — tránh lệch HTML */
export const useIsClient = () => useSyncExternalStore(noop, () => true, () => false);

/** Giá trị ngẫu nhiên tính một lần cho mỗi lần tải trang (ổn định giữa các lần render) */
const onceCache = new Map<string, unknown>();
export function once<T>(key: string, make: () => T): T {
  if (!onceCache.has(key)) onceCache.set(key, make());
  return onceCache.get(key) as T;
}
