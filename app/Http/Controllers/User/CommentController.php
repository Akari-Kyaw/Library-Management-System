<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Books;
use App\Models\Comments;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, Books $book): RedirectResponse
    {
        $validated = $request->validate([
            'commentText' => 'required|string|max:1000',
            'rating'      => 'required|integer|min:1|max:5',
        ]);

        Comments::create([
            'userId'      => $request->user()->id,
            'bookId'      => $book->id,
            'commentText' => $validated['commentText'],
            'rating'      => $validated['rating'],
            'IsActive'    => true,
        ]);

        return back()->with('success', 'Review submitted successfully!');
    }

    public function update(Request $request, Books $book, Comments $comment): RedirectResponse
    {
        if ((int) $comment->userId !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'commentText' => 'required|string|max:1000',
            'rating'      => 'required|integer|min:1|max:5',
        ]);

        $comment->update([
            'commentText' => $validated['commentText'],
            'rating'      => $validated['rating'],
        ]);

        return back()->with('success', 'Review updated successfully!');
    }

    public function destroy(Request $request, Books $book, Comments $comment): RedirectResponse
    {
        if ((int) $comment->userId !== $request->user()->id) {
            abort(403);
        }

        $comment->delete();

        return back()->with('success', 'Review deleted.');
    }
}
