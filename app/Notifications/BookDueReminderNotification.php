<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookDueReminderNotification extends Notification
{
    use Queueable;

    public function __construct(
        protected Booking $booking,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $bookName = $this->booking->book?->name ?? 'a book';
        $dueDate = $this->booking->due_date->format('M d, Y');
        $isOverdue = $this->booking->due_date->isPast();

        $mail = (new MailMessage)
            ->subject($isOverdue ? "Overdue: \"{$bookName}\"" : "Reminder: \"{$bookName}\" is due soon")
            ->greeting("Hello {$notifiable->name},");

        if ($isOverdue) {
            $days = (int) $this->booking->due_date->diffInDays(now());
            $mail->line("Your booking for **{$bookName}** was due on **{$dueDate}** and is now **{$days} day(s) overdue**.")
                 ->line('A fine of $0.50 per day is being applied.')
                 ->action('View My Bookings', url('/my-bookings'));
        } else {
            $mail->line("This is a friendly reminder that your booking for **{$bookName}** is due on **{$dueDate}**.")
                 ->line('Please return it on time to avoid late fees ($0.50/day).')
                 ->action('View My Bookings', url('/my-bookings'));
        }

        return $mail->line('Thank you for using our Library!');
    }

    public function toArray(object $notifiable): array
    {
        $bookName = $this->booking->book?->name ?? 'a book';
        $isOverdue = $this->booking->due_date->isPast();

        return [
            'booking_id' => $this->booking->id,
            'book_name'  => $bookName,
            'due_date'   => $this->booking->due_date->format('Y-m-d'),
            'message'    => $isOverdue
                ? "Your booking for \"{$bookName}\" is overdue!"
                : "Reminder: \"{$bookName}\" is due on {$this->booking->due_date->format('M d, Y')}.",
        ];
    }
}
