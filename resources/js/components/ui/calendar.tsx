import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn('p-4', className)}
            classNames={{
                months: 'flex flex-col sm:flex-row gap-6',
                month: 'flex flex-col gap-4',
                month_caption: 'flex justify-between items-center px-1 pt-1 mb-1',
                caption_label: 'text-sm font-semibold tracking-wide',
                nav: 'flex items-center gap-1',
                button_previous: cn(
                    buttonVariants({ variant: 'ghost' }),
                    'size-8 rounded-lg p-0 opacity-60 hover:opacity-100 hover:bg-accent',
                ),
                button_next: cn(
                    buttonVariants({ variant: 'ghost' }),
                    'size-8 rounded-lg p-0 opacity-60 hover:opacity-100 hover:bg-accent',
                ),
                month_grid: 'w-full border-collapse',
                weekdays: 'flex mb-1',
                weekday: 'text-muted-foreground w-10 text-center text-[0.75rem] font-semibold uppercase tracking-wider',
                week: 'flex w-full mt-1',
                day: cn(
                    'relative p-0 text-center text-sm',
                    '[&:has([aria-selected])]:bg-primary/10 [&:has([aria-selected].outside)]:bg-primary/5',
                    props.mode === 'range'
                        ? '[&:has(>.range_end)]:rounded-r-full [&:has(>.range_start)]:rounded-l-full first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full'
                        : '[&:has([aria-selected])]:rounded-full',
                ),
                day_button: cn(
                    buttonVariants({ variant: 'ghost' }),
                    'size-10 p-0 font-normal rounded-full aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground',
                ),
                range_start: 'range_start',
                range_end: 'range_end',
                selected:
                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-full',
                today: 'ring-2 ring-primary/40 rounded-full font-semibold',
                outside:
                    'outside text-muted-foreground opacity-40 aria-selected:bg-primary/5 aria-selected:text-muted-foreground aria-selected:opacity-30',
                disabled: 'text-muted-foreground opacity-25 line-through cursor-not-allowed',
                range_middle: 'aria-selected:bg-primary/10 aria-selected:text-foreground rounded-none',
                hidden: 'invisible',
                ...classNames,
            }}
            components={{
                Chevron: ({ orientation }) =>
                    orientation === 'left' ? (
                        <ChevronLeft className="size-4" />
                    ) : (
                        <ChevronRight className="size-4" />
                    ),
            }}
            {...props}
        />
    );
}

Calendar.displayName = 'Calendar';

export { Calendar };
