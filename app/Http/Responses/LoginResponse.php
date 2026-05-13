<?php

namespace App\Http\Responses;

use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request): RedirectResponse
    {
        $user = $request->user();

        if ($user && $user->role === 'admin') {
            return redirect()->to(route('admin.books.index'));
        }

        return redirect()->intended(route('dashboard'));
    }
}
