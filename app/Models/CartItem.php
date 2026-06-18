<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $fillable = [
        'cart_id',
        'product_id',
        'product_variant_id',
        'quantity',
        'reserved_until',
    ];

    protected $casts = [
        'reserved_until' => 'datetime',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    /*
    OPTIONAL (VERY USEFUL)
    Unified price accessor
    */
    public function getPriceAttribute()
    {
        return $this->variant?->price ?? $this->product->price;
    }

    /*
    OPTIONAL (VERY USEFUL)
    Total per cart item
    */
    public function getTotalAttribute()
    {
        return $this->quantity * $this->price;
    }
}