import { forwardRef, TextareaHTMLAttributes, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean;
    helperText?: string;
    showCharCount?: boolean;
    autoResize?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, helperText, showCharCount, maxLength, autoResize, onChange, ...props }, ref) => {
        const [charCount, setCharCount] = useState(0);

        useEffect(() => {
            if (props.value) {
                setCharCount(String(props.value).length);
            }
        }, [props.value]);

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setCharCount(e.target.value.length);

            // Auto resize
            if (autoResize) {
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
            }

            onChange?.(e);
        };

        return (
            <div className="w-full">
                <textarea
                    className={cn(
                        'flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:border-transparent',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        'transition-all duration-200 resize-none',
                        error && 'border-destructive focus-visible:ring-destructive',
                        className
                    )}
                    ref={ref}
                    maxLength={maxLength}
                    onChange={handleChange}
                    {...props}
                />
                <div className="flex items-center justify-between mt-1.5">
                    {helperText && (
                        <p className={cn(
                            'text-xs',
                            error ? 'text-destructive' : 'text-muted-foreground'
                        )}>
                            {helperText}
                        </p>
                    )}
                    {showCharCount && maxLength && (
                        <p className={cn(
                            'text-xs ml-auto',
                            charCount > maxLength * 0.9 ? 'text-destructive' : 'text-muted-foreground'
                        )}>
                            {charCount}/{maxLength}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export { Textarea };
