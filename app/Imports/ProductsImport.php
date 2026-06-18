<?php

namespace App\Imports;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Store;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Row;

class ProductsImport implements OnEachRow, WithHeadingRow, WithValidation
{
    public function __construct(protected $user)
    {
    }

    public function onRow(Row $row)
    {
        $row = $row->toArray();

        // ---------------- STORE ----------------
        $store = Store::query()
            ->forUser($this->user)
            ->when(!empty($row['store_id']), fn($q) => $q->where('id', $row['store_id']))
            ->when(!empty($row['store_name']), fn($q) => $q->orWhere('name', $row['store_name']))
            ->first();

        if (!$store) {
            throw new \Exception("Store not found: " . ($row['store_name'] ?? $row['store_id']));
        }

        // ---------------- FLAGS ----------------
        $hasVariants = filter_var($row['has_variants'] ?? false, FILTER_VALIDATE_BOOLEAN);

        // ---------------- IMAGE RESTORE ----------------
        $imagePath = null;

        // 1. local image
        if (!empty($row['image']) && Storage::disk('public')->exists($row['image'])) {
            $imagePath = $row['image'];
        }

        // 2. fallback download
        elseif (!empty($row['image_url'])) {
            try {
                $contents = @file_get_contents($row['image_url']);

                if ($contents) {
                    $fileName = 'images/' . uniqid() . '.jpg';
                    Storage::disk('public')->put($fileName, $contents);
                    $imagePath = $fileName;
                }
            } catch (\Exception $e) {
                $imagePath = null;
            }
        }

        // ---------------- PRODUCT ----------------
        $product = Product::create([
            'store_id' => $store->id,
            'name' => $row['name'],
            'slug' => Str::slug($row['name'] . '-' . uniqid()),
            'description' => $row['description'] ?? null,
            'price' => $row['price'],
            'stock' => $hasVariants ? 0 : (int) ($row['stock'] ?? 0),
            'is_active' => (int) ($row['is_active'] ?? 1),
            'image' => $imagePath,
        ]);

        // ---------------- CATEGORIES ----------------
        $categoryIds = collect();

        if (!empty($row['category_ids'])) {
            $categoryIds = $categoryIds->merge(
                collect(explode(',', $row['category_ids']))
                    ->map(fn($id) => (int) trim($id))
            );
        }

        if (!empty($row['category_names'])) {
            $names = collect(explode(',', $row['category_names']))
                ->map(fn($n) => trim($n))
                ->filter();

            $idsFromNames = Category::where('store_id', $store->id)
                ->whereIn('name', $names)
                ->pluck('id');

            $categoryIds = $categoryIds->merge($idsFromNames);
        }

        $product->categories()->sync(
            $categoryIds->filter()->unique()->values()
        );

        // ---------------- VARIANTS ----------------
        if ($hasVariants) {

            $variants = json_decode($row['variants'] ?? '[]', true);

            if (!is_array($variants)) {
                $variants = [];
            }

            foreach ($variants as $variant) {

                $size = $variant['Size'] ?? null;
                $color = $variant['Color'] ?? null;

                $key = collect([$size, $color])
                    ->filter()
                    ->map(fn($v) => strtolower(trim($v)))
                    ->implode('-');

                $variantImage = null;

                // variant image restore
                if (!empty($variant['image']) && Storage::disk('public')->exists($variant['image'])) {
                    $variantImage = $variant['image'];
                } elseif (!empty($variant['image_url'])) {
                    try {
                        $contents = @file_get_contents($variant['image_url']);
                        if ($contents) {
                            $fileName = 'images/' . uniqid() . '.jpg';
                            Storage::disk('public')->put($fileName, $contents);
                            $variantImage = $fileName;
                        }
                    } catch (\Exception $e) {
                    }
                }

                ProductVariant::create([
                    'product_id' => $product->id,
                    'price' => $variant['price'] ?? $product->price,
                    'stock' => (int) ($variant['stock'] ?? 0),
                    'sku' => $product->id . '-' . $key,
                    'image' => $variantImage,
                    'attributes' => [
                        'Size' => $size,
                        'Color' => $color,
                    ],
                ]);
            }
        } else {

            ProductVariant::create([
                'product_id' => $product->id,
                'price' => $product->price,
                'stock' => $product->stock,
                'sku' => $product->id . '-default',
                'attributes' => [],
                'image' => $imagePath,
            ]);
        }
    }

    public function rules(): array
    {
        return [
            '*.store_id' => ['required'],
            '*.name' => ['required'],
            '*.price' => ['required', 'numeric'],
            '*.is_active' => ['nullable'],
            '*.has_variants' => ['nullable'],
            '*.variants' => ['nullable'],
        ];
    }
}