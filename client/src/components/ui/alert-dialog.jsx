import * as React from "react"
import { Button } from "@/components/ui/button"

const AlertDialog = ({ open, onOpenChange, title, description, confirmText = "Confirm", cancelText = "Cancel", onConfirm, variant = "destructive" }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={() => onOpenChange?.(false)}
      />
      <div className="relative z-50 w-full max-w-md rounded-xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl text-neutral-100 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-neutral-100">{title}</h3>
          <p className="text-sm text-neutral-400">{description}</p>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={() => { onConfirm?.(); onOpenChange?.(false); }}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}

export { AlertDialog }
