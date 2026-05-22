<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Books;
use App\Models\Categories;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BookController extends Controller
{
    public function index(): Response
    {
        $books = Books::with('category')
            ->latest()
            ->get()
            ->map(fn ($b) => [
                'id'             => $b->id,
                'name'           => $b->name,
                'ISBN'           => $b->ISBN,
                'author'         => $b->author,
                'published_date' => $b->published_date?->format('Y-m-d'),
                'IsActive'       => $b->IsActive,
                'cover_image'    => $b->cover_image ? Storage::url($b->cover_image) : null,
                'category'       => $b->category
                    ? ['categoryName' => $b->category->categoryName]
                    : null,
            ]);

        return Inertia::render('admin/books/index', [
            'books' => $books,
        ]);
    }

    public function create(): Response
    {
        $categories = Categories::where('IsActive', true)->get(['id', 'categoryName']);

        return Inertia::render('admin/books/create', [
            'categories' => $categories,
        ]);
    }

    public function show(Books $book): Response
    {
        $book->load('category')->loadCount(['likes', 'comments', 'favourites']);

        $recentBookings = Booking::with('user')
            ->where('bookId', $book->id)
            ->latest()
            ->take(10)
            ->get()
            ->map(fn ($booking) => [
                'id' => $booking->id,
                'booking_date' => $booking->booking_date?->format('Y-m-d'),
                'due_date' => $booking->due_date?->format('Y-m-d'),
                'time' => $booking->time,
                'status' => $booking->status ?? ($booking->IsActive ? 'pending' : 'returned'),
                'booking_type' => $booking->booking_type ?? 'pickup',
                'user' => $booking->user ? [
                    'id' => $booking->user->id,
                    'name' => $booking->user->name,
                    'email' => $booking->user->email,
                ] : null,
            ]);

        return Inertia::render('admin/books/show', [
            'book' => [
                'id' => $book->id,
                'name' => $book->name,
                'ISBN' => $book->ISBN,
                'author' => $book->author,
                'published_date' => $book->published_date?->format('Y-m-d'),
                'IsActive' => $book->IsActive,
                'description' => $book->description,
                'cover_image' => $book->cover_image ? Storage::url($book->cover_image) : null,
                'pdf_url' => $book->pdf_file ? Storage::url($book->pdf_file) : null,
                'category' => $book->category
                    ? ['categoryName' => $book->category->categoryName]
                    : null,
                'likes_count' => $book->likes_count,
                'comments_count' => $book->comments_count,
                'favourites_count' => $book->favourites_count,
                'created_at' => $book->created_at?->format('Y-m-d H:i'),
                'updated_at' => $book->updated_at?->format('Y-m-d H:i'),
            ],
            'recentBookings' => $recentBookings,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'ISBN'           => 'required|string|max:20|unique:books,ISBN',
            'author'         => 'required|string|max:255',
            'published_date' => 'required|date',
            'categoryId'     => 'required|exists:categories,id',
            'IsActive'       => 'boolean',
            'description'    => 'nullable|string',
            'cover_image'    => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'pdf_file'       => 'nullable|mimes:pdf|max:20480',
        ]);

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request->file('cover_image')->store('books/covers', 'public');
        }

        if ($request->hasFile('pdf_file')) {
            $validated['pdf_file'] = $request->file('pdf_file')->store('books/pdfs', 'public');
        }

        Books::create($validated);

        return redirect()->route('admin.books.index')
            ->with('success', 'Book created successfully.');
    }

    public function edit(Books $book): Response
    {
        $categories = Categories::where('IsActive', true)->get(['id', 'categoryName']);

        return Inertia::render('admin/books/edit', [
            'book' => [
                'id'             => $book->id,
                'name'           => $book->name,
                'ISBN'           => $book->ISBN,
                'author'         => $book->author,
                'published_date' => $book->published_date?->format('Y-m-d'),
                'IsActive'       => $book->IsActive,
                'categoryId'     => (string) $book->categoryId,
                'description'    => $book->description,
                'cover_image'    => $book->cover_image ? Storage::url($book->cover_image) : null,
                'pdf_file'       => $book->pdf_file ? Storage::url($book->pdf_file) : null,
            ],
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Books $book): RedirectResponse
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'ISBN'           => 'required|string|max:20|unique:books,ISBN,' . $book->id,
            'author'         => 'required|string|max:255',
            'published_date' => 'required|date',
            'categoryId'     => 'required|exists:categories,id',
            'IsActive'       => 'boolean',
            'description'    => 'nullable|string',
            'cover_image'    => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'pdf_file'       => 'nullable|mimes:pdf|max:20480',
        ]);

        if ($request->hasFile('cover_image')) {
            if ($book->cover_image) {
                Storage::disk('public')->delete($book->cover_image);
            }
            $validated['cover_image'] = $request->file('cover_image')->store('books/covers', 'public');
        }

        if ($request->hasFile('pdf_file')) {
            if ($book->pdf_file) {
                Storage::disk('public')->delete($book->pdf_file);
            }
            $validated['pdf_file'] = $request->file('pdf_file')->store('books/pdfs', 'public');
        }

        $book->update($validated);

        return redirect()->route('admin.books.index')
            ->with('success', 'Book updated successfully.');
    }

    public function destroy(Books $book): RedirectResponse
    {
        $book->delete();

        return redirect()->route('admin.books.index')
            ->with('success', 'Book deleted successfully.');
    }
}
