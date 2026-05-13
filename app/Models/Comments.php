<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comments extends Model
{
    protected $fillable = ['userId', 'bookId', 'commentText', 'rating', 'IsActive'];

    protected $casts = [
        'IsActive' => 'boolean',
        'rating'   => 'integer',
        'userId'   => 'integer',
        'bookId'   => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'userId');
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Books::class, 'bookId');
    }
}
