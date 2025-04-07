import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// 1. Константы для вариантов и классов
const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const titleClasses = "mb-1 font-medium leading-none tracking-tight"
const descriptionClasses = "text-sm [&_p]:leading-relaxed"

// 2. Типы пропсов
interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {}
interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

// 3. Компоненты
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn(titleClasses, className)}
      {...props}
    />
  )
)
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p  // Изменено с div на p для соответствия типам
      ref={ref}
      className={cn(descriptionClasses, className)}
      {...props}
    />
  )
)
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
