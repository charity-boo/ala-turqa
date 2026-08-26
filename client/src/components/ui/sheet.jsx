import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Sheet = ({ open, onOpenChange, children }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={() => onOpenChange?.(false)}
      />
      {/* Sheet panel */}
      <div className="relative z-50 w-full max-w-xl bg-neutral-900 border-l border-neutral-800 p-6 shadow-2xl h-full text-neutral-100 flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {children}
      </div>
    </div>
  )
}

const SheetHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-2 pb-4 border-b border-neutral-800", className)} {...props} />
)

const SheetTitle = ({ className, ...props }) => (
  <h2 className={cn("text-lg font-semibold text-gold", className)} {...props} />
)

const SheetDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-neutral-400", className)} {...props} />
)

const SheetContent = ({ className, children, ...props }) => (
  <div className={cn("flex-1 overflow-y-auto py-4 pr-1 space-y-6", className)} {...props}>
    {children}
  </div>
)

const SheetFooter = ({ className, ...props }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 border-t border-neutral-800", className)} {...props} />
)

const SheetClose = ({ onClick }) => (
  <button 
    onClick={onClick}
    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-neutral-400 hover:text-white"
  >
    <X className="h-5 w-5" />
    <span className="sr-only">Close</span>
  </button>
)

export { Sheet, SheetHeader, SheetTitle, SheetDescription, SheetContent, SheetFooter, SheetClose }
