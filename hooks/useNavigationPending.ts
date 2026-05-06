'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

interface UseNavigationPendingProps {
  delay?: number
}

export const useNavigationPending = ({ delay = 120 }: UseNavigationPendingProps = {}) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, setIsPending] = useState(false)
  const [showPending, setShowPending] = useState(false)

  const routeKey = useMemo(() => {
    const params = searchParams.toString()
    return params ? `${pathname}?${params}` : pathname
  }, [pathname, searchParams])

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
