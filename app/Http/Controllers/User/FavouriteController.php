<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Books;
use App\Models\Favourite;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class FavouriteController extends Controller
{
    public function index(Request $request): Response
    {
        $favourites = Favourite::where('userId', $request->user()->id)
            ->with('book.category')
            ->latest()
            ->get()
            ->map(fn ($fav) => [
                'id'             => $fav->book->id,
                'name'           => $fav->book->name,
                'author'         => $fav->book->author,
                'published_date' => $fav->book->published_date?->format('Y-m-d'),
                'IsActive'       => $fav->book->IsActive,
                'cover_image'    => $fav->book->cover_image ? Storage::url($fav->book->cover_image) : null,
                'category'       => $fav->book->category
                    ? ['categoryName' => $fav->book->category->categoryName]
                    : null,
            ]);

        return Inertia::render('user/favourites/index', [
            'books' => $favourites,
        ]);
    }

    public function toggle(Request $request, Books $book): RedirectResponse
    {
        $userId = $request->user()->id;

        $fav = Favourite::where('userId', $userId)->where('bookId', $book->id)->first();

        if ($fav) {
            $fav->delete();
        } else {
            Favourite::create(['userId' => $userId, 'bookId' => $book->id]);
        }

        return back();
    }
}
