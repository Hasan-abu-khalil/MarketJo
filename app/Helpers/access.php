<?php
use App\Services\Access\AccessService;
use App\Models\User;

function access(User $user, string $permission, $model = null): bool
{
    return app(AccessService::class)->can($user, $permission, $model);
}