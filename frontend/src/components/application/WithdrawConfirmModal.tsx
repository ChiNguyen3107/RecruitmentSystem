import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface WithdrawConfirmModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isLoading?: boolean;
    jobTitle?: string;
}

export function WithdrawConfirmModal({
    open,
    onOpenChange,
    onConfirm,
    isLoading = false,
    jobTitle,
}: WithdrawConfirmModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-full">
                            <AlertTriangle className="w-6 h-6 text-amber-600" />
                        </div>
                        <DialogTitle>Xác nhận rút đơn ứng tuyển</DialogTitle>
                    </div>
                    <DialogDescription className="pt-4">
                        Bạn có chắc chắn muốn rút đơn ứng tuyển
                        {jobTitle && (
                            <span className="font-semibold text-foreground">
                                {' '}&quot;{jobTitle}&quot;
                            </span>
                        )}
                        ?
                        <br />
                        <br />
                        Hành động này không thể hoàn tác. Bạn sẽ cần nộp đơn mới nếu muốn ứng tuyển lại vị trí này.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Xác nhận rút đơn'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
