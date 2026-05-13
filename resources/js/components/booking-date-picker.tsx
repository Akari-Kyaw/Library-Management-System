import { useMemo, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';

export type BookedPeriod = { from: string; to: string };

type Props = {
    bookedPeriods: BookedPeriod[];
    bookingDate: string;
    dueDate: string;
    onBookingDateChange: (val: string) => void;
    onDueDateChange: (val: string) => void;
};

function toLocalDateString(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function BookingDatePicker({
    bookedPeriods,
    bookingDate,
    dueDate,
    onBookingDateChange,
    onDueDateChange,
}: Props) {
    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const disabledDates = useMemo(
        () =>
            bookedPeriods.map((p) => ({
                from: new Date(p.from + 'T00:00:00'),
                to: new Date(p.to + 'T00:00:00'),
            })),
        [bookedPeriods],
    );

    const [month, setMonth] = useState<Date>(today);
    // 'start' = next click sets start date; 'end' = next click sets end date
    const [step, setStep] = useState<'start' | 'end'>('start');

    const startDate = bookingDate ? new Date(bookingDate + 'T00:00:00') : undefined;
    const endDate   = dueDate     ? new Date(dueDate     + 'T00:00:00') : undefined;

    const handleDayClick = (day: Date | undefined) => {
        if (!day) return;

        if (step === 'start') {
            // Always allow picking a new start date
            onBookingDateChange(toLocalDateString(day));
            onDueDateChange('');
            setStep('end');
        } else {
            // Picking end date
            if (startDate && day < startDate) {
                // Clicked before start → treat as new start date
                onBookingDateChange(toLocalDateString(day));
                onDueDateChange('');
                // Stay in 'end' step so user picks end next
            } else {
                onDueDateChange(toLocalDateString(day));
                setStep('start');
            }
        }
    };

    const resetStart = () => {
        onBookingDateChange('');
        onDueDateChange('');
        setStep('start');
    };

    // Check if selection exceeds 7 days
    const exceedsWeek = useMemo(() => {
        if (!bookingDate || !dueDate) return false;
        const start = new Date(bookingDate + 'T00:00:00');
        const end   = new Date(dueDate     + 'T00:00:00');
        return end.getTime() - start.getTime() > 7 * 24 * 60 * 60 * 1000;
    }, [bookingDate, dueDate]);

    return (
        <div className="flex flex-col gap-3">
            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between gap-2 border-b bg-muted/40 px-4 py-2.5">
                    <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-primary/70" />
                        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                            {step === 'start' ? 'Pick Start Date' : 'Pick End Date'}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                        <button
                            type="button"
                            onClick={resetStart}
                            className="flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-accent"
                        >
                            <span className={`font-medium ${step === 'start' ? 'text-primary' : 'text-muted-foreground'}`}>From:</span>
                            {startDate ? (
                                <span className="font-semibold text-primary underline decoration-dotted">
                                    {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            ) : (
                                <span className="italic text-muted-foreground/60">—</span>
                            )}
                        </button>
                        <span className="text-muted-foreground/40">→</span>
                        <span className="flex items-center gap-1.5">
                            <span className={`font-medium ${step === 'end' ? 'text-primary' : 'text-muted-foreground'}`}>To:</span>
                            {endDate ? (
                                <span className="font-semibold text-primary">
                                    {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            ) : (
                                <span className="italic text-muted-foreground/60">—</span>
                            )}
                        </span>
                    </div>
                </div>

                {/* Single calendar */}
                <div className="flex justify-center p-2">
                    <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={handleDayClick}
                        month={month}
                        onMonthChange={setMonth}
                        disabled={[{ before: today }, ...disabledDates]}
                        numberOfMonths={1}
                        modifiers={{
                            range_start: startDate ? [startDate] : [],
                            range_end: endDate ? [endDate] : [],
                            range_middle: startDate && endDate ? [{ after: startDate, before: endDate }] : [],
                            end_date: endDate ? [endDate] : [],
                        }}
                        modifiersClassNames={{
                            range_start: 'range_start',
                            range_end: 'range_end',
                            range_middle: 'range_middle',
                            end_date: 'bg-primary text-primary-foreground rounded-full hover:bg-primary hover:text-primary-foreground',
                        }}
                    />
                </div>
            </div>

            {/* Exceed 7 days alert */}
            {exceedsWeek && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>Booking period cannot exceed 7 days. Please select an earlier end date.</span>
                </div>
            )}

            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="inline-block size-3 rounded-sm bg-muted-foreground/30 align-middle line-through" />
                Crossed-out dates are already booked. Max booking period is 7 days.
            </p>
        </div>
    );
}

