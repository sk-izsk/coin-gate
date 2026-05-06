import { fetcher } from '@/lib/coinGecko.action'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.trim() ?? ''

  try {
    if (!query) {
      const trending = await fetcher<{ coins: TrendingCoin[] }>('/search/trending', undefined, 300)

      const items = trending.coins.slice(0, 8).map((coin) => ({
        id: coin.item.id,
        name: coin.item.name,
        symbol: coin.item.symbol,
        image: coin.item.large,
        price: coin.item.data.price,
        priceChange24h: coin.item.data.price_change_percentage_24h.usd,
      }))

      return Response.json({ items })
    }

    const searchResults = await fetcher<{
      coins: Array<{
        id: string
        name: string
        symbol: string
        large: string
        market_cap_rank: number | null
      }>
    }>('/search', { query }, 120)

    const matchedCoins = searchResults.coins
      .sort((a, b) => (a.market_cap_rank ?? Number.MAX_SAFE_INTEGER) - (b.market_cap_rank ?? Number.MAX_SAFE_INTEGER))
      .slice(0, 8)

    if (!matchedCoins.length) {
      return Response.json({ items: [] })
    }

    const marketData = await fetcher<CoinMarketData[]>('/coins/markets', {
      vs_currency: 'usd',
      ids: matchedCoins.map((coin) => coin.id).join(','),
      order: 'market_cap_desc',
      per_page: matchedCoins.length,
      page: 1,
      sparkline: 'false',
      price_change_percentage: '24h',
    })

    const marketById = new Map(marketData.map((coin) => [coin.id, coin]))

    const items = matchedCoins.map((coin) => {
      const market = marketById.get(coin.id)

      return {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: market?.image ?? coin.large,
        price: market?.current_price ?? null,
        priceChange24h: market?.price_change_percentage_24h ?? null,
      }
    })

    return Response.json({ items })
  } catch (error) {
    console.error('Error fetching search results:', error)
    return Response.json({ items: [] }, { status: 200 })
  }
}
