import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { Product } from '../types'

interface ProductsResponse {
  products: Product[]
  total: number
}

const LIMIT = 5

export const useProducts = (
  page: number,
  authFetch: <T extends object>(
    url: string,
    params?: RequestInit | undefined
  ) => Promise<T | undefined>
) => {
  return useQuery<ProductsResponse>({
    queryKey: ['products', { page }],
    queryFn: async () => {
      try {
        const data = await authFetch<ProductsResponse>(
          `/api/products?limit=${LIMIT}&skip=${(page - 1) * LIMIT}`
        )
        if (!data) throw new Error('')
        return data
      } catch (e) {
        if (e instanceof Error) toast.error(e.message)
        throw e
      }
    },
    placeholderData: keepPreviousData,
  })
}
