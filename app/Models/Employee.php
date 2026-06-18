<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = [
        'user_id',
        'owner_id',
        'scope',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function owner()
    {
        return $this->belongsTo(
            User::class,
            'owner_id'
        );
    }

    public function permissions()
    {
        return $this->belongsToMany(
            Permission::class,
            'employee_permission'
        );
    }

    public function stores()
    {
        return $this->belongsToMany(
            Store::class,
            'employee_store'
        );
    }
}
