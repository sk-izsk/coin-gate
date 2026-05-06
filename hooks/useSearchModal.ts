'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { useSearchHotkey } from './useSearchHotkey'
import { useSearchNavigation } from './useSearchNavigation'
import { useSearchResults } from './useSearchResults'

interface UseSearchModalProps {
  onSelectCoin?: (coinId: string) => void
}

export const useSearchModal = ({ onSelectCoin }: UseSearchModalProps = {}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const pathname = usePathname()
  const previousPathnameRef = useRef(pathname)
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

  useEffect(() => {
    if (previousPathnameRef.current !== pathname && open) {
      setOpen(false)
    }

    previousPathnameRef.current = pathname
  }, [open, pathname])

  const handleSelect = (coinId: string) => {
    const nextPath = `/coins/${coinId}`

    if (pathname === nextPath) {
      setOpen(false)
      return
    }

    onSelectCoin?.(coinId)
    router.push(nextPath)
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
