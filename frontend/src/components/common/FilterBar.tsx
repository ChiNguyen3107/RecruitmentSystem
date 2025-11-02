import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FilterBarProps {
  children: ReactNode;
  onClear?: () => void;
}

export function FilterBar({ children, onClear }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-4 border rounded-lg bg-card">
      <span className="text-sm font-medium text-muted-foreground">Lọc:</span>
      {children}
      {onClear && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="w-4 h-4 mr-1" />
          Xóa bộ lọc
        </Button>
      )}
    </div>
  );
}

