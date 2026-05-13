<?php

namespace App\Console\Commands;

use App\Models\Booking;
use App\Notifications\BookDueReminderNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SendBookDueReminders extends Command
{
    protected $signature = 'bookings:send-reminders';

    protected $description = 'Send reminder notifications for bookings due tomorrow or already overdue';

    public function handle(): int
    {
        $tomorrow = Carbon::tomorrow()->toDateString();
        $today = Carbon::today()->toDateString();

        // Bookings due tomorrow (reminder) or already overdue (not yet reminded today)
        $bookings = Booking::with(['user', 'book'])
            ->where('IsActive', true)
            ->where(function ($q) use ($tomorrow, $today) {
                $q->whereDate('due_date', $tomorrow)                    // due tomorrow
                  ->orWhereDate('due_date', '<', $today);               // overdue
            })
            ->where(function ($q) use ($today) {
                $q->whereNull('reminder_sent_at')
                  ->orWhereDate('reminder_sent_at', '<', $today);       // not reminded today
            })
            ->get();

        $count = 0;

        foreach ($bookings as $booking) {
            if (! $booking->user) {
                continue;
            }

            $booking->user->notify(new BookDueReminderNotification($booking));

            $booking->update(['reminder_sent_at' => now()]);
            $count++;
        }

        $this->info("Sent {$count} reminder notification(s).");

        return self::SUCCESS;
    }
}
