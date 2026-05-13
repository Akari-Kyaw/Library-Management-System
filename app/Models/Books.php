<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Books extends Model
{
    protected $fillable = [
        'name',
        'ISBN',
        'IsActive',
        'published_date',
        'author',
        'categoryId',
        'cover_image',
        'pdf_file',
        'description',
    ];

    protected $casts = [
        'IsActive' => 'boolean',
        'published_date' => 'date',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Categories::class, 'categoryId', 'id');
    }

    public function likes(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Likes::class, 'bookId');
    }

    public function comments(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Comments::class, 'bookId');
    }

    public function favourites(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Favourite::class, 'bookId');
    }
}
