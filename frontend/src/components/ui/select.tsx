import * as React from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectContextValue {
  value: string
  onChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  labels: Map<string, string>
  setLabel: (value: string, label: string) => void
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined)

const useSelectContext = () => {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error('Select components must be used within Select')
  }
  return context
}

export interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}

export const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => {
  const [open, setOpen] = React.useState(false)
  const [labels, setLabels] = React.useState(new Map<string, string>())
  
  const setLabel = React.useCallback((val: string, label: string) => {
    setLabels(prev => new Map(prev).set(val, label))
  }, [])

  return (
    <SelectContext.Provider value={{ value, onChange: onValueChange, open, setOpen, labels, setLabel }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  )
}

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = useSelectContext()
    
    return (
      <button
        type="button"
        ref={ref}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onClick={() => setOpen(!open)}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"

export interface SelectValueProps {
  placeholder?: string
}

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder = "Select..." }) => {
  const { value, labels } = useSelectContext()
  const displayLabel = value ? labels.get(value) : null

  return (
    <span className="block truncate">
      {displayLabel ? (
        displayLabel
      ) : (
        !value && <span className="text-muted-foreground">{placeholder}</span>
      )}
    </span>
  )
}

export interface SelectContentProps {
  children: React.ReactNode
  className?: string
}

export const SelectContent: React.FC<SelectContentProps> = ({ children, className }) => {
  const { open, setOpen, onChange, value, setLabel } = useSelectContext()
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [hasPreloaded, setHasPreloaded] = React.useState(false)

  React.useEffect(() => {
    // Set hasPreloaded after first render
    if (!hasPreloaded) {
      const timer = setTimeout(() => setHasPreloaded(true), 100)
      return () => clearTimeout(timer)
    }
  }, [hasPreloaded])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, setOpen])

  const content = (
    <div className="p-1 max-h-[300px] overflow-auto">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { onChange, selectedValue: value, setLabel })
        }
        return child
      })}
    </div>
  )

  return (
    <>
      {/* Hidden content to pre-load labels - render once */}
      {!hasPreloaded && (
        <div 
          className="absolute opacity-0 pointer-events-none" 
          style={{ position: 'fixed', left: '-9999px' }}
        >
          {content}
        </div>
      )}
      {/* Visible content when open */}
      {open && (
        <div
          ref={contentRef}
          className={cn(
            "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 mt-1",
            className
          )}
        >
          {content}
        </div>
      )}
    </>
  )
}

export interface SelectItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  children: React.ReactNode
  selectedValue?: string
  onChange?: (value: string) => void
  setLabel?: (value: string, label: string) => void
}

export const SelectItem = React.forwardRef<HTMLButtonElement, SelectItemProps>(
  ({ className, value, children, selectedValue, onChange, setLabel, ...props }, ref) => {
    const isSelected = selectedValue === value
    const textRef = React.useRef<HTMLSpanElement>(null)

    React.useEffect(() => {
      if (setLabel && textRef.current) {
        const label = textRef.current.textContent?.trim() || ''
        setLabel(value, label)
      }
    }, [value, setLabel])

    const handleClick = () => {
      onChange?.(value)
      const context = React.useContext(SelectContext)
      context?.setOpen(false)
    }

    return (
      <button
        type="button"
        ref={ref}
        data-value={value}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          isSelected && "bg-accent",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {isSelected && <Check className="mr-2 h-4 w-4" />}
        <span ref={textRef} className={isSelected ? "mr-2" : "mr-8"}>{children}</span>
      </button>
    )
  }
)
SelectItem.displayName = "SelectItem"

