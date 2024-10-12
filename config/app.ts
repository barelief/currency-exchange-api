import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { Secret } from '@adonisjs/core/helpers'
import { defineConfig } from '@adonisjs/core/http'

export const exchangeRateApiUrl = 'https://api.exchangerate-api.com/v4/latest/USD'

/**
 * The list of supported currencies
 */
export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'ILS'] as const

// [numner] means "get the type of any element of the array"
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number]

export function isSupportedCurrency(currency: string): currency is SupportedCurrency {
  return SUPPORTED_CURRENCIES.includes(currency as SupportedCurrency)
}

/**
 * Cache config
 */

// This formula calculates the total number of ordered currency pairs,
// considering both directions (e.g., USD/EUR and EUR/USD).
const ln = SUPPORTED_CURRENCIES.length
export const cacheCapacity = ln * (ln - 1)

// time for a cache node to expire
export const cacheTTL = 10000 // 10000 is 10s

/**
 * The app key is used for encrypting cookies, generating signed URLs,
 * and by the "encryption" module.
 *
 * The encryption module will fail to decrypt data if the key is lost or
 * changed. Therefore it is recommended to keep the app key secure.
 */
export const appKey = new Secret(env.get('APP_KEY'))

/**
 * The configuration settings used by the HTTP server
 */
export const http = defineConfig({
  generateRequestId: true,
  allowMethodSpoofing: false,

  /**
   * Enabling async local storage will let you access HTTP context
   * from anywhere inside your application.
   */
  useAsyncLocalStorage: false,

  /**
   * Manage cookies configuration. The settings for the session id cookie are
   * defined inside the "config/session.ts" file.
   */
  cookie: {
    domain: '',
    path: '/',
    maxAge: '2h',
    httpOnly: true,
    secure: app.inProduction,
    sameSite: 'lax',
  },
})
