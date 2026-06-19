<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ProductsExport implements FromCollection, WithHeadings
{
    public function __construct(
        protected $user
    ) {
    }

    public function collection()
    {
        return Product::query()
            ->with([
                'store',
                'categories',
                'variants'
            ])
            ->whereHas(
                'store',
                fn($q) => $q->forUser($this->user)
            )
            ->get()
            ->map(function ($product) {

                $hasVariants = $product->variants->count() > 1;

                return [

                    'store_id' =>
                        $product->store_id,

                    'store_name' =>
                        $product->store?->name,


                    'category_ids' =>
                        $product->categories
                            ->pluck('id')
                            ->implode(','),

                    'category_names' =>
                        $product->categories
                            ->pluck('name')
                            ->implode(','),


                    'name' =>
                        $product->name,

                    'description' =>
                        $product->description,


                    'price' =>
                        $product->price,


                    'stock' =>
                        $hasVariants
                        ? ''
                        : $product->stock,


                    'is_active' =>
                        (int) $product->is_active,


                    'has_variants' =>
                        $hasVariants ? 1 : 0,


                    'image' =>
                        $product->image,


                    'image_url' =>
                        $product->image
                        ? asset('storage/' . $product->image)
                        : null,


                    'attributes' =>
                        $hasVariants
                        ? json_encode(
                            $this->attributes($product)
                        )
                        : null,


                    'variants' =>
                        $hasVariants
                        ? json_encode(
                            $this->variants($product)
                        )
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
            'variants'
        ];
    }



    private function attributes($product)
    {
        $data = [];

        foreach ($product->variants as $variant) {

            foreach ($variant->attributes ?? [] as $key => $value) {

                $data[$key] ??= [];

                if (!in_array($value, $data[$key])) {
                    $data[$key][] = $value;
                }
            }
        }

        return $data;
    }



    private function variants($product)
    {
        return $product->variants
            ->map(function ($variant) {

                return [
                    'attributes' => $variant->attributes,

                    'price' => $variant->price,

                    'stock' => $variant->stock,

                    'image' => $variant->image,

                    'image_url' => $variant->image
                        ? asset('storage/' . $variant->image)
                        : null,
                ];
            })
            ->values();
    }
}