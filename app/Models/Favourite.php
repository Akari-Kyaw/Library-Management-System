<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Favourite extends Model
{
    protected $fillable = ['userId', 'bookId'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'userId');
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Books::class, 'bookId');
    }
}
