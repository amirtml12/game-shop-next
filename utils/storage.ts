export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return; // جلوگیری از اجرا روی سرور
  localStorage.setItem(key, JSON.stringify(value));
}

export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue; // جلوگیری از اجرا روی سرور
  const saved = localStorage.getItem(key);
  return saved ? (JSON.parse(saved) as T) : defaultValue;
}