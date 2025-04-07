import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

/**
 * Провайдер для тултипов (должен оборачивать часть приложения, где используются тултипы)
 * Управляет глобальными настройками и состоянием всех тултипов
 */
const TooltipProvider = TooltipPrimitive.Provider

/**
 * Основной компонент Tooltip (корневой элемент)
 * Контролирует отображение тултипа и его состояние
 */
const Tooltip = TooltipPrimitive.Root

/**
 * Триггер для тултипа (элемент, при наведении на который показывается тултип)
 * Обычно это кнопка, иконка или другой интерактивный элемент
 */
const TooltipTrigger = TooltipPrimitive.Trigger

/**
 * Содержимое тултипа (появляется при наведении на триггер)
 * 
 * @param {React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>} props - Свойства контента
 * @param {React.Ref<React.ElementRef<typeof TooltipPrimitive.Content>} ref - Референс на DOM-элемент
 * @param {number} [sideOffset=4] - Отступ от края триггера (в пикселях)
 * @returns {JSX.Element} Стилизованное содержимое тултипа с анимациями
 */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset} // Отступ от триггера
    className={cn(
      // Базовые стили
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
      
      // Анимации появления
      "animate-in fade-in-0 zoom-in-95",
      
      // Анимации исчезновения
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      
      // Анимации в зависимости от стороны появления
      "data-[side=bottom]:slide-in-from-top-2", // Снизу
      "data-[side=left]:slide-in-from-right-2", // Слева
      "data-[side=right]:slide-in-from-left-2", // Справа
      "data-[side=top]:slide-in-from-bottom-2", // Сверху
      
      className // Кастомные классы из пропсов
    )}
    {...props} // Все остальные пропсы
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName // Имя для DevTools

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
