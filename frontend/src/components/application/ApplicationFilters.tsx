import { useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const STATUS_OPTIONS = [
    { value: 'ALL', label: 'Tất cả trạng thái' },
    { value: 'RECEIVED', label: 'Đã nộp' },
    { value: 'REVIEWED', label: 'Đang xem xét' },
    { value: 'INTERVIEW', label: 'Phỏng vấn' },
    { value: 'OFFER', label: 'Nhận offer' },
    { value: 'HIRED', label: 'Đã tuyển' },
    { value: 'REJECTED', label: 'Từ chối' },
];

const DATE_RANGE_OPTIONS = [
    { value: 'ALL', label: 'Tất cả thời gian' },
    { value: '7_DAYS', label: '7 ngày qua' },
    { value: '30_DAYS', label: '30 ngày qua' },
    { value: '3_MONTHS', label: '3 tháng qua' },
];

const SORT_OPTIONS = [
    { value: 'appliedAt_desc', label: 'Ngày nộp (mới nhất)' },
    { value: 'appliedAt_asc', label: 'Ngày nộp (cũ nhất)' },
    { value: 'companyName_asc', label: 'Tên công ty (A-Z)' },
];

export function ApplicationFilters() {
    const [searchParams, setSearchParams] = useSearchParams();

    const status = searchParams.get('status') || 'ALL';
    const dateRange = searchParams.get('dateRange') || 'ALL';
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'appliedAt_desc';

    const updateFilter = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value && value !== 'ALL') {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        // Reset về trang đầu khi filter thay đổi
        newParams.delete('page');
        setSearchParams(newParams);
    };

    const handleSearchChange = (value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set('search', value);
        } else {
            newParams.delete('search');
        }
        newParams.delete('page');
        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setSearchParams({});
    };

    const hasActiveFilters = status !== 'ALL' || dateRange !== 'ALL' || search;

    return (
        <div className="bg-card border rounded-lg p-4 space-y-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Tìm kiếm theo tên công việc..."
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {/* Status Filter */}
                <Select value={status} onValueChange={(value) => updateFilter('status', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Date Range Filter */}
                <Select value={dateRange} onValueChange={(value) => updateFilter('dateRange', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Thời gian" />
                    </SelectTrigger>
                    <SelectContent>
                        {DATE_RANGE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sort} onValueChange={(value) => updateFilter('sort', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sắp xếp" />
                    </SelectTrigger>
                    <SelectContent>
                        {SORT_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="w-full md:w-auto"
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        Xóa bộ lọc
                    </Button>
                )}
            </div>
        </div>
    );
}
