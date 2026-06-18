<?php

namespace App\Exports;

use App\Models\VendorOrder;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class VendorOrdersExport implements FromCollection, WithHeadings
{
    public function __construct(protected $user)
    {
    }

    public function collection()
    {
        return VendorOrder::query()
            ->with([
                'order.user',
                'orderItem.product',
                'orderItem.variant',
                'store'
            ])
            ->when($this->user->role === 'vendor', function ($q) {
                $q->where('vendor_id', $this->user->id);
            })
            ->when($this->user->isVendorEmployee(), function ($q) {
                $storeIds = $this->user->employee->stores()->pluck('stores.id');
                $q->whereIn('store_id', $storeIds);
            })
            ->latest()
            ->get()
            ->map(function ($item) {

                $variant = $item->orderItem->variant ?? null;

                return [
                    // ORDER INFO
                    'order_id' => $item->order_id,
                    'status' => $item->status,
                    'created_at' => $item->created_at->format('Y-m-d H:i'),

                    // CUSTOMER
                    'customer_name' => $item->order->user->name ?? '-',
                    'customer_email' => $item->order->user->email ?? '-',

                    // SHIPPING
                    'shipping_phone' => $item->order->shipping_phone ?? '-',
                    'shipping_city' => $item->order->shipping_city ?? '-',
                    'shipping_place' => $item->order->shipping_place ?? '-',

                    // STORE
                    'store' => $item->store->name ?? '-',

                    // PRODUCT
                    'product' => $item->orderItem->product->name ?? '-',

                    // VARIANT (IMPORTANT FIX)
                    'variant' => $variant
                        ? collect($variant->attributes)->map(function ($v, $k) {
                            return "$k: $v";
                        })->implode(', ')
                        : 'No variant',

                    // ORDER ITEM
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Order ID',
            'Status',
            'Created At',

            'Customer Name',
            'Customer Email',

            'Shipping Phone',
            'Shipping City',
            'Shipping Address',

            'Store',

            'Product',
            'Variant',

            'Quantity',
            'Price',
        ];
    }
}