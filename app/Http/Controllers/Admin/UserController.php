<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::latest()
            ->get()
            ->map(fn ($u) => [
                'id'           => $u->id,
                'name'         => $u->name,
                'email'        => $u->email,
                'role'         => $u->role ?? 'user',
                'status'       => $u->status ?? 'active',
                'created_at'   => $u->created_at?->format('Y-m-d'),
            ]);

        return Inertia::render('admin/users/index', [
            'users' => $users,
        ]);
    }

    public function show(User $user): Response
    {
        $user->loadCount(['likes', 'favourites']);

        $bookingsCount = Booking::where('userId', $user->id)->count();

        $recentBookings = Booking::with('book')
            ->where('userId', $user->id)
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('admin/users/show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'user',
                'status' => $user->status ?? 'active',
                'address' => $user->address,
                'phonre_number' => $user->phonre_number,
                'IsActive' => $user->IsActive,
                'email_verified_at' => $user->email_verified_at?->format('Y-m-d H:i'),
                'created_at' => $user->created_at?->format('Y-m-d H:i'),
                'updated_at' => $user->updated_at?->format('Y-m-d H:i'),
                'likes_count' => $user->likes_count,
                'favourites_count' => $user->favourites_count,
                'bookings_count' => $bookingsCount,
            ],
            'recentBookings' => $recentBookings->map(fn ($booking) => [
                'id' => $booking->id,
                'booking_date' => $booking->booking_date?->format('Y-m-d'),
                'due_date' => $booking->due_date?->format('Y-m-d'),
                'time' => $booking->time,
                'status' => $booking->status ?? ($booking->IsActive ? 'pending' : 'returned'),
                'booking_type' => $booking->booking_type ?? 'pickup',
                'book' => $booking->book ? [
                    'id' => $booking->book->id,
                    'name' => $booking->book->name,
                    'ISBN' => $booking->book->ISBN,
                ] : null,
            ]),
        ]);
    }

    public function toggleBan(User $user): RedirectResponse
    {
        abort_if($user->role === 'admin', 403);

        $user->update([
            'status' => $user->status === 'banned' ? 'active' : 'banned',
        ]);

        $message = $user->status === 'banned' ? 'User has been banned.' : 'User has been unbanned.';

        return redirect()->route('admin.users.index')
            ->with('success', $message);
    }

    public function destroy(User $user): RedirectResponse
    {
        // Prevent deleting admins via this endpoint
        abort_if($user->role === 'admin', 403);

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }
}
