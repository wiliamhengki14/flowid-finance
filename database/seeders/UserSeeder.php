<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@flowid.id'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password123'),
                'role' => 'pemilik',
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'siti@flowid.id'],
            [
                'name' => 'Siti Aisyah',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'rina@flowid.id'],
            [
                'name' => 'Rina',
                'password' => Hash::make('password123'),
                'role' => 'kasir',
                'is_active' => true,
            ]
        );
    }
}
