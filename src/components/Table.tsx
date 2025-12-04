import type { ReactNode } from 'react'

export interface Column<T> {
  header: string
  accessorKey?: keyof T
  cell?: (item: T) => ReactNode
  className?: string
}

interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  isLoading?: boolean
  emptyMessage?: string
}

export default function Table<T>({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'No data available',
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full animate-pulse space-y-4">
        <div className="h-10 w-full rounded bg-gray-100" />
        <div className="h-24 w-full rounded bg-gray-100" />
        <div className="h-24 w-full rounded bg-gray-100" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex h-48 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((item, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`whitespace-nowrap px-6 py-4 text-sm text-gray-900 ${column.className || ''}`}
                  >
                    {column.cell
                      ? column.cell(item)
                      : column.accessorKey
                        ? (item[column.accessorKey] as ReactNode)
                        : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
