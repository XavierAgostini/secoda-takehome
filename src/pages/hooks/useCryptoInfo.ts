import { useEffect, useState } from 'react';
import { CryptoItem } from '../types';

interface UseCryptoInfoOutput {
  lastSyncedAt: string;
  isLoading: boolean;
  cryptoListInfo: CryptoItem[];
}

export const useCryptoInfo = (): UseCryptoInfoOutput => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [lastSyncedAt, setLastSyncedAt] = useState<string>('')
  const [cryptoListInfo, setCryptoListInfo] = useState<CryptoItem[]>([])

  const fetchData = async () => {
    setIsLoading(true)
    const response = await fetch('/api/crypto')
    const data = await response.json()
    setLastSyncedAt(new Date().toLocaleTimeString())
    setIsLoading(false)
    setCryptoListInfo(data)
  }

  useEffect(function refetchDataEveryMinute() {
    const interval = setInterval(() => {
      fetchData()
    }, 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(function initializeData() {
    fetchData()
  }, [])

 
  return {
    lastSyncedAt,
    isLoading,
    cryptoListInfo,
  }
}