import { useEffect, useState, useMemo } from 'react';
import { CryptoItem } from '../types';

interface useCryptoTableOutput {
  lastSyncedAt: string;
  isLoading: boolean;
  cryptoListInfo: CryptoItem[];
  tableFields: { id: string; name: string }[];
  sortConfig: { sortKey: string; isDesc: boolean } | null;
  handleSort: (key: string) => void;
}

const ONE_MINUTE_IN_MS = 60 * 1000

const TABLE_FIELDS = [
  { id: 'rank', name: '#', },
  { id: 'name', name: 'Name', },
  { id: 'price', name: 'Price', },
  { id: '1h', name: '1h %', },
  { id: '24h', name: '24h %', },
  { id: '7d', name: '7d %', },
  { id: 'market_cap', name: 'Market Cap', },
  { id: 'volume_24h', name: 'Volume (24h)', },
  { id: 'circulating_supply', name: 'Circulating Supply', },
]

export const useCryptoTable = (): useCryptoTableOutput => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [lastSyncedAt, setLastSyncedAt] = useState<string>('')
  const [cryptoListInfo, setCryptoListInfo] = useState<CryptoItem[]>([])
  const [sortConfig, setSortConfig] = useState<{ sortKey: string; isDesc: boolean } | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    const response = await fetch('/api/crypto')
    const data = await response.json()
    setLastSyncedAt(new Date().toLocaleTimeString())
    setIsLoading(false)
    setCryptoListInfo(data)
  }

  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev?.sortKey === key) {
        return {
          sortKey: key,
          isDesc: !prev.isDesc,
        }
      }
      return {
        sortKey: key,
        isDesc: false,
      }
    })
  }

  useEffect(function refetchDataEveryMinute() {
    const interval = setInterval(() => {
      fetchData()
    }, ONE_MINUTE_IN_MS)
    return () => clearInterval(interval)
  }, [])

  useEffect(function initializeData() {
    fetchData()
  }, [])

  const sortedCryptoListInfo = useMemo(() => {
    if (!sortConfig) return cryptoListInfo

    const { sortKey, isDesc } = sortConfig

    const sortedCryptoListInfo = [...cryptoListInfo]

    sortedCryptoListInfo.sort((a, b) => {
        if (sortKey === 'name') {
          return isDesc ?  a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }
      
        if (sortKey === 'rank') {
          return isDesc ?  a.cmc_rank - b.cmc_rank : b.cmc_rank - a.cmc_rank;
        }
       
        if (sortKey === 'price') {
          return isDesc ?  a.quote.USD.price - b.quote.USD.price : b.quote.USD.price - a.quote.USD.price;
        }
        if (sortKey === '1h') {
          return isDesc ?  a.quote.USD.percent_change_1h - b.quote.USD.percent_change_1h : b.quote.USD.percent_change_1h - a.quote.USD.percent_change_1h;
        }
        if (sortKey === '24h') {
          return isDesc ?  a.quote.USD.percent_change_24h - b.quote.USD.percent_change_24h : b.quote.USD.percent_change_24h - a.quote.USD.percent_change_24h;
        }
        if (sortKey === '7d') {
          return isDesc ?  a.quote.USD.percent_change_7d - b.quote.USD.percent_change_7d : b.quote.USD.percent_change_7d - a.quote.USD.percent_change_7d;
        }
        if (sortKey === 'market_cap') {
          return isDesc ?  a.quote.USD.market_cap - b.quote.USD.market_cap : b.quote.USD.market_cap - a.quote.USD.market_cap;
        }
        if (sortKey === 'volume_24h') {
          return isDesc ?  a.quote.USD.volume_24h - b.quote.USD.volume_24h : b.quote.USD.volume_24h - a.quote.USD.volume_24h;
        }
        if (sortKey === 'circulating_supply') {
          return isDesc ?  a.circulating_supply - b.circulating_supply : b.circulating_supply - a.circulating_supply;
        }
      return 0
    })
    return sortedCryptoListInfo
  }, [cryptoListInfo, sortConfig])
      
 
  return {
    lastSyncedAt,
    isLoading,
    cryptoListInfo: sortedCryptoListInfo,
    tableFields: TABLE_FIELDS,
    sortConfig,
    handleSort,
  }
}