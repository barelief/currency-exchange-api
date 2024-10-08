# Currency Exchange API

A currency exchange API built with [AdonisJS](https://docs.adonisjs.com/guides/preface/introduction#what-is-adonisjs). This API delivers real-time exchange rates with enhanced performance using in-memory caching, configurable rounding policy and [Zod](https://zod.dev/?id=introduction) for validation.

Demo server here: https://minimal-gwyq.onrender.com

Try following `curl` command (or just use Postman) to test: 
```
curl -X GET "https://minimal-gwyq.onrender.com/debug?baseCurrency=USD&quoteCurrency=GBP&baseAmount=10000"
| jq
```

![postman4](https://github.com/user-attachments/assets/a89b13db-75ca-47cd-b6a6-9e134d410118)

## Key Features

- **Currency Conversion**: Supports conversions for USD, EUR, GBP, and ILS. Currency list can be extended in separate setup file `config/app.ts`
- **Optimized Performance**: Utilizes an LRU caching mechanism for faster and more efficient responses.
- **Input Validation**: Ensures robust input validation with Zod.
- **Customizable Rounding**: Configurable rounding policies to suit different business needs.
- **Rate limiting**: Configurable restrictions on the frequency of API requests to prevent abuse 
- **Clear Developer Interface**: Easy to extend, maintain, and test. 

## Project structure 

```
├── 📂 app
│   ├── 📂 controllers
│   │   └── 📂 http
│   │       └── 📄 quote_controller.ts 
│   ├── 📂 services
│   │   └── 📄 exchange_rate_service.ts
│   └── 📂 utils
│       ├── 📄 lru_cache.ts
│       ├── 📄 quote_validator.ts
│       └── 📄 rounding_policy.ts
├── 📂 config
│   ├── 📄 app.ts
├── 📂 start
│   └── 📄 routes.ts
├── 📂 tests
    └── 📂 functional
        └── 📄 quote.spec.ts
```
## Key files

These are custom files built on top of AdonisJS [API starter kit](https://docs.adonisjs.com/guides/getting-started/installation#api-starter-kit)

📂 controllers/http

- [**`quote_controller.ts`**](app/controllers/http/quote_controller.ts): The main controller for handling `/quote` requests. It validates the request, interacts with the exchange rate service, applies the rounding policy, and leverages the LRU cache for performance.

📂 services/

- [**`exchange_rate_service.ts`**](app/services/exchange_rate_service.ts): This service handles the communication with the third-party ExchangeRate-API. It fetches the latest exchange rates for the supported currencies.

📂 utils/

- [**`lru_cache.ts`**](app/utils/lru_cache.ts): Implements a LRU Cache to store exchange rates. This cache minimizes external API calls, reducing costs and improving response times.
- [**`rounding_policy.ts`**](app/utils/rounding_policy.ts): Provides utility functions to handle various rounding policies, such as rounding up, down etc.
- [**`quote_validator.ts`**](app/utils/quote_validator.ts): Uses Zod for validating incoming requests, ensuring that only valid currency codes and amounts are processed.

## Quick Start

1. **Clone the repository:**

```bash
git clone https://github.com/barelief/currency-exchange-api.git
cd currency-exchange-api
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**
   
1. copy `.env.example` to `.env`
2. Setup system variables in `config/app.ts` file in the project root:

```bash
export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'ILS'] as const
export const cacheCapacity = 10
```

4. **Run the server:**

Start HTTP development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3333`.
## API Endpoints

### `GET /quote`

Retrieve a currency conversion quote with real-time exchange rates.

#### Query Parameters:

| Name            | Type    | Description                            |
| --------------- | ------- | -------------------------------------- |
| `baseCurrency`  | String  | 3-letter ISO currency code (e.g., USD) |
| `quoteCurrency` | String  | 3-letter ISO currency code (e.g., EUR) |
| `baseAmount`    | Integer | Amount in cents (e.g., 100 for 1 USD)  |
#### Example:

```bash
GET /quote?baseCurrency=USD&quoteCurrency=EUR&baseAmount=100
```
#### Response:

```json
{
  "exchangeRate": 0.843,
  "quoteAmount": 84
}
```

### `GET /debug`

This debug endpoint provides a detailed response for a currency conversion request, including exchange rate, quote amount, and additional debugging information such as raw amounts, rounding policy, and cache usage. This route offers insight into how the API processes the conversion.
#### Example Request:

```bash
GET /debug?baseCurrency=ILS&quoteCurrency=USD&baseAmount=1234
```
#### Example Response:

```json
{
  "exchangeRate": 0.262,
  "quoteAmount": 324,
  "debugInfo": {
      "rawQuoteAmount": 323.8845144356955,
      "roundingPolicy": "roundHalfEven",
      "responseTime": "612ms",
      "cached": false,
      "totalRequests": 4
  },
  "cacheInfo": {
      "size": 4,
      "capacity": 5,
      "utilizationPercentage": 80,
      "mostRecentlyCached": "ILS-USD",
      "leastRecentlyCached": "EUR-GBP",
      "cacheOrder": [
          "ILS-USD",
          "USD-GBP",
          "GBP-EUR",
          "EUR-GBP"
      ]
  }
}
```

## Testing

To run tests for the project, use the following command:

```bash
npm run test
```
or 
```
node ace test
```

To add a new test:

```
node ace make:test testname
```

## Author

Bartosh Polonski [https://github.com/barelief](https://github.com/barelief)
