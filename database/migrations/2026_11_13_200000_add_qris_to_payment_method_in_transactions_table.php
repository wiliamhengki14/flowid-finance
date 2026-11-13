<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE transactions MODIFY COLUMN payment_method ENUM('transfer', 'tunai', 'qris') NOT NULL DEFAULT 'transfer'");
        } else {
            Schema::table('transactions', function (Blueprint $table) {
                $table->string('payment_method', 20)->default('transfer')->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE transactions MODIFY COLUMN payment_method ENUM('transfer', 'tunai') NOT NULL DEFAULT 'transfer'");
        } else {
            Schema::table('transactions', function (Blueprint $table) {
                $table->string('payment_method', 20)->default('transfer')->change();
            });
        }
    }
};

