import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, leftIcon, rightIcon, helperText, ...props }, ref) => {
        return (
            <div className="w-full">
                <div className="relative group">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        type={type}
                        className={cn(
                            'flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:border-transparent',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            'transition-all duration-200',
                            leftIcon && 'pl-10',
                            rightIcon && 'pr-10',
                            error && 'border-destructive focus-visible:ring-destructive',
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {helperText && (
                    <p className={cn(
                        'mt-1.5 text-xs',
                        error ? 'text-destructive' : 'text-muted-foreground'
                    )}>
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };
