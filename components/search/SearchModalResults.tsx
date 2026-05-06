'use client'

import { cn, formatCurrency, formatPercentage } from '@/utils/utils'
import { TrendingDown, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import type { SearchResultItem } from '../../hooks/useSearchResults'

interface SearchModalResultsProps {
  emptyLabel: string
  itemRefs: React.RefObject<Array<HTMLAnchorElement | null>>
  items: SearchResultItem[]
  selectedIndex: number
  onClose: () => void
  onHoverItem: (index: number) => void
}

export const SearchModalResults = ({
  emptyLabel,
  itemRefs,
  items,
  selectedIndex,
  onClose,
  onHoverItem,
}: SearchModalResultsProps) => {
  if (!items.length) {
    return (
      <div className="search-results">
        <p className="empty">{emptyLabel}</p>
      </div>
    )
  }

  return (
    <div className="search-results">
      {items.map((coin, index) => {
        const change = coin.priceChange24h ?? 0
        const isUp = change >= 0

        return (
          <Link
            key={coin.id}
            href={`/coins/${coin.id}`}
            ref={(element) => {
              itemRefs.current[index] = element
            }}
            className={cn('search-item', {
              'is-selected': index === selectedIndex,
            })}
            aria-selected={index === selectedIndex}
            onClick={onClose}
            onMouseEnter={() => onHoverItem(index)}
            onFocus={() => onHoverItem(index)}
          >
            <div className="coin-info">
              <Image src={coin.image} alt={coin.name} width={36} height={36} />
              <div>
                <strong>{coin.name}</strong>
                <span className="coin-symbol">{coin.symbol}</span>
              </div>
            </div>

            <div className="coin-price">
              {coin.price === null ? '-' : formatCurrency({ value: coin.price })}
            </div>

            <div
              className={cn('coin-change', {
                'text-green-500': isUp,
                'text-red-500': !isUp,
              })}
            >
              {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{coin.priceChange24h === null ? '-' : formatPercentage(change)}</span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
