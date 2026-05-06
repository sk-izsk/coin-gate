'use client'

import { useRef } from 'react'

import { useTheme } from 'next-themes'
import { useCandlestickChart } from '../hooks/useCandlestickChart'
import { useCandlestickData } from '../hooks/useCandlestickData'
import { useCandlestickSeries } from '../hooks/useCandlestickSeries'
import { LIVE_INTERVAL_BUTTONS, PERIOD_BUTTONS } from '../constant'

export const CandleStickChart = ({
  children,
  data,
  coinId,
  height = 360,
  initialPeriod = 'daily',
  liveOhlcv = null,
  mode = 'historical',
  liveInterval,
  setLiveInterval,
}: CandlestickChartProps) => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const chartContainerRef = useRef<HTMLDivElement | null>(null)
  const { period, ohlcData, isPending, handlePeriodChange } = useCandlestickData({
    coinId,
    data,
    initialPeriod,
  })
  const { chartRef, candleSeriesRef } = useCandlestickChart({
    containerRef: chartContainerRef,
    height,
    isDark,
    period,
  })

  useCandlestickSeries({
    chartRef,
    candleSeriesRef,
    ohlcData,
    liveOhlcv,
    mode,
  })

  return (
    <div id="candlestick-chart">
      <div className="chart-header">
        <div className="flex-1">{children}</div>

        <div className="button-group">
          <span className="text-sm mr-1 font-medium text-purple-100/50">Period:</span>
          {PERIOD_BUTTONS.map(({ value, label }) => (
            <button
              key={value}
              className={period === value ? 'config-button-active' : 'config-button'}
              onClick={() => handlePeriodChange(value)}
              disabled={isPending}
            >
              {label}
            </button>
          ))}
        </div>

        {liveInterval && (
          <div className="button-group">
            <span className="text-sm mr-1 font-medium text-purple-100/50">Update Frequency:</span>
            {LIVE_INTERVAL_BUTTONS.map(({ value, label }) => (
              <button
                key={value}
                className={liveInterval === value ? 'config-button-active' : 'config-button'}
                onClick={() => setLiveInterval && setLiveInterval(value)}
                disabled={isPending}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div ref={chartContainerRef} className="chart" style={{ height }} />
    </div>
  )
}
