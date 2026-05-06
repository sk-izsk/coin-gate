'use client'

import * as React from 'react'
import Link from 'next/link'

import { useOptionalPendingNavigationBoundary } from './PendingNavigationBoundary'

const isModifiedEvent = (event: React.MouseEvent<HTMLAnchorElement>) => {
  const target = event.currentTarget.getAttribute('target')

  return (
    (target && target !== '_self') ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.button !== 0
  )
}

type PendingNavigationLinkProps = React.ComponentProps<typeof Link>

export const PendingNavigationLink: React.FC<PendingNavigationLinkProps> = ({
  onClick,
  ...props
}) => {
  const navigationBoundary = useOptionalPendingNavigationBoundary()

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)

    if (event.defaultPrevented || isModifiedEvent(event)) {
      return
    }

    if (event.currentTarget.hasAttribute('download')) {
      return
    }

    navigationBoundary?.startPending()
  }

  return <Link onClick={handleClick} {...props} />
}
