<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    protected $fillable = [
        'name'
    ];

    public function employees()
    {
        return $this->belongsToMany(
            Employee::class,
            'employee_permission'
        );
    }
}