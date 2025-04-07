import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// Тип пропсов для календаря (наследуем от DayPicker)
export type CalendarProps = React.ComponentProps<typeof DayPicker>;

/**
 * Компонент Calendar - кастомизированная обертка над DayPicker
 * 
 * @param {CalendarProps} props - Пропсы календаря
 * @param {string} className - Дополнительные классы для корневого элемента
 * @param {object} classNames - Кастомизация классов внутренних элементов
 * @param {boolean} showOutsideDays - Показывать дни из других месяцев
 * @returns {JSX.Element} Кастомизированный компонент календаря
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)} // Основной класс с отступами
      // Кастомизация классов для всех внутренних элементов
      classNames={{
        // Контейнер месяцев (для нескольких месяцев)
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        // Отдельный месяц
        month: "space-y-4",
        // Заголовок месяца (название + год)
        caption: "flex justify-center pt-1 relative items-center",
        // Текст заголовка
        caption_label: "text-sm font-medium",
        // Навигация (кнопки вперед/назад)
        nav: "space-x-1 flex items-center",
        // Кнопки навигации
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        // Кнопка "назад"
        nav_button_previous: "absolute left-1",
        // Кнопка "вперед"
        nav_button_next: "absolute right-1",
        // Таблица с днями
        table: "w-full border-collapse space-y-1",
        // Строка с названиями дней недели
        head_row: "flex",
        // Ячейка с названием дня недели
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        // Строка с днями месяца
        row: "flex w-full mt-2",
        // Ячейка дня
        cell: [
          "h-9 w-9 text-center text-sm p-0 relative",
          // Стили для границ выбранного диапазона
          "[&:has([aria-selected].day-range-end)]:rounded-r-md",
          "[&:has([aria-selected].day-outside)]:bg-accent/50",
          "[&:has([aria-selected])]:bg-accent",
          "first:[&:has([aria-selected])]:rounded-l-md",
          "last:[&:has([aria-selected])]:rounded-r-md",
          "focus-within:relative focus-within:z-20"
        ].join(" "),
        // День
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        // Конец диапазона
        day_range_end: "day-range-end",
        // Выбранный день
        day_selected: [
          "bg-primary text-primary-foreground",
          "hover:bg-primary hover:text-primary-foreground",
          "focus:bg-primary focus:text-primary-foreground"
        ].join(" "),
        // Сегодняшний день
        day_today: "bg-accent text-accent-foreground",
        // День из другого месяца
        day_outside: [
          "day-outside text-muted-foreground opacity-50",
          "aria-selected:bg-accent/50",
          "aria-selected:text-muted-foreground",
          "aria-selected:opacity-30"
        ].join(" "),
        // Неактивный день
        day_disabled: "text-muted-foreground opacity-50",
        // Дни внутри диапазона (но не начало/конец)
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        // Скрытые дни (для выравнивания)
        day_hidden: "invisible",
        // Переопределение классов из пропсов
        ...classNames,
      }}
      // Кастомизация иконок
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props} // Все остальные пропсы DayPicker
    />
  );
}

Calendar.displayName = "Calendar"; // Имя для DevTools

export { Calendar };
