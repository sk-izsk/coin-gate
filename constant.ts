import {
  CandlestickSeriesPartialOptions,
  ChartOptions,
  ColorType,
  DeepPartial,
} from 'lightweight-charts'

export const navItems = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Search',
    href: '/',
  },
  {
    label: 'All Coins',
    href: '/coins',
  },
]

const getChartColors = (isDark: boolean) => ({
  background: isDark ? '#0b1116' : '#ffffff',
  text: isDark ? '#8f9fb1' : '#475569',
  grid: isDark ? '#1a2332' : '#f1f5f9',
  border: isDark ? '#1a2332' : '#e2e8f0',
  crosshairVertical: isDark ? '#ffffff40' : '#00000040',
  crosshairHorizontal: isDark ? '#ffffff20' : '#00000020',
  candleUp: '#158A6E',
  candleDown: '#EB1C36',
})

export const getCandlestickConfig = (isDark: boolean): CandlestickSeriesPartialOptions => {
  const colors = getChartColors(isDark)
  return {
    upColor: colors.candleUp,
    downColor: colors.candleDown,
    wickUpColor: colors.candleUp,
    wickDownColor: colors.candleDown,
    borderVisible: true,
    wickVisible: true,
  }
}

export const getChartConfig = (
  height: number,
  isDark: boolean,
  timeVisible: boolean = true,
): DeepPartial<ChartOptions> => {
  const colors = getChartColors(isDark)
  return {
    width: 0,
    height,
    layout: {
      background: { type: ColorType.Solid, color: colors.background },
      textColor: colors.text,
      fontSize: 12,
      fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial',
    },
    grid: {
      vertLines: { visible: false },
      horzLines: {
        visible: true,
        color: colors.grid,
        style: 2,
      },
    },
    rightPriceScale: {
      borderColor: colors.border,
    },
    timeScale: {
      borderColor: colors.border,
      timeVisible,
      secondsVisible: false,
    },
    handleScroll: true,
    handleScale: true,
    crosshair: {
      mode: 1,
      vertLine: {
        visible: true,
        color: colors.crosshairVertical,
        width: 1,
        style: 0,
      },
      horzLine: {
        visible: true,
        color: colors.crosshairHorizontal,
        width: 1,
        style: 0,
      },
    },
    localization: {
      priceFormatter: (price: number) =>
        '$' + price.toLocaleString(undefined, { maximumFractionDigits: 2 }),
    },
  }
}

export const PERIOD_CONFIG: Record<Period, { days: number | string }> = {
  daily: { days: 1 },
  weekly: { days: 7 },
  monthly: { days: 30 },
  '3months': { days: 90 },
  '6months': { days: 180 },
  yearly: { days: 365 },
  max: { days: 'max' },
}

export const PERIOD_BUTTONS: { value: Period; label: string }[] = [
  { value: 'daily', label: '1D' },
  { value: 'weekly', label: '1W' },
  { value: 'monthly', label: '1M' },
  { value: '3months', label: '3M' },
  { value: '6months', label: '6M' },
  { value: 'yearly', label: '1Y' },
  { value: 'max', label: 'Max' },
]

export const LIVE_INTERVAL_BUTTONS: { value: '1s' | '1m'; label: string }[] = [
  { value: '1s', label: '1s' },
  { value: '1m', label: '1m' },
]
