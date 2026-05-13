<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
