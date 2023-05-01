'use client'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Table } from '@mantine/core';
import Icon from './components/Icon';
import { useCryptoTable } from "./hooks/useCryptoTable";
import Link from 'next/link';

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


export default function CryptoTable() {
  const { isLoading, cryptoListInfo, lastSyncedAt, tableFields, sortConfig, handleSort } = useCryptoTable()
  if (isLoading && !cryptoListInfo.length) {
    return (
      <Table>
        <thead>
          <tr>
            { 
              tableFields.map(({ id, name }) => (
                <th key={id}>{name}</th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {Array(10).fill(0).map((_, index) => (
            <tr key={index} className="">
              {Array(tableFields.length).fill(0).map((_, index) => (
                <td key={index}><Skeleton /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    )
  }

  return (
    <Table highlightOnHover horizontalSpacing='md'>
      <thead>
        <tr>
          { 
            tableFields.map(({ id, name }) => (
              <th key={id} onClick={() => handleSort(id)}>
                <div className={`flex items-center gap-2 cursor-pointer ${id == '24h' || id == '7d' ? 'min-w-[66px]': 'min-w-fit'}`}>
                  <span>{name}</span>
                  {sortConfig?.sortKey === id ? (
                    <Icon name={sortConfig.isDesc? 'arrow-up' : 'arrow-down'} size={12} />) : <div style={{width: 12, height: 12, background: 'transparent'}}/>}
                </div>
              </th>
            ))
          }
        </tr>
      </thead>
      <tbody>
        {cryptoListInfo.map((coin: any) => (
          <tr key={coin.id} className="">
            <td>{coin.cmc_rank}</td>
            <td>
              <Link href={`https://coinmarketcap.com/currencies/${coin.slug}`} target="_blank">
                <div className="inline-flex gap-1">
                <Icon name={coin.slug} />
                <strong>{coin.name}</strong>
                <span className="text-gray-500">({coin.symbol})</span>
                </div>
              </Link>
            </td>
            <td>{currencyFormatter(coin.quote.USD.price)}</td>
            <td>
              <PercentItem value={coin.quote.USD.percent_change_1h} />
            </td>
            <td>
              <PercentItem value={coin.quote.USD.percent_change_24h} />
            </td>
            <td>
              <PercentItem value={coin.quote.USD.percent_change_7d} />
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
      <caption>
        <p>Last synced at: {lastSyncedAt}</p>
      </caption>
    </Table>
  )
}