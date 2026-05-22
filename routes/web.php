<?php

use App\Http\Controllers\Admin\BookController as AdminBookController;
use App\Http\Controllers\Admin\BookingController as AdminBookingController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\User\BookController as UserBookController;
use App\Http\Controllers\User\BookingController as UserBookingController;
use App\Http\Controllers\User\CommentController as UserCommentController;
use App\Http\Controllers\User\FavouriteController as UserFavouriteController;
use App\Http\Controllers\User\LikeController as UserLikeController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'library'])->name('home');

Route::get('dashboard', [HomeController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// User routes — view book detail and book it
Route::middleware(['auth', 'verified'])->prefix('books')->name('books.')->group(function () {
    Route::get('{book}', [UserBookController::class, 'show'])->name('show');
    Route::post('{book}/book', [UserBookController::class, 'book'])->name('book');
    Route::post('{book}/like', [UserLikeController::class, 'toggle'])->name('like');
    Route::post('{book}/favourite', [UserFavouriteController::class, 'toggle'])->name('favourite');
    Route::post('{book}/comments', [UserCommentController::class, 'store'])->name('comments.store');
    Route::patch('{book}/comments/{comment}', [UserCommentController::class, 'update'])->name('comments.update');
    Route::delete('{book}/comments/{comment}', [UserCommentController::class, 'destroy'])->name('comments.destroy');
});

// User favourites
Route::middleware(['auth', 'verified'])->get('my-favourites', [UserFavouriteController::class, 'index'])->name('favourites.index');

// User bookings
Route::middleware(['auth', 'verified'])->prefix('my-bookings')->name('bookings.')->group(function () {
    Route::get('/', [UserBookingController::class, 'index'])->name('index');
    Route::post('{booking}/pay', [UserBookingController::class, 'payFine'])->name('pay');
    Route::post('{booking}/return', [UserBookingController::class, 'returnBook'])->name('return');
});

// Admin routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('books', AdminBookController::class);
    Route::resource('categories', AdminCategoryController::class)->except(['show']);
    Route::get('bookings', [AdminBookingController::class, 'index'])->name('bookings.index');
    Route::patch('bookings/{booking}/confirm', [AdminBookingController::class, 'confirm'])->name('bookings.confirm');
    Route::delete('bookings/{booking}', [AdminBookingController::class, 'destroy'])->name('bookings.destroy');
    Route::get('users', [AdminUserController::class, 'index'])->name('users.index');
    Route::get('users/{user}', [AdminUserController::class, 'show'])->name('users.show');
    Route::patch('users/{user}/ban', [AdminUserController::class, 'toggleBan'])->name('users.ban');
    Route::delete('users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
});

require __DIR__.'/settings.php';
