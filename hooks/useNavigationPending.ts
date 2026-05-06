'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface UseNavigationPendingProps {
  delay?: number
}

export const useNavigationPending = ({ delay = 120 }: UseNavigationPendingProps = {}) => {
  const pathname = usePathname()
  const [isPending, setIsPending] = useState(false)
  const [showPending, setShowPending] = useState(false)

  // Avoid useSearchParams here so shared layout/client wrappers stay prerenderable in Next 16.
  const routeKey =
    typeof window === 'undefined' ? pathname : `${pathname}${window.location.search}`

  useEffect(() => {
    setIsPending(false)
    setShowPending(false)
  }, [routeKey])

  useEffect(() => {
    if (!isPending) {
      setShowPending(false)
      return
    }

    const timeoutId = window.setTimeout(() => {
      setShowPending(true)
    }, delay)

    return () => window.clearTimeout(timeoutId)
  }, [delay, isPending])

  return {
    isPending,
    showPending,
    startPending: () => setIsPending(true),
    stopPending: () => {
      setIsPending(false)
      setShowPending(false)
    },
  }
}
