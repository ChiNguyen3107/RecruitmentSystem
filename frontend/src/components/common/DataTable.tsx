import { ReactNode } from 'react';

interface DataTableProps {
  headers: string[];
  children: ReactNode;
  emptyMessage?: string;
}

export function DataTable({ headers, children, emptyMessage = 'Không có dữ liệu' }: DataTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}

