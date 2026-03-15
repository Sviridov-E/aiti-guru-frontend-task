import { authFetch } from '@/entities/auth'
import { useProducts } from '@/entities/products'
import { Button } from '@/shared/ui'
import { useState } from 'react'

export const Dashboard = () => {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useProducts(page, authFetch)

  if (isLoading) return <h2>Loading</h2>

  return (
    <div>
      <ol>
        {data?.products.map(({ title, id }) => (
          <li key={id}>{title}</li>
        ))}
      </ol>
      <Button onClick={() => setPage(page => Math.max(1, page - 1))}>
        назад
      </Button>
      <Button onClick={() => setPage(page => page + 1)}>дальше</Button>
    </div>
  )
}
