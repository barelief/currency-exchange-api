/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('/quote', async (ctx) => {
  const { default: QuoteController } = await import('#controllers/http/quote_controller')
  return new QuoteController().getQuote(ctx)
})

router.get('/debug', async (ctx) => {
  const { default: QuoteController } = await import('#controllers/http/quote_controller')
  return new QuoteController().getQuote(ctx, true)
})

router.get('/', async () => {
  return {
    message: 'Welcome to my API world!',
  }
})

router.post('/echo', async ({ request }) => {
  console.warn('request received to /echo')
  const body = request.body()
  return {
    message: 'Echoing back the request body',
    body: body,
  }
})
