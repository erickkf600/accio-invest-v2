export function parseCurrency(value: string): number {
  return typeof value === 'string' ? Number(value?.replace(/\D/g, '')) / 100 : value
}
