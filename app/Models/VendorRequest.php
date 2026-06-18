<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VendorRequest extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'store_name',
        'message',
        'status',
        'is_active',
        'reviewed_at',
        'reviewed_by',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    
}
