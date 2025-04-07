import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"

// Добавляем CSS-анимации в глобальные стили (можно в ваш CSS-файл)
// Если используете Tailwind, добавьте в tailwind.config.js:
/*
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 300ms ease-out",
        "scale-in": "scaleIn 300ms ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  }
*/

// Типы
type AvatarProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
type AvatarImageProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> & {
  fadeInDuration?: number
  scaleInDuration?: number
}
type AvatarFallbackProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>

// Константы классов
const avatarClasses = "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full"
const imageClasses = "aspect-square h-full w-full object-cover animate-fade-in animate-scale-in"
const fallbackClasses = "flex h-full w-full items-center justify-center rounded-full bg-muted"

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(avatarClasses, className)}
      {...props}
    />
  )
)
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, fadeInDuration, scaleInDuration, style, ...props }, ref) => {
    // Динамические стили для анимации
    const animationStyle = {
      '--fade-in-duration': `${fadeInDuration ?? 300}ms`,
      '--scale-in-duration': `${scaleInDuration ?? 300}ms`,
      ...style,
    } as React.CSSProperties

    return (
      <AvatarPrimitive.Image
        ref={ref}
        className={cn(imageClasses, className)}
        style={animationStyle}
        {...props}
      />
    )
  }
)
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(fallbackClasses, className)}
      {...props}
    />
  )
)
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
