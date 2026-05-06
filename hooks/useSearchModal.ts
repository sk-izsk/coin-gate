'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { useSearchHotkey } from './useSearchHotkey'
import { useSearchNavigation } from './useSearchNavigation'
import { useSearchResults } from './useSearchResults'

export const useSearchModal = () => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const { emptyLabel, query, searchState, setQuery } = useSearchResults({ open })

  useEffect(() => {
    if (!open) {
      return
    }

    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus()
    })

    return () => window.cancelAnimationFrame(frame)
  }, [open])

  const handleSelect = (coinId: string) => {
    setOpen(false)
    router.push(`/coins/${coinId}`)
  }

  useSearchHotkey({
    onOpen: () => setOpen(true),
  })
  const { handleInputKeyDown, itemRefs, selectedIndex, setSelectedIndex } = useSearchNavigation({
    items: searchState.items,
    open,
    onSelect: handleSelect,
  })

  return {
    emptyLabel,
    handleInputKeyDown,
    handleSelect,
    inputRef,
    itemRefs,
    open,
    query,
    searchState,
    selectedIndex,
    setOpen,
    setQuery,
    setSelectedIndex,
  }
}
