'use client'

import { RefObject, useEffect, useRef } from 'react'

import { IChartApi, ISeriesApi } from 'lightweight-charts'

import { buildCandlestickSeriesData, mergeOhlcWithLiveOhlcv } from '../utils/candlestick'

interface UseCandlestickSeriesProps {
  chartRef: RefObject<IChartApi | null>
  candleSeriesRef: RefObject<ISeriesApi<'Candlestick'> | null>
  ohlcData: OHLCData[]
  liveOhlcv: OHLCData | null
  mode: 'historical' | 'live'
}

export const useCandlestickSeries = ({
  chartRef,
  candleSeriesRef,
  ohlcData,
  liveOhlcv,
  mode,
}: UseCandlestickSeriesProps) => {
  const prevOhlcDataLength = useRef(ohlcData.length)

  useEffect(() => {
    const series = candleSeriesRef.current
    if (!series) {
      return
    }

    const mergedData = mergeOhlcWithLiveOhlcv(ohlcData, liveOhlcv)
    series.setData(buildCandlestickSeriesData(mergedData))

    const dataChanged = prevOhlcDataLength.current !== ohlcData.length

    if (dataChanged || mode === 'historical') {
      chartRef.current?.timeScale().fitContent()
      prevOhlcDataLength.current = ohlcData.length
    }
  }, [candleSeriesRef, chartRef, liveOhlcv, mode, ohlcData])
}
