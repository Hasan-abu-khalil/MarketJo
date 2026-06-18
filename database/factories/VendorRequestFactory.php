<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\VendorRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<VendorRequest>
 */
class VendorRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $adminIds = User::where('role', 'admin')->pluck('id')->toArray();

        return [
            'user_id' => User::factory(),
            'store_name' => $this->faker->company(),
            'message' => $this->faker->paragraph(2),
            'status' => $this->faker->randomElement(['pending', 'approved', 'rejected']),
            'is_active' => $this->faker->boolean(80),
            'reviewed_at' => $this->faker->optional()->dateTimeBetween('-1 month', 'now'),

            // FIXED (no Closure, no is_admin)
            'reviewed_by' => $this->faker->optional()->randomElement($adminIds),
        ];
    }

    /**
     * Optional states for cleaner seeding
     */
    public function pending(): static
    {
        return $this->state(fn() => ['status' => 'pending']);
    }

    public function approved(): static
    {
        return $this->state(fn() => ['status' => 'approved']);
    }

    public function rejected(): static
    {
        return $this->state(fn() => ['status' => 'rejected']);
    }
}
