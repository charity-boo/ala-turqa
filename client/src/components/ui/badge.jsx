import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gold/20 text-gold border-gold/30",
        secondary:
          "border-transparent bg-neutral-800 text-neutral-300",
        destructive:
          "border-transparent bg-red-950/80 text-red-400 border-red-800/50",
        outline: "text-neutral-300 border-neutral-700",
        info: "border-transparent bg-blue-950/80 text-blue-400 border-blue-800/50",
        success: "border-transparent bg-emerald-950/80 text-emerald-400 border-emerald-800/50",
        warning: "border-transparent bg-amber-950/80 text-amber-400 border-amber-800/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
