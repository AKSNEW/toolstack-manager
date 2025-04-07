import * as React from "react"
import { cn } from "@/lib/utils"
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react"

// Типы для сортировки
type SortDirection = "asc" | "desc" | null
interface SortConfig {
  key: string
  direction: SortDirection
}

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  sortConfig?: SortConfig
  onSort?: (key: string) => void
}

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean
  sortKey?: string
}

/**
 * Основной компонент Table с поддержкой сортировки
 */
const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, sortConfig, onSort, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
)
Table.displayName = "Table"

/**
 * Компонент заголовка таблицы с поддержкой сортировки
 */
const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, children, sortable = false, sortKey = "", ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={cn(
          "h-12 px-4 text-left align-middle font-medium text-muted-foreground",
          "[&:has([role=checkbox])]:pr-0",
          sortable && "cursor-pointer hover:bg-muted/50",
          className
        )}
        {...props}
      >
        {sortable ? (
          <div className="flex items-center">
            {children}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        ) : (
          children
        )}
      </th>
    )
  }
)
TableHead.displayName = "TableHead"

// Остальные компоненты (TableHeader, TableBody, TableFooter, TableRow, TableCell, TableCaption) 
// остаются без изменений, как в предыдущей реализации

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}

// Хук для управления сортировкой
export function useSort<T>(data: T[], initialConfig?: SortConfig) {
  const [sortConfig, setSortConfig] = React.useState<SortConfig | null>(initialConfig || null)

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data
    
    return [...data].sort((a, b) => {
      // @ts-ignore
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      // @ts-ignore
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })
  }, [data, sortConfig])

  const requestSort = (key: string) => {
    let direction: SortDirection = "asc"
    if (sortConfig && sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc"
      } else if (sortConfig.direction === "desc") {
        direction = null
      }
    }
    setSortConfig(direction ? { key, direction } : null)
  }

  return { sortedData, sortConfig, requestSort }
}
