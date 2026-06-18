<?php

namespace Database\Factories;

use App\Models\Address;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Address>
 */
class AddressFactory extends Factory
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
        'phone' => fake()->phoneNumber(),
        'city' => fake()->city(),
        'place' => fake()->address(),
        'is_default' => fake()->boolean(),
    ];
    }
}
