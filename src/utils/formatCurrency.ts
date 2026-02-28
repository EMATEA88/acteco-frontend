export function formatCurrencyAOA(value: number | string): string {
  const numericValue = Number(value)

  if (isNaN(numericValue)) {
    return '0,00 Kz'
  }

  const fixed = numericValue.toFixed(2)
  const parts = fixed.split('.')

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  return parts.join(',') + ' Kz'
}