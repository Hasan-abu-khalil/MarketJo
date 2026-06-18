<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'total_price' => fake()->randomFloat(2, 20, 1000),
            'status' => fake()->randomElement([
                'pending',
                'paid',
                'processing',
                'shipped',
                'completed',
                'cancelled'
            ]),
            'shipping_name' => fake()->name(),
            'shipping_phone' => fake()->phoneNumber(),
            'shipping_city' => fake()->city(),
            'shipping_place' => fake()->address(),
        ];
    }
}
