<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    private const FINE_PER_DAY = 0.50;

    public function index(Request $request): Response
    {
        $bookings = Booking::with(['book.category'])
            ->where('userId', $request->user()->id)
            ->where('IsActive', true)
            ->latest()
            ->get()
            ->map(function ($booking) {
                $isOverdue = $booking->due_date->isPast();
                $daysOverdue = $isOverdue ? (int) $booking->due_date->diffInDays(now()) : 0;
                $fine = $daysOverdue * self::FINE_PER_DAY;

                $payment = Payment::where('bookingId', $booking->id)->latest()->first();

                return [
                    'id'           => $booking->id,
                    'booking_date' => $booking->booking_date->format('Y-m-d'),
                    'due_date'     => $booking->due_date->format('Y-m-d'),
                    'time'         => $booking->time,
                    'status'       => $booking->status ?? 'pending',
                    'isOverdue'    => $isOverdue,
                    'daysOverdue'  => $daysOverdue,
                    'fine'         => number_format($fine, 2),
                    'fineRaw'      => $fine,
                    'isPaid'       => $payment && $payment->paid_at !== null,
                    'book' => $booking->book ? [
                        'id'          => $booking->book->id,
                        'name'        => $booking->book->name,
                        'author'      => $booking->book->author,
                        'ISBN'        => $booking->book->ISBN,
                        'cover_image' => $booking->book->cover_image ? Storage::url($booking->book->cover_image) : null,
                        'category'    => $booking->book->category
                            ? ['categoryName' => $booking->book->category->categoryName]
                            : null,
                    ] : null,
                ];
            });

        return Inertia::render('user/bookings/index', [
            'bookings' => $bookings,
        ]);
    }

    public function payFine(Request $request, Booking $booking): RedirectResponse
    {
        if ((string) $booking->userId !== (string) $request->user()->id) {
            abort(403);
        }

        if ($booking->status !== 'confirmed') {
            return back()->withErrors(['payment' => 'Only confirmed bookings can be paid.']);
        }

        if (! $booking->due_date->isPast()) {
            return back()->withErrors(['payment' => 'This booking is not overdue.']);
        }

        $existingPayment = Payment::where('bookingId', $booking->id)
            ->whereNotNull('paid_at')
            ->exists();

        if ($existingPayment) {
            return back()->withErrors(['payment' => 'Fine has already been paid.']);
        }

        $daysOverdue = (int) $booking->due_date->diffInDays(now());
        $fine = $daysOverdue * self::FINE_PER_DAY;

        Payment::create([
            'bookingId' => $booking->id,
            'userId'    => $request->user()->id,
            'fine'      => $fine,
            'paid_at'   => now(),
        ]);

        return back()->with('success', 'Fine of $' . number_format($fine, 2) . ' paid successfully!');
    }

    public function returnBook(Request $request, Booking $booking): RedirectResponse
    {
        if ((string) $booking->userId !== (string) $request->user()->id) {
            abort(403);
        }

        if ($booking->status !== 'confirmed') {
            return back()->withErrors(['return' => 'Only confirmed bookings can be returned.']);
        }

        if ($booking->due_date->isPast()) {
            $hasPaid = Payment::where('bookingId', $booking->id)
                ->whereNotNull('paid_at')
                ->exists();

            if (! $hasPaid) {
                return back()->withErrors(['return' => 'Please pay the overdue fine before returning.']);
            }
        }

        $booking->update([
            'IsActive' => false,
            'status' => 'returned',
        ]);

        return back()->with('success', 'Book returned successfully!');
    }
}
