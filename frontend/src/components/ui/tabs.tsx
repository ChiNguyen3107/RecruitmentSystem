import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Context để share state giữa các Tabs components
interface TabsContextValue {
    activeTab: string;
    setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error('Tabs components must be used within a Tabs component');
    }
    return context;
}

// Main Tabs Container
interface TabsProps {
    defaultValue: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children: ReactNode;
    className?: string;
}

export function Tabs({ defaultValue, value, onValueChange, children, className }: TabsProps) {
    const [internalValue, setInternalValue] = useState(defaultValue);

    const activeTab = value !== undefined ? value : internalValue;

    const setActiveTab = useCallback((newValue: string) => {
        if (value === undefined) {
            setInternalValue(newValue);
        }
        onValueChange?.(newValue);
    }, [value, onValueChange]);

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={cn('w-full', className)}>
                {children}
            </div>
        </TabsContext.Provider>
    );
}

// Tabs List (Navigation)
interface TabsListProps {
    children: ReactNode;
    className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
    return (
        <div
            role="tablist"
            className={cn(
                'inline-flex h-12 items-center justify-start gap-2 rounded-lg bg-muted p-1 text-muted-foreground w-full overflow-x-auto',
                className
            )}
        >
            {children}
        </div>
    );
}

// Individual Tab Trigger
interface TabsTriggerProps {
    value: string;
    children: ReactNode;
    className?: string;
    disabled?: boolean;
}

export function TabsTrigger({ value, children, className, disabled = false }: TabsTriggerProps) {
    const { activeTab, setActiveTab } = useTabsContext();
    const isActive = activeTab === value;

    return (
        <button
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${value}`}
            disabled={disabled}
            onClick={() => setActiveTab(value)}
            className={cn(
                'inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-50',
                isActive
                    ? 'bg-background text-foreground shadow-sm'
                    : 'hover:bg-background/50 hover:text-foreground',
                className
            )}
        >
            {children}
        </button>
    );
}

// Tab Content Panel
interface TabsContentProps {
    value: string;
    children: ReactNode;
    className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
    const { activeTab } = useTabsContext();
    const isActive = activeTab === value;

    if (!isActive) return null;

    return (
        <div
            role="tabpanel"
            id={`panel-${value}`}
            aria-labelledby={`tab-${value}`}
            className={cn(
                'mt-6 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'animate-in fade-in-50 duration-200',
                className
            )}
        >
            {children}
        </div>
    );
}
