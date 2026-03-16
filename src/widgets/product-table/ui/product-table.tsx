import { authFetch } from '@/entities/auth'
import { useProducts } from '@/entities/products'
import { columns } from '@/entities/products/ui/columns'
import { ProductModal } from '@/features/create-product'
import { SearchProduct } from '@/features/search-products'
import { Button } from '@/shared/ui'
import { DataTable } from '@/shared/ui/data-table'
import { RefreshCw } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { TablePagination } from './table-pagination'

const LIMIT = 20

type SortDirection = 'asc' | 'desc'

export const ProductTable = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page') || '1')
  const sort = searchParams.get('sortBy') || null
  const order = (searchParams.get('order') || 'asc') as SortDirection
  const query = searchParams.get('q') || null

  const { data, isLoading, isFetching, refetch } = useProducts(authFetch, {
    countPerPage: LIMIT,
    page,
    sort,
    order,
    query,
  })
  const totalPages = Math.ceil((data?.total || 0) / LIMIT)

  const handleSort = (field: string) => {
    const isCurrentField = sort === field
    const newOrder = isCurrentField && order === 'asc' ? 'desc' : 'asc'

    setSearchParams({
      page: '1',
      sortBy: field,
      order: newOrder,
    })
  }

  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev)
      params.set('page', newPage.toString())
      return params
    })
  }

  if (isLoading) return <div>Загрузка товаров...</div>

  return (
    <div className='pt-5 '>
      <div className='h-25 bg-card flex items-center justify-center px-8 relative'>
        <h2 className='text-2xl font-bold absolute left-8 top-0 bottom-0 flex items-center'>
          Товары
        </h2>
        <div className='w-5xl max-w-[calc(100vw-510px)]'>
          <SearchProduct />
        </div>
      </div>

      <div className='mt-8 bg-card'>
        <div className='mb-4 p-8 flex justify-between items-center'>
          <h2 className='text-xl font-bold  '>Все позиции</h2>
          <div className='flex gap-2'>
            <Button
              onClick={() => refetch()}
              variant='outline'
              className='size-10.5'
            >
              <RefreshCw className='size-5 text-gray-600' />
            </Button>
            <ProductModal />
          </div>
        </div>

        <div
          className='w-full px-8 overflow-x-auto'
          style={{ opacity: isFetching ? 0.5 : 1 }}
        >
          <DataTable
            columns={columns}
            data={data?.products ?? []}
            onSort={handleSort}
            sort={sort}
            order={order}
          />
        </div>

        <div className='flex items-center justify-between py-10 px-8'>
          <div className='text-lg text-muted-foreground whitespace-nowrap'>
            Показано
            <span className='text-foreground px-2'>
              {(page - 1) * LIMIT + 1}-
              {Math.min(data?.total || 0, page * LIMIT)}
            </span>
            из<span className='text-foreground px-2'>{data?.total}</span>
          </div>

          <TablePagination
            page={page}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  )
}
