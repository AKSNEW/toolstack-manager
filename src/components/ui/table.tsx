import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Основной компонент Table (обертка для таблицы)
 * 
 * @param {React.HTMLAttributes<HTMLTableElement>} props - Свойства таблицы
 * @param {React.Ref<HTMLTableElement>} ref - Референс на DOM-элемент таблицы
 * @returns {JSX.Element} Таблица с возможностью горизонтального скролла
 */
const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto"> {/* Контейнер для скролла */}
      <table
        ref={ref}
        className={cn(
          "w-full caption-bottom text-sm", // Базовые стили
          className // Дополнительные классы
        )}
        {...props} // Все остальные пропсы
      />
    </div>
  )
)
Table.displayName = "Table" // Имя для DevTools

/**
 * Заголовок таблицы (thead)
 * 
 * @param {React.HTMLAttributes<HTMLTableSectionElement>} props - Свойства секции
 * @param {React.Ref<HTMLTableSectionElement>} ref - Референс на DOM-элемент
 * @returns {JSX.Element} Секция заголовка таблицы
 */
const TableHeader = React.forwardRef<
  HTMLTableSectionElement, 
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "[&_tr]:border-b", // Границы для строк в заголовке
      className
    )}
    {...props}
  />
))
TableHeader.displayName = "TableHeader"

/**
 * Тело таблицы (tbody)
 * 
 * @param {React.HTMLAttributes<HTMLTableSectionElement>} props - Свойства секции
 * @param {React.Ref<HTMLTableSectionElement>} ref - Референс на DOM-элемент
 * @returns {JSX.Element} Секция тела таблицы
 */
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      "[&_tr:last-child]:border-0", // Убираем границу у последней строки
      className
    )}
    {...props}
  />
))
TableBody.displayName = "TableBody"

/**
 * Подвал таблицы (tfoot)
 * 
 * @param {React.HTMLAttributes<HTMLTableSectionElement>} props - Свойства секции
 * @param {React.Ref<HTMLTableSectionElement>} ref - Референс на DOM-элемент
 * @returns {JSX.Element} Секция подвала таблицы
 */
const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium", // Стили подвала
      "[&>tr]:last:border-b-0", // Убираем границу у последней строки
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

/**
 * Строка таблицы (tr)
 * 
 * @param {React.HTMLAttributes<HTMLTableRowElement>} props - Свойства строки
 * @param {React.Ref<HTMLTableRowElement>} ref - Референс на DOM-элемент
 * @returns {JSX.Element} Строка таблицы с hover-эффектом
 */
const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors", // Базовые стили
      "hover:bg-muted/50", // Эффект при наведении
      "data-[state=selected]:bg-muted", // Стиль для выбранной строки
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

/**
 * Ячейка заголовка (th)
 * 
 * @param {React.ThHTMLAttributes<HTMLTableCellElement>} props - Свойства ячейки
 * @param {React.Ref<HTMLTableCellElement>} ref - Референс на DOM-элемент
 * @returns {JSX.Element} Ячейка заголовка таблицы
 */
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground", // Базовые стили
      "[&:has([role=checkbox])]:pr-0", // Стиль для ячеек с чекбоксами
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

/**
 * Ячейка данных (td)
 * 
 * @param {React.TdHTMLAttributes<HTMLTableCellElement>} props - Свойства ячейки
 * @param {React.Ref<HTMLTableCellElement>} ref - Референс на DOM-элемент
 * @returns {JSX.Element} Ячейка данных таблицы
 */
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle", // Базовые стили
      "[&:has([role=checkbox])]:pr-0", // Стиль для ячеек с чекбоксами
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

/**
 * Подпись таблицы (caption)
 * 
 * @param {React.HTMLAttributes<HTMLTableCaptionElement>} props - Свойства подписи
 * @param {React.Ref<HTMLTableCaptionElement>} ref - Референс на DOM-элемент
 * @returns {JSX.Element} Подпись таблицы
 */
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(
      "mt-4 text-sm text-muted-foreground", // Стили подписи
      className
    )}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

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
