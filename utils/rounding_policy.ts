// Possible rounding policies
export type RoundingPolicy =
  | 'roundHalfUp'
  | 'roundHalfDown'
  | 'roundHalfEven'
  | 'roundUp'
  | 'roundDown'
  | 'truncate'

// Function to apply the selected rounding policy
export function applyRoundingPolicy(
  amount: number,
  decimals: number,
  policy: RoundingPolicy
): number {
  const factor = Math.pow(10, decimals)
  switch (policy) {
    case 'roundHalfUp':
      return Math.round(amount * factor) / factor
    case 'roundHalfDown':
      return Math.floor(amount * factor + 0.5) / factor
    case 'roundHalfEven':
      const isEven = Math.floor(amount * factor) % 2 === 0
      const rounded = Math.round(amount * factor)
      return isEven ? rounded / factor : Math.floor(amount * factor + 0.5) / factor
    case 'roundUp':
      return Math.ceil(amount * factor) / factor
    case 'roundDown':
      return Math.floor(amount * factor) / factor
    case 'truncate':
      return Math.trunc(amount * factor) / factor
    default:
      throw new Error(`Unknown rounding policy: ${policy}`)
  }
}
