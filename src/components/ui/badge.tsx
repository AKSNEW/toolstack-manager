import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Константы вариантов
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-green-500 text-white hover:bg-green-500/80", // Добавленный вариант
        warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-500/80", // Добавленный вариант
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Пропсы компонента
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode // Добавлена поддержка иконок
  iconPosition?: "left" | "right" // Позиция иконки
}

// Компонент Badge
const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, icon, iconPosition = "left", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      >
        {icon && iconPosition === "left" && (
          <span className="mr-1">{icon}</span>
        )}
        {children}
        {icon && iconPosition === "right" && (
          <span className="ml-1">{icon}</span>
        )}
      </div>
    )
  }
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }
