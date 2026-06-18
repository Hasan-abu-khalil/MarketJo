<?php

namespace App\Console\Commands;

use App\Models\CartItem;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Log;

class ClearExpiredCartReservations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:clear-expired-cart-reservations';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $deleted = CartItem::whereNotNull('reserved_until')
            ->where('reserved_until', '<', now())
            ->delete();

        Log::info("Expired reservations cleared: {$deleted}");
        $this->info("Done: {$deleted}");
    }
}
