<?php

namespace App\Policies;

use App\Models\Employee;
use App\Models\User;

class EmployeePolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->allow($user, 'employees.view');
    }

    public function view(User $user, Employee $employee): bool
    {
        return $this->allow($user, 'employees.view', $employee);
    }

    public function create(User $user): bool
    {
        return $this->allow($user, 'employees.create');
    }

    public function update(User $user, Employee $employee): bool
    {
        return $this->allow($user, 'employees.update', $employee);
    }

    public function delete(User $user, Employee $employee): bool
    {
        return $this->allow($user, 'employees.delete', $employee);
    }

    public function managePermissions(User $user, Employee $employee): bool
    {
        return $this->allow($user, 'employees.update', $employee);
    }
}