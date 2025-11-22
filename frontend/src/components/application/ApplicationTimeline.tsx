import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Check, Circle, Clock, XCircle } from 'lucide-react';
import type { TimelineEvent, ApplicationStatus } from '@/types/application.types';

interface ApplicationTimelineProps {
    timeline: TimelineEvent[];
    currentStatus: ApplicationStatus;
}

const TIMELINE_STEPS: ApplicationStatus[] = [
    'RECEIVED',
    'REVIEWED',
    'INTERVIEW',
    'OFFER',
    'HIRED',
];

const STATUS_LABELS: Record<ApplicationStatus, string> = {
    RECEIVED: 'Đã nộp đơn',
    REVIEWED: 'Đang xem xét',
    INTERVIEW: 'Phỏng vấn',
    OFFER: 'Nhận offer',
    HIRED: 'Đã tuyển dụng',
    REJECTED: 'Bị từ chối',
    WITHDRAWN: 'Đã rút đơn',
};

export function ApplicationTimeline({ timeline, currentStatus }: ApplicationTimelineProps) {
    // Nếu bị từ chối hoặc rút đơn, hiển thị timeline đặc biệt
    if (currentStatus === 'REJECTED' || currentStatus === 'WITHDRAWN') {
        return (
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Trạng thái đơn ứng tuyển</h3>
                <div className="bg-card border rounded-lg p-6">
                    <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${currentStatus === 'REJECTED'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                            <XCircle className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-lg">
                                {STATUS_LABELS[currentStatus]}
                            </h4>
                            {timeline.length > 0 && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    {format(new Date(timeline[timeline.length - 1].timestamp), 'dd/MM/yyyy HH:mm', { locale: vi })}
                                </p>
                            )}
                            {timeline[timeline.length - 1]?.note && (
                                <p className="mt-2 text-sm">{timeline[timeline.length - 1].note}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Timeline bình thường
    const getStepStatus = (step: ApplicationStatus): 'completed' | 'current' | 'upcoming' => {
        const currentIndex = TIMELINE_STEPS.indexOf(currentStatus);
        const stepIndex = TIMELINE_STEPS.indexOf(step);

        if (stepIndex < currentIndex) return 'completed';
        if (stepIndex === currentIndex) return 'current';
        return 'upcoming';
    };

    const getStepEvent = (step: ApplicationStatus): TimelineEvent | undefined => {
        return timeline.find(event => event.status === step);
    };

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">Tiến trình ứng tuyển</h3>
            <div className="bg-card border rounded-lg p-6">
                <div className="space-y-6">
                    {TIMELINE_STEPS.map((step, index) => {
                        const status = getStepStatus(step);
                        const event = getStepEvent(step);
                        const isLast = index === TIMELINE_STEPS.length - 1;

                        return (
                            <div key={step} className="relative">
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className="relative flex-shrink-0">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${status === 'completed'
                                                ? 'bg-green-100 border-green-500 text-green-700'
                                                : status === 'current'
                                                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                                                    : 'bg-gray-100 border-gray-300 text-gray-400'
                                            }`}>
                                            {status === 'completed' ? (
                                                <Check className="w-5 h-5" />
                                            ) : status === 'current' ? (
                                                <Clock className="w-5 h-5" />
                                            ) : (
                                                <Circle className="w-5 h-5" />
                                            )}
                                        </div>

                                        {/* Connector Line */}
                                        {!isLast && (
                                            <div className={`absolute left-1/2 top-10 w-0.5 h-6 -translate-x-1/2 ${status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                                                }`} />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 pb-2">
                                        <h4 className={`font-medium ${status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground'
                                            }`}>
                                            {STATUS_LABELS[step]}
                                        </h4>
                                        {event && (
                                            <>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {format(new Date(event.timestamp), 'dd/MM/yyyy HH:mm', { locale: vi })}
                                                </p>
                                                {event.note && (
                                                    <p className="text-sm mt-2 text-foreground">{event.note}</p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
