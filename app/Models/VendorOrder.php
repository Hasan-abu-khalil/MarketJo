<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class VendorOrder extends Model
{
    protected $fillable = [
        'order_id',
        'order_item_id',
        'vendor_id',
        'store_id',
        'quantity',
        'price',
        'status',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function orderItem()
    {
        return $this->belongsTo(OrderItem::class, 'order_item_id');
    }

    public function vendor()
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
