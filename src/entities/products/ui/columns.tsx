import type { ColumnDef, Table } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import type { Product } from '../types'

const getSortableHeader =
  ({ name, title }: { name: string; title: string }) =>
  ({ table }: { table: Table<Product> }) => {
    const { onSort } = table.options.meta as { onSort: (id: string) => void }

    return (
      <div
        className='flex items-center cursor-pointer hover:text-black transition-colors'
        onClick={() => onSort(name)}
      >
        {title}
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </div>
    )
  }

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'title',
    header: 'Наименование',
  },
  {
    accessorKey: 'brand',
    header: getSortableHeader({ name: 'brand', title: 'Вендор' }),
  },
  {
    accessorKey: 'sku',
    header: 'Артикул',
  },
  {
    accessorKey: 'rating',
    header: getSortableHeader({ name: 'rating', title: 'Оценка' }),
  },
  {
    accessorKey: 'price',
    header: getSortableHeader({ name: 'price', title: 'Цена, ₽' }),
  },
]
