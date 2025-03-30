export function convertKey(input: string): string {
  if (input.length <= 8) return input; // Nếu chuỗi quá ngắn, không cần xử lý
  
  const firstPart = input.slice(0, 4);
  const lastPart = input.slice(-4);
  
  return `${firstPart}...${lastPart}`;
}

export function credisToMicrocredis(credis: string): number {
  return parseInt(credis) * 1_000_000;
}

export function microcredisToCredis(microcredis: string): number {
  return parseInt(microcredis) / 1_000_000;
}