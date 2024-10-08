import { test } from '@japa/runner'
import ExchangeService from '#services/exchange_rate_service'

// Test status codes based on request
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

test.group('Quote', () => {
  // Check correct response format
  test('get quote returns correct response format', async ({ client }) => {
    const response = await client.get('/quote').qs({
      baseCurrency: 'USD',
      quoteCurrency: 'EUR',
      baseAmount: 10000,
    })

    response.assertStatus(200)
    response.assertBodyContains({
      exchangeRate: response.body().exchangeRate,
      quoteAmount: response.body().quoteAmount,
    })
  })

  // Check 400 status for invalid currency
  test('get quote with invalid currency returns 400', async ({ client }) => {
    const response = await client.get('/quote').qs({
      baseCurrency: 'USD',
      quoteCurrency: 'INVALID',
      baseAmount: 10000,
    })

    response.assertStatus(400)
  })

  // Check 400 status for negative amount
  test('get quote with negative amount returns 400', async ({ client }) => {
    const response = await client.get('/quote').qs({
      baseCurrency: 'USD',
      quoteCurrency: 'EUR',
      baseAmount: -10000,
    })

    response.assertStatus(400)
  })
})

// Test ExchangeService for valid output
test.group('ExchangeService', () => {
  // Ensure correct format from getQuote
  test('getQuote returns correct format', async ({ assert }) => {
    const service = new ExchangeService()
    const result = await service.getQuote('USD', 'EUR', 10000)

    assert.properties(result, ['exchangeRate', 'quoteAmount'])
    assert.isNumber(result.exchangeRate)
    assert.isNumber(result.quoteAmount)
  })
})
