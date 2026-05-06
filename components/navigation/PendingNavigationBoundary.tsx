'use client'

import * as React from 'react'
import { createContext, useContext } from 'react'

import { useNavigationPending } from '@/hooks/useNavigationPending'
import { cn } from '@/utils/utils'

import { LoadingOverlay } from '../ui/loading-overlay'

interface PendingNavigationContextValue {
  isPending: boolean
  showPending: boolean
  startPending: () => void
  stopPending: () => void
}

const PendingNavigationContext = createContext<PendingNavigationContextValue | null>(null)

interface PendingNavigationBoundaryProps extends React.ComponentProps<'div'> {
  delay?: number
  overlayLabel?: string
  overlayClassName?: string
}

export const PendingNavigationBoundary: React.FC<PendingNavigationBoundaryProps> = ({
  children,
  className,
  delay = 120,
  overlayClassName,
  overlayLabel = 'Loading...',
  ...props
}) => {
  const navigationPending = useNavigationPending({ delay })

  return (
    <PendingNavigationContext.Provider value={navigationPending}>
      <div
        data-slot="pending-navigation-boundary"
        aria-busy={navigationPending.showPending}
        className={cn('relative', className)}
        {...props}
      >
        {children}
        {navigationPending.showPending && (
          <LoadingOverlay className={overlayClassName} label={overlayLabel} />
        )}
      </div>
    </PendingNavigationContext.Provider>
  )
}

export const usePendingNavigationBoundary = () => {
  const context = useContext(PendingNavigationContext)

  if (!context) {
    throw new Error('usePendingNavigationBoundary must be used within a PendingNavigationBoundary')
  }

  return context
}

export const useOptionalPendingNavigationBoundary = () => {
  return useContext(PendingNavigationContext)
}
