<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ProductsExport implements FromCollection, WithHeadings
{
    public function __construct(protected $user) {}

    public function collection()
    {
        return Product::query()
            ->with(['store', 'categories', 'variants'])
            ->whereHas('store', fn($q) => $q->forUser($this->user))
            ->get()
            ->map(function ($product) {

                $hasVariants = $product->variants->count() > 1;

                return [
                    'store_id' => $product->store_id,
                    'store_name' => $product->store->name ?? null,

                    'category_ids' => $product->categories->pluck('id')->implode(','),
                    'category_names' => $product->categories->pluck('name')->implode(','),

                    'name' => $product->name,
                    'description' => $product->description,

                    'price' => $product->price,
                    'stock' => $hasVariants ? null : $product->stock,

                    'is_active' => (int) $product->is_active,
                    'has_variants' => (int) $hasVariants,

                    'image' => $product->image,
                    'image_url' => $product->image ? asset('storage/' . $product->image) : null,

                    'attributes' => $hasVariants
                        ? json_encode($this->extractAttributes($product))
                        : null,

                    'variants' => $hasVariants
                        ? json_encode($this->formatVariants($product))
                        : null,
                ];
            });
    }

    public function headings(): array
    {
        return [
            'store_id',
            'store_name',
            'category_ids',
            'category_names',
            'name',
            'description',
            'price',
            'stock',
            'is_active',
            'has_variants',
            'image',
            'image_url',
            'attributes',
            'variants',
        ];
    }

    private function extractAttributes($product)
    {
        $result = [];

        foreach ($product->variants as $variant) {
            foreach ($variant->attributes ?? [] as $key => $value) {
                $result[$key] ??= [];
                if (!in_array($value, $result[$key])) {
                    $result[$key][] = $value;
                }
            }
        }

        return $result;
    }

    private function formatVariants($product)
    {
        return $product->variants->map(fn($v) => [
            'Size' => $v->attributes['Size'] ?? null,
            'Color' => $v->attributes['Color'] ?? null,
            'price' => $v->price,
            'stock' => $v->stock,
            'image' => $v->image,
            'image_url' => $v->image ? asset('storage/' . $v->image) : null,
        ]);
    }
}