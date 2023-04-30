// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { CryptoItem } from '../types'
type Data = {
  data: CryptoItem[]
}

// GET /api/crypto
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const coinMarketDataRequest = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=10', {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY || '',
      }
    })
    const { data } = await coinMarketDataRequest.json()
    return res.status(200).json(data)
  } catch (error: any) {
    console.error("Error going GET /crypto", error)
    return res.status(400).send(error.message)
  }
}
