import { convertOHLCData } from './utils'

export const convertOhlcDataToUnixSeconds = (data: OHLCData[]): OHLCData[] => {
  return data.map((item) => [Math.floor(item[0] / 1000), item[1], item[2], item[3], item[4]])
}

export const mergeOhlcWithLiveOhlcv = (
  historicalData: OHLCData[],
  liveOhlcv: OHLCData | null,
): OHLCData[] => {
  const historicalDataInSeconds = convertOhlcDataToUnixSeconds(historicalData)

  if (!liveOhlcv) {
    return historicalDataInSeconds
  }

  const lastHistoricalCandle = historicalDataInSeconds[historicalDataInSeconds.length - 1]

  const mergedData =
    lastHistoricalCandle && lastHistoricalCandle[0] === liveOhlcv[0]
      ? [...historicalDataInSeconds.slice(0, -1), liveOhlcv]
      : [...historicalDataInSeconds, liveOhlcv]

  return mergedData.sort((left, right) => left[0] - right[0])
}

export const buildCandlestickSeriesData = (data: OHLCData[]) => {
  return convertOHLCData(data)
}
