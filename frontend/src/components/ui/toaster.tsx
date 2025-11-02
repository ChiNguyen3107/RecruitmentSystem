import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { createPortal } from "react-dom"
import { Toast } from "./toast"

export interface ToastItem {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

interface ToasterContextType {
  toasts: ToastItem[]
  toast: {
    success: (description: string, title?: string) => string
    error: (description: string, title?: string) => string
    info: (description: string, title?: string) => string
  }
}

const ToasterContext = createContext<ToasterContextType | undefined>(undefined)

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const showToast = useCallback(
    (toastItem: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).substr(2, 9)
      const duration = toastItem.duration ?? 5000

      setToasts((prev) => [...prev, { ...toastItem, id }])

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id))
        }, duration)
      }

      return id
    },
    []
  )

  const closeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = {
    success: (description: string, title?: string) => {
      return showToast({ variant: "default", description, title })
    },
    error: (description: string, title?: string) => {
      return showToast({ variant: "destructive", description, title })
    },
    info: (description: string, title?: string) => {
      return showToast({ variant: "default", description, title })
    },
  }

  return (
    <ToasterContext.Provider value={{ toasts, toast }}>
      {children}
      {mounted &&
        createPortal(
          <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
            {toasts.map((toastItem) => (
              <Toast
                key={toastItem.id}
                variant={toastItem.variant}
                onClose={() => closeToast(toastItem.id)}
                className="mb-2 animate-in slide-in-from-top-5"
              >
                {toastItem.title && (
                  <div className="grid gap-1">
                    <div className="text-sm font-semibold">{toastItem.title}</div>
                    {toastItem.description && (
                      <div className="text-sm opacity-90">{toastItem.description}</div>
                    )}
                  </div>
                )}
                {!toastItem.title && toastItem.description && (
                  <div className="text-sm">{toastItem.description}</div>
                )}
              </Toast>
            ))}
          </div>,
          document.body
        )}
    </ToasterContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToasterContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToasterProvider")
  }
  return context
}
