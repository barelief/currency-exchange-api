// validators/quote_validator.ts
import { z } from 'zod'
import { SUPPORTED_CURRENCIES } from '#config/app'

// Define the Zod schema for validation
export const quoteValidationSchema = z.object({
  baseCurrency: z.enum(SUPPORTED_CURRENCIES),
  quoteCurrency: z.enum(SUPPORTED_CURRENCIES),
  baseAmount: z.number().min(1, { message: 'Base amount must be a positive number' }),
})
