<?php

namespace App\Services;

class VariantGeneratorService
{
    /**
     * Generate all combinations from attributes
     * Example:
     * [
     *   'Size' => ['S', 'M'],
     *   'Color' => ['Red', 'Blue']
     * ]
     */
    public function generate(array $attributes): array
    {
        $results = [[]];

        foreach ($attributes as $name => $values) {
            $temp = [];

            foreach ($results as $result) {
                foreach ($values as $value) {
                    $temp[] = array_merge($result, [
                        $name => $value
                    ]);
                }
            }

            $results = $temp;
        }

        return $results;
    }
}