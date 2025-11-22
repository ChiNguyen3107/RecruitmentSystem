import { HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const badgeVariants = cva(
    'inline-flex items-center gap-1.5 rounded-full border font-medium transition-all duration-200',
    {
        variants: {
            variant: {
                default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
                secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
                outline: 'border-border text-foreground hover:bg-accent',
                success: 'border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                warning: 'border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
                destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
            },
            size: {
                sm: 'px-2 py-0.5 text-xs',
                md: 'px-2.5 py-1 text-sm',
                lg: 'px-3 py-1.5 text-base',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    }
);

export interface BadgeProps
    extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    children: ReactNode;
    onRemove?: () => void;
    removable?: boolean;
}

export function Badge({
    className,
    variant,
    size,
    children,
    onRemove,
    removable = false,
    ...props
}: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
            <span>{children}</span>
            {(removable || onRemove) && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="rounded-full hover:bg-black/10 dark:hover:bg-white/10 p-0.5 transition-colors"
                    aria-label="Remove"
                >
                    <X className="w-3 h-3" />
                </button>
            )}
        </div>
    );
}
