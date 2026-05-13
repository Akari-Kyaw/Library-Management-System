<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Books;
use App\Models\Likes;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function toggle(Request $request, Books $book): RedirectResponse
    {
        $userId = $request->user()->id;

        $like = Likes::where('userId', $userId)->where('bookId', $book->id)->first();

        if ($like) {
            $like->delete();
        } else {
            Likes::create(['userId' => $userId, 'bookId' => $book->id]);
        }

        return back();
    }
}
