import { z } from 'zod'
import { SUPPORTED_CURRENCIES } from '#config/app'

// Define the Zod schema for validation with uppercase transformation
export const quoteValidationSchema = z.object({
  baseCurrency: z.enum(SUPPORTED_CURRENCIES).transform((currency) => currency.toUpperCase()),
  quoteCurrency: z.enum(SUPPORTED_CURRENCIES).transform((currency) => currency.toUpperCase()),
  baseAmount: z.coerce.number().min(1, { message: 'Base amount must be a positive number' }),
})
