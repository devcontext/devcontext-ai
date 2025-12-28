import { cn } from "@/lib/utils"

interface ContentContainerProps {
  children: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg" | "xl" | "full"
}

export function ContentContainer({ 
  children, 
  className,
  size = "xl" 
}: ContentContainerProps) {
  const sizeClasses = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
    xl: "max-w-[1600px]",
    full: "max-w-none"
  }

  return (
    <div className={cn("container mx-auto px-6 py-8", sizeClasses[size], className)}>
      {children}
    </div>
  )
}
