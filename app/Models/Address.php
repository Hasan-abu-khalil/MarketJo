<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = [
        'user_id',
        'phone',
        'city',
        'place',
        'is_default'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
