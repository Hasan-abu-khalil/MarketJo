<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;
    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'product_variant_id',
        'price',
    ];

    protected $appends = ['variant_label'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    public function vendorOrder()
    {
        return $this->hasOne(VendorOrder::class);
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }


    public function getVariantLabelAttribute()
    {
        if (!$this->variant) {
            return null;
        }

        $attributes = $this->variant->attributes;

        if (is_string($attributes)) {
            $attributes = json_decode($attributes, true);
        }

        if (!is_array($attributes)) {
            return null;
        }

        return collect($attributes)
            ->map(fn($v, $k) => ucfirst($k) . ': ' . $v)
            ->join(' / ');
    }
}
