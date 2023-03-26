export function convertDecimalToPercentage(decimal, fixed = 2) {
  return `${(decimal * 100).toFixed(fixed)}%`;
}
