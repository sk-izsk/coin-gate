import { cn, formatCurrency, formatPercentage } from '../utils/utils'
import Image from 'next/image'

import { PendingNavigationLink } from '../components/navigation/PendingNavigationLink'

export const useCoinTableColumn = () => {
  const columns: DataTableColumn<CoinMarketData>[] = [
    {
      header: 'Rank',
      cellClassName: 'rank-cell',
      cell: (coin) => `#${coin.market_cap_rank}`,
    },
    {
      header: 'Token',
      cellClassName: 'token-cell',
      cell: (coin) => (
        <PendingNavigationLink href={`/coins/${coin.id}`} className="token-info">
          <Image src={coin.image} alt={coin.name} width={36} height={36} />
          <p>
            {coin.name} ({coin.symbol.toUpperCase()})
          </p>
        </PendingNavigationLink>
      ),
    },
    {
      header: 'Price',
      cellClassName: 'price-cell',
      cell: (coin) => formatCurrency({ value: coin.current_price }),
    },
    {
      header: '24h Change',
      cellClassName: 'change-cell',
      cell: (coin) => {
        const isTrendingUp = coin.price_change_percentage_24h > 0

        return (
          <span
            className={cn('change-value', {
              'text-green-600': isTrendingUp,
              'text-red-500': !isTrendingUp,
            })}
          >
            {isTrendingUp && '+'}
            {formatPercentage(coin.price_change_percentage_24h)}
          </span>
        )
      },
    },
    {
      header: 'Market Cap',
      cellClassName: 'market-cap-cell',
      cell: (coin) => formatCurrency({ value: coin.market_cap }),
    },
  ]

  return columns
}
