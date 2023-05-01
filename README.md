# Top 10 Cryptocurrency App
This app fetches the current Top 10 Cryptocurrencies and displays their details in a user friendly table. Every 60 seconds the data is refetched. Click on any column to sort in descending or ascending order. Click on the crypto coin name to go to the CoinMarketCap page for more detailed information on the crypto currency.

## Getting Started

This app uses the [CoinMarketCap API](https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyListingsLatest) to fetch the current crypto market data. To run this app you will need to create a `.env` file with the your CoinMarketCap API key added as key `COINMARKETCAP_API_KEY`.

First, run the development server:

```bash

npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack
- NextJS 13
- React
- Typescript
- Tailwind.css
- [Mantine](https://mantine.dev/) 
- [Tabler Icons](https://tabler-icons.io/)


