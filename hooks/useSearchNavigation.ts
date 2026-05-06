'use client'

import { useEffect, useRef, useState } from 'react'

import { type SearchResultItem } from './useSearchResults'

interface UseSearchNavigationProps {
  items: SearchResultItem[]
  open: boolean
  onSelect: (coinId: string) => void
}

export const useSearchNavigation = ({ items, open, onSelect }: UseSearchNavigationProps) => {
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)

  useEffect(() => {
    if (open) {
      return
    }

    setSelectedIndex(-1)
  }, [open])

  useEffect(() => {
    if (!items.length) {
      setSelectedIndex(-1)
      return
    }

    setSelectedIndex((current) => {
      if (current < 0) {
        return 0
      }
      if (current >= items.length) {
        return items.length - 1
      }

      return current
    })
  }, [items])

  useEffect(() => {
    if (selectedIndex < 0) {
      return
    }

    itemRefs.current[selectedIndex]?.scrollIntoView({
      block: 'nearest',
    })
  }, [selectedIndex])

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!items.length) {
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setSelectedIndex((current) => (current + 1) % items.length)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setSelectedIndex((current) => (current <= 0 ? items.length - 1 : current - 1))
      return
    }

    if (event.key === 'Enter' && selectedIndex >= 0) {
      event.preventDefault()
      onSelect(items[selectedIndex].id)
    }
  }

  return {
    handleInputKeyDown,
    itemRefs,
    selectedIndex,
    setSelectedIndex,
  }
}
