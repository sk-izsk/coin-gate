import * as React from 'react'
import { fetcher } from '@/api/coinGecko.api'
import { CoinsPagination } from '@/components/CoinPagination'
import { DataTable } from '@/components/DataTable'
import { PendingNavigationBoundary } from '@/components/navigation/PendingNavigationBoundary'
import { useCoinTableColumn } from '../../hooks/useCoinTableColumn'

const Coins: React.FC<NextPageProps> = async ({ searchParams }) => {
  const { page } = await searchParams

  const currentPage = Number(page) || 1
  const perPage = 10

  const coinsData = await fetcher<CoinMarketData[]>('/coins/markets', {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: perPage,
    page: currentPage,
    sparkline: 'false',
    price_change_percentage: '24h',
  })

  const columns = useCoinTableColumn()

  const hasMorePages = coinsData.length === perPage

  const estimatedTotalPages = currentPage >= 100 ? Math.ceil(currentPage / 100) * 100 + 100 : 100

  return (
    <main id="coins-page">
      <div className="content">
        <h4>All Coins</h4>

        <PendingNavigationBoundary
          className="space-y-4"
          overlayLabel="Loading more coins..."
          overlayClassName="rounded-2xl"
        >
          <DataTable
            tableClassName="coins-table"
            columns={columns}
            data={coinsData}
            rowKey={(coin) => coin.id}
          />

          <CoinsPagination
            currentPage={currentPage}
            totalPages={estimatedTotalPages}
            hasMorePages={hasMorePages}
          />
        </PendingNavigationBoundary>
      </div>
    </main>
  )
}

export default Coins
