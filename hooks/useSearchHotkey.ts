'use client'

import { useEffect } from 'react'

interface UseSearchHotkeyProps {
  onOpen: () => void
}

export const useSearchHotkey = ({ onOpen }: UseSearchHotkeyProps) => {
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        onOpen()
      }
    }

    window.addEventListener('keydown', handleKeydown)

    return () => window.removeEventListener('keydown', handleKeydown)
  }, [onOpen])
}
