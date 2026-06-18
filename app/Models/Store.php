<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'description',
        'logo',
        'status',
        'address',
        'latitude',
        'longitude'

    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }
    public function scopeForUser($query, User $user)
    {
        if ($user->role === 'admin' || $user->isAdminEmployee()) {
            return $query;
        }

        if ($user->isVendorEmployee()) {
            return $query->whereIn(
                'id',
                $user->employee->stores()->pluck('stores.id')
            );
        }

        return $query->where('user_id', $user->id);
    }


    public function orderItems()
{
    return $this->hasManyThrough(
        OrderItem::class,
        Product::class
    );
}
}
