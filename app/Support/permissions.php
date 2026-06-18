<?php

use Illuminate\Support\Facades\Auth;

if (!function_exists('employee_has_permission')) {
    function employee_has_permission(string $permission): bool
    {
        $user = Auth::user();

        if (!$user) {
            return false;
        }

        if ($user->role === 'admin') {
            return true;
        }

        if ($user->role !== 'employee') {
            return false;
        }

        $employee = $user->employee;

        if (!$employee) {
            return false;
        }

        return $employee->permissions()
            ->where('name', $permission)
            ->exists();
    }
}