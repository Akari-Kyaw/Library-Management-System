<?php

namespace App\Http\Controllers;

use App\Models\Books;
use App\Models\Categories;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        if ($request->user()->role === 'admin') {
            return redirect()->route('admin.books.index');
        }

        $books = Books::with('category')
            ->where('IsActive', true)
            ->latest()
            ->get()
            ->map(fn ($book) => [
                'id'             => $book->id,
                'name'           => $book->name,
                'ISBN'           => $book->ISBN,
                'IsActive'       => $book->IsActive,
                'published_date' => $book->published_date?->format('Y-m-d'),
                'author'         => $book->author,
                'categoryId'     => $book->categoryId,
                'cover_image'    => $book->cover_image ? Storage::url($book->cover_image) : null,
                'description'    => $book->description,
                'category'       => $book->category
                    ? ['categoryName' => $book->category->categoryName]
                    : null,
            ]);

        return Inertia::render('dashboard', [
            'books'      => $books,
            'categories' => Categories::where('IsActive', true)
                ->orderBy('categoryName')
                ->pluck('categoryName'),
        ]);
    }

    public function library(): Response
    {
        $books = Books::with('category')
            ->where('IsActive', true)
            ->latest()
            ->get()
            ->map(fn ($book) => [
                'id'             => $book->id,
                'name'           => $book->name,
                'ISBN'           => $book->ISBN,
                'published_date' => $book->published_date?->format('Y-m-d'),
                'author'         => $book->author,
                'cover_image'    => $book->cover_image ? Storage::url($book->cover_image) : null,
                'description'    => $book->description,
                'category'       => $book->category
                    ? ['categoryName' => $book->category->categoryName]
                    : null,
            ]);

        return Inertia::render('library', [
            'books'      => $books,
            'categories' => Categories::where('IsActive', true)
                ->orderBy('categoryName')
                ->pluck('categoryName'),
        ]);
    }
}
