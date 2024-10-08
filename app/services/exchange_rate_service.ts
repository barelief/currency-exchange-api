//blitz
import axios from 'axios'
import LRUCache from '#utils/lru_cache'
import { applyRoundingPolicy, RoundingPolicy } from '#utils/rounding_policy'
import { SupportedCurrency, isSupportedCurrency, cacheCapacity, cacheTTL } from '#config/app'

export default class ExchangeRateService {
  private static instance: ExchangeRateService
  private cache: LRUCache<string, number>
  private requestCount: number

  constructor() {
    this.cache = new LRUCache<string, number>(cacheCapacity, cacheTTL)
    this.requestCount = 0
  }

  public static getInstance(): ExchangeRateService {
    if (!ExchangeRateService.instance) {
      ExchangeRateService.instance = new ExchangeRateService()
    }
    return ExchangeRateService.instance
  }

  public async getQuote(
    baseCurrency: SupportedCurrency,
    quoteCurrency: SupportedCurrency,
    baseAmount: number,
    debug?: boolean,
    roundingPolicy: RoundingPolicy = 'roundHalfEven'
  ) {
    const startTime = Date.now() // Start tracking time

    const { exchangeRate, cached } = await this.getExchangeRate(baseCurrency, quoteCurrency)
    const rawQuoteAmount = baseAmount * exchangeRate
    const quoteAmount = applyRoundingPolicy(rawQuoteAmount, 0, roundingPolicy) // Using 2 decimal places

    const response: any = {
      exchangeRate: Number(exchangeRate.toFixed(3)),
      quoteAmount,
    }

    // add debug response
    if (debug) {
      const responseTime = Date.now() - startTime // Calculate response time in seconds
      this.requestCount++

      response.debugInfo = {
        rawQuoteAmount,
        roundingPolicy,
        responseTime: `${responseTime}ms`,
        cached,
        totalRequests: this.requestCount,
      }
      response.cacheInfo = this.getCacheStats()
    }

    return response
  }

  // Fetch exchange rate from API
  private async getExchangeRate(
    baseCurrency: SupportedCurrency,
    quoteCurrency: SupportedCurrency
  ): Promise<{ exchangeRate: number; cached: boolean }> {
    const cacheKey = `${baseCurrency}-${quoteCurrency}`

    // Check if the exchange rate is in cache
    const cachedRate = this.cache.get(cacheKey)
    if (cachedRate !== undefined) {
      // If found in cache, return cached rate and set cached to true
      return { exchangeRate: cachedRate, cached: true }
    }

    // Otherwise, fetch from the API
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD`)
    const rates = response.data.rates

    if (!isSupportedCurrency(baseCurrency) || !isSupportedCurrency(quoteCurrency)) {
      throw new Error('Unsupported currency')
    }

    const baseRate = baseCurrency === 'USD' ? 1 : rates[baseCurrency]
    const quoteRate = quoteCurrency === 'USD' ? 1 : rates[quoteCurrency]
    const exchangeRate = quoteRate / baseRate

    // Cache the fetched exchange rate and return cached status as false
    this.cache.set(cacheKey, exchangeRate)

    return { exchangeRate, cached: false }
  }

  public getCacheStats() {
    return {
      size: this.cache.size(),
      capacity: this.cache.getCapacity(),
      utilizationPercentage: (this.cache.size() / this.cache.getCapacity()) * 100,
      mostRecentlyCached: this.cache.getMostRecentKey(),
      leastRecentlyCached: this.cache.getLeastRecentKey(),
      cacheOrder: this.cache.getOrderedKeys(),
      expiryData: this.cache.getKeysWithExpirations(),
    }
  }
}
