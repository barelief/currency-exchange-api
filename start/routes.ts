/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

// Route to get a quote
router.get('/quote', async (ctx) => {
  const { default: QuoteController } = await import('#controllers/http/quote_controller')
  return new QuoteController().getQuote(ctx)
})

// Debug route to get a quote with debug mode enabled
router.get('/debug', async (ctx) => {
  const { default: QuoteController } = await import('#controllers/http/quote_controller')
  return new QuoteController().getQuote(ctx, true)
})

// Root route with a welcome message.
// Would put static site with API documentation here
router.get('/', async () => {
  return {
    message: 'Welcome to my API world!',
  }
})

// Echo route to return the request body
router.post('/echo', async ({ request }) => {
  console.warn('request received to /echo')
  const body = request.body()
  return {
    message: 'Echoing back the request body',
    body: body,
  }
})
