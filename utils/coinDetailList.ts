import { formatCurrency } from './utils'

export const coinDetailList = (coinData: CoinDetailsData) => {
  return [
    {
      label: 'Market Cap',
      value: formatCurrency({ value: coinData.market_data.market_cap.usd }),
    },
    {
      label: 'Market Cap Rank',
      value: `# ${coinData.market_cap_rank}`,
    },
    {
      label: 'Total Volume',
      value: formatCurrency({ value: coinData.market_data.total_volume.usd }),
    },
    {
      label: 'Website',
      value: '-',
      link: coinData.links.homepage[0],
      linkText: 'Homepage',
    },
    {
      label: 'Explorer',
      value: '-',
      link: coinData.links.blockchain_site[0],
      linkText: 'Explorer',
    },
    {
      label: 'Community',
      value: '-',
      link: coinData.links.subreddit_url,
      linkText: 'Community',
    },
  ]
}
