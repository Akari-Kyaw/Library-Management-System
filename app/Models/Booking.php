<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    protected $fillable = [
        'userId',
        'bookId',
        'booking_date',
        'due_date',
        'time',
        'status',
        'booking_type',
        'confirmed_at',
        'IsActive',
        'reminder_sent_at',
    ];

    protected $casts = [
        'booking_date' => 'date',
        'due_date' => 'date',
        'confirmed_at' => 'datetime',
        'IsActive' => 'boolean',
        'reminder_sent_at' => 'datetime',
    ];

    public function book(): BelongsTo
    {
        return $this->belongsTo(Books::class, 'bookId', 'id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'userId', 'id');
    }
}
