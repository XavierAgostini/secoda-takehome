import { useState, useEffect } from "react"
import { CryptoItem } from "./types"
import { Table } from '@mantine/core';

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
              <td>{coin.name}</td>
              <td>${coin.quote.USD.price}</td>
              <td>{coin.quote.USD.percent_change_1h}%</td>
              <td>{coin.quote.USD.percent_change_24h}%</td>
              <td>{coin.quote.USD.percent_change_24h}%</td>
              <td>${coin.quote.USD.market_cap}</td>
              <td>${coin.quote.USD.volume_24h}</td>
              <td>{coin.circulating_supply}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}