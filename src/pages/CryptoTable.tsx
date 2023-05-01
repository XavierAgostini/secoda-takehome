'use client'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Table } from '@mantine/core';
import Icon from './components/Icon';
import { useCryptoInfo } from "./hooks/useCryptoInfo";

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
      <Icon name={isPositive ? 'arrow-up' : 'arrow-down'} color={color} size={12}/>
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

const TableFields = [
  '#', 'Name', 'Price', '1h %', '24h %', '7d %', 'Market Cap', 'Volume (24h)', 'Circulating Supply'
]
export default function CryptoTable() {
  const { isLoading, cryptoListInfo, lastSyncedAt } = useCryptoInfo()
  if (isLoading) {
    return (
      <Table>
        <thead>
          <tr>
            { 
              TableFields.map((field) => (
                <th key={field}>{field}</th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {Array(10).fill(0).map((_, index) => (
            <tr key={index} className="">
              {Array(TableFields.length).fill(0).map((_, index) => (
                <td key={index}><Skeleton /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    )
  }

  return (
    <div>
      <p>Last synced at: {lastSyncedAt}</p>
      <Table>
        <thead>
          <tr>
            { 
              TableFields.map((field) => (
                <th key={field}>{field}</th>
              ))
            }
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