'use client'

import { useEffect, useMemo, useState } from 'react'

import { useDebouncedValue } from './useDebouncedValue'

export type SearchResultItem = {
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

interface UseSearchResultsProps {
  open: boolean
}

export const useSearchResults = ({ open }: UseSearchResultsProps) => {
  const [query, setQuery] = useState('')
  const [searchState, setSearchState] = useState<SearchState>(INITIAL_STATE)
  const trimmedQuery = query.trim()
  const debouncedQuery = useDebouncedValue(trimmedQuery, 500)

  useEffect(() => {
    if (!open) {
      return
    }

    const controller = new AbortController()

    const fetchResults = async () => {
      setSearchState((current) => ({
        status: 'loading',
        items: current.items,
      }))

      try {
        const params = new URLSearchParams()
        if (debouncedQuery) {
          params.set('q', debouncedQuery)
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
        if (controller.signal.aborted) {
          return
        }

        setSearchState((current) => ({
          status: 'error',
          items: current.items,
        }))
      }
    }

    fetchResults()

    return () => {
      controller.abort()
    }
  }, [debouncedQuery, open])

  useEffect(() => {
    if (open) {
      return
    }

    setQuery('')
    setSearchState(INITIAL_STATE)
  }, [open])

  const emptyLabel = useMemo(() => {
    if (searchState.status === 'loading') {
      return 'Searching...'
    }
    if (trimmedQuery) {
      return 'No coins found.'
    }

    return 'No trending coins available.'
  }, [searchState.status, trimmedQuery])

  return {
    emptyLabel,
    query,
    searchState,
    setQuery,
  }
}
