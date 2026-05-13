<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Categories extends Model
{
    protected $fillable = [
        'categoryName',
        'IsActive',
        'bookId',
    ];

    protected $casts = [
        'IsActive' => 'boolean',
    ];

    public function books(): HasMany
    {
        return $this->hasMany(Books::class, 'categoryId', 'id');
    }
}
