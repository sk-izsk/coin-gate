'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { cn } from '../lib/utils'

interface Props {}

export const Header: React.FC<Props> = () => {
  const pathName = usePathname()
  return (
    <header>
      <div className="main-container inner">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="Coin gate logo"
            width={122}
            height={30}
            className="h-auto w-auto"
          />
        </Link>
        <nav>
          <Link
            className={cn('nav-link', {
              'is-active': pathName === '/',
              'is-home': true,
            })}
            href="/"
          >
            Home
          </Link>
          <p>Search Modal</p>
          <Link
            className={cn('nav-link', {
              'is-active': pathName === '/coins',
            })}
            href="/coins"
          >
            All coins
          </Link>
        </nav>
      </div>
    </header>
  )
}
