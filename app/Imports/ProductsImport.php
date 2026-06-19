<?php

namespace App\Imports;


use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Category;
use App\Models\Store;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Row;


class ProductsImport implements
    OnEachRow,
    WithHeadingRow,
    WithValidation
{


    public function __construct(
        protected $user
    ) {
    }



    public function onRow(Row $row)
    {

        $data = $row->toArray();


        if (empty($data['name'])) {
            return;
        }



        $store = Store::query()
            ->forUser($this->user)
            ->where(function ($q) use ($data) {

                if (!empty($data['store_id'])) {
                    $q->where('id', $data['store_id']);
                }

                if (!empty($data['store_name'])) {
                    $q->orWhere(
                        'name',
                        $data['store_name']
                    );
                }

            })
            ->first();



        if (!$store) {
            throw new \Exception(
                "Store not found"
            );
        }



        $hasVariants =
            in_array(
                strtolower($data['has_variants'] ?? 0),
                ['1', 'true', 'yes']
            );




        $product = Product::create([

            'store_id' => $store->id,

            'name' => $data['name'],

            'slug' => Str::slug(
                $data['name'] . '-' . uniqid()
            ),

            'description' => $data['description'] ?? null,

            'price' => $data['price'] ?? 0,

            'stock' =>
                $hasVariants
                ? 0
                : ($data['stock'] ?? 0),

            'is_active' =>
                $data['is_active'] ?? 1,

            'image' =>
                $this->restoreImage(
                    $data['image'] ?? null,
                    $data['image_url'] ?? null
                )
        ]);





        $categories = [];


        foreach (
            explode(',', $data['category_ids'] ?? '')
            as $id
        ) {

            if ($id) {
                $categories[] = $id;
            }
        }


        $product->categories()
            ->sync(
                collect($categories)
                    ->unique()
            );




        if (!$hasVariants) {

            ProductVariant::create([

                'product_id' => $product->id,

                'price' => $product->price,

                'stock' => $product->stock,

                'attributes' => [],

                'sku' => $product->id . '-default',

                'image' => $product->image
            ]);

            return;
        }





        $variants = json_decode(
            $data['variants'] ?? '[]',
            true
        );



        foreach ($variants as $variant) {


            $attributes =
                $variant['attributes'] ?? [];



            $key =
                collect($attributes)
                    ->values()
                    ->map(
                        fn($v) =>
                        strtolower($v)
                    )
                    ->implode('-');



            ProductVariant::create([

                'product_id' => $product->id,

                'price' =>
                    $variant['price']
                    ?? $product->price,

                'stock' =>
                    $variant['stock']
                    ?? 0,


                'attributes' => $attributes,


                'sku' =>
                    $product->id . '-' . $key,


                'image' =>
                    $this->restoreImage(
                        $variant['image'] ?? null,
                        $variant['image_url'] ?? null
                    )

            ]);
        }

    }




    private function restoreImage($path, $url)
    {

        if (
            $path &&
            Storage::disk('public')
                ->exists($path)
        ) {
            return $path;
        }


        if ($url) {
            try {
                if ($localPath = $this->localStoragePathFromUrl($url)) {
                    if (Storage::disk('public')->exists($localPath)) {
                        return $localPath;
                    }
                }

                $context = stream_context_create([
                    'http' => [
                        'timeout' => 10,
                        'follow_location' => true,
                    ],
                    'ssl' => [
                        'verify_peer' => false,
                        'verify_peer_name' => false,
                    ],
                ]);

                $content = file_get_contents($url, false, $context);

                if ($content === false) {
                    return null;
                }

                $file = 'images/' . uniqid() . '.jpg';

                Storage::disk('public')
                    ->put($file, $content);

                return $file;
            } catch (\Throwable $e) {
                return null;
            }
        }


        return null;
    }



    private function localStoragePathFromUrl(string $url): ?string
    {
        $parsed = parse_url($url);

        if (! $parsed || empty($parsed['path'])) {
            return null;
        }

        $path = $parsed['path'];

        if (str_starts_with($path, '/storage/')) {
            return ltrim(substr($path, strlen('/storage/')), '/');
        }

        return null;
    }

    public function rules(): array
    {
        return [

            'store_id' => 'required',

            'name' => 'required',

            'price' => 'required|numeric',

        ];
    }

}