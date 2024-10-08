import { HttpContext } from '@adonisjs/core/http'
import ExchangeRateService from '#services/exchange_rate_service'
import { quoteValidationSchema } from '#utils/quote_validator'
import { SupportedCurrency } from '#config/app'

export default class QuoteController {
  public async getQuote({ request, response }: HttpContext, debug: boolean = false) {
    // Extract payload directly from the request
    const payload = request.only(['baseCurrency', 'quoteCurrency', 'baseAmount'])

    // Validate request using Zod schema, which also handles transformations (e.g., uppercase)
    const validationResult = quoteValidationSchema.safeParse(payload)

    // If validation fails, return 400 with error messages
    if (!validationResult.success) {
      return response.status(400).json({
        error: validationResult.error.errors.map((err) => err.message),
      })
    }

    // Use the validated and transformed payload
    const validatedPayload = validationResult.data
    const baseCurrency = validatedPayload.baseCurrency as SupportedCurrency
    const quoteCurrency = validatedPayload.quoteCurrency as SupportedCurrency
    const baseAmount = validatedPayload.baseAmount

    try {
      // Fetch exchange rate
      const exchangeRateService = ExchangeRateService.getInstance()
      const result = await exchangeRateService.getQuote(
        baseCurrency,
        quoteCurrency,
        baseAmount,
        debug
      )
      return response.json(result)
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }
}
