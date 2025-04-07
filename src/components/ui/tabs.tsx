import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

/**
 * Основной компонент Tabs (корневой элемент)
 * Управляет состоянием вкладок и их переключением
 */
const Tabs = TabsPrimitive.Root

/**
 * Контейнер для переключателей вкладок (таб-лист)
 * 
 * @param {React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>} props - Свойства компонента
 * @param {React.Ref<React.ElementRef<typeof TabsPrimitive.List>} ref - Референс на DOM-элемент
 * @returns {JSX.Element} Горизонтальный список переключателей вкладок
 */
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      // Базовые стили контейнера
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className // Дополнительные классы из пропсов
    )}
    {...props} // Все остальные пропсы
  />
))
TabsList.displayName = TabsPrimitive.List.displayName // Имя для DevTools

/**
 * Переключатель вкладки (таб)
 * 
 * @param {React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>} props - Свойства компонента
 * @param {React.Ref<React.ElementRef<typeof TabsPrimitive.Trigger>} ref - Референс на DOM-элемент
 * @returns {JSX.Element} Интерактивный элемент переключателя вкладки
 */
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // Базовые стили
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium",
      // Состояния
      "ring-offset-background transition-all focus-visible:outline-none",
      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      // Активное состояние
      "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className // Дополнительные классы
    )}
    {...props} // Все остальные пропсы
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

/**
 * Контент вкладки
 * 
 * @param {React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>} props - Свойства компонента
 * @param {React.Ref<React.ElementRef<typeof TabsPrimitive.Content>} ref - Референс на DOM-элемент
 * @returns {JSX.Element} Контейнер содержимого активной вкладки
 */
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      // Базовые стили
      "mt-2 ring-offset-background",
      // Фокус-стили
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className // Дополнительные классы
    )}
    {...props} // Все остальные пропсы
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
