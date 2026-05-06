import * as React from 'react'
import { LoaderCircle } from 'lucide-react'

import { cn } from '@/utils/utils'

interface LoadingOverlayProps extends React.ComponentProps<'div'> {
  label?: string
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  className,
  label = 'Loading...',
  ...props
}) => {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      aria-label={label}
      data-slot="loading-overlay"
      className={cn(
        'absolute inset-0 z-20 flex items-center justify-center bg-background/55 backdrop-blur-[1px] cursor-progress',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2 rounded-full border border-border bg-background/95 px-3 py-2 text-sm font-medium text-foreground shadow-sm">
        <LoaderCircle className="size-4 animate-spin" />
        <span>{label}</span>
      </div>
    </div>
  )
}
