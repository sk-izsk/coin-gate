'use client'

import * as React from 'react'

import { usePendingNavigationBoundary } from '@/components/navigation/PendingNavigationBoundary'
import { Pagination as UIPagination } from '@/components/ui/pagination'
import { buildPageNumbers, cn, ELLIPSIS } from '@/utils/utils'
import { useRouter } from 'next/navigation'

export const CoinsPagination: React.FC<Pagination> = ({
  currentPage,
  totalPages,
  hasMorePages,
}) => {
  const router = useRouter()
  const { startPending } = usePendingNavigationBoundary()

  const handlePageChange = (page: number) => {
    startPending()
    router.push(`/coins?page=${page}`)
  }

  const pageNumbers = buildPageNumbers({ currentPage, totalPages })
  const isLastPage = !hasMorePages || currentPage === totalPages

  return (
    <UIPagination id="coins-pagination">
      <UIPagination.Content className="pagination-content">
        <UIPagination.Item className="pagination-control prev">
          <UIPagination.Previous
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            className={currentPage === 1 ? 'control-disabled' : 'control-button'}
          />
        </UIPagination.Item>

        <div className="pagination-pages">
          {pageNumbers.map((page, index) => (
            <UIPagination.Item key={index}>
              {page === ELLIPSIS ? (
                <span className="ellipsis">...</span>
              ) : (
                <UIPagination.Link
                  onClick={() => handlePageChange(page)}
                  className={cn('page-link', {
                    'page-link-active': currentPage === page,
                  })}
                >
                  {page}
                </UIPagination.Link>
              )}
            </UIPagination.Item>
          ))}
        </div>

        <UIPagination.Item className="pagination-control next">
          <UIPagination.Next
            onClick={() => !isLastPage && handlePageChange(currentPage + 1)}
            className={isLastPage ? 'control-disabled' : 'control-button'}
          />
        </UIPagination.Item>
      </UIPagination.Content>
    </UIPagination>
  )
}
