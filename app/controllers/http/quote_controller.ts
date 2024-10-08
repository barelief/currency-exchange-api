// quote_controller.ts
import { HttpContext } from '@adonisjs/core/http'
import ExchangeRateService from '#services/exchange_rate_service'
import { quoteValidationSchema } from '#utils/quote_validator'

export default class QuoteController {
  public async getQuote({ request, response }: HttpContext, debug: boolean = false) {
    // Extract payload directly from the request
    const payload = request.only(['baseCurrency', 'quoteCurrency', 'baseAmount'])

    // Convert baseAmount to a number (zod is strict!), make curerncy uppercase
    const parsedPayload = {
      baseCurrency: payload.baseCurrency.toUpperCase(),
      quoteCurrency: payload.quoteCurrency.toUpperCase(),
      baseAmount: Number(payload.baseAmount),
    }

    // Validate request using Zod schema
    const validationResult = quoteValidationSchema.safeParse(parsedPayload)

    // If validation fails, return 400 with error messages
    if (!validationResult.success) {
      return response.status(400).json({
        error: validationResult.error.errors.map((err) => err.message),
      })
    }

    // perform transpofrmation if needed. check zod schema
    const validatedPayload = validationResult.data

    try {
      // Fetch exchange rate
      const exchangeRateService = ExchangeRateService.getInstance()
      const result = await exchangeRateService.getQuote(
        validatedPayload.baseCurrency,
        validatedPayload.quoteCurrency,
        validatedPayload.baseAmount,
        debug
      )
      return response.json(result)
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }
}
