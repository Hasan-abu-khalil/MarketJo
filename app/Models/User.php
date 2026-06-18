<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function vendorRequests()
    {
        return $this->hasMany(VendorRequest::class);
    }
    public function stores()
    {
        return $this->hasMany(Store::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function cart()
    {
        return $this->hasOne(Cart::class);
    }

    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    public function getUnreadNotificationsCountAttribute()
    {
        return $this->unreadNotifications()->count();
    }
    // public function employee()
    // {
    //     return $this->hasOne(Employee::class);
    // }

    public function employee()
    {
        return $this->hasOne(Employee::class)->with('permissions');
    }
    public function hasPermission(string $permission): bool
    {
        if (
            in_array($this->role, [
                'admin',
                'vendor'
            ])
        ) {
            return true;
        }

        if (!$this->employee) {
            return false;
        }

        return $this->employee
            ->permissions
            ->contains('name', $permission);
    }


    public function ownerId(): int
    {
        if ($this->role === 'employee' && $this->employee) {
            return $this->employee->owner_id;
        }

        return $this->id;
    }

    public function isEmployee(): bool
    {
        return $this->role === 'employee';
    }
    public function isAdminEmployee(): bool
    {
        return $this->role === 'employee'
            && $this->employee
            && $this->employee->scope === 'admin';
    }

    public function isVendorEmployee(): bool
    {
        return $this->role === 'employee'
            && $this->employee
            && $this->employee->scope === 'vendor';
    }

   


    public function accessibleStoreIds()
{
    if ($this->role === 'admin' || $this->isAdminEmployee()) {
        return null; // full access
    }

    if ($this->isVendorEmployee()) {
        return $this->employee?->stores()->pluck('stores.id') ?? collect();
    }

    return $this->stores()->pluck('id');
}
}
