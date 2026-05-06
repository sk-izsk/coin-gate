'use client'

import { RefObject, useEffect, useRef } from 'react'

import { CandlestickSeries, createChart, IChartApi, ISeriesApi } from 'lightweight-charts'

import { getCandlestickConfig, getChartConfig } from '../constant'

interface UseCandlestickChartProps {
  containerRef: RefObject<HTMLDivElement | null>
  height: number
  isDark: boolean
  period: Period
}

const PERIODS_WITH_TIME_SCALE: Period[] = ['daily', 'weekly', 'monthly']

export const useCandlestickChart = ({
  containerRef,
  height,
  isDark,
  period,
}: UseCandlestickChartProps) => {
  const chartRef = useRef<IChartApi | null>(null)
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const chart = createChart(container, {
      ...getChartConfig(height, isDark, PERIODS_WITH_TIME_SCALE.includes(period)),
      width: container.clientWidth,
    })
    const series = chart.addSeries(CandlestickSeries, getCandlestickConfig(isDark))

    chartRef.current = chart
    candleSeriesRef.current = series

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) {
        return
      }

      chart.applyOptions({ width: entry.contentRect.width })
    })

    observer.observe(container)

    return () => {
      observer.disconnect()
      chart.remove()
      chartRef.current = null
      candleSeriesRef.current = null
    }
  }, [containerRef, height, isDark, period])

  return {
    chartRef,
    candleSeriesRef,
  }
}
