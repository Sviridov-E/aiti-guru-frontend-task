import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import z, { ZodType } from 'zod'
import { productSchema } from '../types'

export const productsStoreSchema = z.object({
  products: z.array(productSchema),
  total: z.number(),
})

export type ProductsStore = z.infer<typeof productsStoreSchema>

export const useProducts = (
  authFetch: <T>(
    url: string,
    schema: ZodType<T>,
    params?: RequestInit | undefined
  ) => Promise<T | undefined>,
  {
    page,
    countPerPage,
    sort,
    order,
    query,
  }: {
    page: number
    countPerPage: number
    sort: string | null
    order: 'asc' | 'desc' | null
    query: string | null
  }
) =>
  useQuery<ProductsStore>({
    queryKey: ['products', { page, sort, order, countPerPage, query }],
    queryFn: async () => {
      try {
        const searchParams = new URLSearchParams(
          [
            ['limit', countPerPage],
            ['skip', (page - 1) * countPerPage || null],
            ['sortBy', sort || null],
            ['order', sort ? order : null],
            ['q', query],
          ]
            .filter(([, value]) => value !== null)
            .map(([key, value]) => [key, value?.toString()]) as string[][]
        ).toString()
        const data = await authFetch(
          `/api/products${query ? '/search' : ''}?${searchParams}`,
          productsStoreSchema
        )
        if (!data) throw new Error('Ошибка при полученнии данных')
        return data
      } catch (e) {
        if (e instanceof Error) toast.error('Ошибка при получении данных')
        throw e
      }
    },
    placeholderData: keepPreviousData,
  })
