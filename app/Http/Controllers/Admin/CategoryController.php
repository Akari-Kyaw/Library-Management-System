<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Categories;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $categories = Categories::withCount('books')->latest()->get()->map(fn ($c) => [
            'id'           => $c->id,
            'categoryName' => $c->categoryName,
            'IsActive'     => $c->IsActive,
            'books_count'  => $c->books_count,
        ]);

        return Inertia::render('admin/categories/index', [
            'categories' => $categories,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/categories/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'categoryName' => 'required|string|max:255|unique:categories,categoryName',
            'IsActive'     => 'boolean',
        ]);

        Categories::create([
            'categoryName' => $request->categoryName,
            'IsActive'     => $request->boolean('IsActive', true),
            'bookId'       => '',
        ]);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category created successfully.');
    }

    public function edit(Categories $category): Response
    {
        return Inertia::render('admin/categories/edit', [
            'category' => [
                'id'           => $category->id,
                'categoryName' => $category->categoryName,
                'IsActive'     => $category->IsActive,
            ],
        ]);
    }

    public function update(Request $request, Categories $category): RedirectResponse
    {
        $request->validate([
            'categoryName' => 'required|string|max:255|unique:categories,categoryName,' . $category->id,
            'IsActive'     => 'boolean',
        ]);

        $category->update([
            'categoryName' => $request->categoryName,
            'IsActive'     => $request->boolean('IsActive'),
        ]);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category updated successfully.');
    }

    public function destroy(Categories $category): RedirectResponse
    {
        $category->delete();

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}
