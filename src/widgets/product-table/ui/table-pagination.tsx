import { cn } from '@/shared/lib'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/pagination'

export const TablePagination = ({
  handlePageChange,
  page,
  totalPages,
}: {
  page: number
  totalPages: number
  handlePageChange: (page: number) => void
}) => {
  return (
    <Pagination>
      <PaginationContent className='gap-2'>
        {page !== 1 && (
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              className='text-neutral-500 size-7.5 rounded-sm mr-1'
            />
          </PaginationItem>
        )}

        {Array.from({ length: totalPages }).map((_, i) => {
          const isActive = page === i + 1
          return (
            <PaginationItem key={i}>
              <PaginationLink
                className={cn(
                  'size-7.5 border border-neutral-300 text-sm text-neutral-400 rounded-sm',
                  isActive &&
                    'border-none text-white bg-indigo-400 hover:text-white hover:bg-indigo-400'
                )}
                isActive={isActive}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        {page !== totalPages && (
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
              className='text-neutral-500 size-7.5 rounded-sm ml-1'
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
