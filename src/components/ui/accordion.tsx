import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Основной компонент Accordion (корневой элемент)
 * Это просто реэкспорт компонента Root из Radix UI
 * Позволяет создать аккордеон с одним или несколькими открытыми элементами
 */
const Accordion = AccordionPrimitive.Root

/**
 * Отдельный элемент аккордеона
 * 
 * @param {React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>} props - Свойства элемента
 * @param {React.Ref<React.ElementRef<typeof AccordionPrimitive.Item>} ref - Референс на DOM-элемент
 * @returns {JSX.Element} Элемент аккордеона с нижней границей
 */
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)} // Добавляем нижнюю границу
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem" // Имя для DevTools

/**
 * Триггер (кнопка) для открытия/закрытия элемента аккордеона
 * 
 * @param {React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>} props - Свойства триггера
 * @param {React.Ref<React.ElementRef<typeof AccordionPrimitive.Trigger>} ref - Референс на DOM-элемент
 * @returns {JSX.Element} Заголовок аккордеона с иконкой-стрелкой
 */
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        // Базовые стили
        "flex flex-1 items-center justify-between py-4 font-medium transition-all",
        // Эффекты при наведении
        "hover:underline",
        // Анимация иконки при открытии
        "[&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      {/* Иконка стрелки вниз с анимацией */}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

/**
 * Содержимое элемента аккордеона (появляется/исчезает)
 * 
 * @param {React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>} props - Свойства контента
 * @param {React.Ref<React.ElementRef<typeof AccordionPrimitive.Content>} ref - Референс на DOM-элемент
 * @returns {JSX.Element} Контент с анимацией появления/исчезновения
 */
const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    // Базовые стили и анимации
    className={cn(
      "overflow-hidden text-sm transition-all",
      "data-[state=closed]:animate-accordion-up", // Анимация закрытия
      "data-[state=open]:animate-accordion-down", // Анимация открытия
    )}
    {...props}
  >
    {/* Внутренний div для padding и кастомных стилей */}
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
