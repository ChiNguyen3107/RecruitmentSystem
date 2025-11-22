import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Download, Trash2, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import type { Document } from '@/types/profile.types';
import { validateFileSize, validateFileType, ALLOWED_DOCUMENT_TYPES, MAX_DOCUMENT_SIZE_MB } from '@/lib/validations/profileSchemas';
import { format } from 'date-fns';

interface DocumentsManagerProps {
    documents: Document[];
    onUpload: (file: File) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onSetPrimary: (id: string) => Promise<void>;
    isLoading?: boolean;
}

export function DocumentsManager({
    documents,
    onUpload,
    onDelete,
    onSetPrimary,
    isLoading = false,
}: DocumentsManagerProps) {
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadError('');

        // Validate file type
        if (!validateFileType(file, ALLOWED_DOCUMENT_TYPES)) {
            setUploadError('Chỉ chấp nhận file PDF hoặc DOCX');
            return;
        }

        // Validate file size
        if (!validateFileSize(file, MAX_DOCUMENT_SIZE_MB)) {
            setUploadError(`Kích thước file tối đa ${MAX_DOCUMENT_SIZE_MB}MB`);
            return;
        }

        // Simulate upload progress
        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Simulate progress
            const interval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(interval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 100);

            await onUpload(file);

            clearInterval(interval);
            setUploadProgress(100);

            // Reset after a short delay
            setTimeout(() => {
                setIsUploading(false);
                setUploadProgress(0);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }, 500);
        } catch (error) {
            setUploadError('Upload thất bại. Vui lòng thử lại.');
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDelete = async (id: string, fileName: string) => {
        if (confirm(`Bạn có chắc muốn xóa "${fileName}"?`)) {
            await onDelete(id);
        }
    };

    return (
        <div className="space-y-6">
            {/* Upload Section */}
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-1">Upload CV hoặc tài liệu</h3>
                        <p className="text-sm text-muted-foreground">
                            PDF, DOCX tối đa {MAX_DOCUMENT_SIZE_MB}MB
                        </p>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isUploading || isLoading}
                    />

                    <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading || isLoading}
                        className="min-w-40"
                    >
                        {isUploading ? 'Đang upload...' : 'Chọn file'}
                    </Button>

                    {uploadError && (
                        <p className="text-destructive text-sm flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {uploadError}
                        </p>
                    )}
                </div>

                {/* Upload Progress Bar */}
                {isUploading && (
                    <div className="mt-4">
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-primary h-full transition-all duration-300 ease-out"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{uploadProgress}%</p>
                    </div>
                )}
            </div>

            {/* Documents List */}
            {documents.length > 0 ? (
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Tài liệu đã upload ({documents.length})</h3>
                    <div className="space-y-2">
                        {documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                            >
                                {/* File Icon */}
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-primary" />
                                    </div>
                                </div>

                                {/* File Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-medium truncate">{doc.fileName}</h4>
                                        {doc.isPrimary && (
                                            <span className="px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                                                CV chính
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                        <span>{formatFileSize(doc.fileSize)}</span>
                                        <span>•</span>
                                        <span>{format(new Date(doc.uploadDate), 'dd/MM/yyyy HH:mm')}</span>
                                    </div>
                                </div>

                                {/* Primary Selector */}
                                <button
                                    type="button"
                                    onClick={() => onSetPrimary(doc.id)}
                                    disabled={isLoading || doc.isPrimary}
                                    className="flex-shrink-0 group"
                                    title={doc.isPrimary ? 'CV chính' : 'Đặt làm CV chính'}
                                >
                                    {doc.isPrimary ? (
                                        <CheckCircle2 className="w-5 h-5 text-primary" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    )}
                                </button>

                                {/* Actions */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => window.open(doc.downloadUrl, '_blank')}
                                        disabled={isLoading}
                                    >
                                        <Download className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(doc.id, doc.fileName)}
                                        disabled={isLoading}
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 border rounded-lg bg-muted/30">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Chưa có tài liệu nào</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Upload CV của bạn để bắt đầu ứng tuyển
                    </p>
                </div>
            )}
        </div>
    );
}
