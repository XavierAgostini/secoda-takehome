import { useState, useEffect } from "react"
import { CryptoItem } from "./types"
import { Table } from '@mantine/core';
import Icon from './components/Icon';

const { format: currencyFormatter} = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})


const PercentItem = ({ value }: { value: number }) => {
  const isPositive = value > 0
  const color = isPositive ? 'green' : 'red'
  const textColor = isPositive ? 'text-green-500' : 'text-red-500'

  const percentStr = `${value.toFixed(2)}%`.replace('-', '')
  return (
    <div className="flex items-center">
      <Icon name={isPositive ? 'arrow-up' : 'arrow-down'} color={isPositive ? 'green' : 'red'} size={12}/>
      <span className={textColor}>
        {percentStr}
      </span>
    </div>
  )
}

const VolumeItem = ({ volume, price, symbol }: { volume: number; price: number; symbol: string}) => {
  const volumeValue = currencyFormatter(volume)
  const volumeCoinQuantity = (Number((volume / price).toFixed(0))).toLocaleString()
  return (
    <div className="flex flex-col">
      {volumeValue}
      <span className="text-gray-500">
        {volumeCoinQuantity} {symbol}
      </span>
    </div>
  )
}

export default function CryptoTable() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [cryptoListInfo, setCryptoListInfo] = useState<CryptoItem[]>([])

  const fetchData = async () => {
    setIsLoading(true)
    const response = await fetch('/api/crypto')
    const data = await response.json()
    setIsLoading(false)
    setCryptoListInfo(data)
  }
  useEffect(function initializeTable() {
    fetchData()
  }, [])
   
  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Crypto Table</h1>
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>1h %</th>
            <th>24h %</th>
            <th>7d %</th>
            <th>Market Cap</th>
            <th>Volume (24h)</th>
            <th>Circulating Supply</th>
          </tr>
        </thead>
        <tbody>
          {cryptoListInfo.map((coin: any) => (
            <tr key={coin.id} className="">
              <td>{coin.cmc_rank}</td>
              <td>
                <div className="inline-flex gap-1">
                <Icon name={coin.slug} />
                <strong>{coin.name}</strong>
                <span className="text-gray-500">({coin.symbol})</span>
                </div>
              </td>
              <td>{currencyFormatter(coin.quote.USD.price)}</td>
              <td>
                <PercentItem value={coin.quote.USD.percent_change_1h} />
              </td>
              <td>
                <PercentItem value={coin.quote.USD.percent_change_24h} />
              </td>
              <td>
                <PercentItem value={coin.quote.USD.percent_change_24h} />
              </td>
              <td>{currencyFormatter(coin.quote.USD.market_cap)}</td>
              <td>
                <VolumeItem volume={coin.quote.USD.volume_24h} price={coin.quote.USD.price} symbol={coin.symbol} />
                
              </td>
              <td className="flex gap-1">
                {coin.circulating_supply.toLocaleString()}
                <span>{coin.symbol}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}