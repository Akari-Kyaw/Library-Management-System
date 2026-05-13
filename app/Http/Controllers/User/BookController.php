<?php

namespace App\Http\Controllers\User;

use App\Events\BookingUpdated;
use App\Http\Controllers\Controller;
use App\Models\Books;
use App\Models\Booking;
use App\Models\Comments;
use App\Models\Favourite;
use App\Models\Likes;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BookController extends Controller
{
    public function show(Request $request, Books $book): Response
    {
        $book->load('category');

        $activeBooking = Booking::where('bookId', $book->id)
            ->where('userId', $request->user()->id)
            ->where('IsActive', true)
            ->latest('id')
            ->first();

        $alreadyBooked = $activeBooking !== null;
        $bookingStatus = $activeBooking?->status;
        $today = now()->startOfDay();
        $hasConfirmedBooking = $bookingStatus === 'confirmed'
            && $activeBooking?->booking_date
            && $activeBooking?->due_date
            && $today->between(
                $activeBooking->booking_date->startOfDay(),
                $activeBooking->due_date->endOfDay()
            );

        // Preview: first 300 characters of description
        $preview = $book->description ? Str::limit($book->description, 300) : null;

        $userId = $request->user()->id;

        // Fetch active booking periods for this book (all users) to block in calendar
        $bookedPeriods = Booking::where('bookId', $book->id)
            ->where('IsActive', true)
            ->where('status', '!=', 'returned')
            ->get(['booking_date', 'due_date'])
            ->map(fn ($b) => [
                'from' => $b->booking_date?->format('Y-m-d'),
                'to'   => $b->due_date?->format('Y-m-d'),
            ]);

        $likesCount   = Likes::where('bookId', $book->id)->count();
        $userLiked    = Likes::where('bookId', $book->id)->where('userId', $userId)->exists();
        $userFavourited = Favourite::where('bookId', $book->id)->where('userId', $userId)->exists();

        $comments = Comments::where('bookId', $book->id)
            ->where('IsActive', true)
            ->with('user:id,name')
            ->latest()
            ->get()
            ->map(fn ($c) => [
                'id'          => $c->id,
                'commentText' => $c->commentText,
                'rating'      => $c->rating,
                'created_at'  => $c->created_at?->format('M d, Y'),
                'userId'      => (int) $c->userId,
                'user'        => ['name' => $c->user?->name ?? 'Unknown'],
            ]);

        return Inertia::render('user/books/show', [
            'book' => [
                'id'             => $book->id,
                'name'           => $book->name,
                'ISBN'           => $book->ISBN,
                'author'         => $book->author,
                'published_date' => $book->published_date?->format('Y-m-d'),
                'IsActive'       => $book->IsActive,
                'cover_image'    => $book->cover_image ? Storage::url($book->cover_image) : null,
                'preview'        => $preview,
                'description'    => $hasConfirmedBooking ? $book->description : null,
                'pdf_url'        => $hasConfirmedBooking && $book->pdf_file ? Storage::url($book->pdf_file) : null,
                'category'       => $book->category
                    ? ['categoryName' => $book->category->categoryName]
                    : null,
            ],
            'alreadyBooked'   => $alreadyBooked,
            'bookingStatus'   => $bookingStatus,
            'bookingDate'     => $activeBooking?->booking_date?->format('M d, Y'),
            'dueDate'         => $activeBooking?->due_date?->format('M d, Y'),
            'bookedPeriods'   => $bookedPeriods,
            'likesCount'     => $likesCount,
            'userLiked'      => $userLiked,
            'userFavourited' => $userFavourited,
            'comments'       => $comments,
        ]);
    }

    public function book(Request $request, Books $book): RedirectResponse
    {
        $validated = $request->validate([
            'booking_date' => 'required|date|after_or_equal:today',
            'due_date'     => [
                'required',
                'date',
                'after:booking_date',
                function ($attribute, $value, $fail) use ($request) {
                    $start = new \DateTime($request->booking_date);
                    $end   = new \DateTime($value);
                    if ($end->diff($start)->days > 7) {
                        $fail('The booking period cannot exceed 7 days.');
                    }
                },
            ],
            'booking_type' => 'required|in:online,pickup',
            'time'         => 'required_if:booking_type,pickup|nullable|date_format:H:i',
        ]);

        $alreadyBooked = Booking::where('bookId', $book->id)
            ->where('userId', $request->user()->id)
            ->where('IsActive', true)
            ->exists();

        if ($alreadyBooked) {
            return back()->withErrors(['booking' => 'You have already booked this book.']);
        }

        // Check if requested period overlaps any existing active booking
        $overlaps = Booking::where('bookId', $book->id)
            ->where('IsActive', true)
            ->where('status', '!=', 'returned')
            ->where(function ($q) use ($validated) {
                $q->whereBetween('booking_date', [$validated['booking_date'], $validated['due_date']])
                  ->orWhereBetween('due_date', [$validated['booking_date'], $validated['due_date']])
                  ->orWhere(function ($q2) use ($validated) {
                      $q2->where('booking_date', '<=', $validated['booking_date'])
                         ->where('due_date', '>=', $validated['due_date']);
                  });
            })
            ->exists();

        if ($overlaps) {
            return back()->withErrors(['booking' => 'Selected dates overlap with an existing booking for this book.']);
        }

        $booking = Booking::create([
            'userId'       => $request->user()->id,
            'bookId'       => $book->id,
            'booking_date' => $validated['booking_date'],
            'due_date'     => $validated['due_date'],
            'booking_type' => $validated['booking_type'],
            'time'         => $validated['time'] ?? null,
            'status'       => 'pending',
            'IsActive'     => true,
        ]);

        BookingUpdated::dispatch($booking->fresh());

        return redirect()->route('dashboard')
            ->with('success', 'Book booked successfully!');
    }
}
