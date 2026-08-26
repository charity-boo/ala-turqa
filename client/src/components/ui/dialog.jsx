import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" 
        onClick={() => onOpenChange?.(false)}
      />
      {/* Dialog Content */}
      <div className="relative z-50 w-full max-w-lg rounded-xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl text-neutral-100 animate-in zoom-in-95 duration-200">
        {children}
      </div>
    </div>
  )
}

const DialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left pb-4 border-b border-neutral-800", className)} {...props} />
)

const DialogTitle = ({ className, ...props }) => (
  <h2 className={cn("text-lg font-semibold leading-none tracking-tight text-gold", className)} {...props} />
)

const DialogDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-neutral-400 mt-1", className)} {...props} />
)

const DialogFooter = ({ className, ...props }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 border-t border-neutral-800 mt-4", className)} {...props} />
)

const DialogClose = ({ onClick }) => (
  <button 
    onClick={onClick}
    className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 text-neutral-400 hover:text-white"
  >
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </button>
)

export { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose }
