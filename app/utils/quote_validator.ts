import { z } from 'zod'
import { SUPPORTED_CURRENCIES } from '#config/app'

// This schema ensures the input is one of the supported currencies
const currencySchema = z.enum(SUPPORTED_CURRENCIES)

// Make additional transformations before validating
export const quoteValidationSchema = z.object({
  baseCurrency: z.string().toUpperCase().pipe(currencySchema),
  quoteCurrency: z.string().toUpperCase().pipe(currencySchema),
  baseAmount: z.coerce.number().min(1, { message: 'Base amount must be a positive number' }),
})
