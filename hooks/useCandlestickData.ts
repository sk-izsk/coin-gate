'use client'

import { useState, useTransition } from 'react'

import { fetcher } from '../api/coinGecko.api'
import { PERIOD_CONFIG } from '../constant'

interface UseCandlestickDataProps {
  coinId: string
  data?: OHLCData[]
  initialPeriod?: Period
}

export const useCandlestickData = ({
  coinId,
  data,
  initialPeriod = 'daily',
}: UseCandlestickDataProps) => {
  const [period, setPeriod] = useState<Period>(initialPeriod)
  const [ohlcData, setOhlcData] = useState<OHLCData[]>(() => data ?? [])
  const [isPending, startTransition] = useTransition()

  const fetchOHLCData = async (selectedPeriod: Period) => {
    try {
      const { days } = PERIOD_CONFIG[selectedPeriod]

      const newData = await fetcher<OHLCData[]>(`/coins/${coinId}/ohlc`, {
        vs_currency: 'usd',
        days,
        precision: 'full',
      })

      startTransition(() => {
        setOhlcData(newData ?? [])
      })
    } catch (error) {
      console.error('Failed to fetch OHLCData', error)
    }
  }

  const handlePeriodChange = (nextPeriod: Period) => {
    if (nextPeriod === period) {
      return
    }

    setPeriod(nextPeriod)
    fetchOHLCData(nextPeriod)
  }

  return {
    period,
    ohlcData,
    isPending,
    handlePeriodChange,
  }
}
