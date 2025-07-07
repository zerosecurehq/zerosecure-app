export const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};
