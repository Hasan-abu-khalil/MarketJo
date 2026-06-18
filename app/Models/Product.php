<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'store_id',
        'name',
        'slug',
        'description',
        'price',
        'stock',
        'image',
        "is_active"
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function getTotalStockAttribute()
    {
        if ($this->variants()->exists()) {
            return $this->variants()->sum('stock');
        }

        return $this->stock;
    }
    public function getMinPriceAttribute()
    {
        return $this->variants()->min('price');
    }



    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

}
