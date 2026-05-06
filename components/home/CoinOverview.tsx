import * as React from 'react'

import { fetcher } from '@/api/coinGecko.api'
import { formatCurrency } from '@/utils/utils'
import Image from 'next/image'
import { CandleStickChart } from '../CandleStickChart'
import { CoinOverviewFallback } from './Fallback'

const CoinOverview: React.FC = async () => {
  try {
    const [coin, coinOHLCData] = await Promise.all([
      fetcher<CoinDetailsData>('/coins/bitcoin', {
        dex_pair_format: 'symbol',
      }),
      fetcher<OHLCData[]>('/coins/bitcoin/ohlc', {
        vs_currency: 'usd',
        days: 1,
        precision: 'full',
      }),
    ])

    return (
      <div id="coin-overview">
        <CandleStickChart data={coinOHLCData} coinId="bitcoin">
          <div className="header pt-2">
            <Image src={coin.image.large} alt={coin.name} width={56} height={56} />
            <div className="info">
              <p>
                {coin.name} / {coin.symbol.toUpperCase()}
              </p>
              <h1>{formatCurrency({ value: coin.market_data.current_price.usd })}</h1>
            </div>
          </div>
        </CandleStickChart>
      </div>
    )
  } catch (error) {
    console.error('Error fetching coin overview:', error)
    return <CoinOverviewFallback />
  }
}

export default CoinOverview
