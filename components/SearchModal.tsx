'use client'

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn, formatCurrency, formatPercentage } from '@/lib/utils'
import { Search, TrendingDown, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'

type SearchResultItem = {
  id: string
  name: string
  symbol: string
  image: string
  price: number | null
  priceChange24h: number | null
}

type SearchState =
  | { status: 'idle'; items: SearchResultItem[] }
  | { status: 'loading'; items: SearchResultItem[] }
  | { status: 'success'; items: SearchResultItem[] }
  | { status: 'error'; items: SearchResultItem[] }

const INITIAL_STATE: SearchState = { status: 'idle', items: [] }

export const SearchModal = () => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [searchState, setSearchState] = useState<SearchState>(INITIAL_STATE)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeydown)

    return () => window.removeEventListener('keydown', handleKeydown)
  }, [])

  useEffect(() => {
    if (!open) return

    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus()
    })

    return () => window.cancelAnimationFrame(frame)
  }, [open])

  useEffect(() => {
    if (!open) return

    const controller = new AbortController()
    const timeoutId = window.setTimeout(
      async () => {
        setSearchState((current) => ({
          status: 'loading',
          items: current.items,
        }))

        try {
          const params = new URLSearchParams()
          if (query.trim()) {
            params.set('q', query.trim())
          }

          const response = await fetch(`/api/search?${params.toString()}`, {
            signal: controller.signal,
          })

          if (!response.ok) {
            throw new Error(`Search failed: ${response.status}`)
          }

          const data = (await response.json()) as { items: SearchResultItem[] }

          setSearchState({
            status: 'success',
            items: data.items,
          })
        } catch {
          if (controller.signal.aborted) return

          setSearchState((current) => ({
            status: 'error',
            items: current.items,
          }))
        }
      },
      query.trim() ? 180 : 0,
    )

    return () => {
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [open, query])

  useEffect(() => {
    if (!open) {
      setQuery('')
      setSearchState(INITIAL_STATE)
      setSelectedIndex(-1)
    }
  }, [open])

  useEffect(() => {
    if (!searchState.items.length) {
      setSelectedIndex(-1)
      return
    }

    setSelectedIndex((current) => {
      if (current < 0) return 0
      if (current >= searchState.items.length) return searchState.items.length - 1
      return current
    })
  }, [searchState.items])

  useEffect(() => {
    if (selectedIndex < 0) return

    itemRefs.current[selectedIndex]?.scrollIntoView({
      block: 'nearest',
    })
  }, [selectedIndex])

  const handleSelect = (coinId: string) => {
    setOpen(false)
    router.push(`/coins/${coinId}`)
  }

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (!searchState.items.length) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setSelectedIndex((current) => (current + 1) % searchState.items.length)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setSelectedIndex((current) =>
        current <= 0 ? searchState.items.length - 1 : current - 1,
      )
      return
    }

    if (event.key === 'Enter' && selectedIndex >= 0) {
      event.preventDefault()
      handleSelect(searchState.items[selectedIndex].id)
    }
  }

  const emptyLabel = useMemo(() => {
    if (searchState.status === 'loading') return 'Searching...'
    if (query.trim()) return 'No coins found.'
    return 'No trending coins available.'
  }, [query, searchState.status])

  return (
    <div id="search-modal">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={<button type="button" className="trigger" aria-label="Open search" />}
        >
          <Search size={18} className="md:mr-2 text-purple-100/70" />
          <span className="trigger-label">Search for a token</span>
          <span className="kbd">Cmd K</span>
        </DialogTrigger>

        <DialogContent className="dialog" showCloseButton={false}>
          <DialogTitle className="sr-only">Search coins</DialogTitle>

          <div className="search-shell">
            <div className="search-head">
              <div className="cmd-input">
                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Search for a token by name or symbol..."
                  className="search-input"
                />
              </div>
            </div>

            <div className="results-pane">
              {searchState.items.length ? (
                <div className="search-results">
                  {searchState.items.map((coin, index) => {
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
                        onClick={() => setOpen(false)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        onFocus={() => setSelectedIndex(index)}
                      >
                        <div className="coin-info">
                          <Image src={coin.image} alt={coin.name} width={36} height={36} />
                          <div>
                            <strong>{coin.name}</strong>
                            <span className="coin-symbol">{coin.symbol}</span>
                          </div>
                        </div>

                        <div className="coin-price">
                          {coin.price === null ? '-' : formatCurrency(coin.price)}
                        </div>

                        <div
                          className={cn('coin-change', {
                            'text-green-500': isUp,
                            'text-red-500': !isUp,
                          })}
                        >
                          {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          <span>
                            {coin.priceChange24h === null ? '-' : formatPercentage(change)}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="search-results">
                  <p className="empty">{emptyLabel}</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
