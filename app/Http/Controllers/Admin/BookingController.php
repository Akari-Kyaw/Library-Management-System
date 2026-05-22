<?php

namespace App\Http\Controllers\Admin;

use App\Events\BookingUpdated;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(): Response
    {
        $bookings = Booking::with(['book', 'user'])
            ->latest()
            ->get()
            ->map(fn ($b) => [
                'id'           => $b->id,
                'booking_date' => $b->booking_date?->format('Y-m-d'),
                'due_date'     => $b->due_date?->format('Y-m-d'),
                'time'         => $b->time,
                'status'       => $b->status ?? ($b->IsActive ? 'pending' : 'returned'),
                'IsActive'     => $b->IsActive,
                'book'         => $b->book ? ['id' => $b->book->id, 'name' => $b->book->name, 'ISBN' => $b->book->ISBN] : null,
                'user'         => $b->user ? ['id' => $b->user->id, 'name' => $b->user->name, 'email' => $b->user->email] : null,
            ]);

        return Inertia::render('admin/bookings/index', [
            'bookings' => $bookings,
        ]);
    }

    public function destroy(Booking $booking): RedirectResponse
    {
        $booking->delete();

        return redirect()->route('admin.bookings.index')
            ->with('success', 'Booking removed.');
    }

    public function confirm(Booking $booking): RedirectResponse
    {
        if ($booking->status === 'confirmed') {
            return back()->with('success', 'Booking is already confirmed.');
        }

        $booking->update([
            'status' => 'confirmed',
            'confirmed_at' => now(),
        ]);

        BookingUpdated::dispatch($booking->fresh());

        return back()->with('success', 'Booking confirmed successfully.');
    }
}
